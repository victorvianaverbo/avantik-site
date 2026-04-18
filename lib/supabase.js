import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ajokzpjguhfxxudteetr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjQ1NTQsImV4cCI6MjA5MDQwMDU1NH0.TG-ASfMGgNY4BoHsFQx8TQ-4HPVsdbGEu4zJuFAeiNg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
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
  essencial: {
    name: 'Essencial',
    price: 0,
    priceLabel: 'Grátis',
    maxPhotos: 1,
    maxPalestras: 1,
    maxVideos: 0,
    whatsappVisible: false,
    badge: null,
    searchOrder: 3,
    features: [
      'Perfil básico na plataforma',
      '1 foto de perfil',
      '1 palestra cadastrada',
      'Contato por email',
    ]
  },
  profissional: {
    name: 'Profissional',
    price: 67,
    priceLabel: 'R$ 67/mês',
    maxPhotos: 10,
    maxPalestras: 99,
    maxVideos: 1,
    whatsappVisible: true,
    badge: 'profissional',
    searchOrder: 2,
    features: [
      'Tudo do Essencial',
      '10 fotos no perfil',
      'Até 99 palestras cadastradas',
      '1 vídeo',
      'WhatsApp visível para empresas',
      'Selo verificado',
      'Prioridade na busca',
      'Programa Avantik Pro (básico)',
    ]
  },
  destaque: {
    name: 'Destaque',
    price: 147,
    priceLabel: 'R$ 147/mês',
    maxPhotos: 99,
    maxPalestras: 999,
    maxVideos: 99,
    whatsappVisible: true,
    badge: 'destaque',
    searchOrder: 1,
    features: [
      'Tudo do Profissional',
      'Palestras ilimitadas',
      'Fotos e vídeos ilimitados',
      'Selo dourado de destaque',
      'Topo dos resultados de busca',
      'Destaque na homepage',
      'Programa Avantik Pro (completo)',
      'Analytics de views e leads',
    ]
  }
};

/**
 * Retorna HTML do badge de tier
 */
export function getTierBadge(plan) {
  if (plan === 'profissional') return '<span class="tier-badge tier-badge--profissional">Verificado</span>';
  if (plan === 'destaque') return '<span class="tier-badge tier-badge--destaque">Destaque</span>';
  return '';
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
 * Verifica se existe speaker com este email sem auth_id (para migracao)
 */
export async function findSpeakerByEmail(email) {
  const { data } = await supabase
    .from('speakers')
    .select('id, name, auth_id')
    .eq('email', email)
    .limit(1);

  return data && data.length > 0 ? data[0] : null;
}

/**
 * Vincula auth_id a um speaker existente (migracao)
 */
export async function linkSpeakerAuth(speakerId, authId) {
  const { error } = await supabase
    .from('speakers')
    .update({ auth_id: authId })
    .eq('id', speakerId)
    .is('auth_id', null);

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
