#!/usr/bin/env node
/**
 * Patch unico: insere "Setor Publico" na navegacao das ~58 paginas do site.
 *
 * POR QUE UM SCRIPT E NAO JS EM RUNTIME
 * O header esta copiado inline em cada HTML (nao existe partial). A alternativa
 * seria montar os links num renderHeader() do script.js, mas o script.js e
 * `defer` e o header e position:fixed no topo — injetar os links depois do parse
 * daria um flash de header vazio em toda navegacao, e tiraria do HTML os 5 links
 * internos que formam o esqueleto de link interno do site (crawlers que nao
 * renderizam deixariam de ver). Entao: patch deterministico no HTML.
 *
 * O QUE MUDA EM CADA ARQUIVO
 *   1. desktop  -> insere Setor Publico depois de Academy
 *   2. desktop  -> REMOVE "Para Empresas" (medicao abaixo)
 *   3. mobile   -> insere Setor Publico depois de Academy (Para Empresas FICA)
 *   4. rodape   -> insere Setor Publico + Para Empresas + Eventos Presenciais
 *   5. cache    -> bumpa ?v= de style.css / theme-2026.css / script.js
 *
 * POR QUE REMOVER "PARA EMPRESAS" DO DESKTOP
 * Medido no Chrome headless com os CSS reais (nao estimado):
 *   viewport 1424/1264px : 6 itens cabem, folga de so 32px
 *   viewport 1164px      : 6 itens ESTOURAM em 44px  <-- a faixa de compressao
 *                          do tema so entra em 1160px, entao aqui nao ha rede
 *   com a troca (5 itens): folga de 77 a 208px em todas as larguras
 * Alem disso "Para Empresas" ja nao existia em 44 dos 60 arquivos, entao a
 * remocao CONVERGE a divergencia de menus em vez de amplia-la. O item continua
 * no menu mobile, no rodape e nos CTAs de conteudo.
 *
 * ANCORA
 * Todo arquivo com navegacao contem `href="/academy/"` nos DOIS blocos, sempre
 * em linha propria. Verificado: 58/58. Se a ancora nao casar, o arquivo e
 * pulado e logado — o script nunca adivinha posicao.
 *
 * BOM
 * 58 dos 61 HTMLs comecam com BOM UTF-8. O arquivo e lido como Buffer e o BOM
 * e reanexado byte a byte; readFileSync(f,'utf8') converteria em U+FEFF e a
 * reescrita poderia duplicar ou perder.
 *
 * Uso:
 *   node patch-header-setor-publico.mjs --dry    (mostra o que faria)
 *   node patch-header-setor-publico.mjs          (aplica)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const DRY = process.argv.includes('--dry');
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);

const NOVA_VERSAO = '20260811a';
const IGNORAR = new Set(['node_modules', '.git', '.agent', '.claude', 'migrations']);

// ---------------------------------------------------------------- utilidades

async function listarHtml(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') && e.name !== '.') continue;
    if (IGNORAR.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...await listarHtml(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Insere `linha` (com a indentacao capturada) logo depois do match de `re`. */
function inserirDepois(texto, re, montarLinha) {
  const m = texto.match(re);
  if (!m) return null;
  const indent = m[1];
  const eol = texto.includes('\r\n') ? '\r\n' : '\n';
  return texto.replace(re, `${m[0]}${eol}${indent}${montarLinha(indent)}`);
}

// ---------------------------------------------------------------- ancoras

const RE_ACADEMY_DESKTOP = /^([ \t]*)<a href="\/academy\/" class="header__link[^"]*">Academy<\/a>$/m;
const RE_ACADEMY_MOBILE  = /^([ \t]*)<a href="\/academy\/" class="header__mobile-link">Academy<\/a>$/m;
const RE_EMPRESAS_DESKTOP = /^[ \t]*<a href="\/para-empresas\/" class="header__link[^"]*">Para Empresas<\/a>\r?\n/m;
const RE_RODAPE = /^([ \t]*)<a href="\/para-palestrantes\/">Para Palestrantes<\/a>$/m;

// ---------------------------------------------------------------- principal

const arquivos = await listarHtml(ROOT);
const relatorio = { patch: [], pulado: [], abortado: [] };

