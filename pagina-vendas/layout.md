# Layout Spec - Desvendando o Mercado de Palestras | Bruno Bettini

Especificacao exaustiva de direcao de arte para construcao da pagina completa.
Base: copy.md (aprovada) + index.html/style.css (hero + secao 01 aprovados).
Identidade alinhada a Avantik (avantikpalestras.com.br).

> REGRAS GLOBAIS NAO-NEGOCIAVEIS
> - NUNCA usar travessoes (— ou –) em nenhum texto visivel. Usar virgula, ponto, dois-pontos ou parenteses.
> - NUNCA usar separadores "·" ou "|" em microcopy. Usar ponto final.
> - Manter SEMPRE o par tipografico DM Serif Display (titulos) + DM Sans (corpo).
> - Manter SEMPRE a paleta de tokens abaixo. Dourado e a unica cor de destaque (sem magenta/rosa).
> - Toda animacao deve respeitar `@media (prefers-reduced-motion: reduce)` (desligar transform/opacity).
> - Sem emojis.

---

## SISTEMA DE DESIGN (tokens globais)

### Paleta (hex exatos)
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#FAFAF9` | fundo padrao (papel) |
| `--surface` | `#FFFFFF` | cards, paineis |
| `--muted-bg` | `#F1F5F9` | fundo de dobra alternada |
| `--text` | `#1A1A2E` | texto principal / titulos |
| `--text-2` | `#64748B` | texto de corpo secundario |
| `--text-muted` | `#94A3B8` | labels, legendas |
| `--primary` | `#2E2B5F` | roxo-marinho, destaque serio |
| `--primary-light` | `#4340A0` | hover/realce roxo |
| `--accent` | `#E8B931` | dourado, CTA e detalhes |
| `--accent-hover` | `#D4A522` | dourado escuro (texto sobre claro) |
| `--accent-soft` | `rgba(232,185,49,0.10)` | preenchimento suave |
| `--border` | `#E2E8F0` | linhas e bordas |
| `--dark` | `#1C1C1E` | texto sobre dourado / fundo escuro base |
| `--dark-2` | `#211F3D` | variacao escura roxa (dobras dark) |
| `--on-dark` | `#F5F5F5` | texto sobre fundo escuro |
| `--on-dark-2` | `#A0A8B5` | texto secundario sobre escuro |

### Tipografia
- Heading: `"DM Serif Display", Georgia, serif` (peso unico 400; italico disponivel).
- Body: `"DM Sans", system-ui, sans-serif` (400, 500, 600, 700).
- Import (ja no head): `DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1`.

### Escala tipografica de referencia
| Papel | clamp(min, fluido, max) | line-height | letter-spacing |
|---|---|---|---|
| Display hero | `clamp(3.2rem, 10vw, 8rem)` | 0.92 | -0.025em |
| H2 secao | `clamp(2.1rem, 5vw, 3.7rem)` | 1.05 | -0.02em |
| H3 / pull-quote | `clamp(1.6rem, 3vw, 2.4rem)` | 1.15 | -0.015em |
| Lead/sub | `clamp(1.05rem, 1rem + 0.4vw, 1.3rem)` | 1.5 | 0 |
| Corpo | `clamp(1rem, 0.95rem + 0.3vw, 1.0625rem)` | 1.6 | 0 |
| Label/kicker | `0.7rem` | 1.3 | 0.18em a 0.22em, uppercase |
| Numero gigante | `clamp(2.9rem, 5vw, 4rem)` | 1 | -0.025em |

### Espacamento e grid
- Container: `max-width: 1200px`, padding lateral `--pad: clamp(1.25rem, 5vw, 2rem)`.
- Padding vertical de dobra padrao: `clamp(5rem, 11vw, 9rem)`.
- Dobras "respiro premium": `min-height` entre `88svh` e `100svh` quando o conteudo permitir.
- Raio: botoes `0.625rem`; cards `1.25rem`; pills `100px`; selos `0.6rem`.

