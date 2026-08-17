/**
 * Importacao em massa da planilha de palestrantes (v2 - taxonomia curada).
 *
 * PRE-REQUISITOS:
 *   1. Rodar no SQL Editor do Supabase: migrations/019-taxonomia-v2.sql (cria os
 *      49 temas canonicos com `categoria` e a coluna speakers.free_talk_eligible).
 *   2. npm install (uma vez).
 *
 * USO:
 *   node importar-planilha.js
 *   node importar-planilha.js --file "F:/Downloads/PLANILHA CADASTRO SITE PALESTRANTES.xlsx"
 *
 * O QUE FAZ:
 *   - Aba "CADASTRO BIO": cria/atualiza palestrantes (chave = NOME; e-mail opcional).
 *     Baixa a foto do Google Drive e re-hospeda no Supabase Storage (speaker-photos).
 *   - Aba "CADASTRO PALESTRA": cria/atualiza palestras e mapeia a coluna "Tipo"
 *     (texto livre) para os temas canonicos por palavra-chave.
 *   - Popula speaker_themes (M2M) com a UNIAO dos temas canonicos das palestras
 *     de cada palestrante -> e o que alimenta o filtro do diretorio.
 *   - Idempotente.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ajokzpjguhfxxudteetr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE;
if (!SUPABASE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE no ambiente antes de rodar (nunca commite a chave).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const args = process.argv.slice(2);
const fileArgIdx = args.indexOf('--file');
const XLSX_PATH = fileArgIdx >= 0 ? args[fileArgIdx + 1] : 'F:/Downloads/PLANILHA CADASTRO SITE PALESTRANTES.xlsx';

// ---------- Utilidades ----------

function normalize(s) {
  return (s || '').toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function slugify(s) {
  return normalize(s).replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
function cleanField(v) {
  if (v === null || v === undefined) return null;
  const s = v.toString().trim();
  if (!s || s === '-') return null;
  if (/^n[aã]o\s+informado$/i.test(s)) return null;
  return s;
}
function parsePrice(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return Math.round(v);
  const raw = v.toString().trim();
  if (!raw) return null;
  const cleaned = raw.replace(/[R$\s]/gi, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}
function parseCidade(raw) {
  const v = cleanField(raw);
  if (!v) return { city: null, state: null };
  const m = v.match(/^(.+?)\s*\/\s*([A-Z]{2})\s*$/);
  if (m) return { city: m[1].trim(), state: m[2].trim() };
  return { city: v, state: null };
}

// ---------- Mapa de palavra-chave -> tema canonico (slug) ----------
// Ordem importa: o primeiro slug casado vira o tema principal da palestra.
const KEYWORD_THEME = [
  ['lideranca', 'lideranca'],
  ['vendas', 'vendas'], ['comercial', 'vendas'], ['prospeccao', 'vendas'],
  ['negocia', 'negociacao'],
  ['experiencia do cliente', 'experiencia-do-cliente'],
  ['atendimento', 'atendimento'],
  ['gestao', 'gestao'],
  ['cultura organizacional', 'cultura-organizacional'], ['cultura empresarial', 'cultura-organizacional'], ['felicidade corporativa', 'cultura-organizacional'], ['clima organizacional', 'cultura-organizacional'],
  ['comunicacao', 'comunicacao'], ['mediacao de conflito', 'comunicacao'],
  ['oratoria', 'oratoria'],
  ['networking', 'networking'], ['network', 'networking'],
  ['inteligencia emocional', 'inteligencia-emocional'],
  ['saude mental', 'saude-mental'], ['saude emocional', 'saude-mental'], ['bem-estar', 'saude-mental'], ['bem estar', 'saude-mental'], ['qualidade de vida', 'saude-mental'], ['saude fisica', 'saude-mental'],
  ['autoconhecimento', 'autoconhecimento'],
  ['desenvolvimento pessoal', 'desenvolvimento-pessoal'], ['desenvolvimento humano', 'desenvolvimento-pessoal'], ['formacao humana', 'desenvolvimento-pessoal'], ['proposito', 'desenvolvimento-pessoal'], ['identidade', 'desenvolvimento-pessoal'],
  ['alta performance', 'alta-performance'], ['performance', 'alta-performance'], ['produtividade', 'alta-performance'], ['disciplina', 'alta-performance'], ['excelencia', 'alta-performance'], ['pioneirismo', 'alta-performance'],
  ['motivacional', 'motivacional'], ['motivacao', 'motivacional'],
  ['superacao', 'superacao'], ['resiliencia', 'superacao'],
  ['futuro do trabalho', 'carreira'], ['carreira', 'carreira'],
  ['aprendizagem', 'aprendizagem'], ['ingles', 'aprendizagem'],
  ['geopolitica', 'geopolitica'], ['relacoes internacionais', 'geopolitica'], ['cenario global', 'geopolitica'], ['economia global', 'geopolitica'],
  ['politica', 'politica'],
  ['etica', 'etica'],
  ['espiritualidade', 'espiritualidade'],
  ['familia', 'familia-e-relacoes-humanas'], ['relacoes humanas', 'familia-e-relacoes-humanas'],
  ['filosofia', 'filosofia'],
  ['sustentabilidade', 'sustentabilidade'],
  ['diversidade', 'diversidade-e-inclusao'], ['inclusao', 'diversidade-e-inclusao'], ['representatividade', 'diversidade-e-inclusao'], ['lideranca feminina', 'diversidade-e-inclusao'],
  ['seguranca do trabalho', 'seguranca-do-trabalho'], ['sipat', 'seguranca-do-trabalho'],
  ['reputacao', 'reputacao'],
  ['empreendedorismo', 'empreendedorismo'], ['startup', 'empreendedorismo'], ['escalabilidade', 'empreendedorismo'], ['nova economia', 'empreendedorismo'], ['liberdade economica', 'empreendedorismo'], ['liberdade individual', 'empreendedorismo'],
  ['inteligencia artificial', 'inteligencia-artificial'],
  ['inovacao', 'inovacao'], ['transformacao digital', 'inovacao'],
  ['tecnologia', 'tecnologia'],
  ['marketing', 'marketing'],
  ['branding', 'branding'], ['construcao de marca', 'branding'], ['marca pessoal', 'branding'],
  ['financas empresariais', 'financas-empresariais'],
  ['educacao financeira', 'financas'], ['financas', 'financas'], ['patrimonio', 'financas'], ['investimentos', 'financas'],
  ['economia', 'economia'], ['mercado financeiro', 'economia'], ['cenario economico', 'economia'], ['macroeconomic', 'economia'],
  ['tributos', 'tributos'],
  ['juridico', 'juridico'], ['direito', 'juridico'],
  ['departamento pessoal', 'departamento-pessoal'],
  ['franchising', 'franchising'],
  ['varejo', 'varejo'],
  ['defesa pessoal', 'defesa-pessoal'],
  ['estrategia', 'estrategia'], ['estrategico', 'estrategia'], ['planejamento', 'estrategia'],
  ['educacao', 'educacao'],
  ['negocios', 'negocios'],
  ['comportamento', 'comportamento'], ['neurociencia', 'comportamento'], ['geracoes', 'comportamento'],
  ['futuro', 'futuro'],
];

function mapTipoToSlugs(tipoRaw) {
  const t = normalize(tipoRaw);
  if (!t) return [];
  const out = [];
  for (const [kw, slug] of KEYWORD_THEME) {
    if (t.includes(kw) && !out.includes(slug)) out.push(slug);
  }
  return out;
}

// ---------- Foto: baixar do Drive e subir no Storage ----------
function driveId(url) {
  const m = String(url || '').match(/\/d\/([^\/?]+)/) || String(url || '').match(/[?&]id=([^&]+)/);
  return m ? m[1] : null;
}
async function fetchDriveImage(driveUrl) {
  const id = driveId(driveUrl);
  if (!id) return null;
  const candidates = [
    `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://lh3.googleusercontent.com/d/${id}=w1000`,
  ];
  for (const u of candidates) {
    try {
      const res = await fetch(u, { redirect: 'follow' });
      if (!res.ok) continue;
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!ct.startsWith('image/')) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1500) continue; // muito pequeno = erro/icone
      return { buf, contentType: ct };
    } catch { /* tenta proximo */ }
  }
  return null;
}
async function uploadPhoto(driveUrl, slug) {
  const img = await fetchDriveImage(driveUrl);
  if (!img) return null;
  const ext = img.contentType.includes('png') ? 'png' : img.contentType.includes('webp') ? 'webp' : 'jpg';
  const filename = `${slug}.${ext}`;
  const { error } = await supabase.storage.from('speaker-photos')
    .upload(filename, img.buf, { upsert: true, contentType: img.contentType });
  if (error) { console.log(`  [foto] erro upload ${slug}: ${error.message}`); return null; }
  return supabase.storage.from('speaker-photos').getPublicUrl(filename).data.publicUrl;
}

