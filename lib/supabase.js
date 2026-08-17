import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ajokzpjguhfxxudteetr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjQ1NTQsImV4cCI6MjA5MDQwMDU1NH0.TG-ASfMGgNY4BoHsFQx8TQ-4HPVsdbGEu4zJuFAeiNg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

/**
 * Escapa HTML para prevenir XSS
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Gera slug a partir do nome: "Ana Maria da Silva" -> "ana-maria-da-silva"
 */
export function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Garante slug unico verificando no banco
 */
export async function ensureUniqueSlug(baseSlug) {
  const { data } = await supabase
    .from('speakers')
    .select('slug')
    .like('slug', `${baseSlug}%`);

  if (!data || data.length === 0) return baseSlug;

  const existing = new Set(data.map(d => d.slug));
  if (!existing.has(baseSlug)) return baseSlug;

  let i = 2;
  while (existing.has(`${baseSlug}-${i}`)) i++;
  return `${baseSlug}-${i}`;
}

/**
 * Formata faixa de preco: "R$ 5k-10k"
 */
export function formatPriceRange(min, max) {
  const fmt = (v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v);
  if (min && max) return `R$ ${fmt(min)}-${fmt(max)}`;
  if (min) return `A partir de R$ ${fmt(min)}`;
  if (max) return `Até R$ ${fmt(max)}`;
  return 'Sob consulta';
}

/**
 * Extrai embed URL do YouTube
 */
export function getYouTubeEmbed(url) {
  if (!url) return null;
  // So aceita videos individuais (watch?v=, embed/, youtu.be/) — canais e perfis nao sao embedaveis
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return null; // canal/perfil — nao embedar
}

/**
 * URL publica de foto no Supabase Storage
 */
export function getPhotoUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from('speaker-photos').getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Otimiza imagens externas (ex: fotos do Supabase Storage) via Netlify Image CDN:
 * redimensiona + converte pra webp. So funciona no deploy Netlify (netlify.toml
 * tem [images] remote_images). Em http(s) local, retorna a URL original.
 */
