# Layout - Encontro Entre Palestrantes | Edição Especial Belvedere

> Especificação de Diretor de Arte para implementação via /desenvolver.
> Base: copy.md + design aprovado (Hero + Seção 01 já implementados em index.html/style.css).
> Página em MODO CENTRALIZADO (coluna única estilo VSL/conversão), como as irmãs
> pagina-diagnostico e pagina-vendas (low ticket).

---

## Linguagem Visual Global (extraída do design aprovado)

### Paleta (usar EXATAMENTE estes tokens)
```css
--brasa-300:#FBC97A; --brasa-400:#FBB44C; --brasa-500:#ED7D2B; --brasa-600:#D9641A; --brasa-700:#B23E0C;
--grafite-950:#141417; --grafite-900:#1C1C20; --grafite-800:#2A2A30; --grafite-700:#3A3A42; --grafite-500:#5C5C66; --grafite-400:#8A8A94;
--marfim:#F6F4F1; --areia:#ECE8E2; --nevoa:#CFCBC4; --bronze:#C9A24B;
--brasa-grad:linear-gradient(135deg,#FBB44C,#ED7D2B 50%,#C2470F);
```
Mapeamento: `--bg:#F6F4F1` (marfim), `--surface:#FFFFFF`, `--muted-bg:#FBFAF8`,
`--text:#1C1C20`, `--text-2:#3A3A42`, `--text-muted:#8A8A94`, `--primary:#D9641A`,
`--accent:#ED7D2B`, `--border:#ECE8E2`, dobras escuras `--dark-2:#1C1C20` / `--dark-3:#141417`,
`--on-dark:#F6F4F1`, `--on-dark-2:#CFCBC4`.

### Fontes (Google Fonts, já linkadas)
- Heading: **Cormorant Garamond** 500/600 (+ italic) — sempre `font-weight:600` em títulos
- Body: **Hanken Grotesk** 400/500/600/700
- Labels/kickers/botões/micro: **Jost** 400/500/600

### Constantes
- `--maxw:1200px`, `--wrap:760px`, `--pad:clamp(1.25rem,5vw,2rem)`
- `--ease-out:cubic-bezier(0.16,1,0.3,1)`, `--ease-spring:cubic-bezier(0.34,1.56,0.64,1)`
- Border-radius padrão: cards `1.25rem`–`1.5rem`, botões `999px` (pílula)
- Botão primário: gradiente `--brasa-grad`, texto `#fff`, Jost 500 uppercase letter-spacing 0.1em,
  shadow `0 12px 32px rgba(217,100,26,0.32)`; hover `translateY(-3px)` + shadow `0 16px 40px rgba(217,100,26,0.42)`, 400ms `--ease-spring`
- Eyebrow padrão: Jost 0.72rem 600 uppercase ls 0.22em cor `--text-muted`; número em Cormorant 600 cor `--accent-hover`; em dark: texto `--on-dark-2`, número `--accent`
- Motivo de xadrez (assinatura da marca — usar nas dobras escuras indicadas):
  dois `linear-gradient(45deg, ...)` marfim a 25%/75%, `background-size:96px 96px`, `background-position:0 0, 48px 48px`, opacity 0.04–0.05
- Reveal ao scroll: `[data-reveal]` opacity 0 + translateY(22px) → `is-in` via IntersectionObserver (threshold 0.15), transição 700ms `--ease-out`; respeitar `prefers-reduced-motion`
- Alternância de dobras: Hero(dark) → 01 claro → 02 claro-muted → 03 DARK → 04 claro → 05 DARK → 06 claro → 07 DARK spotlight → 08 claro → 09 claro-muted → 10 DARK poster → footer dark
- Todos os CTAs → `https://www.sympla.com.br/evento/encontro-entre-palestrantes-edicao-especial-belvedere-apogeu-do-palestrante/3482515` com `target="_blank" rel="noopener"`

### script.js (comportamentos globais)
1. `is-loaded` no body (já no inline script do HTML)
2. IntersectionObserver para `[data-reveal]` e `.signal`-likes (adiciona `.is-in`)
3. Countdown da Seção 10 (target: `2026-07-08T19:00:00-03:00`)
4. Accordion do FAQ (toggle `data-open`, `aria-expanded`)
5. Linha da timeline (Seção 03): preencher `stroke-dashoffset`/`scaleY` conforme progresso de scroll da seção (rAF + getBoundingClientRect, ou CSS `animation-timeline: view()` com fallback JS)

---

## Seção 0: HERO (JÁ IMPLEMENTADO — manter como está)

- Arquetipo: Editorial (modo centralizado/VSL) | Constraints: xadrez mascarado + brilho brasa (Cor/Mídia), headline serif com `em` sublinhado (Tipografia), reveal stagger pós-load (Movimento), Glassmorphism no card do evento (Efeitos)
- Conteúdo, layout, card-bilhete do evento (max-width 620px, fio de brasa no topo, R$127 gigante) e responsivo: **exatamente como está em index.html/style.css**. NÃO reescrever, apenas preservar.

---

## Seção 01: A VERDADE (JÁ IMPLEMENTADA — manter como está)

- Arquetipo: Contained Center + pull-quote editorial | Constraints: Texto Revelar por marca de aspas (Tipografia), highlight com border-top brasa (Layout)
- Preservar como está. Única adição: envolver os parágrafos com `data-reveal` (stagger natural pela ordem do observer).

---