### Easing e timing
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` (entradas/reveal).
- `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` (hover de botoes).
- Reveal padrao: `opacity 0 -> 1` + `translateY(18px -> 0)`, `700ms var(--ease-out)`, stagger de 80ms a 120ms entre irmaos.
- Trigger de scroll: IntersectionObserver a `20%` de entrada do elemento (rootMargin `0px 0px -15% 0px`), dispara uma unica vez (`unobserve` apos revelar).

### Sombras
- Card padrao: `0 12px 40px rgba(0,0,0,0.05)`.
- Card elevado (hover): `0 20px 50px rgba(46,43,95,0.12)`.
- CTA dourado: `0 12px 32px rgba(232,185,49,0.35)`; hover `0 16px 40px rgba(232,185,49,0.45)`.
- Glow dourado (dobras dark): `0 0 60px rgba(232,185,49,0.25)`.

### Breakpoints
- Desktop: `> 880px` (layouts multi-coluna completos).
- Tablet/stack: `<= 880px` (colunas empilham, sticky vira estatico, scroll-cue some).
- Mobile: `<= 540px` (CTAs full-width, badges reduzem, numeros reflow).

### Botoes (componente base, ja definido)
- `.btn`: inline-flex, center, `font-weight 600`, `font-size 0.95rem`, `border-radius 0.625rem`, transicao `transform .4s var(--ease-spring), box-shadow .4s var(--ease-out), background-color .3s, color .3s`.
- `.btn--primary`: bg `--accent`, cor `--dark`, padding `0.95rem 1.6rem`, sombra CTA. Hover: `translateY(-3px)` + sombra hover + bg `--accent-hover`.
- `.btn--ghost`: cor `--primary`, sublinhado animado (scaleX 0.35 -> 1) em `--primary`, 2px, hover revela 100%.
- Focus-visible (todos): `outline: 2px solid var(--primary); outline-offset: 3px`.

### Elementos decorativos recorrentes
- Brilhos radiais de fundo: dourado `radial-gradient(circle, rgba(232,185,49,0.16), transparent 62%)` e roxo `rgba(46,43,95,0.08)`, posicionados fora da viewport (cantos), `z-index: -1`, `pointer-events: none`.
- Traco dourado de label: `width 1.6rem; height 2px; background var(--accent)` antes de kickers.
- Numeracao de secao em serif dourado (`--accent-hover`).

---

# MAPA DE ARQUETIPOS POR SECAO (visao geral, variedade garantida)

| # | Secao | Arquetipo | Fundo | Constraints-chave |
|---|---|---|---|---|
| 0 | Hero | Hero Dominante + Editorial | claro | Mixed Fonts, Asymmetric Padding, Selective Color, Stagger (sem trustbar) |
| 1 | A Pergunta | Split Revelador (sticky) | muted | Sticky Element, Editorial, Clip/Reveal |
| 2 | O Problema Real | Split Assimetrico | DARK | Dark Mode, Counter index, Color Blocking |
| 3 | O Que Vai Descobrir (o mapa) | Scroll Horizontal (pin) | claro | Scroll Horizontal, Counter, Hover Lift |
| 4 | Site vs Instagram | Before/After (comparacao) | muted | Split com Overlap, Mouse Tilt, Selective Color |
| 5 | Quem Sou Eu | Layered + Framed Content | DARK | Imagem Duotone, Parallax, Framed |
| 6 | Para Quem E | Bento Box | claro | Bento Grid, Color Blocking, Hover Reveal |
| 7 | A Oferta | Spotlight (contido) | DARK + glow | Gradiente, Light/Glow, Scale hover |
| 8 | Garantia | Isolated Element | claro | White Space Hero, Draw SVG, Float Loop |
| 9 | FAQ | Reveal on Demand | muted | Reveal on Demand, Editorial, Clip Reveal |
| 10 | CTA Final | Type Hero / Poster | DARK | Headline Full Width, Mouse Parallax, Text Reveal |

Regra cumprida: nenhum arquetipo se repete em secoes consecutivas; alternancia ritmica de fundo claro/muted/dark cria dobras nitidas.

---

## Secao 0: HERO  (ja implementado, documentado como referencia)

### Arquetipo e Constraints
- Arquetipo: Hero Dominante + Editorial (sidebar dataline assimetrica).
- Constraints: Mixed Fonts (Tipografia), Asymmetric Padding + Off-Grid sidebar (Layout), Selective Color (Cor), Stagger reveal pos-load (Movimento), Hover Lift (Interacao).
- Justificativa: estabelece autoridade editorial e ja entrega prova (numeros) e oferta acima da dobra.

### Conteudo (exato)
- Badge: ponto pulsante + "Bruno Bettini" + separador + "Para palestrantes que querem parar de patinar".
- H1 (3 linhas): "Desvendando" / "o *Mercado*" / "de Palestras" (palavra "Mercado" em italico roxo com sublinhado dourado).
- Sub: "O mapa completo e o passo a passo de onde esta o dinheiro do mercado de palestras no Brasil, e por que a maioria dos palestrantes nunca chega perto dele."
- Oferta: selo "Oferta de lancamento" + "de R$ 197" (riscado) + "R$ 47" + "a vista, acesso imediato".
- CTA primario: "Quero desvendar o mercado agora". CTA ghost: "Ver o que tem dentro".
- Microcopy: "Condicao de lancamento por tempo limitado. 7 dias de garantia."
- Sidebar: label "O que poucos enxergam"; stats "22 mi / CNPJs ativos no Brasil", "1,1 mi / medias e grandes empresas com orcamento pra te contratar", "13,5% / do PIB em despesas do Estado, onde palestrantes vendem todo dia"; rodape "Bruno Bettini, mercado de palestras".

### Layout
- `min-height: 100svh`, flex center. Grid `minmax(0,1.65fr) minmax(0,1fr)`, gap `clamp(2rem,5vw,5rem)`, align-items end.
- Sidebar = card branco, borda, raio 1.25rem, sombra padrao. Scroll-cue centralizado no rodape.

### Tipografia / Cores / Animacoes / Interatividade / Responsividade
- Conforme `style.css` atual (display 8rem max; reveal data-delay 1..7; badge dot pulse; scroll-cue rail). NAO alterar sem aprovacao.

---

## Secao 1: A PERGUNTA QUE MAIS RECEBO  (ja implementado, referencia)

### Arquetipo e Constraints
- Arquetipo: Split Revelador com coluna esquerda STICKY (editorial de revista).
- Constraints: Sticky Element (Layout), Mixed Fonts (Tipografia), Clip/Stagger Reveal (Movimento).
- Justificativa: a pergunta-objeção fica ancorada enquanto a resposta do Bruno se desenrola, criando tensao narrativa.

### Conteudo (exato)
- Marca de secao: "01" + "A pergunta que mais recebo".
- Pull-quote: "Bruno, quanto tempo eu *demoro* pra virar nesse jogo?"
- Corpo (ordem): "Tem gente na internet prometendo que voce faz um curso no fim de semana e sai vendendo palestra de R$ 5.000. Outros prometem R$ 20.000." / **"Eu nao vou te vender milagre."** / "Estou no consultorio com palestrante todo dia, na mentoria, no dia a dia. Rarissimos viram por conta de um curso de fim de semana. Para ser sincero: eu nao conheco nenhum." / "A verdade e que esse e um mercado de bilhoes, mas nao e um mercado simples, facil ou de fim de semana. E um mercado de construcao." / "Quem entende o jogo entra. Quem nao entende fica patinando em palestra de R$ 900, R$ 1.000, R$ 2.000 a vida inteira." / highlight: "Este material e o primeiro passo pra voce enxergar o jogo inteiro."

### Layout / Tipografia / Cores / Animacoes / Responsividade
- Conforme `style.css` atual: fundo `--muted-bg`, grid `1.05fr 0.95fr`, head sticky `top: clamp(2rem,8vh,6rem)`, pull-quote `clamp(2.1rem,4.6vw,3.7rem)`, corpo `max-width 46ch`, highlight serif com borda-top dourada 2px. Mobile: empilha, head estatico.

---

## Secao 2: O PROBLEMA REAL  (Nao falta mercado. Falta clareza.)

### Arquetipo e Constraints
- Arquetipo: Split Assimetrico (40/60), primeira dobra ESCURA da pagina.
- Constraints: Dark Mode (Cor), Counter/Index numerado com Stagger (Movimento), Color Blocking (Cor) com borda dourada (Layout).
- Justificativa: inverter para fundo escuro marca uma virada dramatica ("o problema e voce"), e os 5 sinais ganham peso como diagnostico numerado, sem virar lista de checkmarks.

### Conteudo (exato)
- Eyebrow: "02 / O problema real".
- Titulo (H2): "Nao falta mercado. Falta clareza."
- Lead (2 paragrafos): "Tira da sua mente que o povo nao esta contratando. Eles estao contratando todos os dias." / "O mercado e mais abundante do que escasso. O problema nao e o mercado estar ruim. O problema e voce nao saber onde ele esta, e nao estar se expondo a ele."
- Lista "Sinais de quem esta patinando" (numerada 01 a 05):
  1. "Voce prospecta empresa pequena, que nao tem orcamento pro seu cache"
  2. "Voce reclama do algoritmo, mas nao tem nem uma pagina de vendas pronta caso viralize"
  3. "Voce acha que palestrante 'vende palestra', e por isso perde mentoria, consultoria, treinamento e in company"
  4. "Voce tem a ideia, mas nunca executou: nunca ligou, nunca se cadastrou, nunca mandou o portfolio de novo"
  5. "Voce acha seu material bom porque VOCE gosta dele, nao porque o cliente aprovou"
- Frase de virada (destaque final): "Voce nao esta no campo do resultado. Voce esta parado no campo da ideia. Este material te tira de la."

### Layout (estrutura HTML conceitual)
- `<section class="problema section--dark">` > `.problema__inner` (container 1200, padding `clamp(5rem,11vw,9rem) var(--pad)`).
- Grid desktop: `grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr)`, gap `clamp(2.5rem,6vw,6rem)`, align-items start.
  - Coluna esquerda (`.problema__intro`, sticky `top: clamp(2rem,10vh,7rem)`): eyebrow, H2, lead, frase de virada.
  - Coluna direita (`.problema__signals`): `<ol>` com 5 `<li class="signal">`.
- Cada `.signal`: grid `auto 1fr`, gap `1.2rem`, padding-block `1.4rem`, separadas por `border-bottom: 1px solid rgba(255,255,255,0.10)` (ultimo sem borda).
  - `.signal__num`: serif, dourado, `font-size: clamp(1.6rem, 2.4vw, 2.2rem)`, largura fixa `2.4rem`.
  - `.signal__text`: DM Sans 500, `--on-dark`.

### Tipografia
- Eyebrow: DM Sans 600, `0.72rem`, uppercase, `letter-spacing 0.22em`, cor `--on-dark-2`; "02" em `--accent`.
- H2: DM Serif Display, `clamp(2.1rem, 5vw, 3.6rem)`, line-height 1.04, cor `--on-dark`, `max-width 14ch`.
- Lead: DM Sans 400, `clamp(1.05rem,1.1vw+1rem,1.25rem)`, line-height 1.55, cor `--on-dark-2`.
- Frase de virada: DM Serif Display, `clamp(1.3rem,2vw,1.7rem)`, cor `--on-dark`, com palavra "campo do resultado" e "campo da ideia" em `--accent`. Borda-top `2px solid var(--accent)`, padding-top `1.4rem`, margin-top `2rem`.

### Cores
- Fundo secao: `--dark-2 #211F3D` (roxo profundo, nao preto puro), com brilho radial dourado no canto superior direito `rgba(232,185,49,0.10)`.
- Numeros: `--accent #E8B931`. Linhas divisorias: `rgba(255,255,255,0.10)`.
- Texto: titulo/sinais `#F5F5F5`; lead `#A0A8B5`.