export function cdnImg(url, w, q = 80) {
  if (!url || !/^https?:\/\//.test(url)) return url || '';
  // Evita reprocessar imagens que ja sao do proprio Netlify Image CDN.
  if (url.includes('/.netlify/images')) return url;
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${w}&q=${q}&fm=webp`;
}

/**
 * Lista de estados brasileiros
 */
export const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

/**
 * Tiers de plano para palestrantes
 */
export const TIERS = {
  profissional: {
    name: 'Profissional',
    price: 97,
    annualPrice: 1164,
    installments: 12,
    priceLabel: '12x de R$ 97 sem juros',
    annualLabel: 'R$ 1.164/ano',
    maxPhotos: 3,
    maxPalestras: 1,
    maxVideos: 1,
    whatsappVisible: true,
    badge: 'profissional',
    searchOrder: 3,
    features: [
      'Perfil no banco de palestras da Avantik',
      '1 palestra cadastrada',
      '3 fotos + 1 vídeo',
      'WhatsApp visível para contratantes',
      'Contato direto com o lead',
      'Suporte por e-mail',
    ]
  },
  premium: {
    name: 'Premium',
    price: 147,
    annualPrice: 1764,
    installments: 12,
    priceLabel: '12x de R$ 147 sem juros',
    annualLabel: 'R$ 1.764/ano',
    maxPhotos: 10,
    maxPalestras: 3,
    maxVideos: 3,
    whatsappVisible: true,
    badge: 'premium',
    searchOrder: 2,
    features: [
      'Tudo do Profissional',
      'Até 3 palestras cadastradas (3x mais chances de matching)',
      '10 fotos + 3 vídeos',
      'Prioridade na busca',
      'Badge Premium no perfil',
      'Analytics básico de visualizações',
    ]
  },
  elite: {
    name: 'Elite',
    price: 297,
    annualPrice: 3564,
    installments: 12,
    priceLabel: '12x de R$ 297 sem juros',
    annualLabel: 'R$ 3.564/ano',
    maxPhotos: 99,
    maxPalestras: 10,
    maxVideos: 99,
    whatsappVisible: true,
    badge: 'elite',
    searchOrder: 1,
    features: [
      'Tudo do Premium',
      'Até 10 palestras cadastradas (cobertura total de temas)',
      'Fotos e vídeos ilimitados',
      'Topo dos resultados de busca',
      'Destaque na homepage',
      'Badge dourado Elite no perfil',
      'Analytics completo de views e leads',
      'Suporte prioritário',
    ]
  }
};

/**
 * SVGs Lucide inline usados nos badges. Cada SVG ocupa 14x14.
 */
const BADGE_ICONS = {
  mic:        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  graduation: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  shield:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
  // Selo "verificado" (aprovado pela curadoria): check branco no circulo azul do .badge--selo.
  verified:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
};

/**
 * Retorna HTML dos badges acumulaveis do palestrante.
 *   - Selo Palco (has_seal): palestrante selecionado pela Avantik como destaque de palco.
 *   - Setor Publico (public_sector_ready): habilitado pela curadoria para orgaos publicos.
 *   - Apogeu Graduado (did_apogeu): concluiu o curso Apogeu.
 *   - Tier (profissional/premium/elite): sempre presente.
 * Uso: renderBadges(speaker) -> string HTML. Aceita tanto objeto speaker quanto apenas
 * string do plan (retrocompatibilidade com antigo getTierBadge).
 */
export function renderBadges(speakerOrPlan) {
  const s = typeof speakerOrPlan === 'string' ? { plan: speakerOrPlan } : (speakerOrPlan || {});

  const items = [];
  if (s.has_seal) {
    // Pill com texto fixo (sem depender de hover) — "Aprovado pela curadoria".
    items.push(`<span class="badge-seal" aria-label="Aprovado pela curadoria">${BADGE_ICONS.verified}<span>Aprovado pela curadoria</span></span>`);
  }
  if (s.public_sector_ready) {
    items.push(`<span class="badge badge--setor-publico" title="Setor Público — documentação e notório saber validados pela curadoria da Avantik" aria-label="Habilitado para o setor público">${BADGE_ICONS.shield}</span>`);
  }
  if (s.did_apogeu) {
    items.push(`<span class="badge badge--apogeu" title="Apogeu Graduado — concluiu o curso Apogeu da Avantik" aria-label="Apogeu Graduado">${BADGE_ICONS.graduation}</span>`);
  }
  if (items.length === 0) return '';
  return `<div class="badges">${items.join('')}</div>`;
}

/**
 * @deprecated Use renderBadges(speaker). Mantido para callers legados.
 */
export function getTierBadge(plan) {
  return renderBadges({ plan });
}

/**
 * Valor numerico pra ordenacao (menor = aparece primeiro)
 */
export function getTierOrder(plan) {
  return TIERS[plan]?.searchOrder ?? 3;
}

// ==========================================
// AUTH FUNCTIONS
// ==========================================

/**
 * Cadastra novo usuario no Supabase Auth
 */
export async function authSignUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Login com email e senha
 */
export async function authSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Logout
 */
export async function authSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Retorna usuario logado ou null
 */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Descobre os papeis do usuario: contractor, speaker, ou ambos.
 * Retorna objeto retrocompativel com .type e .profile (papel primario)
 * + .roles[], .hasRole(t), .getProfile(t) para suportar multiplos papeis.
 */
export async function getUserType(userId) {
  // Buscar ambos em paralelo (maybeSingle nao lanca erro se vazio)
  const [contractorRes, speakerRes] = await Promise.all([
    supabase.from('contractors').select('*').eq('auth_id', userId).maybeSingle(),
    supabase.from('speakers').select('*').eq('auth_id', userId).maybeSingle(),
  ]);

  const contractor = contractorRes.data;
  const speaker = speakerRes.data;

  const roles = [];
  if (contractor) roles.push({ type: 'contractor', profile: contractor });
  if (speaker) roles.push({ type: 'speaker', profile: speaker });

  // Papel ativo: usar localStorage se disponivel, senao o primeiro encontrado
  let activeRole = null;
  try {
    activeRole = localStorage.getItem('avantik_active_role');
  } catch (_) {}

  const activeEntry = roles.find(r => r.type === activeRole) || roles[0];
  const primary = activeEntry || { type: null, profile: null };

  return {
    type: primary.type,
    profile: primary.profile,
    roles,
    hasRole: (t) => roles.some(r => r.type === t),
    getProfile: (t) => (roles.find(r => r.type === t) || {}).profile || null,
  };
}

/**
 * Verifica se existe speaker com este email sem auth_id (para migracao).
 * Usa RPC SECURITY DEFINER — speakers nao e mais publicamente legivel (LGPD).
 */
export async function findSpeakerByEmail(email) {
  const { data, error } = await supabase.rpc('find_speaker_by_email', { p_email: email });
  if (error || !data || data.length === 0) return null;
  return data[0];
}

/**
 * Vincula auth_id a um speaker existente (migracao)
 */
export async function linkSpeakerAuth(speakerId, authId) {
  // Usa RPC SECURITY DEFINER (migration 013) porque a RLS de SELECT restringe
  // speakers com auth_id=auth.uid() — durante o primeiro acesso o auth_id
  // ainda e NULL, entao o UPDATE direto nao encontra a linha via RLS.
  const { error } = await supabase.rpc('link_speaker_auth', {
    p_speaker_id: speakerId,
    p_auth_id: authId,
  });

  if (error) throw error;
}

/**
 * Protege rota: redireciona para /entrar/ se nao logado.
 * allowedType pode ser string ou array de strings.
 * Retorna { user, type, profile, roles, hasRole, getProfile } se logado.
 */
export async function requireAuth(allowedType) {
  const user = await getUser();
  if (!user) {
    window.location.href = '/entrar/?redirect=' + encodeURIComponent(window.location.pathname);
    return null;
  }

  const result = await getUserType(user.id);

  if (allowedType) {
    const allowed = Array.isArray(allowedType) ? allowedType : [allowedType];
    const hasAllowed = allowed.some(t => result.hasRole(t));
    if (!hasAllowed) {
      window.location.href = '/';
      return null;
    }
  }

  return { user, ...result };
}

/**
 * Tipos de evento disponiveis
 */
export const EVENT_TYPES = {
  palestra: 'Palestra',
  workshop: 'Workshop',
  treinamento: 'Treinamento',
  sipat: 'SIPAT',
  painel: 'Painel',
  outro: 'Outro'
};

/**
 * Formatos de palestra
 */
export const PALESTRA_FORMATS = {
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Presencial e online'
};

/**
 * Formata duracao em minutos para exibicao: 60 -> "1h", 90 -> "1h30"
 */
export function formatDuration(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, '0')}`;
}

// ==========================================
// SUBSCRIPTION / BILLING HELPERS
// ==========================================

const DAY_MS = 24 * 60 * 60 * 1000;
const TRIAL_DAYS = 15;
const RENEWAL_WARNING_DAYS = 30;

/**
 * Retorna o estado de cobranca do palestrante.
 *   { state, daysLeft, paidUntil, trialEndsAt }
 * Onde state pode ser:
 *   'paid_active'    — plano anual ativo e longe do vencimento
 *   'paid_expiring'  — plano anual ativo, vence em <= 30 dias
 *   'trial_active'   — trial valido, ainda nao pagou
 *   'trial_expiring' — trial vence em <= 5 dias
 *   'expired'        — sem trial valido nem plano pago
 */
export function getSubscriptionStatus(speaker) {
  if (!speaker) return { state: 'expired', daysLeft: 0 };
  const now = Date.now();

  if (speaker.subscription_paid_until) {
    const paidUntil = new Date(speaker.subscription_paid_until);
    const daysLeft = Math.ceil((paidUntil.getTime() - now) / DAY_MS);
    if (daysLeft > RENEWAL_WARNING_DAYS) return { state: 'paid_active', daysLeft, paidUntil };
    if (daysLeft > 0) return { state: 'paid_expiring', daysLeft, paidUntil };
  }

  if (speaker.trial_started_at) {
    const trialEndsAt = new Date(new Date(speaker.trial_started_at).getTime() + TRIAL_DAYS * DAY_MS);
    const daysLeft = Math.ceil((trialEndsAt.getTime() - now) / DAY_MS);
    if (daysLeft > 5) return { state: 'trial_active', daysLeft, trialEndsAt };
    if (daysLeft > 0) return { state: 'trial_expiring', daysLeft, trialEndsAt };
  }

  return { state: 'expired', daysLeft: 0 };
}

/**
 * Inicia checkout no Mercado Pago para o plano escolhido.
 * Chama a Netlify Function /create-checkout, recebe init_point e redireciona.
 * Lanca erro se nao houver sessao ou se a function falhar.
 */
/**
 * Plano de anuidade do CONTRATANTE.
 * Contratante segue gratis (gratis + comissao 30%); esta e a opcao paga opcional.
 */
export const CONTRACTOR_PLAN = {
  price: 2000,
  installments: 12,
  freeTalks: 3,
};

/**
 * Status do plano do contratante (espelho simplificado de getSubscriptionStatus).
 * Retorna { active, paidUntil, freeTalksTotal, freeTalksUsed, freeTalksLeft }.
 */
export function getContractorPlanStatus(contractor) {
  const c = contractor || {};
  const active = c.plan === 'anual' && c.subscription_paid_until
    && new Date(c.subscription_paid_until).getTime() > Date.now();
  const total = c.free_talks_total || 0;
  const used = c.free_talks_used || 0;
  return {
    active: !!active,
    paidUntil: c.subscription_paid_until || null,
    freeTalksTotal: total,
    freeTalksUsed: used,
    freeTalksLeft: Math.max(0, total - used),
  };
}

export async function startCheckout(plan, opts = {}) {
  const isContractor = opts.type === 'contractor';
  if (!isContractor && !TIERS[plan]) throw new Error(`Plano invalido: ${plan}`);

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error('Voce precisa estar logado para assinar.');

  const res = await fetch('/.netlify/functions/create-checkout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(isContractor ? { plan, type: 'contractor' } : { plan }),
  });

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).error || ''; } catch {}
    throw new Error(`Falha ao iniciar checkout (${res.status}). ${detail}`);
  }

  const { init_point } = await res.json();
  if (!init_point) throw new Error('Resposta invalida do checkout.');

  window.location.href = init_point;
}

/**
 * Gera slug para palestra a partir do titulo
 */
export function generatePalestraSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
