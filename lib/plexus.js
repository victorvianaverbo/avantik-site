/**
 * Rede/plexus animada desenhada em canvas — o "banner" dos cards da Academy.
 *
 * Extraido de academy/academy-hub.js (era initCardPlexus) porque passou a ser
 * usado em tres lugares: o grid de programas da Academy, a secao de eventos
 * presenciais do mesmo hub, e os cards de /eventos/. Sao ~55 linhas com
 * controle de requestAnimationFrame e resize; duas copias divergiriam na
 * primeira correcao de performance.
 *
 * A cor vem do proprio elemento: <canvas data-color="#EBB700">.
 *
 * O TAMANHO da superficie muda o preset: uma capa de card tem ~300x200 e um
 * hero tem a tela inteira. Com os numeros do card, um hero sai com 26 pontos
 * espalhados em 1400x900 e quase nenhuma linha (a ligacao so acontece abaixo
 * de 80px) — vira poeira, nao rede. Daí <canvas data-plexus="hero">, que usa
 * os valores do .program-hero da Academy. Sem o atributo, preset "card" —
 * os tres usos antigos seguem identicos.
 *
 * Comportamento preservado do original:
 *  - respeita prefers-reduced-motion (desenha um frame e para, sem loop)
 *  - so anima quando o canvas esta visivel (IntersectionObserver), o que
 *    importa numa pagina com varios canvas ao mesmo tempo
 *  - redimensiona com debounce de 200ms
 */
const PRESETS = {
  // area = px^2 por no; max/min = teto e piso da contagem; link = distancia
  // maxima que ainda desenha linha; alpha = opacidade da linha mais forte.
  //
  // link: 'auto' deriva a distancia da densidade real (1.25x o espacamento
  // medio entre nos). O valor fixo de 130 do .program-hero so funciona na
  // altura dele; num hero de LP, que passa de 1600px, os mesmos 64 nos ficam
  // a ~190px um do outro e NENHUMA linha e desenhada — sobram pontos soltos.
  card: { area: 6000, max: 26, min: 16, link: 80, dot: 1.5, alpha: 0.5, speed: 0.3 },
  hero: { area: 24000, max: 90, min: 0, link: 'auto', dot: 1.6, alpha: 0.45, speed: 0.35 },
};

export function initPlexus(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cfg = PRESETS[canvas.dataset.plexus] || PRESETS.card;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(canvas.dataset.color || '#ffffff');
  const rgb = m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 255, 255];
  let w, h, nodes, raf, link, running = false;

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = Math.max(1, Math.round(r.width));
    h = canvas.height = Math.max(1, Math.round(r.height));
    const count = Math.min(cfg.max, Math.max(cfg.min, Math.round((w * h) / cfg.area)));
    link = cfg.link === 'auto'
      ? Math.min(240, Math.max(90, 1.25 * Math.sqrt((w * h) / Math.max(1, count))))
      : cfg.link;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * cfg.speed, vy: (Math.random() - 0.5) * cfg.speed,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(1 - d / link) * cfg.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.9)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, cfg.dot, 0, Math.PI * 2); ctx.fill();
    }
    if (running && !reduce) raf = requestAnimationFrame(frame);
  }

  resize();
  if (reduce) { frame(); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !running) { running = true; frame(); }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    });
  }, { rootMargin: '120px' });
  io.observe(canvas);

  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(resize, 200); });
}

/**
 * Estrela de 4 pontas (sparkle) — brilho decorativo sobre a capa.
 * Posicoes/tempos fixos de proposito (sem Math.random), para o markup ser
 * deterministico entre renders.
 */
const SPARKLE_SVG = '<path d="M12 0c.6 6 .9 9.4 12 12-11.1 2.6-11.4 6-12 12-.6-6-.9-9.4-12-12 11.1-2.6 11.4-6 12-12Z"/>';

export function sparklesHtml() {
  const spk = [
    { top: '18%', left: '68%', size: 16, dur: '2.8s', delay: '0s' },
    { top: '40%', left: '88%', size: 11, dur: '3.4s', delay: '0.6s' },
    { top: '64%', left: '10%', size: 13, dur: '3.0s', delay: '1.2s' },
    { top: '26%', left: '30%', size: 9, dur: '2.4s', delay: '1.8s' },
  ];
  return spk.map((s) =>
    `<svg class="sparkle" width="${s.size}" height="${s.size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" ` +
    `style="top:${s.top};left:${s.left};--spk-dur:${s.dur};--spk-delay:${s.delay}">${SPARKLE_SVG}</svg>`
  ).join('');
}