### Elementos Visuais
- Linha vertical fina dourada (`1px`, `rgba(232,185,49,0.4)`) separando as duas colunas no desktop (via borda esquerda da coluna direita), some no mobile.
- Grain/noise overlay opcional a `opacity 0.04` para textura premium sobre o escuro.

### Animacoes
- Intro (eyebrow, H2, lead): reveal padrao stagger 100ms ao entrar 20%.
- Sinais: stagger sequencial 90ms entre cada `.signal` (fade-up 600ms `--ease-out`); o `.signal__num` faz count-up visual simples (opacidade + translateY), sem contador numerico.
- Frase de virada: clip-reveal (`clip-path: inset(0 100% 0 0)` -> `inset(0 0 0 0)`, 700ms `--ease-out`) sincronizada com fade.

### Interatividade
- Hover em `.signal`: `background: rgba(255,255,255,0.03)`, `.signal__num` muda para `--accent` mais claro (`#F2CF63`) e desloca `translateX(4px)`, 300ms `--ease-out`.
- Sem links clicaveis (secao narrativa).

### Responsividade
- `<= 880px`: grid 1 coluna; `.problema__intro` estatico (sem sticky); linha vertical removida; sinais mantem numeracao.
- `<= 540px`: `.signal__num` largura `1.8rem`, `font-size 1.5rem`; H2 `2rem`.

---

## Secao 3: O QUE VOCE VAI DESCOBRIR  (o mapa, 10 topicos)

### Arquetipo e Constraints
- Arquetipo: Scroll Horizontal com pin (a secao "trava" e os topicos do mapa deslizam lateralmente conforme o scroll vertical).
- Constraints: Scroll Horizontal (Layout), Counter Animation / progress (Movimento), Hover Lift (Interacao), Selective Color (Cor).
- Justificativa: 10 itens em lista vertical cansam; transformar o "mapa" numa trilha horizontal reforca a metafora de jornada/mapa e cria um momento memoravel. Fallback vertical em mobile.

### Conteudo (exato)
- Eyebrow: "03 / O que voce vai descobrir".
- Titulo (H2): "O mapa completo de onde esta o dinheiro".
- Intro: "O mapa completo, gravado e organizado passo a passo, com o mesmo conteudo que eu aplico no acompanhamento de palestrantes. Veja parte do que esta aqui dentro:"
- 10 cards (numero + titulo em negrito + descricao), texto exato:
  1. "Posicionamento e mentalidade" / "por que palestrante de cache baixo quase nunca contrata ninguem, e como isso te trava"
  2. "A conta real do mercado" / "22 milhoes de CNPJs no Brasil, mais de 1,1 milhao de medias e grandes empresas. Faca a conta de quantas palestras isso significa por ano"
  3. "Quem voce deve parar de prospectar agora" / "e onde esta o cliente que tem orcamento carimbado pra te contratar"
  4. "Sistema S desvendado" / "SESI, SENAI, SESC, SENAC e as 27 unidades de cada confederacao. O mesmo e-mail, o mesmo telefone, todo ano"
  5. "CDL, CACB e associacoes comerciais" / "onde esta a grana de verdade e a armadilha de Pareto que faz voce perder tempo com quem nao tem caixa"
  6. "Licitacoes e dinheiro publico" / "secretarias, conselhos regionais (CREA, CRM e cia), 13,5% do PIB em despesas do Estado. Cases reais de contratos milionarios"
  7. "Grandes congressos e eventos" / "como entrar nos que se repetem todo ano (CBTD, SEBRAE, feiras) usando sempre o mesmo contato"
  8. "As 4 formas de vender palestra" / "indicacao, prospeccao ativa, trafego pago e os bancos de palestrantes, com o lado positivo e negativo de cada uma"
  9. "A matematica da venda" / "quantas ligacoes viram reunioes, quantas reunioes viram propostas, quantas propostas viram contrato"
  10. "Como precificar de verdade" / "por que sua palestra de R$ 4.000 precisa valer R$ 70.000 na cabeca do cliente"

