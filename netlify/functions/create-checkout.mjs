// POST /.netlify/functions/create-checkout
//
// Body: { plan: 'profissional' | 'premium' | 'elite' }
// Auth: Bearer <supabase_access_token> no header Authorization (do supabase.auth.getSession())
//
// Cria uma preference de Checkout Pro no MP, registra mp_preference_id no speaker
// e retorna { init_point } pro frontend redirecionar pro checkout.
//
// MP cobra: annual_price em ate 12x SEM JUROS (Avantik absorve via
// payment_methods.installments=12 + default_installments=12; o MP nao adiciona
// juros pra parcelamento quando o lojista nao especifica financeiro).

import { createClient } from '@supabase/supabase-js';

const PRODUCTS = {
  profissional: { name: 'Avantik Profissional - Anual', annual_price: 1164.00 },
  premium:      { name: 'Avantik Premium - Anual',      annual_price: 1764.00 },
  elite:        { name: 'Avantik Elite - Anual',        annual_price: 3564.00 },
};

// Plano de anuidade do CONTRATANTE (3 palestras gratis/ano, Avantik banca o cache)
const CONTRACTOR_PRODUCTS = {
  anual: { name: 'Avantik Empresas - Anuidade', annual_price: 2000.00 },
};

export default async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  // 1. Valida envs
  const MP_TOKEN = process.env.MP_ACCESS_TOKEN_PROD;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SITE_URL = process.env.SITE_URL || 'https://avantikpalestras.com.br';
  if (!MP_TOKEN || !SUPA_URL || !SUPA_SERVICE) {
    return json({ error: 'server_misconfigured' }, 500);
  }

  // 2. Valida body
  let body;
  try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const plan = body?.plan;
  const isContractor = body?.type === 'contractor';
  const product = isContractor ? CONTRACTOR_PRODUCTS[plan] : PRODUCTS[plan];
  if (!product) return json({ error: 'invalid_plan' }, 400);

  // 3. Identifica o usuario pelo bearer token
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'unauthorized' }, 401);

  const supabase = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData?.user) return json({ error: 'unauthorized' }, 401);
  const authUser = userData.user;

  // 4. Monta a preference conforme o tipo (palestrante ou contratante)
  let externalRef, payerEmail, payerName, backBase, metadata, ownerTable, ownerId;

  if (isContractor) {
    const { data: contractor, error: ctErr } = await supabase
      .from('contractors')
      .select('id, email, name')
      .eq('auth_id', authUser.id)
      .maybeSingle();
    if (ctErr || !contractor) return json({ error: 'contractor_not_found' }, 404);

    externalRef = `contractor:${contractor.id}:${plan}:${Date.now()}`;
    payerEmail = contractor.email || authUser.email;
    payerName = contractor.name || undefined;
    backBase = '/meus-projetos/';
    metadata = { plan, contractor_id: contractor.id, type: 'contractor' };
    ownerTable = 'contractors';
    ownerId = contractor.id;
  } else {
    const { data: speaker, error: spErr } = await supabase
      .from('speakers')
      .select('id, email, full_name, name')
      .eq('auth_id', authUser.id)
      .maybeSingle();
    if (spErr || !speaker) return json({ error: 'speaker_not_found' }, 404);

    externalRef = `${speaker.id}:${plan}:${Date.now()}`;
    payerEmail = speaker.email || authUser.email;
    payerName = speaker.full_name || speaker.name || undefined;
    backBase = '/minhas-palestras/';
    metadata = { plan, speaker_id: speaker.id };
    ownerTable = 'speakers';
    ownerId = speaker.id;
  }

  const preferencePayload = {
    items: [{
      id: `avantik-${isContractor ? 'empresa' : plan}-anual`,
      title: product.name,
      description: isContractor
        ? 'Anuidade Avantik Empresas (12 meses): 3 palestras gratis com a Avantik bancando o cache.'
        : `Assinatura anual do plano ${plan} da plataforma Avantik (12 meses de acesso).`,
      quantity: 1,
      currency_id: 'BRL',
      unit_price: product.annual_price,
    }],
    payer: {
      email: payerEmail,
      name: payerName,
    },
    external_reference: externalRef,
    statement_descriptor: 'AVANTIK',
    back_urls: {
      success: `${SITE_URL}${backBase}?mp=success`,
      failure: `${SITE_URL}${backBase}?mp=failure`,
      pending: `${SITE_URL}${backBase}?mp=pending`,
    },
    auto_return: 'approved',
    payment_methods: {
      installments: 12,
      default_installments: 12,
      excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
    },
    notification_url: `${SITE_URL}/.netlify/functions/mp-webhook`,
    metadata,
  };

  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferencePayload),
  });

  if (!mpRes.ok) {
    const errBody = await mpRes.text();
    console.error('MP preference creation failed', mpRes.status, errBody);
    return json({ error: 'mp_failed', detail: errBody.slice(0, 500) }, 502);
  }

  const preference = await mpRes.json();

  // 5. Registra mp_preference_id no dono (audit / reconciliacao)
  await supabase
    .from(ownerTable)
    .update({ mp_preference_id: preference.id })
    .eq('id', ownerId);

  return json({
    preference_id: preference.id,
    init_point: preference.init_point,
    sandbox_init_point: preference.sandbox_init_point,
  });
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const config = { path: '/.netlify/functions/create-checkout' };
