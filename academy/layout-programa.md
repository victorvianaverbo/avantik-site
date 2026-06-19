# Layout — Template de Programa (`/academy/<slug>/`)

> Spec de direção de arte do template ÚNICO de programa, renderizado por `academy-programa.js`
> e tematizado por `data.js` (cores oficiais dos 6 manuais). Pareada com cada `copy.md` de programa.
> Vale para os 6 programas via tokens de tema. Implementação em `/desenvolver`.

## Linguagem visual aprovada (manter)

- **Display de marca:** `Metropolis` 900 (black), caixa-alta — wordmarks (hero, CTA, capas).
- **Corpo:** `DM Sans` 400/600/700.
- **Tema por programa (injeção em runtime via `applyTheme`):**
  - `--academy-primary` (cor vívida da marca) · `--academy-accent` (secundária) · `--academy-dark` (quase-preto com viés da marca).
  - `--academy-on-primary` / `--academy-on-accent` calculados por **luminância** (texto preto/branco automático).
  - Cores oficiais: Empreender `#00A900`/`#00F900` · Gestão `#0076F8`/`#004DBB` · IE `#8D00FF`/`#9E55A0` · Oratória `#FF4000`/`#FF6500` · Vendas `#FB0000`/`#A10000` · Liderança `#EBB700`/`#FFD200`.
- **Assinatura visual (dos manuais):** fundo escuro + **glow** radial da cor + **plexus** (canvas de rede). Presente no Hero e no CTA final.
- **Espaçamentos/movimento:** iguais ao hub (`clamp` de seção, reveals AOS, `cubic-bezier(0.16,1,0.3,1)`).

> ORDEM DE SEÇÕES (com personalização `?mentor=`):
> Hero → O Problema → O que vai aprender → Formato → Mentor(es) → Oferta+Garantia → FAQ → CTA final.
> Quando há `?mentor=<slug>` válido: o Mentor destacado vai no Hero e a seção "Conheça os mentores" some.
> Sem mentor: Hero genérico (CTA = checkout do produto) e a grade de mentores aparece.

---

## Seção 1: Hero (wordmark de marca) — APROVADO, manter

### Arquétipo e Constraints
- Arquétipo: **Type Hero / Poster** (wordmark da marca como protagonista).
- Constraints: **Headline >150px + Mixed Weights uppercase** (Tipografia) · **Selective Color + glow sobre Dark Mode** (Cor) · **Particle System / plexus** (Mídia).

### Conteúdo (de copy.md › Hero)
- Eyebrow: `Avantik Academy · {pilar}` (ex.: `Avantik Academy · Vendas`).
- H1 (wordmark): `{brand}` (ex.: `PROPULSÃO EM VENDAS`).
- Tagline: `{tagline}`. Subheadline: `{heroSub}`.
- Preço: `de R$ 197` (riscado) · `12x de R$ 19,70` · `R$ 197 à vista`.
- CTA: `Quero o programa` → checkout (afiliado se houver `?mentor=`).
- Coluna direita: **card do mentor** (se `?mentor=`) ou card-resumo do programa.

### Layout
- Section `padding clamp(5rem,11vw,8rem) 0`, `background --academy-dark`, `overflow hidden`, `position relative`.
- `<canvas class="program-hero__plexus">` (z 0, opacity .55). Glow `::before` (z 0): `radial(80% 60% at 12% -10%, color-mix(primary 38%,transparent),transparent 60%) + radial(70% 60% at 100% 110%, color-mix(accent 26%,transparent),transparent 55%)`.
- Grid `1.2fr 0.8fr; gap clamp(2rem,5vw,4rem); align-items center; z 1`.

### Tipografia
- Eyebrow: DM Sans 700 `.8rem` uppercase `letter-spacing .12em`, cor `primary`, traço antes na cor `primary`.
- H1: Metropolis 900 uppercase, `clamp(2.6rem,7.5vw,5.25rem)`, `line-height .98`, `letter-spacing -0.02em`, cor `primary`, `text-shadow 0 0 36px color-mix(primary 45%,transparent)`.
- Tagline: DM Sans 600 `clamp(1.15rem,2vw,1.45rem)` `rgba(255,255,255,.92)`. Sub: DM Sans 400 `clamp(1rem,1.3vw,1.1rem)` `rgba(255,255,255,.7)` max `52ch`.
- Preço-now: Metropolis/DM `2rem` cor `primary`; from riscado `rgba(255,255,255,.5)`.

