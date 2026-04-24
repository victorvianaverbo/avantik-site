/**
 * Atualiza photo_url, video_url e website dos speakers existentes
 * usando a aba online "Midias" do Google Sheets.
 *
 * USO:
 *   node atualizar-midias.js
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const SUPABASE_URL = 'https://ajokzpjguhfxxudteetr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgyNDU1NCwiZXhwIjoyMDkwNDAwNTU0fQ.ORFf1oXdjZIUfY7FEuSsXW95p49OBouOQ1H5Zo03tXk';

const SHEET_ID = '1Z4UQlv69gMY4zSCbQpLpdYXFuC3x5CJjaL3EaEWtOcg';
const MIDIA_GID = '1079774907';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parser CSV (respeita aspas e newlines dentro de campos)
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cur += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (ch === '\r') { /* skip */ }
      else { cur += ch; }
    }
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

function cleanField(v) {
  if (v == null) return null;
  const s = v.toString().trim();
  if (!s) return null;
  if (/^n[aã]o\s+informado$/i.test(s)) return null;
  return s;
}

// Converte URL do Google Drive para CDN de preview
function driveToImageUrl(url) {
  if (!url) return null;
  const m = url.match(/\/file\/d\/([^\/]+)/);
  if (!m) return url;
  return `https://lh3.googleusercontent.com/d/${m[1]}=w800`;
}

function normalize(s) {
  return (s || '').toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function fetchSheetCSV() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${MIDIA_GID}`;
  console.log('Baixando aba online...');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar: ${res.status}`);
  const text = await res.text();
  return text;
}

async function main() {
  const csvText = await fetchSheetCSV();
  const rows = parseCSV(csvText);
  const header = rows[0];
  console.log('Colunas:', header);
  const data = rows.slice(1).filter(r => r.some(c => c && c.trim()));

  // Criar mapa de speakers no banco por nome (normalizado)
  const { data: speakers, error: spkErr } = await supabase.from('speakers').select('id, name, photo_url, video_url, website');
  if (spkErr) throw spkErr;
  const speakersByName = {};
  speakers.forEach(s => { speakersByName[normalize(s.name)] = s; });
  console.log(`Speakers no banco: ${speakers.length}`);

  let ok = 0, skipped = 0, notFound = 0;
  const log = [];

  for (const row of data) {
    const obj = {};
    header.forEach((h, i) => { obj[h.trim()] = (row[i] || '').trim(); });

    const name = cleanField(obj['Nome']);
    if (!name) continue;

    const speaker = speakersByName[normalize(name)];
    if (!speaker) {
      notFound++;
      log.push(`[NAO ENCONTRADO] ${name}`);
      continue;
    }

    const photoUrl = driveToImageUrl(cleanField(obj['Link da Foto']));
    // SO "Video Avantik" — coluna "youtube" e canal, nao video individual (nao embedavel)
    const videoUrl = cleanField(obj['Video Avantik']);
    const website = cleanField(obj['Site']);

    const patch = {};
    if (photoUrl) patch.photo_url = photoUrl;
    if (videoUrl) patch.video_url = videoUrl;
    if (website) patch.website = website;

    if (Object.keys(patch).length === 0) {
      skipped++;
      log.push(`[SEM DADOS] ${name}`);
      continue;
    }

    const { error } = await supabase.from('speakers').update(patch).eq('id', speaker.id);
    if (error) {
      log.push(`[ERRO] ${name}: ${error.message}`);
      continue;
    }

    ok++;
    const fields = Object.keys(patch).join(', ');
    log.push(`[OK] ${name} — ${fields}`);
  }

  writeFileSync('/tmp/atualizar-midias.log', log.join('\n'));
  console.log(`\n=== RESUMO ===`);
  console.log(`Atualizados: ${ok}`);
  console.log(`Sem dados de midia: ${skipped}`);
  console.log(`Nao encontrados no banco: ${notFound}`);
  console.log(`Log em /tmp/atualizar-midias.log`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
