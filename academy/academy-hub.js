/**
 * Hub da Avantik Academy renderiza o grid dos 6 programas a partir de data.js.
 */
import { getProgramsInOrder, getProgramsComEvento } from '/academy/data.js';
// initPlexus e sparklesHtml sairam daqui para /lib/plexus.js: a mesma capa
// animada e usada tambem pelos cards de /eventos/.
import { initPlexus, sparklesHtml } from '/lib/plexus.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

/**
 * Card de uma EDIÇÃO PRESENCIAL. Reusa .program-card inteiro (o componente já
 * é temático por variável inline), então não precisa de CSS novo. As trocas
 * em relação ao card de programa: o href vai para a LP do evento, o kicker
 * vira a data e o CTA muda de texto.
 */
function eventoCardHtml(p, index) {
  const brand = p.brand || p.nome;
  const ev = p.evento;
  return `
    <a href="${escapeHtml(ev.url)}" class="program-card" data-aos="fade-up" data-aos-delay="${(index % 3) * 80}"
       style="--card-primary:${escapeHtml(p.theme.primary)};--card-accent:${escapeHtml(p.theme.primary)};background:linear-gradient(180deg, color-mix(in srgb, ${escapeHtml(p.theme.primary)} 6%, var(--color-surface)), var(--color-surface))">
      <div class="program-card__cover" style="background:radial-gradient(130% 130% at 22% -10%, color-mix(in srgb, ${escapeHtml(p.theme.primary)} 42%, #050505), #060606)">
        <canvas class="program-card__plexus" data-color="${escapeHtml(p.theme.primary)}" aria-hidden="true"></canvas>
        ${sparklesHtml()}
        <span class="program-card__cover-fallback" style="color:${escapeHtml(p.theme.primary)};text-shadow:0 0 24px color-mix(in srgb, ${escapeHtml(p.theme.primary)} 55%, transparent)">${escapeHtml(brand)}</span>
      </div>
      <div class="program-card__body">
        <span class="program-card__kicker">${escapeHtml(ev.dataLabel)}</span>
        <h3 class="program-card__name">${escapeHtml(brand)}</h3>
        <p class="program-card__tagline">${escapeHtml(ev.local)} · presencial, dia inteiro.</p>
        <span class="program-card__cta">Ver o evento →</span>
      </div>
    </a>`;
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
    grid.querySelectorAll('.program-card__plexus').forEach(initPlexus);
  }

  // Edições presenciais: 5 dos 6 programas. Se um dia nenhum tiver evento,
  // a seção inteira some em vez de ficar um bloco vazio com título.
  const gridEventos = document.getElementById('eventos-grid');
  if (gridEventos) {
    const comEvento = getProgramsComEvento();
    if (comEvento.length === 0) {
      const secao = gridEventos.closest('section');
      if (secao) secao.hidden = true;
    } else {
      gridEventos.innerHTML = comEvento.map(eventoCardHtml).join('');
      gridEventos.removeAttribute('aria-busy');
      gridEventos.querySelectorAll('.program-card__plexus').forEach(initPlexus);
    }
  }

  initFaq();
  // Re-disparar AOS para os elementos recém-inseridos
  if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
}

render();