### Card do mentor (coluna direita)
- `background rgba(255,255,255,.05)`, `border 1px rgba(255,255,255,.14)`, `border-radius 1.25rem`, `padding 1.75rem`, `backdrop-filter blur(4px)`.
- Label `SEU MENTOR NESTE PROGRAMA` (cor `primary`), foto circular `72px` borda `primary`, nome Metropolis-ish/DM Serif `1.4rem`, tema `rgba(255,255,255,.7)`, bio `.95rem`.

### Animações / Interatividade
- Plexus animado (nós conectados na cor `primary`, linhas com alpha por distância). `prefers-reduced-motion`: estático.
- CTA hover: `translateY(-1px) + brightness(1.08)`, sombra `0 14px 30px color-mix(primary 32%,transparent)`.

### Responsividade
- ≤820px: grid 1 coluna; card do mentor abaixo; H1 `clamp(2.2rem,11vw,3.2rem)`.

---

## Seção 2: O Problema  (NOVO — falta na página)

### Arquétipo e Constraints
- Arquétipo: **Editorial Pull-Quote / Single Focus** (uma afirmação forte, sem cards).
- Constraints: **Headline grande de impacto** (Tipografia) · **Text Reveal por scroll** (Movimento) · **Selective Color** (Cor — palavra-chave na cor da marca).
- Justificativa: nomear a dor exige foco e silêncio visual; uma frase-âncora grande converte melhor que blocos.

### Conteúdo (de copy.md › O problema) — por programa
- Eyebrow `O PROBLEMA`.
- Título-âncora = título da seção "O problema" do copy.md do programa (ex. Vendas: `Vender no improviso é montanha-russa de faturamento.`).
- Parágrafo = conteúdo da seção (ex. Vendas: `Pipeline vazio, objeção que derruba a venda, cliente que some depois da primeira compra. Sem processo, cada negociação recomeça do zero. Aqui você aprende a construir um caminho de vendas que se repete e escala.`).
- (Mesmo padrão para Empreender, Gestão, IE, Oratória, Liderança — ver cada copy.md › "O problema". Estes textos devem entrar no `data.js` como `problema: { titulo, texto }`.)

### Layout
- Fundo `--color-bg` (claro) para contraste com o hero escuro. `padding clamp(3.5rem,8vw,6.5rem) 0`.
- Container `max-width 880px`. Título-âncora alinhado à esquerda; parágrafo `max-width 60ch` margin-top 1.5rem.
- Detalhe: barra vertical `4px` na cor `primary` à esquerda do título (`padding-left 1.5rem`).

### Tipografia
- Título-âncora: DM Serif Display `clamp(1.9rem,4.2vw,3.1rem)`, line-height 1.12, `--color-text`; 1 palavra-chave em `color: primary`.
- Parágrafo: DM Sans 400 `1.1rem` line-height 1.7 `--color-text-secondary`.

### Animações / Interatividade
- Text reveal: título revela por linhas (clip-path/translateY+opacity, stagger 80ms) ao entrar 25% no viewport.
- Sem hover (seção de leitura).

### Responsividade
- ≤640px: título `clamp(1.6rem,7vw,2.2rem)`; barra vertical 3px.

---

## Seção 3: O que você vai aprender

### Arquétipo e Constraints
- Arquétipo: **Editorial em linhas numeradas alternadas** (NÃO grid de checkmarks).
- Constraints: **Stagger reveal** (Movimento) · **Draw SVG line / divisória animada** (Movimento) · **Hover Color** (Interação).
- Justificativa: lista de competências fica mais premium como índice editorial numerado do que como bullets.

### Conteúdo (de copy.md › O que você vai aprender) — `aprende[]` do `data.js`
- Eyebrow `O QUE VOCÊ VAI APRENDER` · Título `Conteúdo direto ao resultado.`
- 4 itens do array `aprende` (ex. Vendas: processo previsível; negociação/objeções; prospecção/pipeline; relacionamento/recompra).

### Layout
- Lista vertical full-width (não cards isolados): cada item = linha com `grid-template-columns: 64px 1fr`; numeral `01–04` + texto; divisória `1px` entre linhas que "desenha" da esquerda no reveal.
- `padding-block 1.25rem` por linha; container `max-width 920px`.

### Tipografia
- Numeral: Metropolis 900 `1.75rem` cor `color-mix(primary 80%, var(--color-text))`.
- Texto item: DM Sans 600 `clamp(1.05rem,1.6vw,1.25rem)` `--color-text`.

### Interatividade / Animações
- Stagger: linhas `fade-up` 600ms delay 80ms incremental.
- Hover linha: numeral e texto migram para `primary` (200ms); divisória engrossa para 2px na cor `primary`.

### Responsividade
- ≤640px: numeral menor (1.3rem), colunas `44px 1fr`.

---

