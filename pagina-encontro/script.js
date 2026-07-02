/* =========================================================
   Encontro Entre Palestrantes | Edição Especial Belvedere
   Comportamentos: reveal, timeline fill, countdown, FAQ,
   partículas da oferta, parallax dos ghosts, mouse-spotlight
   ========================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Reveal ao scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => revealObs.observe(el));

  // seção final: dispara as reveal-lines do título
  const finalSection = document.querySelector('.final');
  if (finalSection) {
    const finalObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        finalSection.classList.add('is-in');
        finalObs.disconnect();
      }
    }, { threshold: 0.25 });
    finalObs.observe(finalSection);
  }

  /* ---------- 2. Timeline: trilho de brasa preenche com o scroll ---------- */
  const tl = document.getElementById('timeline');
  const tlFill = tl ? tl.querySelector('.tl__fill') : null;
  if (tl && tlFill && !reduceMotion) {
    let ticking = false;
    const updateFill = () => {
      const rect = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      // progresso: 0 quando o topo da timeline entra a 80% da tela,
      // 1 quando a base chega a 35% da tela
      const start = vh * 0.8;
      const end = vh * 0.35;
      const total = rect.height + (start - end);
      const advanced = start - rect.top;
      const p = Math.min(1, Math.max(0, advanced / total));
      tlFill.style.transform = `scaleY(${p})`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateFill); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateFill();
  }

  /* ---------- 3. Countdown até 08/07/2026 19h (Brasília) ---------- */
  const cdWrap = document.getElementById('countdown');
  if (cdWrap) {
    const target = new Date('2026-07-08T19:00:00-03:00').getTime();
    const els = {
      d: cdWrap.querySelector('[data-cd="d"]'),
      h: cdWrap.querySelector('[data-cd="h"]'),
      m: cdWrap.querySelector('[data-cd="m"]'),
      s: cdWrap.querySelector('[data-cd="s"]'),
    };
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        cdWrap.innerHTML = '<span class="count__live">Acontecendo agora</span>';
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      els.d.textContent = pad(d);
      els.h.textContent = pad(h);
      els.m.textContent = pad(m);
      els.s.textContent = pad(s);
      // últimas 24h: modo urgente
      cdWrap.closest('.count').classList.toggle('count--urgent', diff < 86400000);
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------- 4. FAQ accordion ---------- */
  document.querySelectorAll('.faq__item').forEach((item) => {
    const btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.hasAttribute('data-open');
      // fecha os outros
      document.querySelectorAll('.faq__item[data-open]').forEach((other) => {
        if (other !== item) {
          other.removeAttribute('data-open');
          other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.removeAttribute('data-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.setAttribute('data-open', '');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 5. Partículas de brasa (oferta) ---------- */
  const canvas = document.querySelector('.oferta__particles');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let running = false;
    let rafId = null;

    const resize = () => {
      const section = canvas.parentElement;
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };

    const spawn = () => {
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * canvas.height * 0.3,
        r: 1 + Math.random() * 1.5,
        speed: 0.25 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 0.3,
        alpha: 0.15 + Math.random() * 0.4,
      }));
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237, 125, 43, ${p.alpha})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      resize();
      if (!particles.length) spawn();
      draw();
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    // roda só quando a seção está visível
    const ofertaObs = new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? start() : stop();
    }, { rootMargin: '100px' });
    ofertaObs.observe(canvas.parentElement);

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : (canvas.parentElement.getBoundingClientRect().top < window.innerHeight && start());
    });
    window.addEventListener('resize', () => { if (running) { resize(); } }, { passive: true });
  }

  /* ---------- 6. Mouse-spotlight no card da oferta ---------- */
  const ofertaCard = document.querySelector('.oferta__card');
  if (ofertaCard && window.matchMedia('(hover: hover)').matches) {
    ofertaCard.addEventListener('pointermove', (e) => {
      const rect = ofertaCard.getBoundingClientRect();
      ofertaCard.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      ofertaCard.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  }

  /* ---------- 7. Parallax sutil dos ghosts (CTA final) ---------- */
  const ghosts = document.querySelectorAll('.final__ghost span');
  if (ghosts.length && !reduceMotion) {
    const factors = [0.06, 0.09, 0.04];
    let gTicking = false;
    const updateGhosts = () => {
      const section = document.querySelector('.final');
      const rect = section.getBoundingClientRect();
      const offset = rect.top - window.innerHeight / 2;
      ghosts.forEach((g, i) => {
        g.style.transform = `translateY(${(-offset * factors[i % factors.length]).toFixed(1)}px)`;
      });
      gTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!gTicking) { gTicking = true; requestAnimationFrame(updateGhosts); }
    }, { passive: true });
  }
})();
