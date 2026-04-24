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

/* Carrossel de clientes agora roda automaticamente via CSS (scrollClients 60s).
   Nao precisa mais de JS — setas escondidas via CSS. */

/* ==========================================
   AUTH NAV (estado de login no header)
   ========================================== */

async function initAuthNav() {
  try {
    const { supabase, authSignOut, getUserType } = await import('/lib/supabase.js');

    // Escuta mudancas de estado (login/logout) para re-renderizar.
    // INITIAL_SESSION dispara quando a sessao e hidratada do localStorage no load.
    if (!window.__avantikAuthListenerSet) {
      window.__avantikAuthListenerSet = true;
      supabase.auth.onAuthStateChange((event) => {
        if (
          event === 'INITIAL_SESSION' ||
          event === 'SIGNED_IN' ||
          event === 'SIGNED_OUT' ||
          event === 'TOKEN_REFRESHED'
        ) {
          initAuthNav();
        }
      });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Usuario deslogado — restaurar estado default (caso tenha saido)
      const ha = document.getElementById('header-actions') || document.querySelector('.header__actions');
      if (ha && ha.dataset.authState === 'logged') {
        // Se a navbar estava em modo logado, recarregar para restaurar default
        location.reload();
      }
      return;
    }

    const result = await getUserType(user.id);
    if (!result.type) return;

    const contractor = result.getProfile('contractor');
    const speaker = result.getProfile('speaker');

    const headerActions = document.getElementById('header-actions') || document.querySelector('.header__actions');
    const mobileActions = document.querySelector('.header__mobile-actions');
    if (!headerActions) return;

    // Expor logout no window
    window.__avantikLogout = async () => {
      await authSignOut();
      try { localStorage.removeItem('avantik_active_role'); } catch(_) {}
      location.href = '/';
    };

    // --- CTA primario visivel na topbar (a acao de maior valor por papel) ---
    let primaryCta = '';
    if (contractor) {
      primaryCta = '<a href="/projetos/novo/" class="btn btn--accent btn--sm">Publicar Oportunidade</a>';
    } else if (speaker) {
      primaryCta = `<a href="/palestrante/?slug=${speaker.slug || ''}" class="btn btn--accent btn--sm">Meu Perfil</a>`;
    }

    // --- Dados do avatar ---
    const displayName = (speaker?.name || contractor?.name || user.email || '').trim();
    const firstName = displayName.split(/\s+/)[0] || 'Você';
    const initials = displayName
      ? displayName.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
      : (user.email?.[0] || '?').toUpperCase();
    const photo = speaker?.photo_url && speaker.photo_url !== '/images/avatar-placeholder.svg'
      ? speaker.photo_url
      : null;

    const avatarHtml = photo
      ? `<span class="user-menu__avatar user-menu__avatar--photo" style="background-image:url('${photo}')" aria-hidden="true"></span>`
      : `<span class="user-menu__avatar" aria-hidden="true">${initials}</span>`;

    // --- Itens do menu (ordem: acoes do papel, oportunidades, sair) ---
    const ICON_CAL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    const ICON_USER = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    const ICON_FOLDER = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
    const ICON_SEARCH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    const ICON_LOGOUT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

    let menuItems = '';
    if (speaker) {
      menuItems += `<a href="/palestrante/?slug=${speaker.slug || ''}" class="user-menu__item">${ICON_USER}Meu perfil público</a>`;
      menuItems += `<a href="/minhas-palestras/" class="user-menu__item">${ICON_CAL}Minhas palestras</a>`;
    }
    if (contractor) {
      menuItems += `<a href="/meus-projetos/" class="user-menu__item">${ICON_FOLDER}Meus projetos</a>`;
    }
    menuItems += `<a href="/projetos/" class="user-menu__item">${ICON_SEARCH}Oportunidades</a>`;
    menuItems += `<div class="user-menu__divider"></div>`;
    menuItems += `<button type="button" class="user-menu__item user-menu__item--danger" onclick="window.__avantikLogout()">${ICON_LOGOUT}Sair</button>`;

    const safeName = String(firstName).replace(/[<>&"']/g, '');
    const safeEmail = String(user.email || '').replace(/[<>&"']/g, '');

    const navHtml = `
      ${primaryCta}
      <div class="user-menu" id="user-menu">
        <button class="user-menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Abrir menu do usuário">
          ${avatarHtml}
          <span class="user-menu__name">${safeName}</span>
          <svg class="user-menu__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="user-menu__panel" role="menu">
          <div class="user-menu__header">
            <strong>${safeName}</strong>
            <span>${safeEmail}</span>
          </div>
          <div class="user-menu__divider"></div>
          ${menuItems}
        </div>
      </div>
    `;

    // --- Mobile: mantem empilhado, mas so os itens essenciais + logout ---
    let mobileHtml = '';
    if (contractor) {
      mobileHtml += `<a href="/projetos/novo/" class="btn btn--accent">Publicar Oportunidade</a>`;
      mobileHtml += `<a href="/meus-projetos/" class="btn btn--outline">Meus Projetos</a>`;
    }
    if (speaker) {
      mobileHtml += `<a href="/palestrante/?slug=${speaker.slug || ''}" class="btn ${contractor ? 'btn--outline' : 'btn--accent'}">Meu Perfil</a>`;
      mobileHtml += `<a href="/minhas-palestras/" class="btn btn--outline">Minhas Palestras</a>`;
    }
    mobileHtml += `<a href="/projetos/" class="btn btn--outline">Oportunidades</a>`;
    mobileHtml += `<button class="btn" onclick="window.__avantikLogout()">Sair</button>`;

    headerActions.innerHTML = navHtml;
    headerActions.dataset.authState = 'logged';
    if (mobileActions) mobileActions.innerHTML = mobileHtml;

    // --- Toggle do dropdown ---
    const um = document.getElementById('user-menu');
    if (um) {
      const trigger = um.querySelector('.user-menu__trigger');
      const close = () => {
        um.classList.remove('user-menu--open');
        trigger.setAttribute('aria-expanded', 'false');
      };
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = um.classList.toggle('user-menu--open');
        trigger.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', (e) => {
        if (!um.contains(e.target)) close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    }
  } catch (e) {
    console.error('initAuthNav error:', e);
  }
}
