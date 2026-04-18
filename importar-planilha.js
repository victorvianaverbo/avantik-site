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
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjQ1NTQsImV4cCI6MjA5MDQwMDU1NH0.TG-ASfMGgNY4BoHsFQx8TQ-4HPVsdbGEu4zJuFAeiNg';

const AVATAR_PLACEHOLDER = '/images/avatar-placeholder.svg';

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

const cadastroSheetName = sheetNames.find(n => /cadastro/i.test(n));
const palestrasSheetName = sheetNames.find(n => /p[aá]gina\s*1/i.test(n)) || sheetNames[0];

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

  const payload = {
    name,
    email,
    bio,
    city,
    state,
    linkedin,
    instagram,
    photo_url: AVATAR_PLACEHOLDER,
    active: true,
    plan: 'essencial',
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

let palOk = 0, palSkip = 0, palOrf = 0;

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

  // Slug unico por (speaker_id, slug)
  const baseSlug = slugify(title);
  const { data: existingSlugs } = await supabase
    .from('palestras')
    .select('slug')
    .eq('speaker_id', sid)
    .like('slug', `${baseSlug}%`);
  let slug = baseSlug;
  if (existingSlugs && existingSlugs.some(s => s.slug === baseSlug)) {
    // Ja existe essa palestra para esse palestrante -> pula (idempotencia)
    console.log(`[palestra] JA EXISTE "${title}" / ${speakerName}`);
    palSkip++;
    continue;
  }

  const { data: palInserted, error: palErr } = await supabase
    .from('palestras')
    .insert({
      speaker_id: sid,
      title,
      slug,
      description,
      theme_id: primaryThemeId,
      target_audience: targetAudience,
      objectives: objectives.length ? objectives : null,
      impact_phrase: impactPhrase,
      topics,
      active: true,
    })
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
console.log(`Palestras: ${palOk} inseridas, ${palSkip} puladas/existentes, ${palOrf} orfas`);
console.log('Concluido.');
