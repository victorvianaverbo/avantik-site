/**
 * Script para importar palestrantes em massa a partir do CSV.
 *
 * USO:
 *   1. Preencha o arquivo modelo-palestrantes.csv com seus dados
 *   2. Execute: node importar-palestrantes.js
 *
 * COLUNAS DO CSV:
 *   nome (obrigatório), email (obrigatório), telefone, cidade, estado,
 *   bio, foto_url, video_url, preco_minimo, preco_maximo,
 *   instagram, linkedin, website, plano (essencial|profissional|destaque),
 *   temas (separados por ;)
 *
 * NOTAS:
 *   - A primeira linha do CSV é o cabeçalho (ignorada)
 *   - Temas devem corresponder aos nomes cadastrados no banco (ex: "Liderança;Vendas")
 *   - Se o plano não for informado, usa "essencial"
 *   - Palestrantes são criados com active=true
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://ajokzpjguhfxxudteetr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjQ1NTQsImV4cCI6MjA5MDQwMDU1NH0.TG-ASfMGgNY4BoHsFQx8TQ-4HPVsdbGEu4zJuFAeiNg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Ler CSV
const csvFile = readFileSync('./modelo-palestrantes.csv', 'utf-8');
const lines = csvFile.split('\n').filter(l => l.trim());
const header = lines[0].split(',');
const rows = lines.slice(1);

// Buscar temas do banco
const { data: allThemes } = await supabase.from('themes').select('id, name');
const themeMap = {};
if (allThemes) {
  allThemes.forEach(t => {
    themeMap[t.name.toLowerCase().trim()] = t.id;
  });
}

console.log(`Temas disponíveis: ${Object.keys(themeMap).join(', ')}`);
console.log(`Palestrantes para importar: ${rows.length}`);
console.log('---');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  result.push(current.trim());
  return result;
}

function generateSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
}

let success = 0;
let errors = 0;

for (const line of rows) {
  const cols = parseCSVLine(line);
  const nome = cols[0];
  const email = cols[1];

  if (!nome || !email) {
    console.log(`PULADO: linha sem nome ou email`);
    errors++;
    continue;
  }

  const slug = generateSlug(nome);
  const plano = cols[13] || 'essencial';
  const temasStr = cols[14] || '';

  // Verificar slug único
  const { data: existing } = await supabase
    .from('speakers').select('slug').like('slug', `${slug}%`);
  let finalSlug = slug;
  if (existing && existing.some(e => e.slug === slug)) {
    let i = 2;
    while (existing.some(e => e.slug === `${slug}-${i}`)) i++;
    finalSlug = `${slug}-${i}`;
  }

  // Inserir palestrante
  const { data: speaker, error } = await supabase
    .from('speakers')
    .insert({
      active: true,
      plan: plano,
      name: nome,
      slug: finalSlug,
      email: email,
      phone: cols[2] || null,
      city: cols[3] || null,
      state: cols[4] || null,
      bio: cols[5] || null,
      photo_url: cols[6] || null,
      video_url: cols[7] || null,
      price_min: parseInt(cols[8]) || null,
      price_max: parseInt(cols[9]) || null,
      instagram: cols[10] || null,
      linkedin: cols[11] || null,
      website: cols[12] || null,
    })
    .select()
    .single();

  if (error) {
    console.log(`ERRO: ${nome} - ${error.message}`);
    errors++;
    continue;
  }

  // Vincular temas
  if (temasStr && speaker) {
    const temaNames = temasStr.split(';').map(t => t.trim());
    const themeRows = [];
    for (const tn of temaNames) {
      const tid = themeMap[tn.toLowerCase()];
      if (tid) {
        themeRows.push({ speaker_id: speaker.id, theme_id: tid });
      } else {
        console.log(`  AVISO: tema "${tn}" não encontrado para ${nome}`);
      }
    }
    if (themeRows.length > 0) {
      await supabase.from('speaker_themes').insert(themeRows);
    }
  }

  console.log(`OK: ${nome} → /palestrante/?slug=${finalSlug}`);
  success++;
}

console.log('---');
console.log(`Concluído: ${success} importados, ${errors} erros`);
