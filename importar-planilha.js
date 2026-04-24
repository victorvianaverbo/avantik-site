/**
 * Importacao em massa da planilha PLANILHA CADASTRO SITE.xlsx
 *
 * PRE-REQUISITOS:
 *   1. Rodar no SQL Editor do Supabase: migrations/008-importacao-planilha.sql
 *   2. Instalar deps locais (uma vez): npm install
 *
 * USO:
 *   node importar-planilha.js
 *   node importar-planilha.js --file "F:/Downloads/PLANILHA CADASTRO SITE.xlsx"
 *
 * O QUE FAZ:
 *   - Le a aba CADASTRO e cria/atualiza palestrantes em public.speakers
 *   - Le a aba "Pagina1" e cria palestras em public.palestras, vinculando
 *     a multiplos temas via public.palestra_themes quando a categoria e
 *     composta (ex: "Gestao / Financas").
 *   - Palestrantes sem foto ficam com avatar placeholder.
 *   - Idempotente: rodar duas vezes nao duplica registros.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';

const SUPABASE_URL = 'https://ajokzpjguhfxxudteetr.supabase.co';
// Service role key — necessario para contornar RLS ao criar themes/speakers/palestras
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgyNDU1NCwiZXhwIjoyMDkwNDAwNTU0fQ.ORFf1oXdjZIUfY7FEuSsXW95p49OBouOQ1H5Zo03tXk';

const AVATAR_PLACEHOLDER = '/images/avatar-placeholder.svg';

// Converte link do Google Drive (/file/d/ID/view) para URL direta de imagem
function driveToImageUrl(driveUrl) {
  if (!driveUrl) return null;
  const match = driveUrl.match(/\/file\/d\/([^\/]+)/);
  if (!match) return driveUrl;
  return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
}

const args = process.argv.slice(2);
const fileArgIdx = args.indexOf('--file');
const XLSX_PATH = fileArgIdx >= 0 ? args[fileArgIdx + 1] : 'F:/Downloads/PLANILHA CADASTRO SITE.xlsx';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------- Utilidades ----------

function normalize(s) {
  return (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function slugify(s) {
  return normalize(s)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function cleanField(v) {
  if (v === null || v === undefined) return null;
  const s = v.toString().trim();
  if (!s) return null;
  if (/^n[aã]o\s+informado$/i.test(s)) return null;
  return s;
}

// Converte valores de preco da planilha para inteiro em reais.
// Aceita: 5000, "5000", "5.000", "R$ 5.000,00", "5000,50" -> 5000 (arredonda pra baixo).
function parsePrice(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return Math.round(v);
  const raw = v.toString().trim();
  if (!raw) return null;
  // Remove R$, espacos, pontos de milhar. Troca virgula decimal por ponto.
  const cleaned = raw
    .replace(/[R$\s]/gi, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '') // ponto de milhar
    .replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function parseCidade(raw) {
  const v = cleanField(raw);
  if (!v) return { city: null, state: null };
  // "Belo Horizonte/MG"
  const m = v.match(/^(.+?)\s*\/\s*([A-Z]{2})\s*$/);
  if (m) return { city: m[1].trim(), state: m[2].trim() };
  return { city: v, state: null };
}

function parseCategorias(raw) {
  const v = cleanField(raw);
  if (!v) return [];
  return v.split('/').map(s => s.trim()).filter(Boolean);
}

// ---------- Carregar planilha ----------

console.log(`Lendo planilha: ${XLSX_PATH}`);
const workbook = XLSX.read(readFileSync(XLSX_PATH), { type: 'buffer' });
const sheetNames = workbook.SheetNames;
console.log(`Abas encontradas: ${sheetNames.join(', ')}`);

// Aba de palestrantes: "CADASTRO BIO" (nova planilha) ou "CADASTRO" (antiga)
const cadastroSheetName = sheetNames.find(n => /cadastro\s+bio/i.test(n))
  || sheetNames.find(n => /^cadastro$/i.test(n));
// Aba de palestras: "CADASTRO PALESTRA" (nova planilha) ou "Pagina1" (antiga)
const palestrasSheetName = sheetNames.find(n => /cadastro\s+palestra/i.test(n))
  || sheetNames.find(n => /p[aá]gina\s*1/i.test(n))
  || sheetNames[0];

if (!cadastroSheetName) throw new Error('Aba CADASTRO nao encontrada');
if (!palestrasSheetName) throw new Error('Aba de palestras nao encontrada');

const cadastroRows = XLSX.utils.sheet_to_json(workbook.Sheets[cadastroSheetName], { defval: null });
const palestrasRows = XLSX.utils.sheet_to_json(workbook.Sheets[palestrasSheetName], { defval: null });

console.log(`Palestrantes na planilha: ${cadastroRows.length}`);
console.log(`Palestras na planilha: ${palestrasRows.length}`);
console.log('---');

// ---------- Carregar themes do banco ----------

const { data: allThemes, error: themesErr } = await supabase.from('themes').select('id, name, slug');
if (themesErr) throw themesErr;

const themeByName = {};
for (const t of allThemes) {
  themeByName[normalize(t.name)] = t;
}

async function ensureTheme(name) {
  const key = normalize(name);
  if (themeByName[key]) return themeByName[key];
  const slug = slugify(name);
  const { data, error } = await supabase
    .from('themes')
    .insert({ name, slug })
    .select('id, name, slug')
    .single();
  if (error) {
    // Pode ser corrida de slug, tenta buscar
    const { data: found } = await supabase.from('themes').select('id, name, slug').eq('slug', slug).single();
    if (found) {
      themeByName[key] = found;
      return found;
    }
    throw error;
  }
  themeByName[key] = data;
  console.log(`  [tema novo] ${name} (${slug})`);
  return data;
}

// ---------- Importar palestrantes ----------

let spkOk = 0, spkUpd = 0, spkSkip = 0;
const speakerByName = {};   // nome normalizado -> id

for (const row of cadastroRows) {
  const name = cleanField(row['Nome']);
  const email = cleanField(row['E-mail'] || row['Email']);
  if (!name || !email) {
    console.log(`[speaker] PULADO (sem nome/email): ${JSON.stringify(row).slice(0, 80)}`);
    spkSkip++;
    continue;
  }

  const { city, state } = parseCidade(row['Cidade']);
  const bio = cleanField(row['Bio']);
  const linkedin = cleanField(row['LinkedIn']);
  const instagram = cleanField(row['Instagram']);
  const website = cleanField(row['Site']);
  const photoDriveUrl = cleanField(row['Link da Foto']);
  // Video preferencial: "Video Avantik"; fallback: canal do youtube
  const videoUrl = cleanField(row['Video Avantik']) || cleanField(row['youtube']);
  const photoUrl = driveToImageUrl(photoDriveUrl) || AVATAR_PLACEHOLDER;
  const seloRaw = cleanField(row['Selo']);
  const hasSeal = seloRaw && ['sim', 'yes', 'x', '1', 'true'].includes(seloRaw.toString().trim().toLowerCase());

  const payload = {
    name,
    email,
    bio,
    city,
    state,
    linkedin,
    instagram,
    website,
    photo_url: photoUrl,
    video_url: videoUrl,
    active: true,
    plan: 'profissional',
    has_seal: hasSeal,
  };

  // Ja existe? (busca por email)
  const { data: existing } = await supabase
    .from('speakers')
    .select('id, slug')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('speakers').update(payload).eq('id', existing.id);
    if (error) {
      console.log(`[speaker] ERRO update ${name}: ${error.message}`);
      spkSkip++;
      continue;
    }
    speakerByName[normalize(name)] = existing.id;
    console.log(`[speaker] UPD ${name}`);
    spkUpd++;
    continue;
  }

  // Slug unico
  const baseSlug = slugify(name);
  const { data: slugsLike } = await supabase
    .from('speakers')
    .select('slug')
    .like('slug', `${baseSlug}%`);
  let slug = baseSlug;
  if (slugsLike && slugsLike.some(s => s.slug === baseSlug)) {
    let i = 2;
    while (slugsLike.some(s => s.slug === `${baseSlug}-${i}`)) i++;
    slug = `${baseSlug}-${i}`;
  }

  const { data: inserted, error } = await supabase
    .from('speakers')
    .insert({ ...payload, slug })
    .select('id')
    .single();

  if (error) {
    console.log(`[speaker] ERRO insert ${name}: ${error.message}`);
    spkSkip++;
    continue;
  }
  speakerByName[normalize(name)] = inserted.id;
  console.log(`[speaker] OK  ${name} (${slug})`);
  spkOk++;
}

console.log('---');
console.log(`Palestrantes: ${spkOk} inseridos, ${spkUpd} atualizados, ${spkSkip} pulados`);
console.log('---');

// ---------- Importar palestras ----------

let palOk = 0, palUpd = 0, palSkip = 0, palOrf = 0;

for (const row of palestrasRows) {
  const speakerName = cleanField(row['Usuário'] || row['Usuario']);
  const title = cleanField(row['Nome da Palestra']);
  if (!speakerName || !title) {
    palSkip++;
    continue;
  }

  const speakerId = speakerByName[normalize(speakerName)];
  if (!speakerId) {
    // Tenta buscar no banco (caso palestrante ja existisse antes)
    const { data: found } = await supabase
      .from('speakers')
      .select('id')
      .ilike('name', speakerName)
      .maybeSingle();
    if (found) {
      speakerByName[normalize(speakerName)] = found.id;
    } else {
      console.log(`[palestra] ORFAO "${title}" - palestrante "${speakerName}" nao encontrado`);
      palOrf++;
      continue;
    }
  }
  const sid = speakerByName[normalize(speakerName)];

  const tipoRaw = row['Tipo'];
  const categorias = parseCategorias(tipoRaw);
  const themesForPalestra = [];
  for (const cat of categorias) {
    const t = await ensureTheme(cat);
    themesForPalestra.push(t);
  }
  const primaryThemeId = themesForPalestra[0]?.id || null;

  const objectives = [];
  for (const key of ['O que você vai aprender na palestra 1', 2, 3, 4, 5, 6]) {
    const v = cleanField(row[key]);
    if (v) objectives.push(v);
  }

  const description = cleanField(row['Sobre a palestra']);
  const impactPhrase = cleanField(row['Frase de Impacto']);
  const topics = cleanField(row['Assuntos abordados']);
  const targetAudience = cleanField(row['Para quem é esta palestra'] || row['Para quem e esta palestra']);
  const priceMin = parsePrice(row['Preço Mínimo'] || row['Preco Minimo']);
  const priceMax = parsePrice(row['Preço Máximo'] || row['Preco Maximo']);

  // Payload canonico — usado tanto no insert quanto no update
  const palestraPayload = {
    speaker_id: sid,
    title,
    description,
    theme_id: primaryThemeId,
    target_audience: targetAudience,
    objectives: objectives.length ? objectives : null,
    impact_phrase: impactPhrase,
    topics,
    price_min: priceMin,
    price_max: priceMax,
    active: true,
  };

  // Slug unico por (speaker_id, slug)
  const baseSlug = slugify(title);
  const { data: existingSlugs } = await supabase
    .from('palestras')
    .select('id, slug')
    .eq('speaker_id', sid)
    .like('slug', `${baseSlug}%`);
  let slug = baseSlug;
  const existing = existingSlugs?.find(s => s.slug === baseSlug);
  if (existing) {
    // Atualiza palestra existente (refresca precos, temas, descricao etc)
    const { error: updErr } = await supabase
      .from('palestras')
      .update(palestraPayload)
      .eq('id', existing.id);
    if (updErr) {
      console.log(`[palestra] ERRO update "${title}" / ${speakerName}: ${updErr.message}`);
      palSkip++;
      continue;
    }
    // Re-vincula temas: apaga e insere (idempotente)
    await supabase.from('palestra_themes').delete().eq('palestra_id', existing.id);
    if (themesForPalestra.length > 0) {
      const linkRows = themesForPalestra.map(t => ({ palestra_id: existing.id, theme_id: t.id }));
      await supabase.from('palestra_themes').insert(linkRows);
    }
    console.log(`[palestra] UPD "${title}" / ${speakerName}${priceMin || priceMax ? ` R$ ${priceMin || '?'}-${priceMax || '?'}` : ''}`);
    palUpd++;
    continue;
  }

  const { data: palInserted, error: palErr } = await supabase
    .from('palestras')
    .insert({ ...palestraPayload, slug })
    .select('id')
    .single();

  if (palErr) {
    console.log(`[palestra] ERRO "${title}" / ${speakerName}: ${palErr.message}`);
    palSkip++;
    continue;
  }

  // Vincular temas adicionais (e tambem o principal, para consistencia)
  if (themesForPalestra.length > 0) {
    const rows = themesForPalestra.map(t => ({ palestra_id: palInserted.id, theme_id: t.id }));
    const { error: linkErr } = await supabase.from('palestra_themes').insert(rows);
    if (linkErr) {
      console.log(`  [link-temas] aviso: ${linkErr.message}`);
    }
  }

  console.log(`[palestra] OK  ${title}  /  ${speakerName}  [${categorias.join(', ')}]`);
  palOk++;
}

console.log('---');
console.log(`Palestras: ${palOk} inseridas, ${palUpd} atualizadas, ${palSkip} puladas, ${palOrf} orfas`);
console.log('Concluido.');
