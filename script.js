/**
 * Metodo Zero v20
 */

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initForms();
  initPhoneInput();
  initYear();
  initHeader();
  initHeroTabs();
  initHowTabs();
  initCtaTabs();
  initMobileMenu();
  initCounters();
  initCarouselPause();
  initFAQ();
  initBlogFilter();
  initVideoThumbs();
  initClientsCarousel();
  initAuthNav();
});

/* ==========================================
   AOS
   ========================================== */

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
      disableMutationObserver: true
    });
  }
}

/* ==========================================
   FORMULARIOS
   ========================================== */

const tempEmailDomains = [
  'tempmail', 'guerrillamail', '10minutemail', 'mailinator',
  'throwaway', 'fakeinbox', 'yopmail', 'trashmail', 'temp-mail',
  'disposable', 'sharklasers'
];

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return false;
  const domain = email.split('@')[1].toLowerCase();
  return !tempEmailDomains.some(temp => domain.includes(temp));
}

function initForms() {
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const feedback = form.querySelector('.form-feedback');

  // Validacao
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('error');

    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }

    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
      field.classList.add('error');
      valid = false;
    }

    if (field.type === 'tel') {
      const iti = field._iti;
      if (iti && !iti.isValidNumber()) {
        field.classList.add('error');
        valid = false;
      }
    }
  });

  if (!valid) {
    showFeedback(feedback, 'error', 'Preencha todos os campos corretamente.');
    return;
  }

  // Captura nome e email ANTES do envio (form.reset limpa os campos)
  const nome = form.querySelector('[name="nome"]')?.value || '';
  const email = form.querySelector('[name="email"]')?.value || '';

  // Telefone internacional - pega instancia do input DESTE form
  const phone = form.querySelector('input[type="tel"]');
  if (phone && phone._iti) {
    phone.value = phone._iti.getNumber();
  }

  // Envio
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const res = await fetch(form.getAttribute('action') || window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    });

    if (res.ok) {
      // Meta Pixel
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }

      // GTM dataLayer
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({ event: 'generate_lead', form_name: form.getAttribute('name') || 'contato', method: 'netlify_form' });
      }

      // Redirect com parametros
      const action = form.getAttribute('action');
      if (action) {
        const redirectUrl = new URL(action, window.location.origin);

        // Repassa todos os parametros da URL atual (utm_source, fbclid, etc)
        new URLSearchParams(window.location.search).forEach((value, key) => {
          redirectUrl.searchParams.set(key, value);
        });

        // Passa nome e email como parametros
        if (nome) redirectUrl.searchParams.set('nome', nome);
        if (email) redirectUrl.searchParams.set('email', email);

        window.location.href = redirectUrl.toString();
        return;
      }

      // Fallback: mostrar mensagem (quando nao tem action)
      showFeedback(feedback, 'success', 'Mensagem enviada com sucesso!');
      form.reset();
      if (phone && phone._iti) phone._iti.setNumber('');
    } else {
      throw new Error('Erro');
    }
  } catch {
    showFeedback(feedback, 'error', 'Erro ao enviar. Tente novamente.');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function showFeedback(el, type, msg) {
  if (!el) return;
  el.className = 'form-feedback ' + type;
  el.textContent = msg;
  setTimeout(() => {
    el.className = 'form-feedback';
    el.textContent = '';
  }, 5000);
}

/* ==========================================
   TELEFONE INTERNACIONAL
   ========================================== */

function initPhoneInput() {
  if (typeof intlTelInput === 'undefined') return;

  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input._iti = intlTelInput(input, {
      initialCountry: 'br',
      preferredCountries: ['br', 'us', 'pt'],
      separateDialCode: true,
      strictMode: true,
      loadUtilsOnInit: 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/utils.js'
    });
  });
}

/* ==========================================
   UTILS
   ========================================== */

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ==========================================
   HEADER SCROLL
   ========================================== */

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('header--scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ==========================================
   HERO TABS
   ========================================== */

function initHeroTabs() {
  const tabs = document.querySelectorAll('[data-hero-tab]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.heroTab;

      tabs.forEach(t => {
        t.classList.remove('hero__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('hero__tab--active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.hero__subtitle').forEach(sub => {
        sub.hidden = true;
        sub.classList.remove('hero__subtitle--active');
      });

      const activeSub = document.getElementById('hero-sub-' + target);
      if (activeSub) {
        activeSub.hidden = false;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            activeSub.classList.add('hero__subtitle--active');
          });
        });
      }
    });
  });
}

