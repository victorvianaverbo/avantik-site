/**
 * Template de página de programa da Avantik Academy.
 *
 * Lê o slug do programa de <body data-program="...">, busca em PROGRAMS,
 * aplica o tema (CSS custom properties), renderiza o conteúdo e personaliza
 * o mentor em destaque via ?mentor=<slug>.
 *
 * Estados:
 *   - com ?mentor= válido  → hero com o mentor + CTAs no link de afiliado dele
 *   - sem mentor / inválido → estado genérico (CTA no checkout do produto) +
 *                             grade "Conheça os mentores"
 */
import { PROGRAMS, findMentor, buildCheckoutUrl, COLECAO_NOME, COLECAO_LOGO } from '/academy/data.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** URL otimizada pelo CDN de imagem do Netlify (resize + webp). */
function cdnImg(url, w) {
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${w}&fm=webp&q=82`;
}

/** Luminância relativa (0-1) de um hex, para decidir texto claro/escuro. */
function luminance(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return 0;
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => {
    const v = parseInt(h, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Texto legível (preto/branco) sobre uma cor de fundo. */
function onColor(hex) {
  return luminance(hex) > 0.42 ? '#101010' : '#ffffff';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (!theme) return;
  root.style.setProperty('--academy-primary', theme.primary);
  root.style.setProperty('--academy-accent', theme.accent);
  root.style.setProperty('--academy-dark', theme.dark);
  root.style.setProperty('--academy-on-primary', onColor(theme.primary));
  root.style.setProperty('--academy-on-accent', onColor(theme.accent));
}

/**
 * Rede/plexus animada no hero, na cor da marca assinatura comum dos 6 manuais.
 * Respeita prefers-reduced-motion (desenha estático).
 */
function initPlexus(canvas, color) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, nodes, raf;

  const rgb = (() => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color || '#ffffff');
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 255, 255];
  })();

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    const count = Math.min(64, Math.round((w * h) / 24000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
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
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(1 - dist / 130) * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.9)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  resize();
  frame();
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { cancelAnimationFrame(raf); resize(); frame(); }, 200);
  });
}

function isPlaceholderCheckout(url) {
  return /PLACEHOLDER/i.test(url || '');
}

function mentorCardHtml(mentor) {
  return `
    <div class="mentor-card" data-aos="fade-left">
      <span class="mentor-card__label">Seu mentor neste programa</span>
      <div class="mentor-card__head">
        <img class="mentor-card__photo" src="${escapeHtml(mentor.foto)}" alt="${escapeHtml(mentor.nome)}" width="72" height="72" loading="lazy">
        <div>
          <h2 class="mentor-card__name">${escapeHtml(mentor.nome)}</h2>
          <p class="mentor-card__tema">${escapeHtml(mentor.tema)}</p>
        </div>
      </div>
      <p class="mentor-card__bio">${escapeHtml(mentor.bio)}</p>
    </div>`;
}

/** Realça (cor da marca) a primeira palavra-chave do título do problema. */
function emphasizeFirst(text) {
  const safe = escapeHtml(text);
  return safe.replace(/^(\S+\s+\S+)/, '<em>$1</em>');
}

function problemaHtml(program) {
  const p = program.problema;
  if (!p) return '';
  return `
    <section class="academy-section program-problema" id="problema">
      <div class="container">
        <div class="program-problema__inner" data-aos="fade-up">
          <span class="academy-eyebrow">O problema</span>
          <h2 class="program-problema__title">${emphasizeFirst(p.titulo)}</h2>
          <p class="program-problema__text">${escapeHtml(p.texto)}</p>
        </div>
      </div>
    </section>`;
}

function learnHtml(program) {
  const rows = (program.aprende || []).map((t, i) => `
    <div class="program-learn__row" data-aos="fade-up" data-aos-delay="${i * 80}">
      <span class="program-learn__num">${String(i + 1).padStart(2, '0')}</span>
      <span class="program-learn__txt">${escapeHtml(t)}</span>
    </div>`).join('');
  if (!rows) return '';
  return `
    <section class="academy-section" id="aprende">
      <div class="container">
        <span class="academy-eyebrow">O que você vai aprender</span>
        <h2 class="academy-title">Conteúdo direto ao resultado.</h2>
        <div class="program-learn__list">${rows}</div>
      </div>
    </section>`;
}

function formatoHtml() {
  const steps = [
    { t: 'Aulas gravadas', d: 'Palestras de 30 a 40 minutos, no seu ritmo, com acesso contínuo.' },
    { t: 'Mentoria mensal ao vivo', d: 'Encontros por Zoom com o mentor para aplicar no seu caso real.' },
    { t: 'Certificado e comunidade', d: 'Reconhecimento da sua evolução e uma rede para crescer junto.' },
  ];
  const cols = steps.map((s, i) => `
    <div class="program-format__step" data-aos="fade-up" data-aos-delay="${i * 100}">
      <div class="program-format__node">${i + 1}</div>
      <div>
        <h3>${escapeHtml(s.t)}</h3>
        <p>${escapeHtml(s.d)}</p>
      </div>
    </div>`).join('');
  return `
    <section class="academy-section program-format" id="formato">
      <div class="container">
        <span class="academy-eyebrow">Formato</span>
        <h2 class="academy-title">Como você aprende.</h2>
        <div class="program-format__timeline">${cols}</div>
      </div>
    </section>`;
}

function mentorsGridHtml(program) {
  const mentores = program.mentores || [];
  if (!mentores.length) return '';
  const cards = mentores.map((m) => `
    <a class="mentor-mini" href="/academy/${escapeHtml(program.slug)}/?mentor=${escapeHtml(m.slug)}">
      <img class="mentor-mini__photo" src="${escapeHtml(m.foto)}" alt="${escapeHtml(m.nome)}" width="88" height="88" loading="lazy">
      <p class="mentor-mini__name">${escapeHtml(m.nome)}</p>
      <p class="mentor-mini__tema">${escapeHtml(m.tema)}</p>
      <span class="mentor-mini__cta">Ver página →</span>
    </a>`).join('');
  return `
    <section class="academy-section" id="mentores">
      <div class="container">
        <span class="academy-eyebrow">Mentores</span>
        <h2 class="academy-title">Conheça quem ensina neste programa.</h2>
        <div class="program-mentors__grid">${cards}</div>
      </div>
    </section>`;
}

function livroHtml(program) {
  const l = program.livro;
  if (!l || !program.mockup) return '';
  const temas = (l.temas || []).map((t) => `<li>${escapeHtml(t)}</li>`).join('');
  const autores = (l.prefacio || l.convidado)
    ? `<p class="program-livro__autores">${l.prefacio ? `Prefácio por <strong>${escapeHtml(l.prefacio)}</strong>` : ''}${l.prefacio && l.convidado ? ' · ' : ''}${l.convidado ? `Convidado especial <strong>${escapeHtml(l.convidado)}</strong>` : ''}</p>`
    : '';
  return `
    <section class="academy-section program-livro" id="livro">
      <div class="container">
        <div class="program-livro__grid">
          <div class="program-livro__media" data-aos="fade-right">
            <img src="${cdnImg(program.mockup, 760)}" alt="Livro ${escapeHtml(program.brand)}" width="600" height="600" loading="lazy">
          </div>
          <div class="program-livro__body" data-aos="fade-left">
            <img class="program-livro__colecao" src="${cdnImg(COLECAO_LOGO, 440)}" alt="${escapeHtml(COLECAO_NOME)}" width="240" height="62" loading="lazy">
            <h2 class="academy-title">O livro que deu origem ao programa</h2>
            <p class="program-livro__sub">${escapeHtml(program.brand)} · ${escapeHtml(program.subtitulo || '')}</p>
            <p class="program-livro__desc">${escapeHtml(l.descricao)}</p>
            ${temas ? `<ul class="program-livro__temas">${temas}</ul>` : ''}
            ${autores}
          </div>
        </div>
      </div>
    </section>`;
}

function autoresHtml(program) {
  if (!program.autoresImg) return '';
  return `
    <section class="program-autores" id="autores">
      <div class="container">
        <span class="academy-eyebrow" style="display:flex;justify-content:center">Quem escreve a coleção</span>
        <h2 class="academy-title" style="text-align:center">Dezenas de autores. Um só objetivo: resultado.</h2>
        <p class="academy-lead" style="text-align:center;margin-left:auto;margin-right:auto">${escapeHtml(COLECAO_NOME)} reúne especialistas que vivem o que ensinam. Conheça quem assina o ${escapeHtml(program.brand)}.</p>
        <figure class="program-autores__banner" data-aos="zoom-in">
          <img src="${cdnImg(program.autoresImg, 1280)}" alt="Autores de ${escapeHtml(program.brand)}" width="1280" height="720" loading="lazy">
        </figure>
      </div>
    </section>`;
}

function faqHtml(program) {
  const items = (program.faq || []).map((f) => `
    <div class="faq-item">
      <button class="faq-item__q" type="button" aria-expanded="false">
        <span class="faq-item__q-text">${escapeHtml(f.q)}</span>
        <span class="faq-item__icon" aria-hidden="true"></span>
      </button>
      <div class="faq-item__a"><div class="faq-item__a-inner"><p>${escapeHtml(f.a)}</p></div></div>
    </div>`).join('');
  if (!items) return '';
  return `
    <section class="academy-section program-faq-dark" id="faq">
      <div class="container">
        <span class="academy-eyebrow">Perguntas frequentes</span>
        <h2 class="academy-title">Ainda em dúvida?</h2>
        <div class="program-faq__list">${items}</div>
      </div>
    </section>`;
}

/** Liga o acordeão do FAQ (delegação de clique). */
function initFaq(root) {
  root.querySelectorAll('.faq-item__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
}

function render(program, mentor) {
  const checkoutUrl = buildCheckoutUrl(program, mentor);
  const ctaHref = isPlaceholderCheckout(checkoutUrl) ? '#' : checkoutUrl;
  const ctaTarget = ctaHref === '#' ? '' : 'target="_blank" rel="noopener noreferrer"';
  const placeholderNote = '';

  const heroRight = mentor
    ? mentorCardHtml(mentor)
    : `<div class="mentor-card" data-aos="fade-left">
         <span class="mentor-card__label">O programa</span>
         <p class="mentor-card__bio">${escapeHtml(program.descricao)}</p>
       </div>`;

  const app = document.getElementById('programa-app');
  app.innerHTML = `
    <section class="program-hero">
      <canvas class="program-hero__plexus" aria-hidden="true"></canvas>
      <div class="container">
        <div class="program-hero__grid">
          <div>
            <img class="program-hero__colecao" src="${cdnImg(COLECAO_LOGO, 440)}" alt="${escapeHtml(COLECAO_NOME)}" width="220" height="56" loading="eager">
            <span class="academy-eyebrow program-hero__kicker">Avantik Academy · ${escapeHtml(program.brand || program.nome)}</span>
            <h1 class="program-hero__title">${escapeHtml(program.brand || program.nome)}</h1>
            <p class="program-hero__tagline">${escapeHtml(program.tagline)}</p>
            ${program.heroSub ? `<p class="program-hero__sub">${escapeHtml(program.heroSub)}</p>` : ''}
            <div class="program-hero__price">
              ${program.preco.de ? `<span class="program-hero__price-from">${escapeHtml(program.preco.de)}</span>` : ''}
              <span class="program-hero__price-now">${escapeHtml(program.preco.por)}</span>
              ${program.preco.avista ? `<span class="program-hero__price-note">${escapeHtml(program.preco.avista)}</span>` : ''}
            </div>
            <a href="${ctaHref}" ${ctaTarget} class="btn btn--academy btn--lg">Quero o programa</a>
            ${placeholderNote}
          </div>
          ${heroRight}
        </div>
      </div>
    </section>

    ${problemaHtml(program)}

    ${livroHtml(program)}

    ${learnHtml(program)}

    ${formatoHtml()}

    ${autoresHtml(program)}

    ${mentor ? '' : mentorsGridHtml(program)}

    ${faqHtml(program)}

    <section class="program-cta program-cta--offer">
      <canvas class="program-cta__plexus" aria-hidden="true"></canvas>
      <div class="container">
        <h2>${escapeHtml(program.ctaTitle || `Comece o programa ${program.nome} agora`)}</h2>
        <p>${escapeHtml(program.descricao)}</p>
        <div class="program-cta__offer" data-aos="zoom-in">
          <div class="program-cta__seal">7 dias<br>garantia</div>
          <div class="program-cta__price">
            ${program.preco.de ? `<span class="program-cta__price-from">${escapeHtml(program.preco.de)}</span>` : ''}
            <span class="program-cta__price-now">${escapeHtml(program.preco.por)}</span>
            ${program.preco.avista ? `<span class="program-cta__price-note">${escapeHtml(program.preco.avista)}</span>` : ''}
          </div>
          ${program.oferta ? `<p class="program-cta__inclui">${escapeHtml(program.oferta.inclui)}</p>` : ''}
          <a href="${ctaHref}" ${ctaTarget} class="btn btn--academy btn--lg program-cta__btn">Quero o programa</a>
          ${placeholderNote}
          ${program.oferta ? `<p class="program-cta__garantia">${escapeHtml(program.oferta.garantia)}</p>` : ''}
        </div>
      </div>
    </section>`;

  initPlexus(app.querySelector('.program-hero__plexus'), program.theme.primary);
  initPlexus(app.querySelector('.program-cta__plexus'), program.theme.primary);
  initFaq(app);

  if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
}

function init() {
  const slug = document.body.dataset.program;
  const program = PROGRAMS[slug];
  const app = document.getElementById('programa-app');
  if (!program) {
    if (app) app.innerHTML = `<section class="academy-section"><div class="container"><h1 class="academy-title">Programa não encontrado.</h1><p class="academy-lead"><a href="/academy/">Voltar para a Avantik Academy</a></p></div></section>`;
    return;
  }

  applyTheme(program.theme);
  document.title = `${program.brand || program.nome} | Avantik Academy`;

  const mentorSlug = new URLSearchParams(location.search).get('mentor');
  const mentor = findMentor(program, mentorSlug); // null se ausente/inválido
  if (mentor) {
    document.title = `${program.brand || program.nome} com ${mentor.nome} | Avantik Academy`;
  }

  render(program, mentor);
}

init();
