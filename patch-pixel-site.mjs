#!/usr/bin/env node
/**
 * Instala Meta Pixel + cliente CAPI nas paginas do site que ainda nao tinham.
 *
 * ESTADO ANTES: o Pixel existia em 5 dos 67 HTMLs (so as LPs de evento, que
 * vieram do Apogeu). Home, diretorio, perfis, planos, cadastro, blog e a
 * vertical Setor Publico rodavam sem rastreamento nenhum — e o script.js ja
 * dispara fbq('track','Lead') no submit de formulario, o que caia no vazio
 * porque o fbq nem existia nessas paginas.
 *
 * PADRAO DE CARGA: identico ao das LPs — o snippet e adiado com
 * requestIdleCallback (timeout 2500ms) e so entao baixa o fbevents.js. Third
 * party carregado de imediato entra na janela de medicao do PageSpeed e vira
 * TBT; adiado, nao entra.
 *
 * O <noscript> com o beacon de imagem cobre quem tem JS desligado.
 *
 * CSP: connect.facebook.net (script-src) e www.facebook.com (connect-src) ja
 * estao liberados no netlify.toml desde a migracao dos eventos.
 *
 * Uso:
 *   node patch-pixel-site.mjs --dry
 *   node patch-pixel-site.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const DRY = process.argv.includes('--dry');
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);

const PIXEL_ID = '1028501882025260';
const IGNORAR = new Set(['node_modules', '.git', '.agent', '.claude', 'migrations']);

// Paginas de area logada: nao faz sentido rastrear (nao sao de aquisicao) e
// evita mandar sinal de comportamento privado do usuario para o Meta.
const SEM_PIXEL = ['minhas-palestras', 'meus-projetos', 'admin', 'nova-senha', 'primeiro-acesso'];

const SNIPPET = `  <!-- Meta Pixel Code (adiado para idle: nao bloqueia o carregamento) -->
  <script>
  window.__loadPixel=function(){if(window.fbq)return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init','${PIXEL_ID}');fbq('track','PageView');};
  if('requestIdleCallback' in window){requestIdleCallback(window.__loadPixel,{timeout:2500});}else{setTimeout(window.__loadPixel,1800);}
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1"/></noscript>
  <!-- End Meta Pixel Code -->
`;

// window.track() faz Pixel + CAPI com o MESMO event_id (dedup no Meta).
const CAPI = `  <script src="/eventos/capi-client.js?v=20260812a" defer></script>\n`;

async function listarHtml(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || IGNORAR.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...await listarHtml(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const arquivos = await listarHtml(ROOT);
const rel = { patch: [], pulado: [], abortado: [] };

for (const file of arquivos) {
  const r = relative(ROOT, file);
  const bytes = readFileSync(file);
  const temBOM = bytes.subarray(0, 3).equals(BOM);
  let txt = bytes.subarray(temBOM ? 3 : 0).toString('utf8');
  const original = txt;

  if (txt.includes(PIXEL_ID)) { rel.pulado.push([r, 'ja tem pixel']); continue; }
  if (SEM_PIXEL.includes(r.split(sep)[0])) { rel.pulado.push([r, 'area logada']); continue; }
  if (!txt.includes('</head>')) { rel.pulado.push([r, 'sem <head>']); continue; }

  // Ancora: logo apos o <meta name="viewport">, antes de qualquer CSS/JS.
  const reViewport = /^([ \t]*)<meta name="viewport"[^>]*>\r?\n/m;
  if (!reViewport.test(txt)) { rel.abortado.push([r, 'sem meta viewport']); continue; }
  txt = txt.replace(reViewport, (m) => m + '\n' + SNIPPET);

  // capi-client.js antes do </head> (defer, nao bloqueia)
  if (!txt.includes('capi-client.js')) txt = txt.replace('</head>', CAPI + '</head>');

  if (txt === original) { rel.pulado.push([r, 'nada a fazer']); continue; }
  if (!DRY) {
    writeFileSync(file, temBOM ? Buffer.concat([BOM, Buffer.from(txt, 'utf8')]) : Buffer.from(txt, 'utf8'));
  }
  rel.patch.push([r, temBOM ? 'BOM' : '']);
}

console.log(`\nPATCHED (${rel.patch.length})`);
for (const [f, n] of rel.patch) console.log(`  ${f.padEnd(50)} ${n}`);
if (rel.pulado.length) {
  console.log(`\nPULADO (${rel.pulado.length})`);
  for (const [f, n] of rel.pulado) console.log(`  ${f.padEnd(50)} ${n}`);
}
if (rel.abortado.length) {
  console.log(`\nABORTADO — ancora nao casou (${rel.abortado.length})`);
  for (const [f, n] of rel.abortado) console.log(`  ${f.padEnd(50)} ${n}`);
}
console.log(DRY ? '\n>> dry-run: nada escrito' : '\n>> gravado');
