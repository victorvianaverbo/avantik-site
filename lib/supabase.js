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
    price: 67,
    priceLabel: 'R$ 67/mês',
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
      'Contato direto com o lead — zero comissão',
      'Suporte por e-mail',
    ]
  },
  premium: {
    name: 'Premium',
    price: 147,
    priceLabel: 'R$ 147/mês',
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
    priceLabel: 'R$ 297/mês',
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
};

/**
 * Retorna HTML dos badges acumulaveis do palestrante.
 *   - Selo Palco (has_seal): palestrante selecionado pela Avantik como destaque de palco.
 *   - Apogeu Graduado (did_apogeu): concluiu o curso Apogeu.
 *   - Tier (profissional/premium/elite): sempre presente.
 * Uso: renderBadges(speaker) -> string HTML. Aceita tanto objeto speaker quanto apenas
 * string do plan (retrocompatibilidade com antigo getTierBadge).
 */
export function renderBadges(speakerOrPlan) {
  const s = typeof speakerOrPlan === 'string' ? { plan: speakerOrPlan } : (speakerOrPlan || {});

  const items = [];
  if (s.has_seal) {
    items.push(`<span class="badge badge--selo" title="Selo Palco — palestrante destaque no palco" aria-label="Selo Palco">${BADGE_ICONS.mic}</span>`);
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
  hibrido: 'Híbrido'
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