### Layout (estrutura)
- `<section class="mapa">` com bloco de cabecalho (eyebrow + H2 + intro) em container normal, padding-top `clamp(5rem,11vw,9rem)`.
- Wrapper de pin: `.mapa__pin` com `height: 320vh` (define a distancia de scroll). Dentro, `.mapa__sticky` `position: sticky; top:0; height:100svh; display:flex; align-items:center; overflow:hidden`.
- Trilha: `.mapa__track` flex em linha, gap `1.5rem`, transladada no eixo X via JS conforme progresso do scroll dentro de `.mapa__pin` (de `0` a `-(scrollWidth - viewport + padding)`).
- Card `.mapa__card`: largura `clamp(280px, 32vw, 420px)`, altura `clamp(360px, 60vh, 480px)`, surface branco, raio 1.25rem, borda, sombra padrao, padding `2rem`. Topo: numero grande serif dourado contornado; centro/rodape: titulo (serif) + descricao (sans).
- Barra de progresso `.mapa__progress` fixa no rodape da `.mapa__sticky`: trilho `rgba(46,43,95,0.12)` + preenchimento dourado que cresce com o progresso (`scaleX`).
- Primeiro card pode ser um "card de capa" com o H2 repetido pequeno + "10 capitulos" para orientar.

### Tipografia
- Numero do card: DM Serif Display, `clamp(3rem,4vw,4.5rem)`, cor `--surface` com `-webkit-text-stroke: 1.5px var(--accent)` (numero "vazado" dourado), opacidade 1; ao hover preenche `--accent-soft`.
- Titulo card: DM Serif Display, `clamp(1.4rem,1.8vw,1.9rem)`, line-height 1.1, cor `--text`.
- Descricao: DM Sans 400, `0.98rem`, line-height 1.5, cor `--text-2`.
- Termos-chave nas descricoes (numeros "22 milhoes", "13,5%", "R$ 70.000", siglas "SESI", "CBTD") em DM Sans 600 cor `--primary`.

### Cores
- Fundo: `--bg`. Cards: `--surface`, borda `--border`. Numero stroke: `--accent`. Progress fill: `--accent`.
- Brilho dourado sutil atras da trilha (`rgba(232,185,49,0.08)`), parallax lento.

### Elementos Visuais
- Indicador "arraste / role" no canto: pequeno selo com seta horizontal e texto "Role para navegar o mapa" (some apos primeiro avanco de 5%).
- Linha de mapa decorativa (SVG dotted path) cruzando os cards ao fundo, opacidade 0.15, dourada.

### Animacoes
- Pin/scroll-horizontal via JS (scroll progress 0..1 -> translateX). Usar `transform: translate3d` e `will-change: transform`. Suavizar com `lerp` (fator 0.1) em rAF para inercia premium.
- Progress bar: largura/scaleX = progresso. 
- Entrada dos cards: ao se aproximarem do centro, leve `scale(0.96 -> 1)` e `opacity(0.7 -> 1)` baseado na distancia ao centro do viewport.
- Numero vazado: stroke desenha (Draw) na primeira aparicao.

### Interatividade
- Hover card: `translateY(-10px)` + sombra elevada + numero preenche dourado, 400ms `--ease-spring`.
- Mouse parallax leve dentro do card (tilt maximo 4deg) com `--ease-out`.
- Teclado/acessibilidade: a secao tambem deve ser navegavel; foco em card rola ate ele.

### Responsividade
- `<= 880px`: DESLIGAR o pin/scroll-horizontal. Trilha vira grid vertical 1 coluna (cards full-width, altura auto), reveal stagger ao scroll. Progress bar oculta. Mantem numeros vazados e hover lift reduzido.
- `<= 540px`: cards padding `1.4rem`, numero `2.6rem`, titulo `1.4rem`.

---

## Secao 4: SITE vs INSTAGRAM  (Por que site e nao so Instagram)

### Arquetipo e Constraints
- Arquetipo: Before/After (comparacao visual de dois estados).
- Constraints: Split com Overlap (Layout), Mouse Tilt 3D (Interacao), Selective Color (Cor).
- Justificativa: o argumento e uma comparacao direta (efemero x permanente); materializa-la em dois paineis confrontados comunica antes de ler.

### Conteudo (exato)
- Eyebrow: "04 / Sua estrutura".
- Titulo (H2): "O cliente que compra palestra nao quer te seguir. Ele quer te contratar."
- Corpo: "Seu Instagram nao e seu. Se a rede mudar a regra amanha, voce perde tudo. Um cliente que compra palestra nao quer ver seus stories, ele quer entender, em um lugar so, o que voce faz e como contratar." / "Na aula eu mostro por que estrutura profissional nao e luxo, e o que decide se voce entra pra ganhar ou so pra participar. (E sim, esta pagina que voce esta lendo e exatamente o tipo de estrutura que separa amador de profissional.)"
- Painel A (negativo) "Instagram": tag "Efemero". Itens: "Nao e seu, e da plataforma", "Some no feed em horas", "O cliente nao quer te seguir", "Regra muda e voce perde tudo".
- Painel B (positivo) "Seu site": tag "Permanente". Itens: "Voce controla 100%", "Comeca e termina a comunicacao", "Mostra o que faz e como contratar", "Transforma curioso em cliente".

### Layout
- `<section class="vs">` fundo `--muted-bg`, padding dobra padrao.
- Cabecalho centralizado-esquerda (eyebrow + H2 `max-width 22ch` + corpo `max-width 52ch`).
- Comparador: grid `1fr 1fr` desktop, gap 0, com overlap central. Painel A (`.vs__card--neg`) levemente rotacionado `-2deg` e recuado; Painel B (`.vs__card--pos`) `+1deg`, elevado (z maior), `translateY(-24px)`, sombra elevada. Sobreposicao de ~`32px` no centro (margens negativas).
- Cada painel: header (titulo + tag), `<ul>` de itens com marcador proprio (Painel A: "x" em circulo cinza; Painel B: traco dourado).
- Divisor central "VS": circulo `64px`, surface, borda dourada, serif "VS" cor `--primary`, posicionado absoluto no cruzamento, `z-index` acima dos dois.

### Tipografia
- H2: DM Serif Display `clamp(2rem,4.5vw,3.4rem)`, line-height 1.06.
- Tag painel: DM Sans 700 `0.66rem` uppercase `letter-spacing 0.16em`; A em `--text-muted`, B em `--accent-hover`.
- Titulo painel: DM Serif Display `1.6rem`. Itens: DM Sans 500 `1rem`.

