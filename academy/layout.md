# Layout — Avantik Academy (Hub `/academy/`)

> Spec de direção de arte para a página-hub. Pareada com `academy/copy.md`.
> Implementação ocorre em `/desenvolver`. Nada aqui é código — é a bíblia da construção.

## Linguagem visual aprovada (manter em toda a página)

- **Font pairing:**
  - Display institucional Avantik (voz da Academy): `DM Serif Display` (serif, italic no realce).
  - Display de marca dos programas (wordmarks): `Metropolis` (900/black, caixa-alta) — self-hosted em `/academy/assets/fonts/`.
  - Corpo: `DM Sans` (400/600/700).
- **Paleta base (hub institucional = Avantik):**
  - `--color-bg #FAFAF9` · `--color-surface #FFFFFF` · `--color-text #1A1A2E` · `--color-text-secondary #64748B`
  - `--color-dark #1C1C1E` (heroes/bands) · accent dourado `--color-accent #E8B931`
  - `--color-muted-bg #F1F5F9` · `--color-border #E2E8F0`
- **Cor por programa (cards):** cada card injeta `theme.primary`/`theme.accent`/`theme.dark` do `data.js` (cores oficiais dos manuais).
- **Espaçamento:** seções `padding: clamp(3.5rem, 8vw, 6.5rem) 0`; container `max-width 1200px`, `padding-inline: clamp(1.25rem, 5vw, 2rem)`.
- **Movimento:** reveals AOS `fade-up` 600–800ms `cubic-bezier(0.16,1,0.3,1)`, stagger 80ms. Hero sem animação de entrada; pós-load sutil.
- **Elementos de craft recorrentes:** glow radial da cor sobre dark, textura plexus (canvas), eyebrow com traço dourado, **sparkle** nos cards (novo).

---

## Seção 1: Hero institucional

### Arquétipo e Constraints
- Arquétipo: **Type Hero / Editorial** (tipografia serif como protagonista, voz Avantik).
- Constraints: **Headline Full Width + Texto com realce italic** (Tipografia) · **Selective Color sobre Dark Mode** (Cor) · **Ambient Motion** (Movimento — glow respirando).
- Justificativa: o hub é a voz institucional da Avantik (não de uma marca-programa); o serif DM Serif + dourado sobre dark estabelece autoridade premium antes de o usuário entrar no universo de cada programa.

### Conteúdo (de copy.md › Hero)
- Eyebrow: `AVANTIK ACADEMY`
- H1: `Onde o conhecimento dos autores vira a sua vantagem.` (com "vantagem" em italic dourado)
- Sub: `Cursos e mentorias derivados da coleção Foco em Resultados. Seis programas, mentores que vivem o que ensinam e encontros ao vivo todo mês. Não é teoria de fim de semana, é método testado na prática.`
- CTA primário: `Ver os programas` → `#programas`
- CTA secundário: `Como funciona` → `#como-funciona`

### Layout
- Section `min-height: auto`, `padding: clamp(5rem,12vw,8rem) 0 clamp(4rem,9vw,6rem)`, fundo `--color-dark`.
- Conteúdo alinhado à esquerda, largura máx do H1 `18ch`; sub `60ch`.
- Ordem vertical: eyebrow → H1 → sub (margin-top 1.25rem) → ações (margin-top 2rem).

### Tipografia
- Eyebrow: DM Sans 700, `0.8rem`, `letter-spacing .12em`, uppercase, cor `#E8B931`, com traço `1.75rem×2px` dourado antes.
- H1: DM Serif Display 400, `clamp(2.6rem, 7vw, 5rem)`, `line-height 1.04`, `letter-spacing -0.02em`, cor `#fff`; realce "vantagem" italic, cor `#E8B931`.
- Sub: DM Sans 400, `clamp(1.1rem,1.8vw,1.35rem)`, `line-height 1.6`, cor `rgba(255,255,255,.82)`.

### Cores
- Fundo `#1C1C1E`. Glow `::before`: `radial-gradient(120% 80% at 12% 0%, rgba(232,185,49,.12), transparent 55%)` + `radial-gradient(100% 70% at 100% 100%, rgba(108,104,201,.18), transparent 60%)`.
- Botão primário `.btn--academy` (dourado, texto `#1C1C1E`); secundário outline branco `border rgba(255,255,255,.4)`.

### Elementos visuais / Animações / Interatividade
- Glow `::before` com `animation: breathe 8s ease-in-out infinite` (opacity .85↔1, scale 1↔1.04). Respeitar `prefers-reduced-motion` (estático).
- Botões: hover `translateY(-1px) + brightness(1.08)`, 200ms.

### Responsividade
- ≤768px: H1 `clamp(2.2rem,9vw,3rem)`; ações empilham full-width; padding reduz.

