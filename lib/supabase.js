import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ajokzpjguhfxxudteetr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjQ1NTQsImV4cCI6MjA5MDQwMDU1NH0.TG-ASfMGgNY4BoHsFQx8TQ-4HPVsdbGEu4zJuFAeiNg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  if (max) return `Ate R$ ${fmt(max)}`;
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
    priceLabel: 'Gratis',
    maxPhotos: 1,
    maxThemes: 3,
    maxVideos: 0,
    whatsappVisible: false,
    badge: null,
    searchOrder: 3,
    features: [
      'Perfil basico na plataforma',
      '1 foto de perfil',
      'Ate 3 temas de atuacao',
      'Contato por email',
    ]
  },
  profissional: {
    name: 'Profissional',
    price: 67,
    priceLabel: 'R$ 67/mes',
    maxPhotos: 10,
    maxThemes: 99,
    maxVideos: 1,
    whatsappVisible: true,
    badge: 'profissional',
    searchOrder: 2,
    features: [
      'Tudo do Essencial',
      '10 fotos no perfil',
      'Todos os temas de atuacao',
      '1 video',
      'WhatsApp visivel para empresas',
      'Selo verificado',
      'Prioridade na busca',
      'Programa Apogeu (basico)',
    ]
  },
  destaque: {
    name: 'Destaque',
    price: 147,
    priceLabel: 'R$ 147/mes',
    maxPhotos: 99,
    maxThemes: 99,
    maxVideos: 99,
    whatsappVisible: true,
    badge: 'destaque',
    searchOrder: 1,
    features: [
      'Tudo do Profissional',
      'Fotos e videos ilimitados',
      'Selo dourado de destaque',
      'Topo dos resultados de busca',
      'Destaque na homepage',
      'Programa Apogeu (completo)',
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