### Cores
- Painel A: surface levemente acinzentado `#F4F5F7`, texto `--text-2`, marcador `#C4CAD4`. Sensacao "apagada" (filtro `saturate(0.9)`).
- Painel B: surface branco, borda dourada `1px rgba(232,185,49,0.5)`, glow dourado suave; titulo `--primary`, marcadores `--accent`.
- "VS": borda `2px var(--accent)`.

### Elementos Visuais
- Painel A com leve dessaturacao e opacidade 0.92; Painel B nitido. Reforca before/after.
- Icone de cadeado pequeno no painel A (nao e seu); icone de chave/casa no painel B (controle). SVG inline, 20px.

### Animacoes
- Reveal: paineis entram de lados opostos (A da esquerda `translateX(-40px)`, B da direita `translateX(40px)`) + fade, 700ms `--ease-out`, ao entrar 25%.
- "VS" faz `scale(0 -> 1)` com `--ease-spring` 200ms apos os paineis.

### Interatividade
- Mouse tilt 3D em cada painel (perspective 900px, rotacao maxima 6deg) seguindo o cursor; Painel B com brilho que segue o mouse (`radial-gradient` via variavel `--mx/--my`).
- Hover Painel B: sobe `translateY(-32px)` e intensifica glow. Painel A permanece recuado.

### Responsividade
- `<= 880px`: paineis empilham (B acima de A para terminar no negativo? Nao: ordem A entao B, B mantem destaque), sem rotacao nem overlap; "VS" vira divisor horizontal entre eles; tilt desativado.
- `<= 540px`: itens `0.95rem`, paddings reduzidos.

---

## Secao 5: QUEM SOU EU  (Bruno Bettini)

### Arquetipo e Constraints
- Arquetipo: Layered + Framed Content (retrato em camadas com moldura editorial).
- Constraints: Imagem Duotone/Overlay (Midia), Parallax (Movimento), Framed Content (Layout). Segunda dobra escura.
- Justificativa: rosto + autoridade pedem tratamento de retrato editorial; o duotone integra a foto a paleta da marca mesmo sem foto profissional final.

### Conteudo (exato)
- Eyebrow: "05 / Quem te guia".
- Nome (H2): "Bruno Bettini".
- Corpo: "Eu vivo desse mercado e formo palestrantes que vivem dele. Acompanho palestrantes individualmente na mentoria, no detalhe, no consultorio, ligacao por ligacao, proposta por proposta." / "Ja participei de licitacoes milionarias, ganhei editais de orgaos publicos, e conheco por dentro como o dinheiro circula em cada canto desse mercado: empresa privada, sistema S, CDL, conselhos, secretarias, congressos e bancos de palestrantes." / "Nao trabalho com promessa de fim de semana. Trabalho com construcao. E e isso que voce vai comecar a construir neste material."
- Credenciais (chips, reaproveitando prova): "Licitacoes milionarias", "Editais publicos ganhos", "Sistema S", "CDL e CACB", "Conselhos (CREA, CRM)", "Grandes congressos".

### Layout
- `<section class="bio section--dark">`, grid `minmax(0,0.9fr) minmax(0,1.1fr)`, gap `clamp(2.5rem,6vw,5rem)`, align-items center.
- Esquerda: retrato `.bio__photo` em moldura (frame): imagem dentro de container raio 1.5rem, com uma "moldura" deslocada atras (`::after` borda dourada 1px, offset `16px 16px`), parallax: foto move mais devagar que a moldura no scroll.
- Direita: eyebrow, nome grande, corpo, chips de credenciais (flex-wrap).
- Assinatura decorativa (SVG lettering "Bruno Bettini") abaixo do corpo, dourada, opacidade 0.85.

### Tipografia
- Nome: DM Serif Display `clamp(2.6rem,6vw,4.5rem)`, line-height 1, cor `--on-dark`.
- Corpo: DM Sans 400 `clamp(1.02rem,1vw+0.9rem,1.18rem)`, line-height 1.6, cor `--on-dark-2`; termos "licitacoes milionarias", "editais", "construcao" em `--accent`.
- Chips: DM Sans 600 `0.8rem`, cor `--on-dark`, fundo `rgba(255,255,255,0.06)`, borda `rgba(255,255,255,0.14)`, raio 100px, padding `0.42rem 0.9rem`.

### Cores
- Fundo: `--dark-2 #211F3D`. Foto duotone: sombras `--primary`/`#15132e`, luzes `--accent` suave (mix-blend ou filtro). Overlay roxo `rgba(46,43,95,0.35)` sobre a foto.
- Moldura: `1px solid rgba(232,185,49,0.6)`.

### Elementos Visuais
- Placeholder de foto: se nao houver imagem final, usar bloco com gradiente `--primary -> --dark-2` e iniciais "BB" em serif gigante dourado vazado. Documentar slot `assets/bruno.jpg` (retrato 4:5, min 1000x1250).
- Tratamento: `filter: grayscale(1) contrast(1.05)` + camada `mix-blend-mode: multiply` dourada para duotone.

### Animacoes
- Parallax: foto `translateY` -20px..20px e moldura -8px..8px conforme scroll (scroll-linked). 
- Nome: text-reveal por palavra (mask) ao entrar 30%.
- Chips: stagger 60ms fade-up.

### Interatividade
- Hover na foto: overlay roxo reduz opacidade (0.35 -> 0.15) revelando mais cor, 500ms; leve `scale(1.02)`.
- Chips hover: borda dourada acende, `translateY(-2px)`.

### Responsividade
- `<= 880px`: 1 coluna, foto no topo (`max-width 380px`, centralizada), moldura offset reduzido `8px`; parallax desativado.
- `<= 540px`: nome `2.4rem`; chips menores `0.74rem`.

---

## Secao 6: PARA QUEM E  (Esta aula e pra voce se...)

### Arquetipo e Constraints
- Arquetipo: Bento Box (celulas de tamanhos variados).
- Constraints: Bento Grid assimetrico (Grid), Color Blocking (Cor), Hover Reveal (Interacao).
- Justificativa: 4 perfis + 1 frase de corte cabem num bento com hierarquia visual, fugindo da grade simetrica de cards.

### Conteudo (exato)
- Eyebrow: "06 / Para quem e".
- Titulo (H2): "Esta aula e pra voce se..."
- 4 perfis (titulo curto editorializado + texto exato da copy):
  - Celula 1 (grande): "Esta comecando agora e nao quer perder dois anos tateando no escuro"
  - Celula 2: "Ja e palestrante mas esta patinando, e quer entender exatamente ONDE esta travando"
  - Celula 3: "Ja performa e quer um mapa pra escalar com metodo, nao na sorte"
  - Celula 4: "Esta cansado de prospectar quem nao tem orcamento e de reclamar que 'o mercado esta ruim'"