for (const file of arquivos) {
  const rel = relative(ROOT, file);
  const bytes = readFileSync(file);
  const temBOM = bytes.subarray(0, 3).equals(BOM);
  let txt = bytes.subarray(temBOM ? 3 : 0).toString('utf8');
  const original = txt;

  // guarda 1: precisa dos dois blocos de navegacao
  if (!txt.includes('id="nav-links"') || !txt.includes('id="mobile-menu"')) {
    relatorio.pulado.push([rel, 'sem navegacao']);
    continue;
  }
  // guarda 2: idempotencia. Precisa ser especifica do MENU: /cadastro/ e
  // /minhas-palestras/perfil/ linkam /setor-publico/ no texto de ajuda do
  // checkbox da vertical, e um teste generico os pularia por engano.
  if (/<a href="\/setor-publico\/" class="header__(link|mobile-link)/.test(txt)) {
    relatorio.pulado.push([rel, 'ja tem o item']);
    continue;
  }
  // guarda 3: painel interno, menu enxuto de proposito
  if (rel.split(sep)[0] === 'admin') {
    relatorio.pulado.push([rel, 'area admin']);
    continue;
  }

  // 1. desktop
  let prox = inserirDepois(txt, RE_ACADEMY_DESKTOP, () =>
    `<a href="/setor-publico/" class="header__link">Setor Público</a>`);
  if (!prox) { relatorio.abortado.push([rel, 'ancora Academy (desktop)']); continue; }
  txt = prox;

  // 2. desktop: tira Para Empresas (some a linha inteira)
  const tinhaEmpresas = RE_EMPRESAS_DESKTOP.test(txt);
  if (tinhaEmpresas) txt = txt.replace(RE_EMPRESAS_DESKTOP, '');

  // 3. mobile
  prox = inserirDepois(txt, RE_ACADEMY_MOBILE, () =>
    `<a href="/setor-publico/" class="header__mobile-link">Setor Público</a>`);
  if (!prox) { relatorio.abortado.push([rel, 'ancora Academy (mobile)']); continue; }
  txt = prox;

  // 4. rodape (opcional: 52 dos 58 arquivos tem essa coluna)
  let rodape = 'sem rodape';
  const eol = txt.includes('\r\n') ? '\r\n' : '\n';
  const mR = txt.match(RE_RODAPE);
  if (mR) {
    const ind = mR[1];
    const bloco = [
      `<a href="/setor-publico/">Setor Público</a>`,
      `<a href="/para-empresas/">Para Empresas</a>`,
      `<a href="/eventos/">Eventos Presenciais</a>`,
    ].map(l => ind + l).join(eol);
    txt = txt.replace(RE_RODAPE, `${mR[0]}${eol}${bloco}`);
    rodape = 'rodape ok';
  }

  // 5. cache busting dos assets que mudaram nesta leva
  txt = txt
    .replace(/style\.css\?v=[A-Za-z0-9._-]+/g, `style.css?v=${NOVA_VERSAO}`)
    .replace(/theme-2026\.css\?v=[A-Za-z0-9._-]+/g, `theme-2026.css?v=${NOVA_VERSAO}`)
    .replace(/script\.js\?v=[A-Za-z0-9._-]+/g, `script.js?v=${NOVA_VERSAO}`);

  if (txt === original) { relatorio.pulado.push([rel, 'nada a fazer']); continue; }

  if (!DRY) {
    const saida = temBOM ? Buffer.concat([BOM, Buffer.from(txt, 'utf8')]) : Buffer.from(txt, 'utf8');
    writeFileSync(file, saida);
  }
  relatorio.patch.push([rel, `${tinhaEmpresas ? '-ParaEmpresas' : 'desktop-ok'}, ${rodape}${temBOM ? ', BOM' : ''}`]);
}

// ---------------------------------------------------------------- relatorio

const p = (s) => console.log(s);
p('');
p(`PATCHED (${relatorio.patch.length})`);
for (const [f, nota] of relatorio.patch) p(`  ${f.padEnd(48)} ${nota}`);
if (relatorio.pulado.length) {
  p('');
  p(`PULADO (${relatorio.pulado.length})`);
  for (const [f, nota] of relatorio.pulado) p(`  ${f.padEnd(48)} ${nota}`);
}
if (relatorio.abortado.length) {
  p('');
  p(`ABORTADO — ancora nao casou, arquivo intacto (${relatorio.abortado.length})`);
  for (const [f, nota] of relatorio.abortado) p(`  ${f.padEnd(48)} ${nota}`);
}
p('');
p(DRY ? '>> dry-run: nada foi escrito.' : '>> gravado.');