## Seção 4: Formato

### Arquétipo e Constraints
- Arquétipo: **Timeline horizontal (3 passos conectados)** — não 3 cards soltos.
- Constraints: **Scroll Progress line** (Movimento — linha que preenche conforme scroll) · **Hover Lift** (Interação) · **Asymmetric Padding** (Layout).
- Justificativa: "como você aprende" é uma jornada (gravadas → mentoria → certificado/comunidade); timeline comunica sequência.

### Conteúdo (de copy.md › Formato)
- Eyebrow `FORMATO` · Título `Como você aprende.`
- Passo 1 `Aulas gravadas` — `Palestras de 30 a 40 minutos, no seu ritmo, com acesso contínuo.`
- Passo 2 `Mentoria mensal ao vivo` — `Encontros por Zoom com o mentor para aplicar no seu caso real.`
- Passo 3 `Certificado e comunidade` — `Reconhecimento da sua evolução e uma rede para crescer junto.`

### Layout
- Fundo `--color-muted-bg`. 3 colunas conectadas por uma linha horizontal (`2px`) atrás dos nós; cada nó = círculo `primary` com numeral.
- ≤768px vira vertical (linha à esquerda).

### Tipografia
- Título passo: DM Sans 700 `1.15rem`. Texto: DM Sans 400 `--color-text-secondary`.

### Animações / Interatividade
- A linha de progresso preenche na cor `primary` conforme a seção entra (scroll-linked / `animation-timeline: view()`).
- Hover passo: `translateY(-4px)` + glow leve `box-shadow 0 16px 32px color-mix(primary 14%,transparent)`.

### Responsividade
- ≤768px: timeline vertical; nós à esquerda, texto à direita.

---

## Seção 5: Mentor(es)

### Caso A — com `?mentor=` (mentor já destacado no Hero)
- Esta seção é **omitida** (o destaque já está no hero). Evita redundância.

### Caso B — sem mentor (estado genérico)
### Arquétipo e Constraints
- Arquétipo: **Gallery Wall / Card Stack** (grade de mentores do programa).
- Constraints: **Hover Reveal** (Interação — ao passar, revela "ver página do mentor") · **Glassmorphism leve** (Efeito) · **Stagger** (Movimento).
- Justificativa: apresentar os ~10 mentores como uma galeria curada; cada um leva à sua página personalizada (`?mentor=`).

### Conteúdo (de copy.md › Mentor + data.js `mentores[]`)
- Eyebrow `MENTORES` · Título `Conheça quem ensina neste programa.`
- Cards: foto, nome, tema. Link → `/academy/<slug>/?mentor=<slug>`.

### Layout
- Grid `repeat(auto-fill, minmax(200px,1fr)); gap 1.25rem`.
- Card: foto circular `88px`, nome DM Sans 700, tema `--color-text-secondary .85rem`, centralizado.

### Interatividade / Animações
- Hover: `translateY(-3px)`, `box-shadow 0 16px 32px rgba(0,0,0,.08)`, borda `color-mix(primary 35%, border)`, surge label "Ver página →" na cor `primary`.
- Stagger reveal 80ms.

### Responsividade
- ≤520px: 2 colunas.

---

## Seção 6: Oferta + Garantia  (NOVO — falta na página)

### Arquétipo e Constraints
- Arquétipo: **Framed Content / Contained Center** (card de oferta enquadrado, foco único).
- Constraints: **Glassmorphism + Glow** (Efeito/Cor) · **Badge selo de garantia** (Estrutura) · **Scale-in reveal** (Movimento).
- Justificativa: o momento de decisão pede um objeto visual contido e "premium" reunindo preço, o que inclui e a garantia.

### Conteúdo (de copy.md › Oferta) — por programa
- Eyebrow `A OFERTA`.
- Título da oferta (ex. Vendas: `Comece a vender com previsibilidade agora.`) — vem do copy.md › Oferta › Título (incluir no `data.js` como `oferta: { titulo, inclui, garantia }`).
- Inclui: `Acesso ao conteúdo gravado, mentorias mensais ao vivo e comunidade. Por R$ 197, ou 12x de R$ 19,70.`
- Garantia: `7 dias de garantia. Se não fizer sentido, você é reembolsado.`
- CTA: `Quero o programa` → checkout (afiliado se `?mentor=`).

### Layout
- Fundo `--color-bg`. Card central `max-width 720px`, `border-radius 1.5rem`, fundo `color-mix(primary 6%, #fff)`, `border 1px color-mix(primary 22%, border)`, `box-shadow 0 30px 70px color-mix(primary 16%, transparent)`, `padding clamp(2rem,5vw,3rem)`.
- Topo do card: preço destacado (`de R$197` riscado + `12x R$19,70`). Lista "o que inclui" (3 itens curtos). Selo de garantia (badge circular `7 DIAS` com borda `primary`) ancorado no canto superior direito do card.
- CTA full-width dentro do card.