- Celula de corte (destaque dourado, largura total): "Se voce so quer absorver conteudo e nao praticar, nao compre. Esta aula e pra quem vai pra cima."

### Layout
- `<section class="paraquem">` fundo `--bg`, dobra padrao.
- Cabecalho a esquerda (eyebrow + H2).
- Bento grid desktop: `grid-template-columns: repeat(4, 1fr)`, `grid-auto-rows: minmax(180px, auto)`, gap `1.25rem`.
  - Celula 1: `grid-column: span 2; grid-row: span 2` (destaque, maior).
  - Celula 2: `span 2; row span 1`.
  - Celula 3: `span 2; row span 1`.
  - Celula 4: `span 2; row span 1` (ao lado da 1, completando a malha).
  - Celula de corte: `grid-column: 1 / -1` (faixa final), fundo `--accent`, texto `--dark`.
- Cada celula: surface, borda, raio 1.25rem, padding `clamp(1.5rem,2.5vw,2.2rem)`, com numero/indice de perfil pequeno no topo e marcador grafico.

### Tipografia
- H2: DM Serif Display `clamp(2rem,5vw,3.4rem)`.
- Texto da celula: DM Sans 500, celula 1 `clamp(1.4rem,2vw,1.9rem)` (serif opcional para a maior), demais `1.15rem`, line-height 1.35, cor `--text`.
- Palavras "ONDE", "metodo", "vai pra cima" em `--primary` 600.
- Celula de corte: DM Serif Display `clamp(1.5rem,2.6vw,2.2rem)`, cor `--dark`.

### Cores
- Celulas padrao: `--surface`, borda `--border`. Celula 1 (destaque): fundo `--primary`, texto `--on-dark`, marcador dourado. Celula de corte: fundo `--accent`, texto `--dark`.
- Color blocking: alternar 1 celula `--primary` (escura) entre as claras cria ritmo.

### Elementos Visuais
- Indice de perfil "01..04" em cada celula, serif dourado pequeno.
- Marcador grafico por celula (formas geometricas douradas diferentes: circulo, triangulo, quadrado, linha) no canto, decorativo.

### Animacoes
- Celulas entram em stagger diagonal (delay baseado em `row+col` * 60ms), fade-up + `scale(0.97->1)`.
- Celula de corte: clip-reveal da esquerda + leve pulse no fundo dourado uma vez.

### Interatividade
- Hover celula clara: `translateY(-6px)`, borda dourada, sombra elevada; revela uma seta/linha dourada que cresce no rodape (Hover Reveal).
- Hover celula `--primary`: brilho dourado interno (radial) acende.
- Celula de corte hover: leve `scale(1.01)`.

### Responsividade
- `<= 880px`: grid `repeat(2, 1fr)`, celula 1 `span 2`, demais `span 1`, corte `1/-1`.
- `<= 540px`: 1 coluna; todas `span 1`; ordem natural; celula 1 mantem destaque visual (fundo `--primary`).

---

## Secao 7: A OFERTA  (Tudo isso por R$ 47)

### Arquetipo e Constraints
- Arquetipo: Spotlight (contido, foco unico) sobre dobra escura com glow.
- Constraints: Gradiente Mesh/Radial (Cor), Light/Glow + Glassmorphism no card (Efeitos), Scale hover no CTA (Movimento).
- Justificativa: o momento de conversao precisa de foco total; escurecer o entorno e iluminar o card de oferta dirige o olho ao preco e ao botao.

### Conteudo (exato)
- Eyebrow: "07 / A oferta".
- Titulo (H2): "Tudo isso por R$ 47".
- Texto: "O mapa completo do mercado, com o passo a passo, gravado e na sua mao." / "Pense no que esta em jogo: a cada vez que um cliente escolheu um palestrante que nao foi voce, voce perdeu. Quanto tempo mais voce quer continuar perdendo por falta de clareza sobre o mercado?"
- Lista do que esta incluido (4 itens, marcador dourado):
  - "Acesso imediato a gravacao completa, com o mapa e o passo a passo"
  - "Assista quantas vezes quiser, no seu ritmo"
  - "O mapa de onde esta o dinheiro: empresas, sistema S, CDL, licitacoes, conselhos e congressos"
  - "Os criterios pra avaliar se o seu material esta pronto pra competir"
- Bloco de preco: "Oferta de lancamento", "de R$ 197" (riscado), "R$ 47", "a vista, acesso imediato".
- Ancoragem: "Uma unica palestra que voce deixou de vender por falta de estrutura vale centenas de vezes esse valor. R$ 47 e menos do que voce gasta sem pensar num fim de semana."
- CTA: "Quero acesso por R$ 47". Microcopy: "Pagamento seguro. Acesso liberado na hora."

### Layout
- `<section class="oferta section--dark" id="oferta">`, `min-height: 100svh`, flex center, padding dobra.
- Card central `.oferta__card` `max-width: 760px`, glassmorphism (fundo `rgba(255,255,255,0.06)`, `backdrop-filter: blur(16px)`, borda `1px rgba(232,185,49,0.35)`), raio `1.75rem`, padding `clamp(2rem,4vw,3.5rem)`, glow dourado externo.
- Interno em grid `1.2fr 0.8fr` desktop: esquerda = titulo + texto + lista incluido; direita = bloco de preco "sticky" visual (card dourado contido) + CTA + microcopy + ancoragem abaixo full-width.
- Lista incluido: `<ul>` itens com marcador "+" dourado em circulo.

### Tipografia
- H2: DM Serif Display `clamp(2.2rem,5vw,3.6rem)`, cor `--on-dark`; "R$ 47" no titulo em `--accent`.
- Preco "R$ 47": DM Serif Display `clamp(3.2rem,7vw,5rem)`, cor `--accent`, line-height 1. "de R$ 197": DM Sans `1.1rem` riscado `--on-dark-2`.
- Itens incluido: DM Sans 500 `1.02rem`, cor `--on-dark`.
- Ancoragem: DM Sans 400 `0.95rem`, cor `--on-dark-2`, italico opcional.

### Cores
- Fundo secao: gradiente radial mesh: base `#15132e`, com manchas `--primary` e `rgba(232,185,49,0.12)` (mesh de 2-3 pontos), bem escuro nas bordas (vignette).
- Card: vidro translucido + borda dourada. Bloco de preco interno: fundo `rgba(232,185,49,0.12)`, borda dourada.
- CTA: `.btn--primary` (dourado/`--dark`) em tamanho maior (`padding 1.1rem 2rem`, `font-size 1.05rem`).

