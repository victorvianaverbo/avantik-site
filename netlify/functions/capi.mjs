// POST /.netlify/functions/capi
//
// Meta Conversions API (server-side) para as LPs de evento em /eventos/*.
// Recebe o evento do browser e reenvia ao Meta com o MESMO event_id, para o
// Meta deduplicar contra o disparo do Pixel client-side.
//
// Portado de apogeu-ofertas/netlify/functions/capi.js. A conversao para ESM
// nao e cosmetica: o package.json deste projeto tem "type": "module", entao
// require()/exports.handler quebrariam no bundle. Segue o padrao de
// create-checkout.mjs: export default async (req) => Response.
//
// Access Token em META_CAPI_TOKEN (Netlify env, contexto production).
// Sem essa variavel a funcao responde 500 — e o cliente engole o erro no
// .catch(), entao a falha e SILENCIOSA. Se os eventos sumirem do Events
// Manager, comece conferindo essa env.

import crypto from 'node:crypto';

const PIXEL_ID = process.env.META_PIXEL_ID || '1028501882025260';
const API_VERSION = 'v21.0';

const sha256 = (v) => crypto.createHash('sha256').update(v).digest('hex');
const normEmail = (e) => String(e || '').trim().toLowerCase();
const normPhone = (p) => String(p || '').replace(/\D/g, '');
const normName = (n) => String(n || '').trim().toLowerCase();

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const TOKEN = process.env.META_CAPI_TOKEN;
  if (!TOKEN) return json({ error: 'META_CAPI_TOKEN nao configurado' }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }

  if (!body?.event_name || !body?.event_id) {
    return json({ error: 'event_name e event_id obrigatorios' }, 400);
  }

  const ip =
    req.headers.get('x-nf-client-connection-ip') ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    undefined;
  const ua = req.headers.get('user-agent') || undefined;

  // user_data: hash SHA-256 no servidor (PII nunca sai daqui em texto puro)
  const user_data = {};
  if (body.em) user_data.em = [sha256(normEmail(body.em))];
  if (body.ph) {
    const ph = normPhone(body.ph);
    if (ph) user_data.ph = [sha256(ph)];
  }
  if (body.fn) user_data.fn = [sha256(normName(body.fn))];
  if (body.fbp) user_data.fbp = body.fbp;
  if (body.fbc) user_data.fbc = body.fbc;
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua;

  const payload = {
    data: [{
      event_name: body.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id,
      event_source_url: body.event_source_url,
      action_source: 'website',
      user_data,
      custom_data: body.custom_data || {},
    }],
  };
  // codigo de teste (Events Manager > Test Events) — opcional
  if (body.test_event_code) payload.test_event_code = body.test_event_code;

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const out = await res.json();
    return json(out, res.ok ? 200 : 502);
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
};