## Seção 02: O QUE VOCÊ VAI LEVAR ("Não é sobre falar melhor. É sobre vender melhor.")

### Arquetipo e Constraints
- Arquetipo: **Modular** (lista vertical de módulos numerados que se repetem com variação)
- Constraints: **Texto com Stroke** nos números (Tipografia), **Hover Slide** com barra de brasa (Interação), **Stagger** no reveal (Movimento)
- Justificativa: são 6 promessas de conteúdo — lista modular numerada dá ritmo de "programa de aula" sem cair em grid de features; números stroke gigantes são a assinatura da família (mesmo tratamento do `mapa__num` do low ticket).

### Conteúdo (exato da copy)
- Eyebrow: `02` + `O que você vai levar dessa noite`
- Título: `Não é sobre falar melhor. É sobre vender melhor.`
- Intro: `Aqui não tem frase bonita nem promessa de internet. Tem bastidor real, números reais e a visão de quem entende por que alguns crescem e outros continuam travados. Bruno Bettini mostra como esse mercado funciona de verdade:`
- Itens (6):
  1. `Como vender no B2B (para empresas) e no B2C (para pessoa física), sem depender só de indicação`
  2. `Como estruturar seus próprios eventos e não ficar refém da agenda dos outros`
  3. `Como usar networking de forma estratégica, não como troca de cartão perdida`
  4. `Como precificar sua palestra pelo valor que ela entrega, não pelo que você tem coragem de cobrar`
  5. `Como construir um posicionamento forte que faz o cliente te procurar`
  6. `O segredo que quase ninguém fala: palestrante profissional não vende só palestra. Vende treinamento, mentoria, workshop, seminário, livro, produto, comunidade e recorrência`
- Fechamento (destaque): `Se você já palestra, essa noite vai mostrar onde você está perdendo dinheiro. Se ainda não começou, vai te poupar anos de erro e frustração.`

### Layout
- Section: `background: var(--bg)`, `padding: clamp(5rem,11vw,9rem) var(--pad)`
- Head: max-width `--wrap`, centrado, `text-align:center`; eyebrow centrado
- Título: Cormorant 600, `clamp(2.1rem,5vw,3.6rem)`, line-height 1.04, cor `--text`, margem-bottom 1.2rem
- Intro: Hanken, `clamp(1.05rem,1vw+0.9rem,1.25rem)`, cor `--text-2`, max-width 56ch, margem `0 auto clamp(2.5rem,5vw,3.5rem)`
- Lista: `max-width: 720px; margin: 0 auto;` sem bullets. Cada item:
  - Grid `grid-template-columns: 4.5rem 1fr`, gap `1.4rem`, align-items `baseline`
  - `padding: 1.5rem 1rem 1.5rem 0`, `border-bottom: 1px solid var(--border)` (último sem)
  - Número `01`–`06`: Cormorant 600, `clamp(2.2rem,3.5vw,3rem)`, `color: transparent`, `-webkit-text-stroke: 1.5px var(--accent)`, line-height 1
  - Texto: Hanken 500, `1.08rem`, line-height 1.5, cor `--text`; trechos-chave (`B2B`, `B2C`, `posicionamento forte`, `recorrência`) em `<b class="k">` peso 600 cor `--primary`
  - Item 06 é o "segredo": fundo `--surface`, border `1px solid rgba(237,125,43,0.35)`, border-radius `1.25rem`, padding `1.5rem`, box-shadow `0 12px 40px rgba(0,0,0,0.05)` — quebra o padrão dos 5 anteriores de propósito
- Fechamento: Cormorant 600 itálico, `clamp(1.3rem,2vw,1.6rem)`, cor `--primary`, `text-align:center`, `max-width: 34ch`, `margin: clamp(2.5rem,5vw,3.5rem) auto 0`, `padding-top: 1.4rem`, `border-top: 2px solid var(--accent)` (display:inline-block)

### Animações
- Head: `data-reveal` (700ms `--ease-out`)
- Itens: stagger — cada item `data-reveal` com `transition-delay: calc(var(--i) * 70ms)` (definir `--i` 0–5 inline)
- Números stroke: quando `.is-in`, animar `stroke` não é possível em text-stroke → em vez disso, opacity 0→1 + translateX(-8px)→0, 600ms, mesmo delay do item

### Interatividade
- Hover no item (desktop): fundo `rgba(237,125,43,0.04)`; pseudo `::before` barra vertical 3px brasa à esquerda, `scaleY(0)→scaleY(1)` transform-origin top, 350ms `--ease-out`; número ganha `-webkit-text-stroke-color: var(--brasa-600)` e `translateX(4px)` 300ms
- Item 06 hover: `translateY(-4px)` + shadow `0 20px 50px rgba(20,20,23,0.10)`, 400ms `--ease-out`

### Responsividade
- ≤540px: grid do item `3rem 1fr`, gap 1rem, número `1.8rem`, texto `1rem`

---

## Seção 03: PROGRAMAÇÃO — TIMELINE DA NOITE (DARK)

### Arquetipo e Constraints
- Arquetipo: **Scroll Storytelling** (a noite se desenrola conforme o scroll)
- Constraints: **Timeline** (Estruturas Especiais), **Scroll Progress / View Timeline** na linha condutora (Movimento), **Dark Mode + xadrez de marca** (Cor), **Sticky Element** no título (Layout)
- Justificativa: uma programação de 18h45→22h É uma linha do tempo; a linha de brasa que se preenche com o scroll transforma leitura em antecipação do evento. É o momento "wow" central da página.