### Elementos Visuais
- Glow pulsante atras do card (`box-shadow: 0 0 80px rgba(232,185,49,0.25)`), respiracao lenta (8s).
- Selo "7 dias de garantia" pequeno proximo ao CTA (linka visualmente a secao 8).
- Particulas/poeira dourada sutil flutuando ao fundo (canvas leve, opcional, baixa densidade).

### Animacoes
- Card: entrada `scale(0.96 -> 1)` + fade + glow acende, 800ms `--ease-out`.
- Preco "R$ 47": destaque com leve `scale` pulse unico ao entrar.
- Itens incluido: stagger 80ms.
- Glow: `breathe` loop (opacity 0.6..1, 8s ease-in-out infinite).

### Interatividade
- CTA hover: `translateY(-3px) scale(1.02)` + sombra dourada intensa; brilho varre o botao (sheen) 600ms.
- Card: mouse spotlight (luz dourada radial segue o cursor sobre o vidro).

### Responsividade
- `<= 880px`: card interno 1 coluna; preco e CTA acima da lista? Nao: ordem = titulo, preco+CTA (destacado), lista, ancoragem. CTA full-width.
- `<= 540px`: preco `3.4rem`; padding card `1.5rem`; particulas desativadas.

---

## Secao 8: GARANTIA  (O risco e todo meu)

### Arquetipo e Constraints
- Arquetipo: Isolated Element (um unico foco com muito respiro).
- Constraints: White Space Hero (Densidade), Draw SVG do selo (Movimento), Float Loop (Movimento). Fundo claro, contraste apos a dobra escura da oferta.
- Justificativa: depois da intensidade da oferta, uma dobra clara, calma e respirada transmite seguranca, que e a funcao da garantia.

### Conteudo (exato)
- Eyebrow: "08 / Garantia".
- Titulo (H2): "O risco e todo meu".
- Texto: "Assista a aula. Se voce sentir que nao recebeu um mapa claro e aplicavel do mercado de palestras, e so pedir seu dinheiro de volta em ate 7 dias. Sem burocracia, sem perguntas."

### Layout
- `<section class="garantia">` fundo `--bg`, `min-height: 80svh`, flex center, conteudo centralizado `max-width: 620px`, text-align center.
- Selo SVG grande no topo (`clamp(120px,16vw,180px)`): badge circular "7 DIAS" com texto curvo "GARANTIA INCONDICIONAL" ao redor.
- Abaixo: H2, texto, e um link discreto opcional de volta a oferta.

### Tipografia
- H2: DM Serif Display `clamp(2rem,5vw,3.2rem)`, cor `--text`.
- Texto: DM Sans 400 `clamp(1.05rem,1vw+1rem,1.25rem)`, line-height 1.6, cor `--text-2`; "7 dias", "Sem burocracia, sem perguntas" em `--primary` 600.

### Cores
- Selo: borda e numeros dourados (`--accent`), miolo branco, texto curvo `--primary`. 
- Brilho dourado suave atras do selo (`rgba(232,185,49,0.15)`).

### Elementos Visuais
- Selo "7 dias" em SVG inline: anel externo com texto curvo (textPath), "7" serif gigante no centro, pequenos raios/serrilha de medalha. 
- Linhas decorativas finas saindo do selo (raios), opacidade 0.2.

### Animacoes
- Selo: Draw SVG (stroke-dasharray do anel desenha em 1.2s ao entrar) + texto curvo fade.
- Float loop: selo flutua `translateY(-6px..6px)` em 5s ease-in-out infinite.
- H2/texto: fade-up stagger 120ms.

### Interatividade
- Hover no selo: leve `rotate(4deg) scale(1.04)`, brilho intensifica.

### Responsividade
- `<= 540px`: selo `120px`; H2 `2rem`; padding vertical reduzido.

---

## Secao 9: FAQ  (objecoes)

### Arquetipo e Constraints
- Arquetipo: Reveal on Demand (perguntas expansiveis com tratamento editorial, NAO accordion generico).
- Constraints: Reveal on Demand (Interacao), Editorial/Asymmetric (Layout), Clip Reveal da resposta (Movimento). Fundo `--muted-bg`.
- Justificativa: FAQ precisa de expand/colapso, mas o tratamento (numeracao serif, linha dourada que cresce, resposta com clip-reveal) o tira do padrao generico.

### Conteudo (exato, 6 itens P/R)
1. P: "E ao vivo ou gravado?" R: "E gravado. Voce compra e assiste na hora, quantas vezes quiser, no seu ritmo."
2. P: "Funciona pra quem esta comecando do zero?" R: "Sim. A aula foi feita tanto pra quem esta comecando e nao quer perder dois anos tateando, quanto pra quem ja e palestrante e esta travado em algum ponto."
3. P: "Vou sair vendendo palestra de R$ 5.000 depois dessa aula?" R: "Nao vou te vender milagre. Essa aula te da clareza total sobre o mercado e onde esta o dinheiro. O resultado vem de voce executar o que vai aprender. E construcao, nao magica."
4. P: "Ja dou palestra ha anos. Ainda vale pra mim?" R: "Vale. Os palestrantes profissionais que acompanho sao os que mais se abrem pra revisar posicionamento e prospeccao. Quase sempre e ai que esta o ponto que destrava o proximo nivel."
5. P: "Quanto tempo tenho de acesso?" R: "O acesso e seu. Compre uma vez e assista quando e quantas vezes quiser."
6. P: "E se eu nao gostar?" R: "Voce tem 7 dias de garantia. Se nao fizer sentido pra voce, devolvo seu dinheiro."

### Layout
- `<section class="faq">`, dobra padrao. Cabecalho a esquerda (eyebrow "09 / Perguntas frequentes" + H2 "Antes de voce decidir").
- Grid `0.8fr 1.2fr` desktop: esquerda = cabecalho sticky; direita = lista de itens `.faq__item`.
- `.faq__item`: `<button class="faq__q">` (numero serif + pergunta + icone +/−) e `.faq__a` (resposta, altura animada). Separadores `border-bottom: 1px solid var(--border)`.

### Tipografia
- H2: DM Serif Display `clamp(2rem,4.5vw,3.2rem)`.
- Numero do item: DM Serif Display `1.4rem` dourado.
- Pergunta: DM Sans 600 `clamp(1.05rem,1.4vw,1.25rem)`, cor `--text`.
- Resposta: DM Sans 400 `1.02rem`, line-height 1.6, cor `--text-2`, `max-width 58ch`.

