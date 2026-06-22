/* O Jogo do Palestrante: quiz de diagnóstico
   Stepper de 8 perguntas, captura de contato, resultado por perfil.
   Estado persistido em localStorage. Integrações:
   - saveLead(): insere o lead no Supabase (REST, fire-and-forget, nunca trava a UX)
   - WhatsApp: wa.me com mensagem prefixada pelo perfil */
(function () {
  const WHATS = "5531992185328";
  const KEY = "jogo-palestrante-quiz";

  // --- Supabase (anon key publica, mesma do projeto Avantik) ---
  // Requer a tabela `diagnostico_leads` com RLS permitindo INSERT anonimo.
  const SUPA_URL = "https://ajokzpjguhfxxudteetr.supabase.co";
  const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjQ1NTQsImV4cCI6MjA5MDQwMDU1NH0.TG-ASfMGgNY4BoHsFQx8TQ-4HPVsdbGEu4zJuFAeiNg";

  const QUESTIONS = [
    { dim: "Produto e oferta", q: "O que você vende hoje?", opts: [
      "Só palestra avulsa, quando aparece",
      "Palestra e, às vezes, algum treinamento",
      "Tenho produtos definidos: palestra, treinamento, mentoria, consultoria",
    ]},
    { dim: "Venda e prospecção", q: "Como os seus clientes chegam até você?", opts: [
      "Quase tudo por indicação ou sorte, não controlo",
      "Um pouco de indicação e um pouco de divulgação solta",
      "Tenho prospecção ativa e um processo de venda que eu controlo",
    ]},
    { dim: "Precificação", q: "Como você define o seu cachê?", opts: [
      "Cobro o que dá, com medo de perder o cliente",
      "Tenho um valor mais ou menos fixo, mas insegurança na hora de defender",
      "Precifico com critério e sustento o valor na negociação",
    ]},
    { dim: "Estrutura e material", q: "Como está o seu material profissional (site, portfólio, vídeo)?", opts: [
      "Não tenho, ou tenho só o Instagram",
      "Tenho algumas coisas soltas, mas nada redondo",
      "Tenho site, portfólio e vídeo que vendem por mim",
    ]},
    { dim: "Visibilidade e posicionamento", q: "Como está a sua autoridade no seu tema?", opts: [
      "Pouca gente sabe exatamente do que eu falo",
      "Tenho presença, mas meu posicionamento é confuso",
      "Sou reconhecido e lembrado pelo meu tema",
    ]},
    { dim: "Mercado e canais", q: "Você sabe onde está o dinheiro do mercado de palestras?", opts: [
      "Não, prospecto qualquer empresa que aparece",
      "Mais ou menos, conheço alguns caminhos",
      "Sim: empresas de médio e grande porte, sistema S, CDL, licitações, conselhos",
    ]},
    { dim: "Jurídico e contratos", q: "Como você fecha os seus negócios?", opts: [
      "No combinado verbal, sem contrato",
      "Às vezes uso contrato, às vezes não",
      "Sempre com contrato, termos claros e riscos protegidos",
    ]},
    { dim: "Carreira e consistência", q: "Como é a sua renda com palestras hoje?", opts: [
      "Esporádica, não dá pra contar com ela",
      "Existe, mas é instável, alguns meses bons, outros zerados",
      "Consistente e crescendo, vivo disso",
    ]},
  ];

  const PROFILES = [
    {
      min: 8, max: 13, name: "Abertura", title: "Você está na Abertura",
      diag: "Você está montando as peças. Tem vontade e talento, mas ainda joga sem tabuleiro: falta produto definido, estrutura e clareza de para quem vender. A boa notícia: é exatamente aqui que o jogo se ganha ou se perde, e dá pra acelerar muito com a sequência certa de jogadas.",
      moves: ["Entrando no Jogo", "Xeque-Mate (Definição de Produtos)", "Estrutura do Palestrante", "Arsenal do Palestrante"],
      virada: "Quem aprende a abertura certa não perde dois anos tateando.",
    },
    {
      min: 14, max: 19, name: "Meio-jogo", title: "Você está no Meio-jogo",
      diag: "Você já se move no tabuleiro: vende, dá palestra, tem alguma estrutura. Mas está patinando no valor, na consistência e no posicionamento. Você trabalha muito e captura pouco do que poderia. Falta transformar movimento em estratégia.",
      moves: ["O Jogo do Dinheiro (Precificação)", "Tudo Começa na Venda", "Arquétipos (Visibilidade)", "Contratos e Riscos Jurídicos", "Monitoramento de Palestras"],
      virada: "No meio-jogo, quem tem método sai na frente de quem só tem esforço.",
    },
    {
      min: 20, max: 24, name: "Final", title: "Você está no Final",
      diag: "Você performa, vive do mercado e já domina o básico do jogo. Agora o desafio é outro: escalar com método, blindar a operação e construir uma carreira que não dependa só de você correr atrás. É hora de jogadas de mestre.",
      moves: ["Construindo sua Master Class", "A Jornada da Carreira do Palestrante", "Planejamento de Eventos", "Monitoramento de Palestras"],
      virada: "No final do jogo, cada movimento vale o dobro. É aqui que se constrói legado.",
    },
  ];

  // ---------- state ----------
  let state = { stage: "intro", idx: 0, answers: [], contact: null };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.stage) state = saved;
  } catch (e) {}

  function persist() { localStorage.setItem(KEY, JSON.stringify(state)); }

  function score() { return state.answers.reduce((a, b) => a + b, 0); }
  function profile() {
    const s = score();
    return PROFILES.find(p => s >= p.min && s <= p.max) || PROFILES[0];
  }

  // Integração Supabase: insere o lead (fire-and-forget, nunca bloqueia o resultado)
  function saveLead(contact, answers, profileName) {
    try {
      const payload = {
        nome: contact.nome,
        email: contact.email,
        whatsapp: contact.whatsapp,
        respostas: answers,
        score: score(),
        perfil: profileName,
        origem: "jogo-do-palestrante",
      };
      fetch(SUPA_URL + "/rest/v1/diagnostico_leads", {
        method: "POST",
        headers: {
          "apikey": SUPA_KEY,
          "Authorization": "Bearer " + SUPA_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch (e) {}
  }

  // ---------- render ----------
  const frame = document.getElementById("quizFrame");

  function render() {
    persist();
    // Fullscreen quiz on mobile: toggle class + body scroll lock
    const isMobile = window.matchMedia("(max-width:640px)").matches;
    const isActive = state.stage !== "intro";
    frame.classList.toggle("quiz-active", isActive && isMobile);
    document.body.style.overflow = (isActive && isMobile) ? "hidden" : "";
    if (state.stage === "intro") return renderIntro();
    if (state.stage === "quiz") return renderQuestion();
    if (state.stage === "capture") return renderCapture();
    if (state.stage === "result") return renderResult();
  }

  function renderIntro() {
    frame.innerHTML = `
      <p class="q-dim">Diagnóstico gratuito</p>
      <h3 class="q-title">8 perguntas para ler o seu tabuleiro.</h3>
      <p style="font-size:16px;color:var(--nevoa);margin:0 0 8px">Responda com sinceridade. Não existe resposta certa, existe a sua posição real no tabuleiro.</p>
      <p class="q-intro-note">Leva 2 minutos. Resultado na hora.</p>
      <div style="margin-top:34px">
        <button class="btn btn-primary" id="qStart">Começar o diagnóstico</button>
      </div>`;
    frame.querySelector("#qStart").addEventListener("click", () => {
      state.stage = "quiz"; state.idx = 0; state.answers = [];
      render();
    });
  }

  function renderQuestion() {
    const i = state.idx;
    const q = QUESTIONS[i];
    const pct = (i / QUESTIONS.length) * 100;
    frame.innerHTML = `
      <div class="q-progress">
        <div class="bar"><i style="width:${pct}%"></i></div>
        <span class="count">${i + 1} de ${QUESTIONS.length}</span>
      </div>
      <p class="q-dim">${q.dim}</p>
      <h3 class="q-title">${q.q}</h3>
      <div class="q-opts">
        ${q.opts.map((o, j) => `
          <button class="q-opt" data-v="${j + 1}">
            <span class="letter">${"ABC"[j]}</span>
            <span>${o}</span>
          </button>`).join("")}
      </div>
      ${i > 0 ? '<button class="q-back" id="qBack">Voltar</button>' : ""}`;
    frame.querySelectorAll(".q-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        state.answers[i] = +btn.dataset.v;
        if (i + 1 < QUESTIONS.length) { state.idx = i + 1; }
        else { state.stage = "capture"; }
        render();
      });
    });
    const back = frame.querySelector("#qBack");
    if (back) back.addEventListener("click", () => { state.idx = i - 1; render(); });
  }

  function renderCapture() {
    frame.innerHTML = `
      <div class="q-progress">
        <div class="bar"><i style="width:100%"></i></div>
        <span class="count">8 de 8</span>
      </div>
      <p class="q-dim">Quase lá</p>
      <h3 class="q-title">Seu diagnóstico está pronto.</h3>
      <p style="font-size:15.5px;color:var(--nevoa);margin:0 0 28px">Deixe seus dados para ver o resultado e dar o próximo passo.</p>
      <form class="form" id="qForm" novalidate>
        <div class="field"><label for="q-nome">Seu nome</label><input id="q-nome" type="text" placeholder="Nome" required></div>
        <div class="field"><label for="q-email">Seu melhor e-mail</label><input id="q-email" type="email" placeholder="voce@email.com" required></div>
        <div class="field"><label for="q-zap">Seu WhatsApp</label><input id="q-zap" type="tel" placeholder="(00) 00000-0000" required></div>
        <button class="btn btn-primary" type="submit">Ver meu resultado</button>
      </form>
      <p class="consent">Ao continuar, você concorda em receber o resultado e o contato do Bruno pelo WhatsApp.</p>
      <button class="q-back" id="qBack">Voltar</button>`;
    frame.querySelector("#qForm").addEventListener("submit", (e) => {
      e.preventDefault();
      state.contact = {
        nome: frame.querySelector("#q-nome").value.trim(),
        email: frame.querySelector("#q-email").value.trim(),
        whatsapp: frame.querySelector("#q-zap").value.trim(),
      };
      const p = profile();
      saveLead(state.contact, state.answers, p.name);
      state.stage = "result";
      render();
    });
    frame.querySelector("#qBack").addEventListener("click", () => {
      state.stage = "quiz"; state.idx = QUESTIONS.length - 1; render();
    });
  }

  function renderResult() {
    const p = profile();
    const first = state.contact && state.contact.nome ? state.contact.nome.split(" ")[0] : "";
    const msg = encodeURIComponent(
      `Olá Bruno! Fiz o diagnóstico do Jogo do Palestrante e meu perfil foi ${p.name} (${score()} pontos). Quero agendar minha Sessão Estratégica de 1 hora no Zoom.`
    );
    frame.innerHTML = `
      <p class="r-profile">Resultado do diagnóstico${first ? " de " + first : ""}</p>
      <h3 class="r-title">${p.title}</h3>
      <p class="r-diag">${p.diag}</p>
      <p class="r-sub">Suas próximas jogadas</p>
      <div class="r-moves">${p.moves.map(m => `<span>${m}</span>`).join("")}</div>
      <p class="r-virada">${p.virada}</p>
      <a class="btn btn-primary" href="https://wa.me/${WHATS}?text=${msg}" target="_blank" rel="noopener">Quero minha Sessão Estratégica</a>
      <button class="q-back" id="qRedo">Refazer o diagnóstico</button>`;
    frame.querySelector("#qRedo").addEventListener("click", () => {
      state = { stage: "intro", idx: 0, answers: [], contact: state.contact };
      render();
    });
  }

  render();
})();
