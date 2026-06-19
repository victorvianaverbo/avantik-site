/**
 * Hub da Avantik Academy renderiza o grid dos 6 programas a partir de data.js.
 */
import { getProgramsInOrder } from '/academy/data.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Estrela de 4 pontas (sparkle) brilho decorativo nas capas.
const SPARKLE_SVG = '<path d="M12 0c.6 6 .9 9.4 12 12-11.1 2.6-11.4 6-12 12-.6-6-.9-9.4-12-12 11.1-2.6 11.4-6 12-12Z"/>';
function sparklesHtml() {
  // posições/tamanhos/tempos fixos (sem Math.random p/ ser determinístico)
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

function cardHtml(p, index) {
  const brand = p.brand || p.nome;
  const cover = p.cover
    ? `<img src="${escapeHtml(p.cover)}" alt="${escapeHtml(brand)}" loading="lazy" onerror="this.style.display='none'">`
    : '';
  return `
    <a href="/academy/${escapeHtml(p.slug)}/" class="program-card" data-aos="fade-up" data-aos-delay="${(index % 3) * 80}"
       style="--card-primary:${escapeHtml(p.theme.primary)};--card-accent:${escapeHtml(p.theme.primary)};background:linear-gradient(180deg, color-mix(in srgb, ${escapeHtml(p.theme.primary)} 6%, var(--color-surface)), var(--color-surface))">
      <div class="program-card__cover" style="background:radial-gradient(130% 130% at 22% -10%, color-mix(in srgb, ${escapeHtml(p.theme.primary)} 42%, #050505), #060606)">
        <canvas class="program-card__plexus" data-color="${escapeHtml(p.theme.primary)}" aria-hidden="true"></canvas>
        ${cover}
        ${sparklesHtml()}
        <span class="program-card__cover-fallback" style="color:${escapeHtml(p.theme.primary)};text-shadow:0 0 24px color-mix(in srgb, ${escapeHtml(p.theme.primary)} 55%, transparent)">${escapeHtml(brand)}</span>
      </div>
      <div class="program-card__body">
        <span class="program-card__kicker">${escapeHtml(p.pilar || p.nome)}</span>
        <h3 class="program-card__name">${escapeHtml(brand)}</h3>
        <p class="program-card__tagline">${escapeHtml(p.tagline)}</p>
        <span class="program-card__cta">Ver programa →</span>
      </div>
    </a>`;
}

/** Rede/plexus animada na capa de um card, na cor da marca (igual ao hero). */
function initCardPlexus(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(canvas.dataset.color || '#ffffff');
  const rgb = m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 255, 255];
  let w, h, nodes, raf, running = false;

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = Math.max(1, Math.round(r.width));
    h = canvas.height = Math.max(1, Math.round(r.height));
    const count = Math.min(26, Math.max(16, Math.round((w * h) / 6000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
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
        if (d < 80) {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(1 - d / 80) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.9)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    if (running && !reduce) raf = requestAnimationFrame(frame);
  }

  resize();
  if (reduce) { frame(); return; }
  // anima só quando o card está visível (performance com 6 canvas)
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

/** Liga o acordeão do FAQ do hub. */
function initFaq() {
  document.querySelectorAll('.faq-item__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
}

function render() {
  const grid = document.getElementById('programs-grid');
  if (grid) {
    const programs = getProgramsInOrder();
    grid.innerHTML = programs.map(cardHtml).join('');
    grid.removeAttribute('aria-busy');
    grid.querySelectorAll('.program-card__plexus').forEach(initCardPlexus);
  }
  initFaq();
  // Re-disparar AOS para os elementos recém-inseridos
  if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
}

render();
