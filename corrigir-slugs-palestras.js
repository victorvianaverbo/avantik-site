/**
 * Corrige slugs de palestras DUPLICADOS globalmente (one-off).
 * A pagina /palestra/ busca por slug global; slugs repetidos quebravam ("nao encontrada").
 * Mantem a 1ª palestra (mais antiga) com o slug original e re-sluga as demais
 * para `${slug}-${id8}` (sufixo curto do id => unico e estavel).
 *
 * USO: node corrigir-slugs-palestras.js
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ajokzpjguhfxxudteetr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgyNDU1NCwiZXhwIjoyMDkwNDAwNTU0fQ.ORFf1oXdjZIUfY7FEuSsXW95p49OBouOQ1H5Zo03tXk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { data: all, error } = await supabase
  .from('palestras')
  .select('id, slug, title, created_at')
  .order('created_at', { ascending: true });
if (error) throw error;

const bySlug = {};
for (const p of all) (bySlug[p.slug] ||= []).push(p);

let fixed = 0;
for (const [slug, list] of Object.entries(bySlug)) {
  if (list.length <= 1) continue;
  // mantem a 1ª (mais antiga); re-sluga as demais
  for (let i = 1; i < list.length; i++) {
    const p = list[i];
    const novo = `${slug}-${p.id.slice(0, 8)}`;
    const { error: upErr } = await supabase.from('palestras').update({ slug: novo }).eq('id', p.id);
    if (upErr) { console.log(`ERRO ${p.title}: ${upErr.message}`); continue; }
    console.log(`re-slug: "${p.title}"  ${slug} -> ${novo}`);
    fixed++;
  }
}
console.log(`---\nSlugs duplicados corrigidos: ${fixed}`);

// Confere
const { data: check } = await supabase.from('palestras').select('slug');
const c = {}; (check || []).forEach(r => (c[r.slug] = (c[r.slug] || 0) + 1));
const dups = Object.entries(c).filter(([, v]) => v > 1);
console.log(`Slugs ainda duplicados: ${dups.length}`);