---

## Seção 2: Por que a Avantik Academy

### Arquétipo e Constraints
- Arquétipo: **Split Assimétrico 58/42** (texto à esquerda, lista de diferenciais à direita).
- Constraints: **Negative Margin / Overlap** (Layout — o bloco direito sobe e sobrepõe a borda da seção) · **Mouse Parallax sutil** (Interação) · **Stagger reveal** (Movimento).
- Justificativa: quebra o ritmo centralizado do hero; a assimetria cria tensão editorial premium e separa "narrativa" (esquerda) de "provas" (direita).

### Conteúdo (de copy.md › Por que a Avantik Academy)
- Eyebrow `POR QUE A AVANTIK ACADEMY`
- Título: `Educação que cabe na sua rotina e pesa na sua carreira.`
- Parágrafo: `A maioria dos cursos entrega aula e desaparece. Aqui você aprende com quem está no jogo, leva suas dúvidas para a mentoria ao vivo e entra numa rede que abre portas. Aprendizado vira relação, e relação vira resultado.`
- 4 diferenciais (lista vertical, NÃO cards com ícone):
  1. `Conteúdo autoral, de autores e palestrantes reais da coleção Foco em Resultados.`
  2. `Mentoria mensal ao vivo, não apenas vídeo gravado.`
  3. `Networking que conecta o online ao presencial.`
  4. `Um ecossistema, seis caminhos: você escolhe onde quer evoluir.`

### Layout
- Grid `grid-template-columns: 1.4fr 1fr; gap: clamp(2rem,5vw,4.5rem)`; `align-items:center`.
- Bloco direito (diferenciais) em card `background #fff`, `border 1px #E2E8F0`, `border-radius 1.25rem`, `padding 2rem`, `margin-top: -3rem` (overlap para cima), `box-shadow 0 30px 60px rgba(0,0,0,.08)`.
- Diferenciais: lista; cada item com **número ordinal** `01–04` em DM Serif dourado + texto; divisória `1px #E2E8F0` entre itens (`padding-block .9rem`).

### Tipografia
- Título: DM Serif Display, `clamp(1.9rem,3.6vw,2.85rem)`, line-height 1.1.
- Parágrafo: DM Sans 400, `1.05rem`, line-height 1.65, `--color-text-secondary`.
- Nº ordinal: DM Serif `1.25rem` `#C7A019`; texto item DM Sans 600 `1rem`.

### Cores
- Fundo seção `--color-bg`. Card branco. Números dourados `#C7A019`.

### Animações / Interatividade
- Reveal stagger nos itens: `fade-up` 600ms, delay 80ms incremental.
- Mouse parallax no card direito: `translate` máx `6px` conforme posição do mouse (desligar em touch / reduced-motion).

### Responsividade
- ≤820px: 1 coluna; card sem `margin-top` negativa; números inline.

---

## Seção 3: Como funciona

### Arquétipo e Constraints
- Arquétipo: **Editorial Rule-of-Thirds com numerais grandes** (4 passos em fluxo, NÃO "3 cards com ícone").
- Constraints: **Counter / Numerais display** (Tipografia) · **Wave Stagger** (Movimento) · **Hover Lift** (Interação).
- Justificativa: comunica processo (gravadas → mentoria → mentores → comunidade) com ritmo numérico; numerais grandes substituem ícones genéricos.

### Conteúdo (de copy.md › Como funciona)
- Eyebrow `COMO FUNCIONA` · Título `Aprenda com quem faz, no seu ritmo.`
- 01 `Aulas gravadas` — `Palestras de 30 a 40 minutos, direto ao ponto, para assistir quando e onde quiser.`
- 02 `Mentorias ao vivo` — `Encontros mensais por Zoom com os mentores para tirar dúvidas e aprofundar o que importa.`
- 03 `Mentores de verdade` — `Autores e palestrantes da coleção Foco em Resultados, cada um dominando o próprio tema.`
- 04 `Comunidade e eventos` — `Networking que conecta o online ao presencial, onde o aprendizado vira relação.`

### Layout
- Grid `repeat(auto-fit, minmax(230px,1fr)); gap 1.5rem; margin-top 2.5rem`.
- Cada item: card `--color-surface`, `border 1px #E2E8F0`, `border-radius 1rem`, `padding 1.75rem`; numeral grande no topo.

### Tipografia
- Numeral: DM Serif `1.75rem`, cor `#E8B931`.
- Título item: DM Sans 700 `1.15rem`. Texto: DM Sans 400 `--color-text-secondary` line-height 1.55.

### Animações / Interatividade
- Wave stagger: itens revelam em sequência ondulada (delays 0/90/180/270ms), `fade-up` 600ms.
- Hover: `translateY(-4px)`, `box-shadow 0 16px 32px rgba(0,0,0,.08)`, borda muda para `color-mix(accent 40%, border)`, 300ms.