// ---------- Carregar planilha ----------

console.log(`Lendo planilha: ${XLSX_PATH}`);
const workbook = XLSX.read(readFileSync(XLSX_PATH), { type: 'buffer' });
const sheetNames = workbook.SheetNames;
console.log(`Abas encontradas: ${sheetNames.join(', ')}`);

const cadastroSheetName = sheetNames.find(n => /cadastro\s+bio/i.test(n)) || sheetNames.find(n => /^cadastro$/i.test(n));
const palestrasSheetName = sheetNames.find(n => /cadastro\s+palestra/i.test(n)) || sheetNames.find(n => /p[aá]gina\s*1/i.test(n)) || sheetNames[0];
if (!cadastroSheetName) throw new Error('Aba CADASTRO BIO nao encontrada');
if (!palestrasSheetName) throw new Error('Aba de palestras nao encontrada');

const cadastroRows = XLSX.utils.sheet_to_json(workbook.Sheets[cadastroSheetName], { defval: null });
const palestrasRows = XLSX.utils.sheet_to_json(workbook.Sheets[palestrasSheetName], { defval: null });
console.log(`Palestrantes: ${cadastroRows.length} | Palestras: ${palestrasRows.length}`);
console.log('---');

// ---------- Carregar themes canonicos do banco ----------
const { data: allThemes, error: themesErr } = await supabase.from('themes').select('id, name, slug, categoria');
if (themesErr) throw themesErr;
const themeBySlug = {};
for (const t of allThemes) themeBySlug[t.slug] = t;
const canonicalCount = allThemes.filter(t => t.categoria).length;
console.log(`Temas no banco: ${allThemes.length} (canonicos com categoria: ${canonicalCount})`);
if (canonicalCount < 40) console.log('AVISO: rode migrations/019-taxonomia-v2.sql antes — temas canonicos faltando.');
console.log('---');

