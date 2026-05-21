// POST /.netlify/functions/mp-webhook
//
// Recebe notificacoes do Mercado Pago. Valida assinatura x-signature,
// busca os detalhes do pagamento via API, e (se aprovado) ativa o plano
// do palestrante: seta plan + subscription_paid_until + mp_payment_id em
// speakers, e insere registro em payments pra audit.
//
// Configurar no painel MP (Sua aplicacao -> Webhooks):
//   URL:    https://avantikpalestras.com.br/.netlify/functions/mp-webhook
//   Eventos: Payments (payment.created, payment.updated)
//   Secret: copiar pro env MP_WEBHOOK_SECRET
//
// Doc oficial:
//   https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
//   https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks#bookmark_validar_origem_da_notificacao

import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

const PRODUCTS = {
  profissional: 1164.00,
  premium:      1764.00,
  elite:        3564.00,
};

// Anuidade do contratante
const CONTRACTOR_PRODUCTS = {
  anual: 2000.00,
};
const CONTRACTOR_FREE_TALKS = 3;

export default async (req) => {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

  const MP_TOKEN = process.env.MP_ACCESS_TOKEN_PROD;
  const MP_SECRET = process.env.MP_WEBHOOK_SECRET;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!MP_TOKEN || !SUPA_URL || !SUPA_SERVICE) {
    console.error('webhook: missing env vars');
    return new Response('server misconfigured', { status: 500 });
  }

  // 1. Le payload
  const rawBody = await req.text();
  let payload;
  try { payload = JSON.parse(rawBody); } catch {
    return new Response('invalid json', { status: 400 });
  }

  // 2. Valida assinatura x-signature (so se MP_WEBHOOK_SECRET estiver configurado)
  // Formato do header: "ts=<timestamp>,v1=<hex>"
  // Manifest assinado: "id:<data.id>;request-id:<x-request-id>;ts:<timestamp>;"
  if (MP_SECRET) {
    const sigHeader = req.headers.get('x-signature') || '';
    const requestId = req.headers.get('x-request-id') || '';
    const url = new URL(req.url);
    const dataId = url.searchParams.get('data.id') || payload?.data?.id || '';

    const parts = Object.fromEntries(sigHeader.split(',').map(s => s.split('=').map(x => x.trim())));
    const ts = parts.ts;
    const v1 = parts.v1;
    if (!ts || !v1) {
      console.warn('webhook: missing x-signature parts', { sigHeader });
      return new Response('invalid signature', { status: 401 });
    }

    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const expected = crypto.createHmac('sha256', MP_SECRET).update(manifest).digest('hex');
    if (!safeEqual(expected, v1)) {
      console.warn('webhook: signature mismatch', { manifest });
      return new Response('invalid signature', { status: 401 });
    }
  }

  // 3. So processa eventos de pagamento
  const topic = payload?.type || payload?.topic;
  if (topic !== 'payment') {
    return new Response('ignored: not a payment event', { status: 200 });
  }
  const paymentId = payload?.data?.id;
  if (!paymentId) return new Response('missing payment id', { status: 400 });

  // 4. Busca detalhes do pagamento no MP (a notificacao so traz o ID)
  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${MP_TOKEN}` },
  });
  if (!mpRes.ok) {
    console.error('webhook: failed to fetch payment', paymentId, mpRes.status);
    return new Response('mp fetch failed', { status: 502 });
  }
  const payment = await mpRes.json();

  const status = payment.status;          // approved | rejected | refunded | cancelled | ...
  const externalRef = payment.external_reference || ''; // "<speaker_id>:<plan>:<ts>" ou "contractor:<id>:<plan>:<ts>"
  const amount = Number(payment.transaction_amount || 0);
  const segs = externalRef.split(':');

  const supabase = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });

  // ===== Ramo CONTRATANTE: "contractor:<id>:<plan>:<ts>" =====
  if (segs[0] === 'contractor') {
    const contractorId = segs[1];
    const cPlan = segs[2];
    if (!contractorId || !CONTRACTOR_PRODUCTS[cPlan]) {
      console.warn('webhook: invalid contractor external_reference', { externalRef, paymentId });
      return new Response('invalid external_reference', { status: 200 });
    }
    if (Math.abs(amount - CONTRACTOR_PRODUCTS[cPlan]) > 0.01) {
      console.error('webhook: contractor amount mismatch', { paymentId, cPlan, amount });
      return new Response('amount mismatch', { status: 200 });
    }

    const cPaidAt = payment.date_approved ? new Date(payment.date_approved) : new Date();
    const cExpiresAt = new Date(cPaidAt.getTime() + 365 * 24 * 60 * 60 * 1000);

    const { data: cExisting } = await supabase
      .from('payments')
      .select('id, status')
      .eq('mp_payment_id', String(paymentId))
      .maybeSingle();

    if (status === 'approved') {
      const { error: ctErr } = await supabase
        .from('contractors')
        .update({
          plan: 'anual',
          subscription_paid_until: cExpiresAt.toISOString(),
          free_talks_total: CONTRACTOR_FREE_TALKS,
          free_talks_used: 0,
          mp_payment_id: String(paymentId),
        })
        .eq('id', contractorId);
      if (ctErr) {
        console.error('webhook: failed to update contractor', ctErr);
        return new Response('db update failed', { status: 500 });
      }
      if (!cExisting) {
        await supabase.from('payments').insert({
          contractor_id: contractorId,
          plan: cPlan,
          mp_payment_id: String(paymentId),
          mp_preference_id: payment.preference_id || null,
          amount,
          status,
          paid_at: cPaidAt.toISOString(),
          expires_at: cExpiresAt.toISOString(),
          raw_payload: payment,
        });
      }
    } else if (status === 'refunded' || status === 'cancelled' || status === 'charged_back') {
      const { data: ct } = await supabase
        .from('contractors')
        .select('mp_payment_id')
        .eq('id', contractorId)
        .maybeSingle();
      if (ct?.mp_payment_id === String(paymentId)) {
        await supabase
          .from('contractors')
          .update({ plan: 'free', subscription_paid_until: null, free_talks_total: 0 })
          .eq('id', contractorId);
      }
      if (cExisting) {
        await supabase.from('payments').update({ status, raw_payload: payment }).eq('id', cExisting.id);
      } else {
        await supabase.from('payments').insert({
          contractor_id: contractorId, plan: cPlan, mp_payment_id: String(paymentId),
          mp_preference_id: payment.preference_id || null, amount, status,
          paid_at: cPaidAt.toISOString(), expires_at: cExpiresAt.toISOString(), raw_payload: payment,
        });
      }
    } else if (!cExisting) {
      await supabase.from('payments').insert({
        contractor_id: contractorId, plan: cPlan, mp_payment_id: String(paymentId),
        mp_preference_id: payment.preference_id || null, amount, status,
        paid_at: null, expires_at: cExpiresAt.toISOString(), raw_payload: payment,
      });
    }

    return new Response('ok', { status: 200 });
  }

  // ===== Ramo PALESTRANTE: "<speaker_id>:<plan>:<ts>" =====
  const [speakerId, plan] = segs;

  if (!speakerId || !plan || !PRODUCTS[plan]) {
    console.warn('webhook: invalid external_reference', { externalRef, paymentId });
    return new Response('invalid external_reference', { status: 200 }); // 200 pra MP nao re-tentar
  }

  // 5. Sanity check: valor cobrado bate com o catalogo
  const expectedAmount = PRODUCTS[plan];
  if (Math.abs(amount - expectedAmount) > 0.01) {
    console.error('webhook: amount mismatch', { paymentId, plan, amount, expectedAmount });
    return new Response('amount mismatch', { status: 200 });
  }

  // 6. Idempotencia: se ja processamos esse payment_id, no-op
  const { data: existing } = await supabase
    .from('payments')
    .select('id, status')
    .eq('mp_payment_id', String(paymentId))
    .maybeSingle();

  // 7. Decide acao baseado no status
  const paidAt = payment.date_approved ? new Date(payment.date_approved) : new Date();
  const expiresAt = new Date(paidAt.getTime() + 365 * 24 * 60 * 60 * 1000);

  if (status === 'approved') {
    // Ativa o plano no speaker
    const { error: spErr } = await supabase
      .from('speakers')
      .update({
        plan,
        subscription_paid_until: expiresAt.toISOString(),
        mp_payment_id: String(paymentId),
      })
      .eq('id', speakerId);
    if (spErr) {
      console.error('webhook: failed to update speaker', spErr);
      return new Response('db update failed', { status: 500 });
    }

    // Grava no audit log (idempotente via UNIQUE constraint em mp_payment_id)
    if (!existing) {
      await supabase.from('payments').insert({
        speaker_id: speakerId,
        plan,
        mp_payment_id: String(paymentId),
        mp_preference_id: payment.preference_id || null,
        amount,
        status,
        paid_at: paidAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        raw_payload: payment,
      });
    }
  } else if (status === 'refunded' || status === 'cancelled' || status === 'charged_back') {
    // Revoga acesso se este foi o pagamento ativo
    const { data: sp } = await supabase
      .from('speakers')
      .select('mp_payment_id')
      .eq('id', speakerId)
      .maybeSingle();
    if (sp?.mp_payment_id === String(paymentId)) {
      await supabase
        .from('speakers')
        .update({ subscription_paid_until: null })
        .eq('id', speakerId);
    }
    if (existing) {
      await supabase.from('payments').update({ status, raw_payload: payment }).eq('id', existing.id);
    } else {
      await supabase.from('payments').insert({
        speaker_id: speakerId,
        plan,
        mp_payment_id: String(paymentId),
        mp_preference_id: payment.preference_id || null,
        amount,
        status,
        paid_at: paidAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        raw_payload: payment,
      });
    }
  } else {
    // pending / in_process / rejected — so loga, nao mexe em status do speaker
    if (!existing) {
      await supabase.from('payments').insert({
        speaker_id: speakerId,
        plan,
        mp_payment_id: String(paymentId),
        mp_preference_id: payment.preference_id || null,
        amount,
        status,
        paid_at: null,
        expires_at: expiresAt.toISOString(),
        raw_payload: payment,
      });
    }
  }

  return new Response('ok', { status: 200 });
};

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}