### Conteúdo (exato da copy)
- Eyebrow: `03` + `Programação`
- Título: `Três horas de mapa, prática e conexão`
- Intro: `Uma programação pensada pra você sair com clareza e com contatos que valem a pena.`
- 7 blocos (horário / título / descrição):
  1. `18h45 às 19h15` — `Credenciamento e Coffee` — `Recepção, ambientação e as primeiras conexões da noite.`
  2. `19h15 às 19h30` — `Abertura Oficial` — `Boas-vindas e a proposta do encontro.`
  3. `19h30 às 20h05` — `O Mapa Real do Mercado de Palestras` — `Como o mercado realmente funciona: sazonalidades, riscos, oportunidades e por que tantos palestrantes continuam perdidos.`
  4. `20h05 às 20h35` — `B2B, B2C e Venda de Palestras na Prática` — `Como vender para empresas, profissionais e eventos sem depender apenas de indicação.`
  5. `20h35 às 21h05` — `Subindo a Régua do Mercado` — `Os erros que o palestrante não pode mais cometer se quer ser percebido com mais profissionalismo, valor e autoridade.`
  6. `21h05 às 21h30` — `Do Palco ao Faturamento` — `Funil de vendas, produtos, posicionamento e estrutura pra transformar palestra em negócio.`
  7. `21h30 às 22h00` — `Direcionamentos Finais e Networking` — `Perguntas, conexões qualificadas, troca entre participantes e os próximos caminhos pra evoluir no mercado.`

### Layout
- Section: `background: radial-gradient(80% 70% at 50% 0%, #26262C, var(--grafite-950) 75%)`; xadrez de marca via `::before` (specs globais, opacity 0.04, mask radial `70% 60% at 50% 20%`); `padding: clamp(5rem,11vw,9rem) var(--pad)`
- Head: max-width `--wrap`, centrado; título Cormorant 600 `clamp(2.1rem,5vw,3.6rem)` cor `--on-dark`; intro `--on-dark-2` max-width 46ch centrada
- Timeline: container `max-width: 680px; margin: clamp(3rem,6vw,4.5rem) auto 0; position: relative;`
  - Trilho: `::before` absoluto, `left: 6.2rem` (desktop), `top:0; bottom:0; width:2px; background: rgba(255,255,255,0.10)`
  - Trilho de progresso: elemento `.tl__fill` absoluto sobre o trilho, `width:2px`, `background: linear-gradient(to bottom, var(--brasa-400), var(--brasa-600))`, `transform-origin: top`, `scaleY` 0→1 conforme progresso do scroll da seção (JS rAF; ou `animation-timeline: view()` com `animation-range: entry 20% exit 80%` + fallback)
  - Item: grid `grid-template-columns: 5rem 2.4rem 1fr`, gap `0 1rem`, `padding: 1.4rem 0`
    - Col 1 — horário: Jost 600 `0.78rem` ls 0.08em, cor `--brasa-400`, text-align right, `white-space:nowrap`, apenas hora inicial em destaque (`18h45`) e final em `0.68rem` cor `--grafite-400` na linha de baixo (`às 19h15`)
    - Col 2 — nó: círculo 14px, `border: 2px solid var(--brasa-500)`, `background: var(--grafite-950)`, centralizado no trilho; quando `.is-in`: preenche `background: var(--brasa-500)` + `box-shadow: 0 0 16px rgba(237,125,43,0.55)`, 400ms. Itens 1 e 7 (coffee/networking) ganham nó em losango (rotate 45deg) — marca os momentos sociais
    - Col 3 — conteúdo: título Cormorant 600 `clamp(1.35rem,2.2vw,1.7rem)` cor `--on-dark`, line-height 1.15; descrição Hanken `0.95rem` cor `--on-dark-2` line-height 1.5, margin-top 0.3rem
- Selo de fechamento sob a timeline: pill Jost 0.7rem uppercase ls 0.18em, `border:1px solid rgba(255,255,255,0.14)`, padding `0.5rem 1.1rem`, radius 999px, cor `--nevoa`, centrado: `19h às 22h · Auditório Ademicon, Belvedere`