// ---------- Pre-carregar palestrantes existentes (chave = nome normalizado) ----------
const { data: existingSpeakers } = await supabase.from('speakers').select('id, slug, name');
const speakerByName = {};          // nome normalizado -> id
const existingByName = {};         // nome normalizado -> {id, slug}
const usedSlugs = new Set();
for (const s of (existingSpeakers || [])) {
  existingByName[normalize(s.name)] = { id: s.id, slug: s.slug };
  if (s.slug) usedSlugs.add(s.slug);
}
function uniqueSlug(base) {
  let slug = base || 'palestrante';
  if (!usedSlugs.has(slug)) { usedSlugs.add(slug); return slug; }
  let i = 2;
  while (usedSlugs.has(`${base}-${i}`)) i++;
  slug = `${base}-${i}`;
  usedSlugs.add(slug);
  return slug;
}

// ---------- Importar palestrantes ----------
let spkOk = 0, spkUpd = 0, spkSkip = 0, semFoto = 0;

for (const row of cadastroRows) {
  const name = cleanField(row['Nome']);
  if (!name) { spkSkip++; continue; }

  const key = normalize(name);
  const existing = existingByName[key];
  const slug = existing?.slug || uniqueSlug(slugify(name));

  const { city, state } = parseCidade(row['Cidade']);
  const seloRaw = cleanField(row['Selo']);
  const hasSeal = !!(seloRaw && ['sim', 'yes', 'x', '1', 'true'].includes(seloRaw.toLowerCase()));

  // Foto -> Storage (re-hospedada). Sem foto valida => photo_url null (nao aparece no site).
  const photoUrl = await uploadPhoto(cleanField(row['Link da Foto']), slug);
  if (!photoUrl) semFoto++;

  const email = cleanField(row['E-mail'] || row['Email']);
  const payload = {
    name,
    bio: cleanField(row['Bio']),
    city, state,
    linkedin: cleanField(row['LinkedIn']),
    instagram: cleanField(row['Instagram']),
    website: cleanField(row['Site']),
    photo_url: photoUrl,
    video_url: cleanField(row['Video Avantik']) || cleanField(row['youtube']),
    active: true,
    plan: 'profissional',
    has_seal: hasSeal,
  };
  // email e NOT NULL: so seta quando vier preenchido (nao apaga o existente em update).
  if (email) payload.email = email;

  if (existing) {
    const { error } = await supabase.from('speakers').update(payload).eq('id', existing.id);
    if (error) { console.log(`[speaker] ERRO update ${name}: ${error.message}`); spkSkip++; continue; }
    speakerByName[key] = existing.id;
    console.log(`[speaker] UPD ${name}${photoUrl ? '' : ' (SEM FOTO)'}`);
    spkUpd++;
  } else {
    // Novo sem e-mail: placeholder unico (NOT NULL). Avantik pode atualizar depois.
    const insertEmail = email || `${slug}@sem-email.avantik.app`;
    const { data: inserted, error } = await supabase.from('speakers').insert({ ...payload, email: insertEmail, slug }).select('id').single();
    if (error) { console.log(`[speaker] ERRO insert ${name}: ${error.message}`); spkSkip++; continue; }
    speakerByName[key] = inserted.id;
    existingByName[key] = { id: inserted.id, slug };
    console.log(`[speaker] OK  ${name} (${slug})${photoUrl ? '' : ' (SEM FOTO)'}`);
    spkOk++;
  }
}
console.log('---');
console.log(`Palestrantes: ${spkOk} inseridos, ${spkUpd} atualizados, ${spkSkip} pulados, ${semFoto} sem foto`);
console.log('---');

