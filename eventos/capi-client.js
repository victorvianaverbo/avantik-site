/* Apogeu — helper de tracking: dispara Pixel (browser) + CAPI (server)
   com o MESMO event_id para o Meta deduplicar. Carregado por todas as paginas. */
(function () {
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function cookie(name) {
    var m = document.cookie.match("(?:^|; )" + name + "=([^;]*)");
    return m ? decodeURIComponent(m[1]) : undefined;
  }

  // track(evento, dados_customizados, dados_do_usuario {em, ph, fn})
  window.track = function (eventName, custom, userData) {
    custom = custom || {};
    userData = userData || {};
    var id = uuid();

    // Se o pixel ainda nao carregou (idle nao rodou), carrega agora antes de converter
    if (typeof window.fbq !== "function" && typeof window.__loadPixel === "function") window.__loadPixel();

    // 1) Pixel no navegador (com eventID para dedup)
    if (typeof window.fbq === "function") window.fbq("track", eventName, custom, { eventID: id });

    // 2) CAPI no servidor (mesmo event_id)
    try {
      fetch("/.netlify/functions/capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          event_name: eventName,
          event_id: id,
          event_source_url: location.href,
          custom_data: custom,
          em: userData.em,
          ph: userData.ph,
          fn: userData.fn,
          fbp: cookie("_fbp"),
          fbc: cookie("_fbc"),
        }),
      }).catch(function () {});
    } catch (e) {}
  };

  // Captura de UTMs (first-touch persistente) + referrer/landing da sessao.
  // Retorna objeto pronto para gravar junto com o lead no Supabase.
  window.getUTMs = function () {
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    var out = {};
    try {
      var qs = new URLSearchParams(location.search);
      var saved = {};
      try { saved = JSON.parse(localStorage.getItem("avk_utms") || "{}"); } catch (e) {}
      var hasNew = keys.some(function (k) { return qs.get(k); });
      keys.forEach(function (k) {
        out[k] = qs.get(k) || (hasNew ? "" : (saved[k] || "")) || null;
      });
      if (hasNew) {
        try {
          localStorage.setItem("avk_utms", JSON.stringify({
            utm_source: out.utm_source, utm_medium: out.utm_medium,
            utm_campaign: out.utm_campaign, utm_content: out.utm_content, utm_term: out.utm_term
          }));
        } catch (e) {}
      }
      // referrer e landing_url = primeira pagina da sessao
      var ft = {};
      try { ft = JSON.parse(sessionStorage.getItem("avk_ft") || "{}"); } catch (e) {}
      if (!ft.landing_url) {
        ft.landing_url = location.href;
        ft.referrer = document.referrer || "";
        try { sessionStorage.setItem("avk_ft", JSON.stringify(ft)); } catch (e) {}
      }
      out.referrer = ft.referrer || null;
      out.landing_url = ft.landing_url || location.href;
    } catch (e) {}
    return out;
  };

  // Persiste o first-touch assim que a pagina carrega (em qualquer uma das LPs)
  try { window.getUTMs(); } catch (e) {}
})();