### Tipografia
- Título: DM Serif `clamp(1.7rem,3.4vw,2.4rem)`. Preço-now Metropolis `2rem` `primary`.

### Animações / Interatividade
- Card scale-in (`scale .96→1` + opacity, 600ms) ao entrar 25%.
- Selo de garantia gira lentamente (`rotate` 20s linear infinite) — opcional, desligar em reduced-motion.
- CTA hover: glow + `translateY(-1px)`.

### Responsividade
- ≤640px: selo vira inline acima do título; padding reduz.

---

## Seção 7: FAQ  (NOVO — falta na página)

### Arquétipo e Constraints
- Arquétipo: **Reveal on Demand (acordeão editorial customizado)**.
- Constraints: **Clip Reveal (grid-rows 0fr→1fr)** (Movimento) · **Hover Underline** (Interação) · **Container Narrow** (Layout).
- Justificativa: tratar objeções com calma; acordeão refinado evita visual "template".

### Conteúdo (de copy.md › FAQ) — por programa (3 itens)
- Eyebrow `PERGUNTAS FREQUENTES`.
- Os 3 Q/A do copy.md de cada programa (ex. Vendas: "Funciona para qualquer produto/serviço?", "Sou novo em vendas, dá conta?", "Quanto tempo leva para concluir?"). Incluir no `data.js` como `faq: [{q, a}]`.

### Layout
- Container `max-width 760px`. Itens com divisória `1px`; resposta colapsada via `grid-template-rows 0fr→1fr` (360ms).

### Tipografia
- Pergunta DM Sans 600 `1.05rem`; resposta DM Sans 400 `--color-text-secondary` line-height 1.6.

### Interatividade
- Hover pergunta: underline animado na cor `primary`. Ícone `+`→`×` rotaciona 45°.

### Responsividade
- ≤640px: paddings menores.

---

## Seção 8: CTA final (band escura) — APROVADO, manter

### Arquétipo e Constraints
- Arquétipo: **Poster / Spotlight band** (wordmark de fechamento).
- Constraints: **Headline Metropolis** (Tipografia) · **Selective Color + glow sobre Dark** (Cor) · **Particle System / plexus** (Mídia).

### Conteúdo (de copy.md › CTA final)
- H2 = `{ctaTitle}` (ex. Vendas: `TROQUE A SORTE POR UM SISTEMA QUE VENDE.`).
- Parágrafo = `{descricao}`.
- CTA `Quero o programa por 12x de R$ 19,70` → checkout (afiliado se `?mentor=`).

### Layout / Tipografia / Cores
- Band `--academy-dark`, `overflow hidden`, `padding clamp(4rem,9vw,7rem) 0`, centralizado.
- `<canvas class="program-cta__plexus">` (opacity .5) + glow `::before` (primary topo-centro, accent base-direita).
- H2: Metropolis 900 uppercase `clamp(1.9rem,4.2vw,3.1rem)` cor `primary` `text-shadow 0 0 32px color-mix(primary 40%,transparent)`.
- Parágrafo `rgba(255,255,255,.82)` `52ch`. Botão `.btn--academy`.

### Animações
- Plexus animado (reuso do hero). Reveal do bloco `fade-up`.

---

## Campos a adicionar no `data.js` (para /desenvolver)
Para as seções novas saírem do copy.md e virarem data-driven, cada programa deve ganhar:
- `problema: { titulo, texto }` (Seção 2)
- `oferta: { titulo, inclui, garantia }` (Seção 6)
- `faq: [ { q, a }, ... ]` (Seção 7)
(`heroSub`, `ctaTitle`, `aprende`, `mentores`, `theme` já existem.)

---

## Resumo de arquétipos (variedade — sem repetição consecutiva)
1. Type Hero/Poster · 2. Editorial Pull-Quote · 3. Editorial numerado · 4. Timeline horizontal · 5. Gallery Wall · 6. Framed Content · 7. Reveal on Demand · 8. Poster band.

## Elementos encantadores planejados
- Plexus animado (hero + CTA) na cor da marca.
- Text-reveal por linhas no Problema.
- Linha-índice que "desenha" no "O que vai aprender".
- Timeline com linha de progresso scroll-linked no Formato.
- Selo de garantia girando + card de oferta com glow/glass.
- Acordeão com clip-reveal e underline animado.
- Hover-reveal "Ver página →" nos cards de mentor.