### Responsividade
- ≤640px: 1 coluna.

---

## Seção 4: Os seis programas (GRID DE MARCAS) — com SPARKLE

### Arquétipo e Constraints
- Arquétipo: **Modular / Bento de marca** (6 cards, cada um com identidade própria da marca).
- Constraints: **Color per Brand + Selective Color** (Cor) · **Hover Lift + Glow** (Interação) · **Sparkle / Particle accent** (Efeito Especial — NOVO) · **Glow on Dark cover** (Mídia).
- Justificativa: é o coração do hub; cada card precisa "ser" a marca do programa. O sparkle dá o brilho premium pedido e reforça o clima "constelação/plexus" comum aos 6 manuais.

### Conteúdo (de copy.md › Os seis programas + data.js)
- Eyebrow `SEIS PILARES, SEIS PROGRAMAS` · Título `Escolha o seu caminho de desenvolvimento.`
- Subtítulo `Cada programa nasce de um livro da coleção e tem identidade, mentores e jornada próprios. Escolha o seu caminho de desenvolvimento.`
- 6 cards (ordem em `PROGRAM_ORDER`): Empreenday, Gestão de Negócios na Prática, Inteligência Emocional e Neurociência, Oratória e Persuasão, Propulsão em Vendas, Liderança Extraordinária. Cada card: pilar (kicker), wordmark da marca, tagline, "Ver programa →".

### Layout
- Grid `repeat(auto-fill, minmax(280px,1fr)); gap 1.5rem; margin-top 2.75rem`. Fundo seção `--color-muted-bg`.
- Card: coluna; topo = **capa** (`aspect-ratio 16/10`), base = corpo (`padding 1.5rem`).
- Capa: fundo `radial-gradient(130% 130% at 22% -10%, color-mix(primary 42%, #050505), #060606)`; wordmark da marca em Metropolis 900 caixa-alta, cor `primary`, `text-shadow 0 0 24px color-mix(primary 55%, transparent)`, ancorado embaixo-esquerda (`padding 1.25rem`).
- Corpo: kicker (pilar) em `primary` 700 uppercase `.72rem`; nome de marca Metropolis 900 `1.4rem`; tagline DM Sans `--color-text-secondary`; CTA "Ver programa →" cor `primary`.

### SPARKLE (especificação do brilho)
- **O que é:** 3–5 estrelas/brilhos (`✦`/SVG 4-pontas) posicionados na capa, cintilando.
- **Visual:** SVG sparkle (4 pontas com glow), tamanhos variados `8–16px`, cor `primary` com `filter: drop-shadow(0 0 6px primary)`, `opacity` base `.0–.9`.
- **Posições:** absolutas dentro da capa, distribuídas (ex.: top 18%/left 70%, top 40%/left 88%, top 64%/left 12%, top 28%/left 30%); levemente fora do wordmark para não competir.
- **Animação:** `twinkle` — keyframes `opacity 0→.9→0` + `scale .6→1→.6` + `rotate 0→90deg`, `duração 2.4–3.6s` (varia por estrela via `--d`), `ease-in-out`, `infinite`, `delay` escalonado (0/.6/1.2/1.8s). Em `prefers-reduced-motion`: estrelas estáticas em opacity `.5`.
- **Hover do card:** sparkles aumentam brilho (`opacity` pico `1`, drop-shadow `0 0 10px`) e a animação acelera (`duration *0.7`); 1 sparkle extra surge perto do CTA.

### Tipografia
- Título seção: DM Serif `clamp(1.9rem,3.6vw,2.85rem)`. Wordmark: Metropolis 900 uppercase.

### Animações / Interatividade
- Entrada: cards `fade-up` 600ms, stagger por coluna `(index%3)*80ms`.
- Hover card: `translateY(-4px)`, `box-shadow 0 24px 48px rgba(0,0,0,.10)`, capa intensifica glow (`primary 55%`), sparkles reagem (acima). 400ms `cubic-bezier(0.16,1,0.3,1)`.
- Card inteiro é `<a>` para `/academy/<slug>/`.

### Responsividade
- ≤520px: 1 coluna; sparkles reduzem para 3; tamanhos -15%.

---

## Seção 5: Para mentores (band de conversão)

### Arquétipo e Constraints
- Arquétipo: **Spotlight / Hero Dominante** (band escura focada em uma mensagem).
- Constraints: **Glow radial** (Cor) · **Isolated Element** (Layout — muito respiro) · **Magnetic CTA** (Interação).
- Justificativa: muda completamente de cenário (claro→escuro) para destacar a oferta B2B/mentor; foco único.