### Cores
- Item fechado: numero `--accent-hover`, pergunta `--text`. Aberto: pergunta `--primary`, linha-base do item vira dourada `--accent`.
- Icone +/−: `--primary`.

### Elementos Visuais
- Icone que transita de "+" para "−" (rotacao 45deg / morph). 
- Linha dourada que cresce sob a pergunta ativa (scaleX 0 -> 1).

### Animacoes
- Abrir: `.faq__a` de `grid-template-rows: 0fr` para `1fr` (tecnica de altura animavel) + fade + clip-reveal de cima, 450ms `--ease-out`. Icone rotaciona 135deg.
- Itens entram em stagger 70ms ao scroll.
- Comportamento: um aberto por vez (fecha os outros) por padrao; primeiro item aberto on-load (opcional).

### Interatividade
- Hover na pergunta: numero e pergunta vao para `--primary`, linha dourada cresce 30%.
- Foco-teclado completo (button), `aria-expanded`, `aria-controls`. Enter/Espaco alterna.

### Responsividade
- `<= 880px`: 1 coluna; cabecalho estatico no topo; itens full-width.
- `<= 540px`: pergunta `1.05rem`; numero `1.2rem`.

---

## Secao 10: CTA FINAL  (vai ser voce?)

### Arquetipo e Constraints
- Arquetipo: Type Hero / Poster (tipografia como protagonista absoluta).
- Constraints: Headline Full Width / grande (Tipografia), Mouse Parallax nos elementos (Interacao), Text Reveal por linha (Movimento), Dark Mode + Gradiente (Cor).
- Justificativa: fecho emocional. A frase de virada vira poster; tudo serve a decisao final.

### Conteudo (exato)
- Eyebrow: "10 / Ultima chamada".
- Titulo poster (H2): "Os clientes vao contratar alguem. A pergunta e: vai ser voce?"
- Texto: "A palestra de lideranca vai acontecer. A de vendas vai acontecer. A de inteligencia emocional vai acontecer. Todos os dias, em todo o Brasil. A unica duvida e quem vai estar la: voce ou outra pessoa." / "Assuma a responsabilidade pelo seu sucesso. Comece entendendo o jogo inteiro."
- CTA: "Desvendar o mercado agora por R$ 47". Microcopy: "Acesso imediato. 7 dias de garantia. Bruno Bettini."

### Layout
- `<section class="final section--dark">`, `min-height: 100svh`, flex center.
- Headline ocupa quase toda a largura (`max-width 16ch`, alinhada a esquerda ou centro-esquerda), com "vai ser voce?" em destaque dourado/italico em linha propria.
- Abaixo: texto `max-width 54ch`, depois CTA grande e microcopy.
- Numeros/palavras-fantasma ao fundo (palavras "lideranca", "vendas", "inteligencia emocional") em tipografia gigante quase transparente, com mouse-parallax.

### Tipografia
- H2 poster: DM Serif Display `clamp(2.6rem, 9vw, 6.5rem)`, line-height 0.98, cor `--on-dark`; "vai ser voce?" em `--accent` italico.
- Texto: DM Sans 400 `clamp(1.05rem,1vw+1rem,1.3rem)`, cor `--on-dark-2`; "voce ou outra pessoa" em `--accent`.
- CTA: `.btn--primary` grande (`padding 1.15rem 2.2rem`, `font-size 1.1rem`).

### Cores
- Fundo: gradiente `--dark-2 #211F3D` -> `#15132e` (radial/vignette), brilho dourado central baixo (`rgba(232,185,49,0.10)`).
- Palavras-fantasma: `rgba(255,255,255,0.04)`.

### Elementos Visuais
- Camada de palavras-fantasma gigantes em parallax (3 camadas, profundidades diferentes).
- Filete dourado sob a headline.

### Animacoes
- Headline: text-reveal linha por linha (mask sobe), 700ms `--ease-out`, stagger 120ms.
- "vai ser voce?": entra por ultimo com leve `scale`/glow.
- Palavras-fantasma: drift lento continuo + mouse parallax.
- CTA: pulse sutil de atencao (sombra) a cada ~6s (uma vez visivel), discreto.

### Interatividade
- Mouse parallax nas palavras-fantasma e leve no headline (profundidades distintas).
- CTA hover: igual oferta (lift + scale + sheen).

### Responsividade
- `<= 880px`: headline `clamp(2.4rem,11vw,4rem)`; palavras-fantasma reduzidas a 1 camada; parallax leve.
- `<= 540px`: CTA full-width; texto `1.05rem`; palavras-fantasma desativadas (performance).

---

## RODAPE (minimo)
- `<footer>` fundo `--dark` (ou `--dark-2`), padding `2.5rem var(--pad)`, texto `--on-dark-2` `0.85rem`.
- Conteudo: "Bruno Bettini. Mercado de palestras." + ano + links discretos (Termos, Privacidade, Contato) se existirem. Sem travessoes.
- CTA-texto final opcional: link dourado "Garantir meu acesso por R$ 47" -> `#oferta`.

---

## NOTAS DE IMPLEMENTACAO (para o /desenvolver)
1. Manter o `index.html`/`style.css` atuais do Hero e Secao 01 intactos; apenas anexar as secoes 2 a 10 + footer.
2. Centralizar tokens no `:root` (ja existem); adicionar `--dark-2`, `--on-dark`, `--on-dark-2`.
3. Criar utilitario `.section--dark` (bg escuro, cores de texto invertidas, ajusta `--border` para `rgba(255,255,255,0.12)`).
4. JS necessario: IntersectionObserver para reveals; scroll-progress para o pin horizontal da Secao 3; FAQ accordion (grid-rows 0fr/1fr) acessivel; mouse parallax/tilt (Secoes 4, 5, 7, 10) com guarda de `pointer: fine` e `prefers-reduced-motion`.
5. Performance: usar `transform`/`opacity` apenas; `will-change` so durante interacao; `content-visibility: auto` em secoes fora da tela; particulas/canvas da Oferta opcionais e desligaveis em mobile.
6. Acessibilidade: contraste AA (texto sobre dark usa `#F5F5F5`/`#A0A8B5`); foco visivel; `prefers-reduced-motion` desliga parallax, pin, float, sheen e mantem conteudo estatico e legivel.
7. Slot de imagem: `assets/bruno.jpg` (retrato 4:5). Sem foto, usar placeholder "BB" especificado na Secao 5.
8. Placeholder de preco: "de R$ 197" e ancoragem; confirmar/ajustar valor real com o cliente antes do go-live.