/* ==========================================
   HOW IT WORKS TABS
   ========================================== */

function initHowTabs() {
  const tabs = document.querySelectorAll('[data-how-tab]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.howTab;

      tabs.forEach(t => {
        t.classList.remove('how__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('how__tab--active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.how__content').forEach(content => {
        content.hidden = true;
        content.classList.remove('how__content--active');
      });

      const activeContent = document.getElementById('how-' + target);
      if (activeContent) {
        activeContent.hidden = false;
        activeContent.classList.add('how__content--active');
      }
    });
  });
}

/* ==========================================
   CTA FINAL TABS
   ========================================== */

function initCtaTabs() {
  const tabs = document.querySelectorAll('[data-cta-tab]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.ctaTab;

      tabs.forEach(t => {
        t.classList.remove('cta-final__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('cta-final__tab--active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.cta-final__content').forEach(content => {
        content.hidden = true;
        content.classList.remove('cta-final__content--active');
      });

      const activeContent = document.getElementById('cta-' + target);
      if (activeContent) {
        activeContent.hidden = false;
        activeContent.classList.add('cta-final__content--active');
      }
    });
  });
}

/* ==========================================
   COUNTER ANIMATION
   ========================================== */

function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.countTo, 10);
  const prefix = el.dataset.countPrefix || '';
  const suffix = el.dataset.countSuffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out curve
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Mark parent card as counted for CSS transition
      const card = el.closest('.why__card');
      if (card) card.classList.add('counted');
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================
   CAROUSEL PAUSE (touch scroll on mobile)
   ========================================== */

function initCarouselPause() {
  const track = document.querySelector('.speakers__track');
  if (!track) return;

  // On mobile, disable CSS animation and enable native scroll
  const mq = window.matchMedia('(max-width: 768px)');

  function handleMobile(e) {
    if (e.matches) {
      track.style.animation = 'none';
    } else {
      track.style.animation = '';
    }
  }

  mq.addEventListener('change', handleMobile);
  handleMobile(mq);
}

/* ==========================================
   MOBILE MENU
   ========================================== */

function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('header__burger--open');
    menu.classList.toggle('header__mobile--open');
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('header__burger--open');
      menu.classList.remove('header__mobile--open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================
   FAQ ACCORDION
   ========================================== */

function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq__item--open');

      // Close all others
      items.forEach(other => other.classList.remove('faq__item--open'));

      // Toggle current
      if (!isOpen) {
        item.classList.add('faq__item--open');
      }
    });
  });
}

/* ==========================================
   BLOG FILTER
   ========================================== */

function initBlogFilter() {
  const filters = document.querySelectorAll('[data-blog-filter]');
  const cards = document.querySelectorAll('[data-blog-category]');
  if (!filters.length || !cards.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.blogFilter;

      // Update active state
      filters.forEach(f => f.classList.remove('blog-grid__filter--active'));
      btn.classList.add('blog-grid__filter--active');

      // Filter cards
      cards.forEach(card => {
        if (filter === 'todos' || card.dataset.blogCategory === filter) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }
      });
    });
  });
}

/* ==========================================
   VIDEO THUMBS (Depoimentos)
   ========================================== */

function initVideoThumbs() {
  const thumbs = document.querySelectorAll('.social__thumb');
  const iframe = document.getElementById('social-featured-iframe');
  if (!thumbs.length || !iframe) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const videoUrl = thumb.dataset.video;
      if (!videoUrl) return;

      iframe.src = videoUrl;

      thumbs.forEach(t => t.classList.remove('social__thumb--active'));
      thumb.classList.add('social__thumb--active');
    });
  });
}

/* ==========================================
   CLIENTS CAROUSEL (setas)
   ========================================== */