### Conteúdo (de copy.md › Para mentores)
- Título `Quer ser mentor na Avantik Academy?`
- Texto `Transforme seu conhecimento em um programa, ganhe uma página personalizada e 50% de comissão sobre cada venda. Sua autoridade, alcançando mais gente, gerando renda recorrente.`
- CTA `Quero ser mentor` → `/para-palestrantes/`

### Layout
- Band `background var(--color-dark)` (institucional indigo via `--academy-primary` default `#2E2B5F`), `padding clamp(3.5rem,8vw,6rem) 0`, texto centralizado, largura do parágrafo `52ch`.
- Glow `::before` dourado/indigo radial topo-centro.

### Tipografia
- H2: DM Serif `clamp(2rem,4.5vw,3rem)` `#fff`. Parágrafo DM Sans `rgba(255,255,255,.82)`.

### Interatividade
- CTA magnético: o botão se desloca até `8px` em direção ao cursor quando o mouse se aproxima (raio 120px); volta com spring 400ms. Desligar em touch/reduced-motion.

### Responsividade
- ≤768px: padding reduz; CTA full-width.

---

## Seção 6: FAQ

### Arquétipo e Constraints
- Arquétipo: **Reveal on Demand (acordeão editorial customizado)** — NÃO accordion básico.
- Constraints: **Clip Reveal** (Movimento — resposta abre com `clip-path`/grid-rows) · **Hover Underline animado** (Interação) · **Asymmetric Padding** (Layout).
- Justificativa: objeções precisam de leitura calma; o acordeão refinado evita o visual "FAQ template".

### Conteúdo (de copy.md › FAQ — 5 itens)
1. `Preciso assistir tudo de uma vez?` / `Não. As aulas são gravadas e ficam disponíveis para você avançar no seu ritmo, quantas vezes precisar.`
2. `Como funcionam as mentorias?` / `São encontros mensais ao vivo, por Zoom, com o mentor do programa. É o espaço para tirar dúvidas, aprofundar temas e aplicar no seu caso real.`
3. `Os mentores são quem mesmo?` / `Autores e palestrantes da coleção Foco em Resultados, profissionais que constroem resultado na prática, não apenas no slide.`
4. `Posso fazer mais de um programa?` / `Pode. Cada programa é independente, e muitos profissionais combinam dois ou três pilares para acelerar a evolução.`
5. `Como recebo acesso depois da compra?` / `A compra e a entrega do conteúdo acontecem pela Hotmart. Após a confirmação, você recebe o acesso por lá.`

### Layout
- Container estreito `max-width 760px`, centralizado.
- Cada item: linha clicável (pergunta + ícone `+`/`–`), divisória `1px #E2E8F0`; resposta colapsada via `display:grid; grid-template-rows: 0fr → 1fr` (transição 360ms `cubic-bezier(0.16,1,0.3,1)`).

### Tipografia
- Pergunta: DM Sans 600 `1.05rem` `--color-text`. Resposta: DM Sans 400 `1rem` `--color-text-secondary` line-height 1.6.

### Interatividade
- Hover pergunta: underline animado da esquerda (`background-size 0→100% 2px`, 250ms) na cor `--color-accent`.
- Click: rotaciona o `+` 45°→`×`; abre/fecha com grid-rows + opacity.

### Responsividade
- ≤640px: paddings menores; ícone 20px.

---

## Seção 7: CTA final

### Arquétipo e Constraints
- Arquétipo: **Isolated Element** (uma frase, muito respiro).
- Constraints: **Headline grande** (Tipografia) · **Selective Color sobre Dark** (Cor).
- Justificativa: fechamento limpo, ecoa o hero sem repeti-lo.

### Conteúdo (de copy.md › CTA final)
- Título `Escolha o pilar que vai destravar a sua próxima fase.`
- Subtítulo `Seis programas, mentores de verdade e uma comunidade para crescer junto.`
- CTA `Ver os programas` → `#programas`

### Layout / Tipografia / Cores
- Band `--color-dark`, centralizado, padding `clamp(4rem,9vw,7rem)`. H2 DM Serif `clamp(2rem,4.5vw,3rem)` `#fff`; sub `rgba(255,255,255,.82)`. Glow dourado topo-centro.

### Animações
- Reveal `fade-up` no bloco; glow respira (reuso da Seção 1).

---

## Footer
- Reutilizar o footer global Avantik (já presente em `academy/index.html`), com "Academy" na coluna Navegação.

---

## Resumo de arquétipos (variedade garantida — sem repetição consecutiva)
1. Type Hero/Editorial · 2. Split Assimétrico · 3. Editorial Rule-of-Thirds · 4. Modular/Bento de marca (+Sparkle) · 5. Spotlight · 6. Reveal on Demand · 7. Isolated Element.