// ---------- Importar palestras + acumular temas por palestrante ----------
let palOk = 0, palUpd = 0, palSkip = 0, palOrf = 0;
const speakerThemeIds = {};  // speaker_id -> Set(theme_id)

for (const row of palestrasRows) {
  const speakerName = cleanField(row['Usuário'] || row['Usuario']);
  const title = cleanField(row['Nome da Palestra']);
  if (!speakerName || !title) { palSkip++; continue; }

  let sid = speakerByName[normalize(speakerName)];
  if (!sid) {
    const { data: found } = await supabase.from('speakers').select('id').ilike('name', speakerName).maybeSingle();
    if (found) { sid = found.id; speakerByName[normalize(speakerName)] = found.id; }
    else { console.log(`[palestra] ORFAO "${title}" - "${speakerName}" nao encontrado`); palOrf++; continue; }
  }

  // Tipo -> temas canonicos
  const slugs = mapTipoToSlugs(row['Tipo']);
  const themeObjs = slugs.map(sl => themeBySlug[sl]).filter(Boolean);
  const primaryThemeId = themeObjs[0]?.id || null;

  if (!speakerThemeIds[sid]) speakerThemeIds[sid] = new Set();
  themeObjs.forEach(t => speakerThemeIds[sid].add(t.id));

  const objectives = [];
  for (const k of ['O que você vai aprender na palestra 1', 2, 3, 4, 5, 6]) {
    const v = cleanField(row[k]); if (v) objectives.push(v);
  }

  const palestraPayload = {
    speaker_id: sid,
    title,
    description: cleanField(row['Sobre a palestra']),
    theme_id: primaryThemeId,
    target_audience: cleanField(row['Para quem é esta palestra'] || row['Para quem e esta palestra']),
    objectives: objectives.length ? objectives : null,
    impact_phrase: cleanField(row['Frase de Impacto']),
    topics: cleanField(row['Assuntos abordados']),
    price_min: parsePrice(row['Preço Mínimo'] || row['Preco Minimo']),
    price_max: parsePrice(row['Preço Máximo'] || row['Preco Maximo']),
    active: true,
  };

  const baseSlug = slugify(title);
  // Upsert: ja existe palestra DESTE palestrante com esse slug?
  const { data: mine } = await supabase.from('palestras').select('id, slug').eq('speaker_id', sid).eq('slug', baseSlug);
  const existing = mine?.[0];

  if (existing) {
    const { error: updErr } = await supabase.from('palestras').update(palestraPayload).eq('id', existing.id);
    if (updErr) { console.log(`[palestra] ERRO update "${title}": ${updErr.message}`); palSkip++; continue; }
    await supabase.from('palestra_themes').delete().eq('palestra_id', existing.id);
    if (themeObjs.length) await supabase.from('palestra_themes').insert(themeObjs.map(t => ({ palestra_id: existing.id, theme_id: t.id })));
    console.log(`[palestra] UPD "${title}" / ${speakerName} [${slugs.join(', ') || 'sem tema'}]`);
    palUpd++;
  } else {
    // Slug unico GLOBALMENTE (a pagina /palestra/ busca por slug global)
    const { data: globalSlugs } = await supabase.from('palestras').select('slug').like('slug', `${baseSlug}%`);
    const taken = new Set((globalSlugs || []).map(s => s.slug));
    let slug = baseSlug;
    if (taken.has(slug)) { let i = 2; while (taken.has(`${baseSlug}-${i}`)) i++; slug = `${baseSlug}-${i}`; }
    const { data: ins, error: palErr } = await supabase.from('palestras').insert({ ...palestraPayload, slug }).select('id').single();
    if (palErr) { console.log(`[palestra] ERRO "${title}": ${palErr.message}`); palSkip++; continue; }
    if (themeObjs.length) await supabase.from('palestra_themes').insert(themeObjs.map(t => ({ palestra_id: ins.id, theme_id: t.id })));
    console.log(`[palestra] OK  "${title}" / ${speakerName} [${slugs.join(', ') || 'sem tema'}]`);
    palOk++;
  }
}
console.log('---');
console.log(`Palestras: ${palOk} inseridas, ${palUpd} atualizadas, ${palSkip} puladas, ${palOrf} orfas`);
console.log('---');

// ---------- Sincronizar speaker_themes (fonte de verdade do filtro) ----------
let stCount = 0;
for (const [sid, set] of Object.entries(speakerThemeIds)) {
  await supabase.from('speaker_themes').delete().eq('speaker_id', sid);
  const rows = [...set].map(theme_id => ({ speaker_id: sid, theme_id }));
  if (rows.length) {
    const { error } = await supabase.from('speaker_themes').insert(rows);
    if (error) console.log(`  [speaker_themes] aviso ${sid}: ${error.message}`);
    else stCount += rows.length;
  }
}
console.log(`speaker_themes: ${stCount} vinculos para ${Object.keys(speakerThemeIds).length} palestrantes`);
console.log('Concluido.');