### Animações
- Cada item: `data-reveal` fade-up 600ms delay `calc(var(--i)*80ms)`
- `.tl__fill` scaleY vinculado ao progresso (ver script.js #5)
- Nó pulsa uma única vez ao entrar (`keyframe: box-shadow 0 0 0 0 → 0 0 0 10px transparent`, 900ms)

### Interatividade
- Hover no item: título desliza `translateX(4px)` 300ms `--ease-out`; nó `scale(1.25)` 300ms `--ease-spring`

### Responsividade
- ≤640px: grid `3.6rem 1.8rem 1fr`; trilho em `left: 4.4rem`; horário quebra em duas linhas (`0.72rem` / `0.62rem`); título `1.25rem`

---

## Seção 04: COMO VAI FUNCIONAR (3 pilares — claro)

### Arquetipo e Constraints
- Arquetipo: **Overlapping Grid** (cards escalonados que transbordam a grade — NUNCA 3 lado a lado alinhados)
- Constraints: **Overlap Elements + Negative Margin** (Layout), **Rotated Container sutil** (Layout aplicado como detalhe: cada card com rotate alternado), **Hover Lift** (Interação)
- Justificativa: 3 pilares pedem diferenciação sem grid genérico; o escalonamento diagonal com leves rotações lembra cartões de evento sobre uma mesa — material, tátil, presencial.

### Conteúdo (exato da copy)
- Eyebrow: `04` + `Como vai funcionar`
- Título: `Conteúdo, prática e networking na mesma noite`
- Cards:
  1. Tag `Palestra envolvente` — `Com Bruno Bettini, fundador do banco de palestrantes Avantik Palestras. Práticas essenciais, dados oficiais do mercado e visão estratégica pra quem quer se destacar.`
  2. Tag `Atividades práticas` — `Simulações de situações reais do mercado, pra te preparar pros desafios e oportunidades que você vai encontrar de verdade.`
  3. Tag `Networking produtivo` — `Coffee break e um momento dedicado à troca de cartões. O tipo de conexão que vira parceria.`

### Layout
- Section: `background: var(--bg)`, `padding: clamp(5rem,11vw,9rem) var(--pad)`
- Head centrado (mesmo padrão global)
- Container dos cards: `max-width: 880px; margin: clamp(3rem,6vw,4rem) auto 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;` com cards se sobrepondo:
  - Card base: `background: var(--surface); border: 1px solid var(--border); border-radius: 1.25rem; padding: clamp(1.8rem,3vw,2.4rem); box-shadow: 0 16px 44px rgba(20,20,23,0.08); min-height: 300px; display:flex; flex-direction:column; gap: 0.9rem;`
  - Card 1: `transform: rotate(-2deg) translateY(18px); z-index:1; margin-right:-14px;`
  - Card 2 (central, protagonista): `transform: rotate(0.5deg) translateY(-14px); z-index:3; border-color: rgba(237,125,43,0.45); box-shadow: 0 24px 60px rgba(20,20,23,0.14), 0 0 40px rgba(237,125,43,0.10);`
  - Card 3: `transform: rotate(2deg) translateY(24px); z-index:2; margin-left:-14px;`
  - Número do card: Cormorant 600 `1.1rem` cor `--accent-hover` (`01`/`02`/`03`)
  - Tag: Jost 600 `0.68rem` uppercase ls 0.16em cor `--primary`
  - Título do card: Cormorant 600 `clamp(1.5rem,2.2vw,1.9rem)` cor `--text` (usar a tag como título; sem título duplicado)
  - Texto: Hanken `0.98rem` cor `--text-2` line-height 1.55

### Animações
- Cards entram com `data-reveal` + delays 0ms/120ms/240ms, partindo de `translateY(40px) rotate(0)` até pose final (rotação incluída na transição — transition em `transform` 800ms `--ease-out`)

### Interatividade
- Hover: card sobe `translateY(pose - 10px)` mantendo rotação, shadow amplia p/ `0 28px 70px rgba(20,20,23,0.16)`, 400ms `--ease-spring`; card central também acende glow `0 0 60px rgba(237,125,43,0.16)`

### Responsividade
- ≤840px: coluna única `max-width: 480px`; rotações reduzidas à metade; translateY zerado; gap 1.25rem; margens negativas removidas

---

## Seção 05: QUEM CONDUZ — BRUNO BETTINI (DARK)

### Arquetipo e Constraints
- Arquetipo: **Split Assimétrico** (foto 40 / conteúdo 60) — no modo centralizado vira foto acima + conteúdo, mas em ≥880px manter split real (é a única seção com split; quebra bem o ritmo de coluna única)
- Constraints: **Nested Frames** (moldura brasa deslocada atrás da foto — assinatura da bio do low ticket), **Dark Mode + xadrez** (Cor), **Hover Lift nos chips** (Interação)
- Justificativa: consistência de família — a bio do low ticket usa exatamente esse tratamento; repetir aqui constrói reconhecimento do Bruno como marca.

### Conteúdo (exato da copy)
- Eyebrow: `05` + `Quem conduz`
- Nome: `Bruno Bettini`
- Parágrafos:
  1. `Fundador da Avantik Palestras, o banco de palestrantes. Bruno vive desse mercado e forma palestrantes que vivem dele.`
  2. `Já participou de licitações milionárias, ganhou editais de órgãos públicos e conhece por dentro como o dinheiro circula em cada canto: empresa privada, sistema S, CDL, conselhos, secretarias, congressos e bancos de palestrantes.` (destacar `licitações milionárias` e `editais` com `.hl` brasa)
  3. `Não trabalha com promessa de fim de semana. Trabalha com construção. E é isso que ele traz pro palco nessa noite.` (destacar `construção`)
- Chips: `Licitações milionárias` · `Editais públicos ganhos` · `Sistema S` · `CDL e CACB` · `Conselhos (CREA, CRM)` · `Grandes congressos`

### Layout
- Section dark: mesmo fundo/xadrez da Seção 03; `padding: clamp(5rem,11vw,9rem) var(--pad)`
- Inner: `max-width: var(--maxw)`, grid `minmax(0,0.9fr) minmax(0,1.1fr)`, gap `clamp(2.5rem,6vw,5rem)`, align center
- Foto: `figure` `width:min(360px,80vw); aspect-ratio:4/5; position:relative; margin:0 auto;`
  - Moldura: `::before`-like span absoluto inset 0, `transform: translate(16px,16px)`, `border:1px solid rgba(237,125,43,0.6)`, radius 1.5rem
  - Imagem: `assets/bruno.jpg` (copiar de `pagina-vendas/assets/bruno.jpg`), `object-fit: cover`, radius 1.5rem
- Nome: Cormorant 600 `clamp(2.6rem,6vw,4.5rem)` cor `--on-dark`
- Texto: Hanken `clamp(1.02rem,1vw+0.85rem,1.18rem)` cor `--on-dark-2` max-width 50ch
- Chips: Jost 600 `0.8rem`, cor `--on-dark`, `background: rgba(255,255,255,0.06)`, `border:1px solid rgba(255,255,255,0.14)`, radius 999px, padding `0.42rem 0.9rem`

### Animações
- Foto: `data-reveal` fade-right (translateX(-24px)→0) 800ms; moldura chega 150ms depois (delay via transition-delay)
- Parágrafos e chips: `data-reveal` stagger 80ms

### Interatividade
- Chips hover: `translateY(-2px)` + `border-color: var(--accent)`, 300ms
- Foto hover (desktop): moldura desliza para `translate(10px,10px)` 400ms `--ease-out` (aperta o frame)

### Responsividade
- ≤880px: coluna única, foto `max-width:340px` centrada, conteúdo centrado, chips centrados; moldura `translate(8px,8px)`

---

## Seção 06: PARA QUEM É (bento — claro)

### Arquetipo e Constraints
- Arquetipo: **Bento Box** (célula-destaque grafite + células regulares + faixa-corte brasa)
- Constraints: **Color Blocking** (Cor: célula grafite + faixa brasa em fundo marfim), **Hover Fill/underline animado** (Interação), **Stagger** (Movimento)
- Justificativa: mesma estrutura da seção "Para quem é" do low ticket — reconhecimento de família; o bento centralizado vira pilha de cartões com a célula-corte como pancada final de qualificação.

### Conteúdo (exato da copy)
- Eyebrow: `06` + `Para quem é`
- Título: `Esse é o seu lugar se você...`
- Células:
  1. (destaque, grafite) `Já é palestrante e quer descobrir exatamente onde está perdendo dinheiro`
  2. `Nunca deu uma palestra, mas sabe que tem conhecimento pra ensinar e quer começar certo`
  3. `É mentor, consultor, empresário, gestor ou especialista, e sente que seu conhecimento vale mais do que está valendo hoje`
  4. `Está cansado de depender de indicação e quer estrutura comercial de verdade`
  5. `Quer transformar autoridade em agenda, contratos e faturamento`
  6. (célula-corte, fundo brasa `--accent`) `Se o seu conhecimento está parado, essa noite existe pra tirá-lo do lugar.`

### Layout
- Section: `background: var(--bg)`, padding padrão
- Head centrado, título Cormorant 600 `clamp(2rem,5vw,3.4rem)`
- Bento: `grid-template-columns: 1fr; max-width: 680px; margin: 0 auto; gap: 1rem;` (modo centralizado)
  - Célula: `background: var(--surface); border:1px solid var(--border); border-radius:1.25rem; padding: clamp(1.6rem,3vw,2.2rem); text-align:center;`
  - Índice: Cormorant 600 `1.1rem` cor `--accent-hover`, display block, margin-bottom 0.6rem
  - Texto: Hanken 500 `1.15rem` line-height 1.35 cor `--text`; `<b>` cor `--primary`
  - Célula 1 (destaque): `background: var(--grafite-900); color: var(--on-dark);` texto em Cormorant 600 `clamp(1.4rem,2vw,1.9rem)`; índice cor `--accent`; `<b>` cor `--accent`
  - Célula 6 (corte): `background: var(--accent);` texto Cormorant 600 `clamp(1.5rem,2.6vw,2.2rem)` cor `--grafite-950`
  - Underline animado: `::after` barra 2px brasa, `left:50%; transform:translateX(-50%); width:0 → 2.4rem` no hover, 400ms

### Animações
- Células `data-reveal` stagger 70ms

### Interatividade
- Hover (não-corte): `translateY(-6px)` + shadow `0 20px 50px rgba(20,20,23,0.12)` + border `rgba(237,125,43,0.5)`, 400ms
- Célula-corte hover: `scale(1.01)`

### Responsividade
- Já é coluna única; ≤540px padding das células `1.4rem`

---

## Seção 07: A OFERTA / LOTES (DARK spotlight — coração de conversão)

### Arquetipo e Constraints
- Arquetipo: **Spotlight** (card central iluminado, tudo ao redor escuro)
- Constraints: **Glassmorphism** (Efeitos — card de vidro como o do Hero e da oferta do low ticket), **Particle System** (Mídia — canvas de brasas sutis, reutilizar o padrão `oferta__particles` do low ticket), **Pulse Loop** no lote ativo (Movimento), **Timeline horizontal de lotes** (Estrutura — escada de preço como réguas, NÃO pricing table)
- Justificativa: é a decisão de compra; o spotlight concentra; a escada de lotes visual (encerrado → ATIVO → futuros) transforma a subida de preço em urgência visível em vez de tabela.

### Conteúdo (exato da copy)
- Eyebrow: `07` + `A oferta`
- Título: `Garanta sua vaga antes do preço subir`
- Texto: `O ingresso dá acesso à noite completa: palestra, atividades práticas, coffee break e networking com outros palestrantes. Os lotes sobem conforme as vagas se esgotam, e o espaço é presencial e limitado.`
- Escada de lotes:
  - `1º Lote · Saia na Frente` — `R$ 97` — estado ENCERRADO
  - `2º Lote · Não Fique de Fora` — `R$ 127` — estado ATIVO — `inscrições até 08/07/2026`
  - `3º Lote · Corre que Ainda Dá Tempo` — `R$ 147` — estado FUTURO
  - `4º Lote · Última Chance` — `R$ 177` — estado FUTURO
- Ancoragem: `Uma única palestra que você deixou de vender por falta de estrutura vale muitas vezes o preço dessa noite. R$ 127, em até 12x, pra entender de uma vez como esse mercado funciona.`
- CTA: `QUERO MINHA VAGA - 2º LOTE R$ 127`
- Microcopy: `Parcele em até 12x. Compra segura via Sympla. Vagas limitadas ao espaço presencial.`

### Layout
- Section: `min-height:100svh; display:flex; align-items:center; justify-content:center;` fundo `radial-gradient(80% 80% at 50% 30%, var(--dark-2), var(--dark-3) 75%)`; canvas de partículas absoluto inset 0 opacity 0.7 (brasas: pontos 1–2px cor rgba(237,125,43,α) subindo lentamente, ~40 partículas, rAF, pausar com `document.hidden`)
- Card: `max-width: 640px; width:100%;` vidro: `background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02)); backdrop-filter: blur(18px); border:1px solid rgba(255,255,255,0.10); border-radius:1.75rem; padding: clamp(2.4rem,5vw,3.6rem) clamp(1.8rem,5vw,3.4rem); text-align:center;` fio de brasa no topo (`::after` 2px, mesmo do Hero); shadow `0 30px 80px rgba(0,0,0,0.45), 0 0 60px rgba(237,125,43,0.10)`
- Título: Cormorant 600 `clamp(2.2rem,5vw,3.2rem)` cor `--on-dark`
- Texto: Hanken `1.02rem` cor `--on-dark-2` max-width 44ch centrado
- **Escada de lotes** (elemento novo, o diferencial da página): lista horizontal `display:grid; grid-template-columns: repeat(4,1fr); gap:0.6rem; margin: clamp(1.8rem,4vw,2.4rem) 0; padding: 1.6rem 0; border-top/bottom: 1px solid rgba(255,255,255,0.10);`
  - Degrau: coluna; barra superior de altura crescente (`height: 22px/30px/38px/46px`) `border-radius: 4px 4px 0 0`
  - Encerrado (1º): barra `rgba(255,255,255,0.08)`; textos riscados `text-decoration: line-through` cor `--grafite-500`; label `ENCERRADO` Jost 0.56rem ls 0.14em
  - ATIVO (2º): barra `var(--brasa-grad)` com `box-shadow: 0 0 20px rgba(237,125,43,0.45)`; preço Cormorant 600 `1.5rem` cor `--brasa-400`; badge `VOCÊ ESTÁ AQUI` Jost 600 0.56rem uppercase ls 0.12em cor `--grafite-950` fundo `--brasa-400` radius 999px padding `0.2rem 0.55rem`; animação `pulse` no glow da barra (2.4s infinite: shadow 0.45→0.15→0.45)
  - Futuros (3º/4º): barra `rgba(255,255,255,0.14)` com borda dashed `1px rgba(255,255,255,0.2)`; preço cor `--nevoa`; label `EM BREVE` cor `--grafite-400`
  - Nome do lote: Jost 500 `0.6rem` uppercase ls 0.1em; preço abaixo da barra
- Preço hero (abaixo da escada): tag `2º LOTE · INSCRIÇÕES ATÉ 08/07` Jost 600 0.66rem ls 0.2em cor `--brasa-400`; valor `R$ 127` Cormorant 600 `clamp(3.6rem,8vw,4.8rem)` cor `--brasa-500`; cond `em até 12x` Jost 0.9rem cor `--nevoa`
- CTA: `.btn--primary .btn--lg` width 100% max-width 420px → link Sympla
- Reassure: Jost 0.78rem cor `--grafite-400` com selo (ícone escudo SVG 16px inline, mesmo path do low ticket) `Compra segura via Sympla` · `Parcele em até 12x` · `Vagas limitadas`
- Ancoragem: Cormorant itálico `1.15rem` cor `--on-dark-2`, border-top `1px solid rgba(255,255,255,0.10)`, padding-top 1.4rem, max-width 420px

### Animações
- Card: `data-reveal` scale(0.97)→1 + fade 800ms
- Degraus: stagger 90ms fade-up; glow do ativo pulsa loop
- Mouse-spotlight no card (desktop): `::before` radial 320px seguindo `--mx/--my` (mesmo padrão do low ticket), opacity 0→1 no hover

### Interatividade
- Hover CTA: padrão global do botão
- Hover degrau futuro: tooltip-title nativo com data de abertura (`title="Inscrições até 08/07/2026"`)

### Responsividade
- ≤540px: escada mantém 4 colunas (barras finas), nomes dos lotes ocultos (`display:none`), só preço + estado; card padding `1.8rem 1.4rem`

---

## Seção 08: INFORMAÇÕES PRÁTICAS (bilhete — claro)

### Arquetipo e Constraints
- Arquetipo: **Framed Content** (conteúdo enquadrado como um ingresso físico)
- Constraints: **Clip-path Section** aplicado como recortes de bilhete (Layout: círculos nas laterais via radial-gradient masks), **Duocromático marfim/grafite com um toque brasa** (Cor)
- Justificativa: informações práticas de evento presencial pedem formato de INGRESSO — memorável, escaneável, e diferente de qualquer lista.

### Conteúdo (exato da copy)
- Eyebrow: `08` + `Informações práticas`
- Linhas do bilhete:
  - `Data e horário` → `08 de julho de 2026 (terça-feira). Credenciamento a partir das 18h45. Evento das 19h às 22h.`
  - `Local` → `Auditório Ademicon — Av. José Maria Alckmin, 952, Belvedere, Belo Horizonte - MG.`
  - `Vestimenta` → `Sem preocupação. A maioria vem direto do trabalho.`
  - `Pagamento` → `Parcele em até 12x. Dados criptografados e compra segura pela Sympla.`

### Layout
- Section: `background: var(--bg)`, padding `clamp(4rem,9vw,7rem) var(--pad)`
- Bilhete: `max-width: 720px; margin:0 auto; background: var(--surface); border:1px solid var(--border); border-radius: 1.25rem; position: relative; display:grid; grid-template-columns: 1fr auto; overflow:hidden; box-shadow: 0 16px 44px rgba(20,20,23,0.07);`
  - Recortes: dois círculos de 22px "mordidos" nas bordas esquerda/direita na altura da divisa do canhoto — pseudo-elementos com `background: var(--bg); border:1px solid var(--border); border-radius:50%; position:absolute;`
  - Corpo (col 1): padding `clamp(1.8rem,3.5vw,2.6rem)`; cada linha: grid `8rem 1fr`, gap 1.2rem, padding `0.9rem 0`, border-bottom `1px dashed var(--border)` (última sem); rótulo Jost 600 `0.68rem` uppercase ls 0.16em cor `--text-muted`; valor Hanken 500 `1rem` cor `--text` line-height 1.5
  - Canhoto (col 2): `border-left: 1px dashed var(--border); padding: clamp(1.8rem,3.5vw,2.6rem) clamp(1.2rem,2.5vw,1.8rem); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem; background: var(--muted-bg);`
    - `ADMIT ONE` → usar `ENCONTRO` Jost 600 0.6rem ls 0.3em vertical (`writing-mode: vertical-rl`) cor `--text-muted`
    - `08 JUL` Cormorant 600 `2rem` cor `--primary`
    - `19H` Jost 500 0.8rem cor `--text-2`

### Animações
- Bilhete: `data-reveal` fade-up 700ms; linhas internas stagger 60ms

### Interatividade
- Hover no bilhete: `rotate(-0.4deg)` sutil 400ms `--ease-spring` (bilhete "pego na mão")
- Local clicável → link `https://maps.google.com/?q=Av.+José+Maria+Alckmin,+952,+Belvedere,+Belo+Horizonte` target blank, cor `--primary`, underline animado no hover

### Responsividade
- ≤600px: canhoto vira faixa horizontal no topo (grid 1 coluna, order -1, writing-mode normal, flex-row com gap 0.8rem); linhas internas grid `1fr` (rótulo sobre valor)

---

## Seção 09: FAQ (claro-muted)

### Arquetipo e Constraints
- Arquetipo: **Reveal on Demand** (accordion refinado — mesmo componente do low ticket, com números Cormorant e ícone +/− animado; NÃO accordion básico de biblioteca)
- Constraints: **Hover Color** (Interação), **Grid-template-rows animation** para abertura suave (Movimento)
- Justificativa: consistência de família com o FAQ do low ticket; o usuário do Bruno já conhece o padrão.

### Conteúdo (exato da copy — 7 itens)
- Eyebrow: `09` + `Perguntas frequentes` | Título: `Antes de você decidir`
1. `Já sou palestrante há anos. Faz sentido eu ir?` → `Sim. O evento traz bastidores reais do mercado e abre espaço pra novas parcerias. Palestrantes experientes costumam ser os que mais destravam o próximo nível quando revisam posicionamento e vendas.`
2. `Nunca dei uma palestra. É recomendável participar?` → `Sim. Você recebe o conteúdo essencial pra começar sua trajetória sem perder anos tateando no escuro.`
3. `Vai ter momento de networking?` → `Vai. Haverá coffee break e uma sessão dedicada à troca de cartões e conexões.`
4. `Preciso de alguma vestimenta especial?` → `Não. Fique à vontade. A maioria dos participantes vem direto do trabalho.`
5. `Posso parcelar o ingresso?` → `Sim, em até 12x pela Sympla, com compra segura.`
6. `E se eu precisar cancelar?` → `Cancelamentos de pedidos pagos são aceitos até 7 dias após a compra, desde que a solicitação seja enviada até 48 horas antes do início do evento.`
7. `Como esclareço outras dúvidas?` → `Fale com o produtor pelo botão de contato. Retornamos rápido pra te ajudar.`

### Layout / Tipografia / Interação
- Section: `background: var(--muted-bg)`, padding padrão; inner `max-width: var(--wrap)` centrado; head centrado
- Item: idêntico ao componente do low ticket — `border-top/bottom 1px solid var(--border)`; botão grid `auto 1fr auto`; número Cormorant 600 `1.4rem` cor `--accent-hover`; pergunta Hanken 600 `clamp(1.05rem,1.4vw,1.25rem)` cor `--text`; ícone +/− (2 barras 18×2px cor `--primary`, vertical rotaciona 90° e some ao abrir, 350ms `--ease-out`)
- Resposta: wrapper `grid-template-rows: 0fr → 1fr` 450ms `--ease-out`; texto Hanken `1.02rem` cor `--text-2` max-width 58ch
- Estado aberto: número e pergunta cor `--primary`
- Hover: número e pergunta → `--primary` 300ms
- Acessibilidade: `aria-expanded` no botão, resposta com `role="region"`

---

## Seção 10: CTA FINAL (DARK poster + countdown)

### Arquetipo e Constraints
- Arquetipo: **Poster** (tipografia dramática de cartaz, ghost words ao fundo)
- Constraints: **Texto com Stroke/ghost gigante** (Tipografia: palavras fantasma 11–18vw), **Counter Animation** (Movimento: COUNTDOWN real até 08/07 19h — urgência de evento presencial), **Scroll Speed** nos ghosts (parallax sutil)
- Justificativa: fechamento do low ticket usa poster+ghosts (família); aqui o countdown de evento com data real transforma o poster em relógio de pressão genuíno — urgência REAL, não fabricada.

### Conteúdo (exato da copy)
- Eyebrow: `10` + `Última chamada`
- Título (3 linhas reveladas): `Os clientes vão` / `contratar alguém.` / `A pergunta é: vai ser você?` (itálico brasa em `vai ser você?`)
- Texto 1: `A palestra de liderança vai acontecer. A de vendas vai acontecer. Todos os dias, em todo o Brasil. A única dúvida é quem vai estar no palco.`
- Texto 2: `Nessa noite, em Belo Horizonte, você começa a entender como sair do campo da ideia e entrar no campo do resultado. Não é sobre falar melhor. É sobre transformar o que você sabe em negócio.`
- Countdown label: `O encontro começa em`
- CTA: `GARANTIR MINHA VAGA AGORA - R$ 127`
- Microcopy: `08 de julho, 19h, Belvedere - BH. Em até 12x. Vagas limitadas. Bruno Bettini.`
- Ghost words: `liderança` (14vw, top 8%, left -4%), `vendas` (18vw, bottom 6%, right -2%), `negócio` (11vw, top 45%, left 30%)

### Layout
- Section: `min-height:100svh; display:flex; align-items:center;` fundo `radial-gradient(70% 90% at 50% 60%, var(--dark-2), var(--dark-3) 80%)`
- Ghosts: absolutos, Cormorant, `color: rgba(255,255,255,0.04)`, `white-space:nowrap`, parallax leve com scroll (translateY ±30px por rAF, fator 0.06/0.09/0.04)
- Inner: `max-width: var(--wrap)`, centrado, coluna flex align center
- Título: Cormorant 600 `clamp(2.6rem,9vw,6.5rem)` line-height 0.98 cor `--on-dark`; cada linha `span.reveal-line` (translateY(100%)→0, 700ms, delays 50/180/310ms quando `.is-in`)
- **Countdown**: linha de 4 blocos (`DIAS · HORAS · MIN · SEG`), `display:flex; gap: clamp(1rem,3vw,2rem); margin: clamp(1.8rem,4vw,2.4rem) 0;`
  - Número: Cormorant 600 `clamp(2.4rem,6vw,3.8rem)` cor `--brasa-400`, `font-variant-numeric: tabular-nums`
  - Rótulo: Jost 600 `0.6rem` uppercase ls 0.2em cor `--grafite-400`
  - Separador `:` Cormorant cor `rgba(255,255,255,0.18)` entre blocos
  - Tick a cada 1s; quando faltar <24h, números ficam `--brasa-500` e ganham pulse sutil; após 08/07 19h, substituir por `ACONTECENDO AGORA` Jost 600 ls 0.2em cor `--brasa-400`
- CTA `.btn--primary .btn--lg` → Sympla; microcopy Jost `0.85rem` cor `--on-dark-2` margin-top 1.2rem

### Responsividade
- ≤540px: ghost 3 oculto; countdown gap 0.8rem, números `2rem`

---

## Footer

- `background: var(--dark-3)`, padding `2.5rem var(--pad)`; flex space-between wrap
- Esquerda: `Encontro Entre Palestrantes · Apogeu do Palestrante · Bruno Bettini` Jost `0.85rem` cor `--on-dark-2`
- Direita: link `Garantir minha vaga - R$ 127` cor `--accent` Jost 600 `0.9rem`, underline animado scaleX 0→1 hover → Sympla
- Linha 2 (discreta, `0.72rem` cor `--grafite-500`): `Cancelamento até 7 dias após a compra, com solicitação até 48h antes do evento. Compra processada pela Sympla.`

---

## Checklist de implementação (/desenvolver)

1. Preservar Hero + Seção 01 exatamente como estão (apenas adicionar `data-reveal` nos parágrafos da 01)
2. Copiar `assets/bruno.jpg` de `../pagina-vendas/assets/` para `pagina-encontro/assets/`
3. Criar `script.js`: observer reveal, countdown, accordion, timeline fill, partículas da oferta, parallax ghosts
4. Todos os CTAs → link Sympla (target _blank)
5. `prefers-reduced-motion: reduce` → desligar partículas, parallax, pulses e timeline fill (mostrar linha cheia)
6. Performance: partículas só quando seção visível (IntersectionObserver) e pausadas em `document.hidden`; imagens `loading="lazy"` exceto hero
7. SEO/social: `<title>` e description já definidos; adicionar og:title/og:description/og:url
8. Sem emojis em nenhum texto
