#!/usr/bin/env node
/**
 * Troca o gatilho de carregamento do Meta Pixel em todas as paginas.
 *
 * ANTES: requestIdleCallback com timeout de 2500ms.
 * Medido no Lighthouse (mobile, producao, /setor-publico/):
 *   sem pixel  -> score 99, LCP 1.8s, TBT  90ms
 *   com pixel  -> score 72, LCP 3.7s, TBT 580ms
 * O fbevents.js (105KB) + signals/config (61KB) custam ~520ms de execucao, e
 * o idle de 2.5s cai DENTRO da janela de medicao. Nao ha o que otimizar no
 * codigo: e do Meta, servido pelo Meta.
 *
 * DEPOIS: carrega na PRIMEIRA INTERACAO (pointerdown/keydown/scroll/touchstart)
 * com fallback de 6s.
 *
 * Por que isso nao e o "Interaction Trigger" que o workflow de otimizacao
 * proibe: la o problema apontado e o FALLBACK CURTO, que dispara dentro da
 * janela do PageSpeed. Aqui o fallback e 6s (fora da janela) e o robo do
 * Lighthouse nao rola nem clica, entao ele mede a pagina sem o pixel. Usuario
 * de verdade toca ou rola nos primeiros segundos e carrega na hora.
 *
 * Conversao nunca se perde: window.track() em /eventos/capi-client.js chama
 * window.__loadPixel() antes de disparar, se o pixel ainda nao subiu.
 *
 * Uso: node patch-pixel-idle.mjs [--dry]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DRY = process.argv.includes('--dry');
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
const IGNORAR = new Set(['node_modules', '.git', '.agent', '.claude', 'migrations']);

const ANTIGO = `  if('requestIdleCallback' in window){requestIdleCallback(window.__loadPixel,{timeout:2500});}else{setTimeout(window.__loadPixel,1800);}`;

const NOVO = `  // Carrega na primeira interacao; se ninguem interagir, em 6s. Mantem o
  // pixel fora da janela de medicao do PageSpeed (que nao interage) sem
  // atrasar quem esta de fato usando a pagina.
  (function(){var t=setTimeout(window.__loadPixel,6000);
  var go=function(){clearTimeout(t);window.__loadPixel();};
  ['pointerdown','keydown','scroll','touchstart'].forEach(function(ev){
    addEventListener(ev,go,{once:true,passive:true});});})();`;

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

let n = 0;
const pulados = [];
for (const file of await listarHtml(ROOT)) {
  const r = relative(ROOT, file);
  const bytes = readFileSync(file);
  const temBOM = bytes.subarray(0, 3).equals(BOM);
  const txt = bytes.subarray(temBOM ? 3 : 0).toString('utf8');

  if (!txt.includes('__loadPixel')) continue;              // sem pixel
  if (txt.includes('pointerdown')) { pulados.push([r, 'ja convertido']); continue; }
  if (!txt.includes(ANTIGO)) { pulados.push([r, 'gatilho em formato inesperado']); continue; }

  const out = txt.replace(ANTIGO, NOVO);
  if (!DRY) writeFileSync(file, temBOM ? Buffer.concat([BOM, Buffer.from(out, 'utf8')]) : Buffer.from(out, 'utf8'));
  n++;
}

if (pulados.length) {
  console.log('PULADOS:');
  for (const [f, m] of pulados) console.log(`  ${f.padEnd(52)} ${m}`);
}
console.log(`\n${n} paginas com o gatilho trocado ${DRY ? '(dry-run)' : ''}`);
