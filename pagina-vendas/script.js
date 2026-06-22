/* =========================================================
   Desvendando o Mercado de Palestras | Bruno Bettini
   Interatividade (vanilla JS)
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ----------------------------------------------------------
     1. Reveal ao scroll ([data-reveal], .signal, .seal, .final)
     ---------------------------------------------------------- */
  // stagger por grupo
  const groups = [".problema__signals", ".bio__chips", ".bento", ".faq__list"];
  groups.forEach((sel) => {
    const parent = document.querySelector(sel);
    if (!parent) return;
    [...parent.children].forEach((child, i) => {
      child.style.transitionDelay = (i * 0.07).toFixed(2) + "s";
    });
  });

  const revealEls = document.querySelectorAll(
    "[data-reveal], .signal, .seal, .final"
  );
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ----------------------------------------------------------
     2. Secao 03 :: Mapa em scroll horizontal (pin)
     ---------------------------------------------------------- */
  (function setupMapa() {
    const mapa = document.querySelector(".mapa");
    const pin = document.querySelector(".mapa__pin");
    const sticky = document.querySelector(".mapa__sticky");
    const track = document.querySelector(".mapa__track");
    const fill = document.querySelector(".mapa__progressfill");
    const hint = document.querySelector(".mapa__hint");
    if (!mapa || !pin || !track) return;

    let distance = 0;
    let active = false;

    function measure() {
      const canRun =
        !reduceMotion && window.innerWidth > 880;
      if (!canRun) {
        mapa.classList.add("mapa--static");
        pin.style.height = "";
        track.style.transform = "";
        active = false;
        return;
      }
      mapa.classList.remove("mapa--static");
      distance = track.scrollWidth - window.innerWidth + 24;
      if (distance < 0) distance = 0;
      pin.style.height = window.innerHeight + distance + "px";
      active = distance > 0;
      onScroll();
    }

    function onScroll() {
      if (!active) return;
      const start = pin.offsetTop;
      const prog = clamp((window.scrollY - start) / distance, 0, 1);
      track.style.transform = "translate3d(" + -distance * prog + "px,0,0)";
      if (fill) fill.style.transform = "scaleX(" + prog + ")";
      if (hint) hint.style.opacity = prog > 0.04 ? "0" : "1";

      // enfase do card no centro do viewport
      const vw = window.innerWidth / 2;
      [...track.children].forEach((card) => {
        const r = card.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - vw) / window.innerWidth;
        const s = clamp(1 - d * 0.18, 0.92, 1);
        const o = clamp(1 - d * 0.6, 0.55, 1);
        card.style.transform = "scale(" + s + ")";
        card.style.opacity = o;
      });
    }

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(measure, 150);
    });

    // garante medida apos fontes carregarem
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
    window.addEventListener("load", measure);
    measure();
  })();

  /* ----------------------------------------------------------
     3. Tilt 3D + spotlight (data-tilt / data-spot)
     ---------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    const bases = {
      "vs__card--neg": "rotate(-2deg)",
      "vs__card--pos": "rotate(1deg) translateY(-24px)",
    };
    function baseOf(el) {
      for (const k in bases) if (el.classList.contains(k)) return bases[k];
      return "";
    }

    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const base = baseOf(el);
      const max = 6;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * max;
        const rx = -(py - 0.5) * max;
        el.style.transform =
          base + " perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        if (el.hasAttribute("data-spot")) {
          el.style.setProperty("--mx", px * 100 + "%");
          el.style.setProperty("--my", py * 100 + "%");
        }
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });

    // spotlight puro (sem tilt): oferta card
    document
      .querySelectorAll("[data-spot]:not([data-tilt])")
      .forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
          el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        });
      });
  }

  /* ----------------------------------------------------------
     4. Parallax do retrato (Secao 05)
     ---------------------------------------------------------- */
  if (!reduceMotion) {
    const photo = document.querySelector(".bio__photo");
    const img = document.querySelector(".bio__img");
    const frame = document.querySelector(".bio__frame");
    if (photo && img && frame) {
      let ticking = false;
      const run = () => {
        const r = photo.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const rel = (center - window.innerHeight / 2) / window.innerHeight; // -0.5..0.5
        img.style.transform = "translateY(" + clamp(rel * -28, -28, 28) + "px)";
        frame.style.transform =
          "translate(16px,16px) translateY(" + clamp(rel * 12, -12, 12) + "px)";
        ticking = false;
      };
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(run);
            ticking = true;
          }
        },
        { passive: true }
      );
      run();
    }
  }

  /* ----------------------------------------------------------
     5. Palavras-fantasma com mouse parallax (Secao 10)
     ---------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    const final = document.querySelector(".final");
    const ghosts = document.querySelectorAll(".final__ghost span");
    if (final && ghosts.length) {
      final.addEventListener("mousemove", (e) => {
        const r = final.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ghosts.forEach((g) => {
          const depth = parseInt(g.dataset.ghost, 10) || 1;
          const f = depth * 14;
          g.style.transform =
            "translate(" + px * f + "px," + py * f + "px)";
        });
      });
    }
  }

  /* ----------------------------------------------------------
     6. FAQ acordeao acessivel (um aberto por vez)
     ---------------------------------------------------------- */
  (function setupFaq() {
    const items = document.querySelectorAll(".faq__item");
    items.forEach((item) => {
      const btn = item.querySelector(".faq__q");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const isOpen = item.hasAttribute("data-open");
        items.forEach((it) => {
          it.removeAttribute("data-open");
          const b = it.querySelector(".faq__q");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.setAttribute("data-open", "");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  })();

  /* ----------------------------------------------------------
     7. Particulas de poeira dourada (Secao 07 :: Oferta)
     ---------------------------------------------------------- */
  (function setupParticles() {
    const canvas = document.querySelector(".oferta__particles");
    if (!canvas || reduceMotion || window.innerWidth <= 540) {
      if (canvas) canvas.style.display = "none";
      return;
    }
    const ctx = canvas.getContext("2d");
    let w, h, particles, raf, running = false;
    const COUNT = 42;

    function size() {
      const r = canvas.getBoundingClientRect();
      w = canvas.width = r.width;
      h = canvas.height = r.height;
    }
    function init() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.3 + 0.08),
        a: Math.random() * 0.4 + 0.1,
      }));
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232,185,49," + p.a + ")";
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!running) { running = true; frame(); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    size();
    init();
    // so anima quando visivel
    const io = new IntersectionObserver((e) => {
      e[0].isIntersecting ? start() : stop();
    });
    io.observe(canvas);
    window.addEventListener("resize", () => { size(); init(); });
  })();
})();