function initClientsCarousel() {
  const track = document.getElementById('clients-track');
  const prevBtn = document.querySelector('.clients__arrow--prev');
  const nextBtn = document.querySelector('.clients__arrow--next');
  if (!track || !prevBtn || !nextBtn) return;

  let pos = 0;

  function getItemWidth() {
    const logo = track.querySelector('.clients__logo');
    if (!logo) return 200;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return logo.offsetWidth + gap;
  }

  function getVisibleCount() {
    const viewport = track.parentElement;
    return Math.floor(viewport.offsetWidth / getItemWidth()) || 1;
  }

  function getMaxPos() {
    const total = track.querySelectorAll('.clients__logo').length;
    return Math.max(0, total - getVisibleCount());
  }

  function update() {
    const offset = pos * getItemWidth();
    track.style.transform = 'translateX(-' + offset + 'px)';
  }

  nextBtn.addEventListener('click', () => {
    const max = getMaxPos();
    pos = pos >= max ? 0 : pos + 1;
    update();
  });

  prevBtn.addEventListener('click', () => {
    const max = getMaxPos();
    pos = pos <= 0 ? max : pos - 1;
    update();
  });
}

/* ==========================================
   AUTH NAV (estado de login no header)
   ========================================== */

async function initAuthNav() {
  try {
    const { supabase, authSignOut, getUserType } = await import('/lib/supabase.js');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const result = await getUserType(user.id);
    if (!result.type) return;

    const contractor = result.getProfile('contractor');
    const speaker = result.getProfile('speaker');
    const hasBoth = contractor && speaker;

    const headerActions = document.getElementById('header-actions') || document.querySelector('.header__actions');
    const mobileActions = document.querySelector('.header__mobile-actions');
    if (!headerActions) return;

    // Expor funcoes no window
    window.__avantikLogout = async () => {
      await authSignOut();
      try { localStorage.removeItem('avantik_active_role'); } catch(_) {}
      location.href = '/';
    };

    window.__avantikSwitchRole = (role) => {
      try { localStorage.setItem('avantik_active_role', role); } catch(_) {}
      location.reload();
    };

    // Determinar papel ativo
    let activeRole = result.type;

    let navHtml = '';
    let mobileHtml = '';

    // Seletor de contexto (so aparece se tem os dois papeis)
    let switchHtml = '';
    let switchMobileHtml = '';
    if (hasBoth) {
      const otherRole = activeRole === 'contractor' ? 'speaker' : 'contractor';
      const otherLabel = otherRole === 'contractor' ? 'Contratante' : 'Palestrante';
      switchHtml = `<button class="btn btn--sm" onclick="window.__avantikSwitchRole('${otherRole}')" title="Trocar para ${otherLabel}" style="font-size:0.75rem;padding:0.375rem 0.75rem">Modo ${otherLabel}</button>`;
      switchMobileHtml = `<button class="btn btn--outline" onclick="window.__avantikSwitchRole('${otherRole}')">Trocar para ${otherLabel}</button>`;
    }

    if (activeRole === 'contractor' && contractor) {
      navHtml = `
        <a href="/meus-projetos/" class="btn btn--outline btn--sm">Meus Projetos</a>
        <a href="/projetos/novo/" class="btn btn--accent btn--sm">Publicar Oportunidade</a>
        ${switchHtml}
        <button class="btn btn--sm" onclick="window.__avantikLogout()">Sair</button>
      `;
      mobileHtml = `
        <a href="/meus-projetos/" class="btn btn--outline">Meus Projetos</a>
        <a href="/projetos/novo/" class="btn btn--accent">Publicar Oportunidade</a>
        ${switchMobileHtml}
      `;
    } else if (activeRole === 'speaker' && speaker) {
      navHtml = `
        <a href="/projetos/" class="btn btn--outline btn--sm">Oportunidades</a>
        <a href="/palestrante/?slug=${speaker.slug || ''}" class="btn btn--accent btn--sm">Meu Perfil</a>
        ${switchHtml}
        <button class="btn btn--sm" onclick="window.__avantikLogout()">Sair</button>
      `;
      mobileHtml = `
        <a href="/projetos/" class="btn btn--outline">Oportunidades</a>
        <a href="/palestrante/?slug=${speaker.slug || ''}" class="btn btn--accent">Meu Perfil</a>
        ${switchMobileHtml}
      `;
    }

    if (navHtml) {
      headerActions.innerHTML = navHtml;
      if (mobileActions) mobileActions.innerHTML = mobileHtml;
    }
  } catch (e) {
    // Silently fail - nav stays in default state
  }
}
