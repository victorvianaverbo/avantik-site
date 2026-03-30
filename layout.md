# Layout Specification - Avantik Homepage

> Especificacao completa de diretor de arte para todas as secoes da homepage.
> Cada secao contem valores exatos, pixel por pixel, para implementacao sem margem de interpretacao.

---

## Design System (Referencia Global)

### Fontes
- **Heading:** DM Serif Display, serif — weight 400
- **Body:** DM Sans, sans-serif — weights 400, 500, 600, 700

### Paleta de Cores
| Token | Hex | Uso |
|-------|-----|-----|
| --color-bg | #FAFAF9 | Fundo padrao |
| --color-text | #1A1A2E | Texto principal |
| --color-text-secondary | #64748B | Texto secundario |
| --color-text-muted | #94A3B8 | Texto terciario |
| --color-primary | #2E2B5F | Marca/roxo profundo |
| --color-primary-light | #4340A0 | Roxo claro |
| --color-accent | #E86A33 | Laranja destaque |
| --color-accent-hover | #D45A28 | Laranja hover |
| --color-accent-light | rgba(232,106,51,0.08) | Laranja sutil |
| --color-surface | #FFFFFF | Superficie cards |
| --color-border | #E2E8F0 | Bordas |
| --color-muted-bg | #F1F5F9 | Fundo muted |

### Espacamento
- **Section padding:** clamp(4rem, 10vw, 8rem) vertical
- **Container max-width:** 1200px
- **Container padding:** clamp(1.25rem, 5vw, 2rem) horizontal

### Curvas de Easing
- **ease-out:** cubic-bezier(0.16, 1, 0.3, 1)
- **ease-spring:** cubic-bezier(0.34, 1.56, 0.64, 1)

---

## Secao 1: Header (JA IMPLEMENTADO - Referencia)

### Arquetipo e Constraints
- Arquetipo: Sticky Header
- Constraints: Glassmorphism, Hover Underline
- Justificativa: Header fixo com blur mantem presenca sem obstruir, underline animado guia navegacao

### Especificacao Resumida (ja construido)
- Fixo no topo, z-index 1000
- Background rgba(250,250,249,0.85) + backdrop-filter blur(16px)
- Altura 72px
- Logo: DM Serif Display 1.5rem + tagline 0.625rem uppercase
- Links: 0.875rem weight 500, underline accent animado 0.35s
- Burger mobile em <=960px
- Estado scroll: border-bottom #E2E8F0 + shadow 0 1px 8px rgba(0,0,0,0.04)

---

## Secao 2: Hero (JA IMPLEMENTADO - Referencia)

### Arquetipo e Constraints
- Arquetipo: Split Assimetrico
- Constraints: Headline >150px, Selective Color, Hover Lift, Float Loop
- Justificativa: Split cria hierarquia clara, headline gigante da personalidade, cor seletiva no "certo." ancora o olhar

### Especificacao Resumida (ja construido)
- Grid 1.15fr | 0.85fr, min-height 100vh
- Eyebrow: 0.75rem uppercase, tracking 0.12em, accent com dash animada
- Title "O palestrante": clamp(2.5rem, 5.5vw, 4.5rem)
- Title "certo.": clamp(4rem, 12vw, 10rem) accent, line-height 0.95
- Tabs empresa/palestrante com transicao fadeY 8px 400ms
- Trust badges: numeros DM Serif 1.5rem primary, labels 0.75rem muted
- Visual: blobs com blur 60px + cards flutuantes + float tags

---

## Secao 3: Categorias de Temas

### Arquetipo e Constraints
- Arquetipo: Bento Box
- Constraints: Hover Glow, Wave Stagger, Selective Color
- Justificativa: Bento Box permite celulas de tamanhos variados que criam ritmo visual interessante, diferente do grid simetrico generico. O hover glow convida a exploracao. Wave stagger cria efeito cascata organico na entrada.

### Conteudo
- Label: "Explore por tema"
- Titulo: "Encontre por tema ou ocasiao"
- Subtitulo: "Dezenas de categorias para conectar voce ao palestrante certo"
- Categorias (12 itens):
  1. SIPAT
  2. Vendas
  3. Lideranca
  4. Motivacional
  5. Inteligencia Emocional
  6. Comunicacao
  7. Dia da Mulher
  8. Outubro Rosa
  9. Saude Mental
  10. Diversidade e Inclusao
  11. Gestao e Empreendedorismo
  12. Inovacao e Tecnologia
- CTA: "Ver todas as categorias" (link com seta)

### Layout
- Fundo: var(--color-bg) #FAFAF9
- Padding: var(--section-py) clamp(4rem, 10vw, 8rem) vertical
- Container: max-width 1200px centralizado

**Header da secao:**
- Label + titulo + subtitulo alinhados a esquerda (nao centralizado — quebra expectativa)
- Label: display inline-block, margin-bottom 0.75rem
- Titulo: margin-bottom 1rem
- Subtitulo: max-width 520px, margin-bottom 3.5rem

**Grid Bento:**
- display: grid
- grid-template-columns: repeat(4, 1fr)
- grid-template-rows: auto
- gap: 1rem
- Layout das celulas (nao simetrico):
  - SIPAT: grid-column span 2, grid-row span 2 (celula grande — destaque)
  - Vendas: grid-column span 1, grid-row span 1
  - Lideranca: grid-column span 1, grid-row span 1
  - Motivacional: grid-column span 1, grid-row span 2 (celula alta)
  - Inteligencia Emocional: grid-column span 1, grid-row span 1
  - Comunicacao: grid-column span 2, grid-row span 1 (celula larga)
  - Dia da Mulher: grid-column span 1, grid-row span 1
  - Outubro Rosa: grid-column span 1, grid-row span 1
  - Saude Mental: grid-column span 1, grid-row span 1
  - Diversidade e Inclusao: grid-column span 2, grid-row span 1 (celula larga)
  - Gestao e Empreendedorismo: grid-column span 1, grid-row span 1
  - Inovacao e Tecnologia: grid-column span 1, grid-row span 1

**Cada celula (card):**
- background: var(--color-surface) #FFFFFF
- border: 1px solid var(--color-border) #E2E8F0
- border-radius: 1rem (16px)
- padding: 1.5rem (24px)
- display: flex, flex-direction: column, justify-content: flex-end
- position: relative, overflow: hidden
- min-height: 140px (celulas normais), 300px (celulas span 2 em row)
- cursor: pointer

**Icone por categoria:**
- Cada categoria tem um emoji/icone representativo posicionado no topo-esquerdo
- font-size: 2rem (celulas normais), 3.5rem (celula grande SIPAT)
- position: absolute, top: 1.5rem, left: 1.5rem
- Icones sugeridos:
  - SIPAT: icone de capacete/seguranca (SVG inline)
  - Vendas: icone de grafico subindo
  - Lideranca: icone de bandeira
  - Motivacional: icone de foguete
  - Inteligencia Emocional: icone de coracao-cerebro
  - Comunicacao: icone de balao de fala
  - Dia da Mulher: icone de flor
  - Outubro Rosa: icone de laco rosa
  - Saude Mental: icone de mente/meditacao
  - Diversidade e Inclusao: icone de maos unidas
  - Gestao e Empreendedorismo: icone de engrenagem
  - Inovacao e Tecnologia: icone de lampada

**Elemento decorativo na celula grande (SIPAT):**
- Gradiente decorativo no canto superior direito
- background: radial-gradient(circle at 100% 0%, rgba(232,106,51,0.06) 0%, transparent 60%)
- width: 200px, height: 200px
- position: absolute, top: 0, right: 0

**Titulo da categoria:**
- font-family: var(--font-body) DM Sans
- font-size: 1rem (celulas normais), 1.375rem (celula grande)
- font-weight: 700
- color: var(--color-text) #1A1A2E
- line-height: 1.3

**Contagem de palestrantes (abaixo do titulo):**
- font-size: 0.8125rem
- font-weight: 500
- color: var(--color-text-muted) #94A3B8
- margin-top: 0.25rem
- Texto: "XX palestrantes" (placeholder para dados dinamicos)

**CTA "Ver todas as categorias":**
- Posicionado abaixo do grid, margin-top: 2.5rem
- Alinhado a esquerda (mesmo alinhamento do header)
- font-size: 0.9375rem, font-weight: 600
- color: var(--color-accent) #E86A33
- display: inline-flex, align-items: center, gap: 0.5rem
- Seta: icone arrow-right SVG, 16x16, stroke-width 2
- Transicao da seta: translateX(0) → translateX(6px) no hover, 350ms ease-out

### Tipografia
- Label: font-size 0.75rem, font-weight 600, letter-spacing 0.12em, text-transform uppercase, color var(--color-accent)
- Titulo: font-family DM Serif Display, font-size clamp(2rem, 4vw, 3.25rem), color var(--color-text), line-height 1.15
- Subtitulo: font-size clamp(1rem, 1.5vw, 1.125rem), line-height 1.65, color var(--color-text-secondary)
- Titulo da categoria: font-family DM Sans, font-size 1rem / 1.375rem, font-weight 700
- Contagem: font-size 0.8125rem, font-weight 500

### Cores
- Background secao: #FAFAF9
- Cards: #FFFFFF, border #E2E8F0
- Card hover: border-color var(--color-accent) #E86A33
- Card hover glow: box-shadow 0 0 0 1px rgba(232,106,51,0.15), 0 8px 32px rgba(232,106,51,0.08)
- Icones: color var(--color-primary) #2E2B5F (default), color var(--color-accent) #E86A33 (hover)
- Celula SIPAT gradiente decorativo: rgba(232,106,51,0.06)

### Elementos Visuais
- Icones SVG inline para cada categoria (stroke-based, 2px stroke, 24x24 normais, 40x40 celula grande)
- Gradiente radial decorativo na celula SIPAT
- Borda inferior accent (3px) que aparece no hover via pseudo-elemento ::after
  - width: 0 → 100%, height: 3px, background: var(--color-accent)
  - position: absolute, bottom: 0, left: 0
  - transition: width 400ms var(--ease-out)

### Animacoes
- **Entrada dos cards:** Wave Stagger
  - Tipo: fade-up
  - Duracao: 600ms
  - Easing: var(--ease-out) cubic-bezier(0.16, 1, 0.3, 1)
  - Delay base: 100ms
  - Stagger: cada card com +60ms de delay (card 1: 100ms, card 2: 160ms, card 3: 220ms, ...)
  - O stagger segue ordem visual (esquerda→direita, topo→baixo) criando efeito onda
  - Trigger: elemento entra a 15% do viewport (AOS offset)
  - Transform: translateY(30px) + opacity 0 → translateY(0) + opacity 1

- **Label + titulo + subtitulo:** fade-up sequencial
  - Label: delay 0ms
  - Titulo: delay 80ms
  - Subtitulo: delay 160ms
  - Duracao: 700ms cada

- **Hover do card:**
  - Transform: translateY(-4px), 400ms var(--ease-spring)
  - Box-shadow: transicao 400ms
  - Border-color: transicao 300ms
  - Icone: color transicao 300ms + scale(1.1) 300ms var(--ease-spring)
  - Barra inferior ::after width: 0 → 100%, 400ms var(--ease-out)

### Interatividade
- **Hover card:** translateY(-4px) + glow shadow + border accent + icone muda cor + barra inferior aparece
- **Click card:** navega para /diretorio/?tema=[categoria] — cada card e um link
- **Focus card (teclado):** mesmo estilo visual do hover + outline: 2px solid var(--color-accent), outline-offset: 2px
- **Active card:** translateY(-2px), shadow reduzido

### Responsividade

**Tablet (<=960px):**
- grid-template-columns: repeat(3, 1fr)
- SIPAT: grid-column span 2 (mantem destaque mas em 3 cols)
- Motivacional: grid-column span 1, grid-row span 1 (perde a altura extra)
- Celulas largas: grid-column span 1 (voltam ao normal)
- gap: 0.875rem

**Mobile (<=768px):**
- grid-template-columns: repeat(2, 1fr)
- TODAS as celulas: grid-column span 1, grid-row span 1 (grid uniforme)
- SIPAT: grid-column span 2 (mantem destaque full-width)
- min-height: 120px
- padding: 1.25rem
- gap: 0.75rem
- Header da secao: centralizado (text-align center)
- Subtitulo: max-width 100%

**Mobile pequeno (<=480px):**
- grid-template-columns: repeat(2, 1fr)
- Mesmas regras do 768px
- gap: 0.625rem
- SIPAT: min-height 160px

---

## Secao 4: Palestrantes em Destaque

### Arquetipo e Constraints
- Arquetipo: Carousel Infinite (Scroll Horizontal)
- Constraints: Hover Lift, Scale In, Overlap Elements
- Justificativa: Carousel horizontal cria sensacao de abundancia e convida exploracao. Hover Lift destaca o card selecionado. Scale In na entrada surpreende com os cards "nascendo". Overlap com o titulo sangrando no visual cria conexao.

### Conteudo
- Label: "Quem esta na plataforma"
- Titulo: "Conheca quem esta movendo palcos"
- Subtitulo: "Palestrantes verificados e avaliados pela comunidade Avantik"
- Cards de palestrantes (6-8, dados do Supabase — layout para placeholders):
  - Foto (avatar placeholder com gradiente)
  - Nome
  - 2-3 tags de tema
  - Avaliacao (estrelas + numero)
  - Faixa de preco
- CTA: "Explorar todos os palestrantes" (botao accent)

### Layout
- Fundo: var(--color-surface) #FFFFFF
- Padding: var(--section-py) vertical

**Header da secao:**
- Container padrao (max-width 1200px)
- text-align: center
- Label: margin-bottom 0.75rem
- Titulo: margin-bottom 1rem
- Subtitulo: max-width 560px, margin: 0 auto 3rem

**Area do carousel:**
- width: 100vw (sai do container, sangra ambas as margens)
- overflow: hidden
- position: relative

**Track do carousel:**
- display: flex
- gap: 1.5rem
- padding: 1rem 0 2rem (espaco para sombra do hover)
- animation: scrollCarousel [duracao]s linear infinite
- O track contem os cards duplicados para loop infinito
- Padding lateral: calc((100vw - 1200px) / 2 + var(--container-px)) para alinhar primeiro card com container

**Cada card de palestrante:**
- width: 280px (fixo, nao flexivel)
- flex-shrink: 0
- background: var(--color-surface) #FFFFFF
- border: 1px solid var(--color-border) #E2E8F0
- border-radius: 1.25rem (20px)
- padding: 0
- overflow: hidden
- cursor: pointer
- transition: transform 400ms var(--ease-spring), box-shadow 400ms var(--ease-out)

**Estrutura interna do card:**

1. **Avatar area (topo):**
   - width: 100%, height: 200px
   - background: gradiente unico por card (placeholders):
     - Card 1: linear-gradient(135deg, #2E2B5F, #4340A0)
     - Card 2: linear-gradient(135deg, #E86A33, #F59E0B)
     - Card 3: linear-gradient(135deg, #10b981, #059669)
     - Card 4: linear-gradient(135deg, #8B5CF6, #6366F1)
     - Card 5: linear-gradient(135deg, #EC4899, #F43F5E)
     - Card 6: linear-gradient(135deg, #0EA5E9, #2E2B5F)
   - Quando houver foto real: object-fit cover
   - Overlay sutil no bottom: linear-gradient(to top, rgba(0,0,0,0.03) 0%, transparent 40%)

2. **Info area (padding 1.25rem 1.5rem 1.5rem):**
   - **Nome:** font-family DM Sans, font-size 1.0625rem, font-weight 700, color var(--color-text), margin-bottom 0.5rem
   - **Tags:** display flex, flex-wrap wrap, gap 0.375rem, margin-bottom 1rem
     - Cada tag: font-size 0.6875rem, font-weight 600, padding 0.25rem 0.625rem, background var(--color-accent-light), color var(--color-accent), border-radius 100px
   - **Bottom row:** display flex, justify-content space-between, align-items center, padding-top 0.875rem, border-top 1px solid var(--color-border)
     - Rating: font-size 0.8125rem, font-weight 600, color #F59E0B, icone estrela preenchida antes
     - Preco: font-size 0.8125rem, font-weight 600, color var(--color-text-secondary)

**CTA abaixo do carousel:**
- Container padrao
- text-align: center
- margin-top: 2.5rem
- Botao: classe btn btn--accent btn--lg
  - background: var(--color-accent)
  - color: #FFFFFF
  - padding: 1rem 2rem
  - border-radius: 0.75rem
  - font-size: 1rem, font-weight: 600

**Controles do carousel (opcionais, para pause/resume):**
- Nenhum botao de seta — o carousel e automatico e infinito
- Pausa no hover (mouseenter no track)
- Resume no mouseleave

### Tipografia
- Label: font-size 0.75rem, font-weight 600, letter-spacing 0.12em, text-transform uppercase, color var(--color-accent)
- Titulo: font-family DM Serif Display, font-size clamp(2rem, 4vw, 3.25rem), color var(--color-text), line-height 1.15
- Subtitulo: font-size clamp(1rem, 1.5vw, 1.125rem), line-height 1.65, color var(--color-text-secondary)
- Nome palestrante: DM Sans, 1.0625rem, weight 700
- Tags: DM Sans, 0.6875rem, weight 600
- Rating: DM Sans, 0.8125rem, weight 600
- Preco: DM Sans, 0.8125rem, weight 600

### Cores
- Background secao: #FFFFFF
- Cards: #FFFFFF, border #E2E8F0
- Card hover: box-shadow 0 16px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)
- Tags: background rgba(232,106,51,0.08), color #E86A33
- Rating estrela: #F59E0B
- Preco: #64748B

### Elementos Visuais
- Mascara de fade nas laterais do carousel para indicar continuidade:
  - Esquerda: linear-gradient(to right, var(--color-surface) 0%, transparent 8%)
  - Direita: linear-gradient(to left, var(--color-surface) 0%, transparent 8%)
  - Position: absolute, top 0, bottom 0, width 120px, z-index 2, pointer-events none
- Avatars com gradientes unicos (cores listadas acima)
- Overlay sutil nos avatars para texto leavel quando houver foto

### Animacoes
- **Carousel scroll automatico:**
  - @keyframes scrollCarousel { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  - Duracao: calculada baseada em numero de cards (aprox 30s para 6 cards)
  - timing-function: linear
  - iteration-count: infinite
  - Pausa no hover: animation-play-state: paused

- **Entrada da secao:**
  - Header (label + titulo + subtitulo): fade-up stagger, 700ms, delay 0/80/160ms
  - Carousel: fade-in + scale(0.98) → scale(1), 800ms, delay 300ms
  - CTA: fade-up, 600ms, delay 500ms

- **Hover do card:**
  - Transform: translateY(-8px), 400ms var(--ease-spring)
  - Box-shadow: 0 16px 48px rgba(0,0,0,0.1), 400ms var(--ease-out)
  - z-index: aumenta para 3 (card aparece acima dos vizinhos)

### Interatividade
- **Hover card:** lift -8px + shadow amplificada + z-index boost
- **Click card:** navega para /palestrante/[slug]
- **Hover carousel:** pausa a animacao de scroll
- **Touch (mobile):** swipe horizontal habilitado via touch-action: pan-x
- **Focus card (teclado):** outline 2px solid var(--color-accent), outline-offset 4px
- **Reduced motion:** carousel para, cards ficam estaticos em grid

### Responsividade

**Tablet (<=960px):**
- Card width: 260px
- Avatar height: 180px
- Gap: 1.25rem

**Mobile (<=768px):**
- Carousel substitui por grid scrollavel horizontal (sem animacao automatica)
- overflow-x: auto, scroll-snap-type: x mandatory
- Cada card: scroll-snap-align: start
- Card width: 260px
- Fade masks: width 60px
- Scrollbar: display none (webkit-scrollbar)
- padding-left / padding-right: var(--container-px)
- CTA: width 100%, centralizado

**Mobile pequeno (<=480px):**
- Card width: 240px
- Avatar height: 160px
- padding info: 1rem 1.25rem 1.25rem

---

## Secao 5: Por que a Avantik

### Arquetipo e Constraints
- Arquetipo: Broken Grid + Overlapping Grid
- Constraints: Counter Animation, Overlap Elements, Hover Color
- Justificativa: Broken grid cria dinamismo visual e foge do padrao "4 cards lado a lado". Os elementos sobrepostos criam profundidade. Counter animation nos numeros adiciona vida. Cada diferencial tem personalidade propria pela assimetria.

### Conteudo
- Label: "Diferenciais"
- Titulo: "Por que mais de 200 palestrantes escolheram a Avantik"
- Diferencial 1:
  - Titulo: "Visibilidade real, nao promessa"
  - Texto: "Investimos em trafego e marketing para que seu perfil seja encontrado por quem realmente contrata."
  - Numero destaque: "+200" (palestrantes)
- Diferencial 2:
  - Titulo: "Programa Apogeu do Palestrante"
  - Texto: "Nosso programa exclusivo desenvolve sua carreira nos 4 pilares: Conteudo, Performance, Apresentacao e Posicionamento."
  - Numero destaque: "4" (pilares)
- Diferencial 3:
  - Titulo: "Sem comissao sobre o cache"
  - Texto: "Diferente de agencias tradicionais, nao ficamos com parte do seu cache. Voce recebe 100% do valor contratado."
  - Numero destaque: "100%" (do valor)
- Diferencial 4:
  - Titulo: "Comunidade ativa de palestrantes"
  - Texto: "Troca de experiencias, networking e oportunidades compartilhadas entre profissionais que vivem de palco."
  - Numero destaque: "+50" (temas)

### Layout
- Fundo: var(--color-bg) #FAFAF9
- Padding: var(--section-py) vertical
- Container: max-width 1200px

**Header da secao:**
- text-align: center
- Label: margin-bottom 0.75rem
- Titulo: max-width 700px, margin: 0 auto 4rem, font-size clamp(2rem, 4vw, 3.25rem)

**Grid dos diferenciais (Broken Grid):**
- display: grid
- grid-template-columns: repeat(12, 1fr)
- grid-template-rows: auto
- gap: 1.5rem
- row-gap: 2rem

**Posicionamento dos 4 cards (assimetrico, sobreposicoes intencionais):**

- **Diferencial 1 (grande, esquerda):**
  - grid-column: 1 / 7 (6 colunas)
  - grid-row: 1
  - margin-top: 0

- **Diferencial 2 (medio, direita, levemente sobreposto):**
  - grid-column: 6 / 13 (7 colunas — overlap de 1 coluna com o card 1)
  - grid-row: 1
  - margin-top: 3rem (offset vertical cria dinamismo)
  - z-index: 2

- **Diferencial 3 (medio, esquerda, row 2):**
  - grid-column: 2 / 8 (6 colunas — offset de 1 coluna do edge)
  - grid-row: 2
  - margin-top: -2rem (puxa para cima, overlap com row 1)

- **Diferencial 4 (medio, direita, row 2):**
  - grid-column: 7 / 12 (5 colunas)
  - grid-row: 2
  - margin-top: 1rem

**Cada card diferencial:**
- background: var(--color-surface) #FFFFFF
- border: 1px solid var(--color-border) #E2E8F0
- border-radius: 1.5rem (24px)
- padding: 2.5rem (40px)
- position: relative
- overflow: hidden
- transition: transform 400ms var(--ease-spring), box-shadow 400ms var(--ease-out)

**Estrutura interna de cada card:**

1. **Numero destaque (canto superior direito):**
   - position: absolute
   - top: 1.5rem, right: 2rem
   - font-family: DM Serif Display
   - font-size: clamp(3rem, 5vw, 5rem)
   - color: rgba(232,106,51,0.08) — quase invisivel, como marca dagua
   - line-height: 1
   - font-weight: 400
   - Animacao: counter que sobe de 0 ate o valor final quando entra na viewport
   - Apos counter terminar: fade de opacity 0.08 → 0.12 sutil

2. **Icone/forma decorativa (topo-esquerdo):**
   - Um circulo pequeno com icone minimalista
   - width: 48px, height: 48px
   - background: var(--color-accent-light) rgba(232,106,51,0.08)
   - border-radius: 12px
   - display: flex, align-items: center, justify-content: center
   - Icone SVG: 20x20, stroke var(--color-accent), stroke-width 2
   - margin-bottom: 1.5rem
   - Transicao hover: background → rgba(232,106,51,0.15), icone → scale(1.1), 300ms

3. **Titulo do diferencial:**
   - font-family: DM Sans
   - font-size: 1.25rem
   - font-weight: 700
   - color: var(--color-text) #1A1A2E
   - line-height: 1.3
   - margin-bottom: 0.75rem

4. **Texto do diferencial:**
   - font-size: 0.9375rem
   - line-height: 1.65
   - color: var(--color-text-secondary) #64748B
   - max-width: 400px

**Elemento decorativo da secao:**
- Uma linha curva SVG sutil conectando os 4 cards
  - stroke: var(--color-border) #E2E8F0
  - stroke-width: 1px
  - stroke-dasharray: 8 4
  - position: absolute (relativo ao grid)
  - z-index: 0 (atras dos cards)
  - opacity: 0.5
  - Animacao: stroke-dashoffset de 0 a -100 em 20s linear infinite (linha "caminha")
  - Visivel apenas em desktop (>=960px)

### Tipografia
- Label: 0.75rem, weight 600, tracking 0.12em, uppercase, accent
- Titulo secao: DM Serif Display, clamp(2rem, 4vw, 3.25rem), line-height 1.15
- Titulo card: DM Sans, 1.25rem, weight 700, line-height 1.3
- Texto card: DM Sans, 0.9375rem, weight 400, line-height 1.65
- Numero watermark: DM Serif Display, clamp(3rem, 5vw, 5rem), weight 400

### Cores
- Background secao: #FAFAF9
- Cards: #FFFFFF, border #E2E8F0
- Card hover: box-shadow 0 12px 40px rgba(0,0,0,0.06), border-color transparent
- Numero watermark: rgba(232,106,51,0.08) → rgba(232,106,51,0.12) apos animacao
- Icone area: bg rgba(232,106,51,0.08), icone stroke #E86A33
- Icone hover: bg rgba(232,106,51,0.15)

### Elementos Visuais
- Icones SVG para cada diferencial:
  - Visibilidade: icone de olho / radar
  - Programa: icone de trofeu / estrela
  - Sem comissao: icone de cifrao com risco / 100%
  - Comunidade: icone de pessoas / grupo
- Numeros watermark em cada card
- Linha curva tracejada conectando cards (desktop apenas)
- Gradiente radial sutil no background da secao: radial-gradient(ellipse at 20% 50%, rgba(46,43,95,0.02) 0%, transparent 50%)

### Animacoes
- **Entrada dos cards:**
  - Card 1: fade-up, 700ms, delay 0ms
  - Card 2: fade-up, 700ms, delay 150ms
  - Card 3: fade-up, 700ms, delay 300ms
  - Card 4: fade-up, 700ms, delay 450ms
  - Trigger: AOS, threshold 15%

- **Counter animation nos numeros:**
  - Tipo: countUp de 0 ao valor (usando JS ou CSS counter)
  - Duracao: 2000ms
  - Easing: ease-out
  - Trigger: card entra na viewport
  - "+200": 0 → 200, com "+" prefixado
  - "4": 0 → 4
  - "100%": 0% → 100%
  - "+50": 0 → 50, com "+" prefixado
  - Numeros arredondam durante contagem

- **Linha tracejada SVG:**
  - stroke-dashoffset animado: 20s linear infinite
  - Aparece com fade-in 1000ms ao entrar na viewport

- **Hover card:**
  - translateY(-6px), 400ms var(--ease-spring)
  - box-shadow amplificada, 400ms
  - Icone area: background intensifica, icone scale(1.1), 300ms

### Interatividade
- **Hover card:** lift -6px + shadow + icone reage
- **Focus card:** outline 2px solid var(--color-accent), outline-offset 4px
- **Cards nao sao clicaveis** (apenas informacionais) — sem cursor pointer

### Responsividade

**Tablet (<=960px):**
- grid-template-columns: repeat(2, 1fr) (grid simples 2 colunas)
- Todos os cards: grid-column auto (sem posicionamento especial)
- margin-top: 0 em todos
- gap: 1.25rem
- Linha SVG decorativa: display none

**Mobile (<=768px):**
- grid-template-columns: 1fr
- Cards empilhados verticalmente
- padding: 2rem
- gap: 1.5rem
- Numeros watermark: font-size 3rem, opacity 0.06

**Mobile pequeno (<=480px):**
- padding cards: 1.5rem
- Titulo card: font-size 1.125rem
- Numeros watermark: display none (limpa a area)

---

## Secao 6: Prova Social

### Arquetipo e Constraints
- Arquetipo: Editorial + Layered
- Constraints: Glassmorphism, Texto com Gradiente, Fade Up
- Justificativa: Layout editorial da credibilidade e sofisticacao. Camadas com glassmorphism criam profundidade. O gradiente no titulo adiciona sutileza. Diferente completamente das secoes anteriores — fundo escuro inverte o tom.

### Conteudo
- Label: "Depoimentos"
- Titulo: "O que dizem sobre a Avantik"
- Depoimentos (3):
  1. Nome: "(nome de cliente)", Cargo: "Coordenadora de T&D"
     - "Precisavamos de um palestrante para SIPAT em menos de 2 semanas. Na Avantik encontramos, comparamos e fechamos em 3 dias. A palestra foi um sucesso."
  2. Nome: "(nome de palestrante)", Cargo: "Palestrante de Lideranca"
     - "Desde que entrei na plataforma, recebi 4 propostas no primeiro mes. A visibilidade que a Avantik me deu mudou minha carreira."
  3. Nome: "(nome de cliente)", Cargo: "Gerente de RH"
     - "Chega de ligar para agencia e esperar orcamento. Na Avantik eu filtro, comparo e decido na hora. E os palestrantes sao realmente bons."
- Logos de empresas: faixa de logos (placeholders)

### Layout
- **INVERSAO DE FUNDO:** Esta secao usa fundo escuro para criar contraste dramatico
- Background: var(--color-primary) #2E2B5F
- Background addional: gradiente sutil radial-gradient(ellipse at 30% 20%, rgba(67,64,160,0.4) 0%, transparent 50%)
- Padding: var(--section-py) vertical
- Container: max-width 1200px
- border-radius: 2rem (32px) — secao com cantos arredondados (dentro de uma div wrapper com margin horizontal de var(--container-px))
- Ou alternativa: secao full-width sem cantos arredondados. **Usar cantos arredondados** para elegancia.

**Header da secao:**
- text-align: center
- Label: color rgba(255,255,255,0.5)
- Titulo: color #FFFFFF
- margin-bottom: 4rem

**Grid de depoimentos:**
- display: grid
- grid-template-columns: repeat(3, 1fr)
- gap: 1.5rem
- align-items: start

**Cada card de depoimento:**
- background: rgba(255,255,255,0.06) — glassmorphism
- backdrop-filter: blur(12px)
- -webkit-backdrop-filter: blur(12px)
- border: 1px solid rgba(255,255,255,0.1)
- border-radius: 1.25rem (20px)
- padding: 2rem (32px)
- position: relative
- transition: transform 400ms var(--ease-spring), background 300ms, border-color 300ms

**Estrutura interna do card de depoimento:**

1. **Aspas decorativas (topo):**
   - Icone de aspas SVG grande
   - width: 32px, height: 32px
   - color: var(--color-accent) #E86A33
   - opacity: 0.6
   - margin-bottom: 1.25rem

2. **Texto do depoimento:**
   - font-family: DM Sans
   - font-size: 1rem
   - font-weight: 400
   - font-style: italic
   - line-height: 1.7
   - color: rgba(255,255,255,0.85)
   - margin-bottom: 1.5rem

3. **Info do autor (bottom):**
   - display: flex, align-items: center, gap: 0.875rem
   - padding-top: 1.25rem
   - border-top: 1px solid rgba(255,255,255,0.08)

   **Avatar placeholder:**
   - width: 44px, height: 44px
   - border-radius: 50%
   - background: linear-gradient(135deg, var(--color-accent), #F59E0B)
   - flex-shrink: 0

   **Nome:**
   - font-size: 0.9375rem, font-weight: 600, color: #FFFFFF
   - line-height: 1.3

   **Cargo:**
   - font-size: 0.8125rem, font-weight: 400, color: rgba(255,255,255,0.5)
   - line-height: 1.3

**Faixa de logos (abaixo dos depoimentos):**
- margin-top: 4rem
- display: flex
- align-items: center
- justify-content: center
- gap: 3rem
- flex-wrap: wrap
- Cada logo:
  - height: 28px, width auto
  - filter: brightness(0) invert(1) — logos ficam brancos
  - opacity: 0.3
  - transition: opacity 300ms
  - Hover: opacity 0.6
- Quando nao houver logos reais: exibir 5-6 placeholders retangulares
  - width: 100px, height: 28px
  - background: rgba(255,255,255,0.06)
  - border-radius: 6px

### Tipografia
- Label: 0.75rem, weight 600, tracking 0.12em, uppercase, rgba(255,255,255,0.5)
- Titulo: DM Serif Display, clamp(2rem, 4vw, 3.25rem), color #FFFFFF, line-height 1.15
  - **Elemento especial:** a palavra "Avantik" no titulo com gradiente de texto
  - background: linear-gradient(135deg, #E86A33, #F59E0B)
  - -webkit-background-clip: text
  - -webkit-text-fill-color: transparent
  - background-clip: text
- Texto depoimento: DM Sans, 1rem, italic, line-height 1.7, rgba(255,255,255,0.85)
- Nome autor: DM Sans, 0.9375rem, weight 600, #FFFFFF
- Cargo autor: DM Sans, 0.8125rem, weight 400, rgba(255,255,255,0.5)

### Cores
- Background secao: #2E2B5F + gradiente radial
- Cards glassmorphism: rgba(255,255,255,0.06), border rgba(255,255,255,0.1)
- Cards hover: rgba(255,255,255,0.1), border rgba(255,255,255,0.18)
- Texto depoimento: rgba(255,255,255,0.85)
- Texto secundario: rgba(255,255,255,0.5)
- Aspas: #E86A33 com opacity 0.6
- Avatar gradiente: #E86A33 → #F59E0B
- Logos: white com opacity 0.3

### Elementos Visuais
- Aspas SVG decorativas em cada card (aspas duplas abertas)
- Gradiente de texto na palavra "Avantik"
- Glassmorphism nos cards (blur + transparencia)
- Gradiente radial no fundo para profundidade
- Avatares com gradientes unicos
- Faixa de logos em branco

**Elemento decorativo sutil:**
- Um circulo grande com borda tracejada
- position: absolute
- width: 400px, height: 400px
- border: 1px dashed rgba(255,255,255,0.05)
- border-radius: 50%
- top: -100px, right: -100px
- Animacao: rotate 60s linear infinite
- pointer-events: none, z-index: 0

### Animacoes
- **Entrada:**
  - Header: fade-up, 700ms, delay 0ms
  - Card 1: fade-up, 700ms, delay 150ms
  - Card 2: fade-up, 700ms, delay 300ms
  - Card 3: fade-up, 700ms, delay 450ms
  - Logos: fade-in, 800ms, delay 600ms

- **Hover card:**
  - translateY(-4px), 400ms var(--ease-spring)
  - background: rgba(255,255,255,0.06) → rgba(255,255,255,0.1)
  - border-color: rgba(255,255,255,0.1) → rgba(255,255,255,0.18)

- **Circulo decorativo:**
  - rotate: 0deg → 360deg, 60s linear infinite
  - Opacity: fade-in 1500ms ao entrar viewport

### Interatividade
- **Hover card:** lift sutil + background claro + border clara
- **Hover logo:** opacity 0.3 → 0.6
- **Focus card (teclado):** outline 2px solid var(--color-accent), outline-offset 4px
- **Cards nao sao clicaveis**

### Responsividade

**Tablet (<=960px):**
- grid-template-columns: repeat(2, 1fr)
- Card 3: grid-column span 2, max-width 480px, margin 0 auto
- gap: 1.25rem
- Wrapper com margin horizontal: 1rem (para ver cantos arredondados)

**Mobile (<=768px):**
- grid-template-columns: 1fr
- Cards empilhados
- gap: 1rem
- padding cards: 1.5rem
- border-radius da secao: 1.5rem
- Logos: gap 2rem
- Logo height: 24px
- Circulo decorativo: display none

**Mobile pequeno (<=480px):**
- border-radius da secao: 1rem
- padding cards: 1.25rem
- Logos: display grid, grid-template-columns repeat(3, 1fr), gap 1rem, justify-items center

---

## Secao 7: CTA Final

### Arquetipo e Constraints
- Arquetipo: Single Focus + Split Revelador
- Constraints: Gradiente Animado, Breathing Loop, Hover Scale
- Justificativa: CTA final deve ser impossivel de ignorar. Single Focus centraliza atencao. O split revelador com tabs mostra conteudo diferente para cada publico. Gradiente animado sutil no fundo cria vitalidade. Breathing loop no botao principal atrai o clique.

### Conteudo
**Tab RH/Empresa:**
- Titulo: "Seu proximo evento merece o palestrante certo"
- Texto: "Busque entre centenas de profissionais qualificados. Filtre por tema, preco e avaliacao. Comece gratuitamente."
- CTA: "Buscar Palestrantes Agora"

**Tab Palestrante:**
- Titulo: "Sua carreira merece mais palcos"
- Texto: "Cadastre seu perfil e seja encontrado por empresas de todo o Brasil. Planos a partir de R$ XX/mes."
- CTA: "Criar Meu Perfil"

### Layout
- Fundo: var(--color-bg) #FAFAF9
- Padding: var(--section-py) vertical
- Container: max-width 1200px

**Card central:**
- max-width: 800px
- margin: 0 auto
- background: var(--color-surface) #FFFFFF
- border: 1px solid var(--color-border) #E2E8F0
- border-radius: 2rem (32px)
- padding: clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)
- text-align: center
- position: relative
- overflow: hidden

**Background decorativo do card:**
- Gradiente animado sutil no fundo
- background: radial-gradient(ellipse at 50% 0%, rgba(232,106,51,0.04) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(46,43,95,0.03) 0%, transparent 50%)
- A posicao do gradiente anima sutilmente:
  - @keyframes ctaGradient { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } 100% { background-position: 0% 0%; } }
  - duracao: 8s, ease-in-out, infinite

**Tabs dentro do card:**
- display: flex, justify-content: center, gap: 0
- margin-bottom: 2.5rem
- Estilo identico ao hero tabs (consistencia)
  - border-bottom: 2px solid var(--color-border)
  - Cada tab: padding 0.75rem 1.5rem, font-size 0.9375rem, weight 600
  - Tab ativa: color var(--color-text), underline accent 2px animado scaleX

**Titulo do CTA:**
- font-family: DM Serif Display
- font-size: clamp(1.75rem, 3.5vw, 2.75rem)
- color: var(--color-text) #1A1A2E
- line-height: 1.2
- margin-bottom: 1.25rem
- max-width: 560px
- margin-left: auto, margin-right: auto

**Texto do CTA:**
- font-size: clamp(1rem, 1.5vw, 1.125rem)
- line-height: 1.65
- color: var(--color-text-secondary) #64748B
- margin-bottom: 2.5rem
- max-width: 480px
- margin-left: auto, margin-right: auto

**Botao CTA:**
- classe btn btn--accent btn--lg mas MAIOR que o padrao
- padding: 1.125rem 2.5rem
- font-size: 1.0625rem
- border-radius: 0.875rem
- **Breathing animation:**
  - @keyframes ctaBreath { 0%, 100% { box-shadow: 0 4px 20px rgba(232,106,51,0.2); } 50% { box-shadow: 0 8px 32px rgba(232,106,51,0.35); } }
  - duracao: 3s, ease-in-out, infinite
  - Pausa no hover (animation-play-state: paused quando hover ativo)

**Transicao entre tabs:**
- Conteudo (titulo + texto + CTA) faz crossfade
- Saida: opacity 1 → 0, translateY(0) → translateY(-8px), 250ms
- Entrada: opacity 0 → 1, translateY(8px) → translateY(0), 350ms
- Total: 600ms por troca

### Tipografia
- Titulo: DM Serif Display, clamp(1.75rem, 3.5vw, 2.75rem), line-height 1.2, color #1A1A2E
- Texto: DM Sans, clamp(1rem, 1.5vw, 1.125rem), line-height 1.65, color #64748B
- Tab label: DM Sans, 0.9375rem, weight 600
- Botao: DM Sans, 1.0625rem, weight 600

### Cores
- Background secao: #FAFAF9
- Card: #FFFFFF, border #E2E8F0
- Gradiente decorativo: rgba(232,106,51,0.04) + rgba(46,43,95,0.03)
- Botao: background #E86A33, hover #D45A28, text #FFFFFF
- Botao glow: rgba(232,106,51,0.2) → rgba(232,106,51,0.35)

### Elementos Visuais
- Gradiente animado sutil no background do card
- Breathing glow no botao CTA
- Tabs com underline accent animado
- Cantos arredondados generosos (2rem)
- Possivel: particulas/pontos decorativos muito sutis nos cantos do card
  - 3-4 circulos pequenos (4px-8px)
  - position: absolute
  - background: rgba(232,106,51,0.1) e rgba(46,43,95,0.08)
  - animacao: float sutil, 6-10s, ease-in-out, infinite

### Animacoes
- **Entrada da secao:**
  - Card inteiro: scale(0.96) + opacity 0 → scale(1) + opacity 1
  - Duracao: 800ms
  - Easing: var(--ease-out)
  - Trigger: AOS, threshold 15%

- **Breathing do botao:**
  - Box-shadow pulsa: 3s ease-in-out infinite
  - Pausa no hover

- **Gradiente do background:**
  - Background-position anima: 8s ease-in-out infinite

- **Hover botao:**
  - Scale(1.03), 300ms var(--ease-spring)
  - Background: #E86A33 → #D45A28
  - Box-shadow fixo (breathing pausa): 0 12px 32px rgba(232,106,51,0.4)

- **Tab switch:**
  - Crossfade 600ms total (250ms out + 350ms in)

### Interatividade
- **Tabs:** switch conteudo com crossfade
- **Hover botao:** scale up + cor escurece + shadow fixa
- **Active botao:** scale(1.01), shadow reduzida
- **Focus botao:** outline 2px solid var(--color-primary), outline-offset 4px
- **Focus tab:** outline 2px dashed var(--color-accent), outline-offset 2px

### Responsividade

**Mobile (<=768px):**
- Card padding: 2.5rem 1.5rem
- border-radius: 1.5rem
- Titulo: max-width 100%
- Texto: max-width 100%
- Botao: width 100%
- Particulas decorativas: display none

**Mobile pequeno (<=480px):**
- Card padding: 2rem 1.25rem
- border-radius: 1.25rem
- Breathing animation: desabilitada (prefers-reduced-motion ou < 480px)

---

## Secao 8: Footer

### Arquetipo e Constraints
- Arquetipo: Balanced (densidade equilibrada)
- Constraints: Selective Color, Hover Underline
- Justificativa: Footer precisa de informacao densa organizada com clareza. Balanced equilibra conteudo sem parecer vazio nem abarrotado. Selective color mantem accent apenas nos links importantes. Hover underline da feedback.

### Conteudo
- Logo: "Avantik" + "Apogeu do Palestrante"
- Links Rapidos: Encontrar Palestrantes, Para Palestrantes, Sobre, Blog, Contato
- Legal: Politica de Privacidade, Termos e Condicoes, Contrato do Assinante
- Contato: (31) 99386-1408, contato@avantik.com.br
- Redes Sociais: Instagram (@apogeudopalestrante), Facebook, YouTube, WhatsApp
- Copyright: 2025 Avantik. Todos os direitos reservados.

### Layout
- Fundo: var(--color-text) #1A1A2E (escuro — contraste com CTA anterior)
- Padding-top: clamp(4rem, 8vw, 6rem)
- Padding-bottom: 2rem
- Container: max-width 1200px

**Grid principal do footer:**
- display: grid
- grid-template-columns: 1.5fr 1fr 1fr 1fr
- gap: 3rem
- padding-bottom: 3rem
- border-bottom: 1px solid rgba(255,255,255,0.08)

**Coluna 1 — Marca:**
- **Logo:**
  - "Avantik": font-family DM Serif Display, font-size 1.75rem, color #FFFFFF, line-height 1.1
  - "Apogeu do Palestrante": font-size 0.625rem, weight 500, letter-spacing 0.08em, uppercase, color rgba(255,255,255,0.4)
  - margin-bottom: 1.25rem
- **Descricao breve:**
  - "Conectando empresas aos melhores palestrantes do Brasil."
  - font-size: 0.875rem, line-height 1.6, color rgba(255,255,255,0.5)
  - max-width: 280px
  - margin-bottom: 1.5rem
- **Redes sociais:**
  - display: flex, gap: 0.75rem
  - Cada icone: width 36px, height 36px, border-radius 8px
  - background: rgba(255,255,255,0.06)
  - display flex, align-items center, justify-content center
  - Icone SVG: 18x18, fill rgba(255,255,255,0.5)
  - Hover: background rgba(255,255,255,0.12), fill #FFFFFF, transition 300ms

**Coluna 2 — Links Rapidos:**
- **Titulo coluna:** "Navegacao"
  - font-size: 0.8125rem, font-weight: 700, text-transform uppercase, letter-spacing 0.08em
  - color: rgba(255,255,255,0.3)
  - margin-bottom: 1.25rem
- **Links:** lista vertical, gap 0.75rem
  - font-size: 0.9375rem, font-weight 400, color rgba(255,255,255,0.6)
  - Hover: color #FFFFFF, transition 250ms
  - Underline animado no hover (como header links): width 0 → 100%, height 1px, background var(--color-accent), transition 350ms

**Coluna 3 — Legal:**
- **Titulo coluna:** "Legal"
  - Mesmo estilo do titulo col 2
- **Links:** lista vertical, gap 0.75rem
  - Mesmo estilo dos links col 2

**Coluna 4 — Contato:**
- **Titulo coluna:** "Contato"
  - Mesmo estilo do titulo col 2
- **Telefone:**
  - display: flex, align-items: center, gap: 0.5rem
  - Icone phone SVG: 16x16, stroke rgba(255,255,255,0.5)
  - "(31) 99386-1408": font-size 0.9375rem, color rgba(255,255,255,0.6)
  - Link tel: href="tel:+5531993861408"
  - Hover: color #FFFFFF
  - margin-bottom: 0.5rem
- **Email:**
  - Mesmo layout do telefone
  - Icone mail SVG: 16x16
  - "contato@avantik.com.br"
  - Link mailto:
  - margin-bottom: 1rem
- **Badge WhatsApp:**
  - display: inline-flex, align-items: center, gap: 0.5rem
  - background: rgba(37,211,102,0.1)
  - border: 1px solid rgba(37,211,102,0.2)
  - border-radius: 8px
  - padding: 0.5rem 1rem
  - Icone WhatsApp SVG: 16x16, fill #25D366
  - "Fale pelo WhatsApp": font-size 0.8125rem, weight 600, color #25D366
  - Hover: background rgba(37,211,102,0.18), border-color rgba(37,211,102,0.3)
  - Link: href="https://wa.me/5531993861408"

**Barra inferior (copyright):**
- margin-top: 2rem
- display: flex, justify-content: space-between, align-items: center
- **Copyright:**
  - font-size: 0.8125rem, color rgba(255,255,255,0.3)
  - "© 2025 Avantik. Todos os direitos reservados."
- **Badge "Feito com ♥":** (opcional)
  - font-size: 0.75rem, color rgba(255,255,255,0.2)
  - "Feito com cuidado em BH"

### Tipografia
- Logo nome: DM Serif Display, 1.75rem, #FFFFFF
- Logo tagline: DM Sans, 0.625rem, weight 500, tracking 0.08em, uppercase
- Descricao: DM Sans, 0.875rem, weight 400, line-height 1.6
- Titulo coluna: DM Sans, 0.8125rem, weight 700, tracking 0.08em, uppercase
- Links: DM Sans, 0.9375rem, weight 400
- Contato: DM Sans, 0.9375rem, weight 400
- WhatsApp badge: DM Sans, 0.8125rem, weight 600
- Copyright: DM Sans, 0.8125rem, weight 400

### Cores
- Background: #1A1A2E
- Texto principal: #FFFFFF
- Texto secundario: rgba(255,255,255,0.6)
- Texto terciario: rgba(255,255,255,0.3)
- Titulos coluna: rgba(255,255,255,0.3)
- Borders: rgba(255,255,255,0.08)
- Icones sociais bg: rgba(255,255,255,0.06), hover rgba(255,255,255,0.12)
- Icones sociais fill: rgba(255,255,255,0.5), hover #FFFFFF
- Underline hover: var(--color-accent) #E86A33
- WhatsApp: #25D366
- WhatsApp bg: rgba(37,211,102,0.1)

### Elementos Visuais
- Icones SVG para redes sociais (Instagram, Facebook, YouTube, WhatsApp)
- Icones SVG para contato (phone, mail)
- Underline animado nos links (accent color)
- Badge WhatsApp com cor verde propria
- Nenhum elemento decorativo excessivo — footer e funcional

### Animacoes
- **Nenhuma animacao de entrada** — footer aparece naturalmente com scroll
- **Hover links:** color transition 250ms, underline width 350ms var(--ease-out)
- **Hover icones sociais:** background + fill 300ms
- **Hover WhatsApp badge:** background + border 300ms

### Interatividade
- **Links:** navegacao para paginas internas ou externas
- **Telefone:** link tel: abre discador
- **Email:** link mailto: abre email client
- **WhatsApp:** link wa.me abre WhatsApp
- **Redes sociais:** links externos (target="_blank", rel="noopener noreferrer")
- **Hover:** todos os links com feedback visual (cor + underline)
- **Focus:** outline 2px dashed rgba(255,255,255,0.4), outline-offset 2px

### Responsividade

**Tablet (<=960px):**
- grid-template-columns: repeat(2, 1fr)
- Coluna Marca: grid-column span 2
- gap: 2.5rem
- Redes sociais: ficam ao lado da descricao (flex-wrap)

**Mobile (<=768px):**
- grid-template-columns: 1fr
- Todas as colunas empilhadas
- gap: 2rem
- text-align: center (ou left — manter left para consistencia)
- Redes sociais: justify-content center (se text-align center)
- Barra copyright: flex-direction column, gap 0.5rem, text-align center

**Mobile pequeno (<=480px):**
- Mesmas regras do 768px
- Logo: font-size 1.5rem
- Descricao: max-width 100%

---

## Resumo dos Arquetipos e Constraints

| Secao | Arquetipo | Constraints |
|-------|-----------|-------------|
| 1. Header | Sticky Header | Glassmorphism, Hover Underline |
| 2. Hero | Split Assimetrico | Headline >150px, Selective Color, Hover Lift, Float Loop |
| 3. Como Funciona | Contained Center | Tabs, Stagger, Fade Up |
| 4. Categorias de Temas | Bento Box | Hover Glow, Wave Stagger, Selective Color |
| 5. Palestrantes em Destaque | Carousel Infinite | Hover Lift, Scale In, Overlap Elements |
| 6. Por que a Avantik | Broken Grid + Overlapping | Counter Animation, Overlap Elements, Hover Color |
| 7. Prova Social | Editorial + Layered | Glassmorphism, Texto com Gradiente, Fade Up |
| 8. CTA Final | Single Focus + Split Revelador | Gradiente Animado, Breathing Loop, Hover Scale |
| 9. Footer | Balanced | Selective Color, Hover Underline |

---

## Elementos Encantadores e Detalhes de Craft

### Micro-interacoes Planejadas
1. **Bento Box hover glow** — cards de categoria com glow laranja sutil que convida ao clique
2. **Counter animation** — numeros que sobem de 0 ao valor nos diferenciais, com easing natural
3. **Carousel auto-pause** — carousel de palestrantes pausa no hover, respeita o usuario
4. **Breathing CTA** — botao final com box-shadow pulsante que inconscientemente atrai atencao
5. **Underlines animados** — todos os links de texto com underline que cresce horizontalmente
6. **Tab crossfade** — troca de conteudo por tabs com animacao suave de fade+translateY

### Transicoes entre Secoes
1. Hero (claro) → Como Funciona (branco) — transicao suave, mesma familia visual
2. Como Funciona (branco) → Categorias (claro) — alternancia leve de background
3. Categorias (claro) → Palestrantes (branco) — alternancia mantida
4. Palestrantes (branco) → Diferenciais (claro) — volta ao claro
5. Diferenciais (claro) → Prova Social (**escuro** — ruptura intencional e dramatica)
6. Prova Social (escuro) → CTA Final (claro — volta ao claro com contraste)
7. CTA Final (claro) → Footer (**escuro** — fecha com peso)

A alternancia claro/branco/escuro cria ritmo visual e evita monotonia.

### Detalhes que Surpreendem
1. **Linha tracejada SVG** nos diferenciais que "caminha" infinitamente
2. **Circulo decorativo rotacionando** na prova social — quase subliminar
3. **Particulas/pontos flutuantes** no CTA final — vitalidade sutil
4. **Gradiente na palavra "Avantik"** no titulo de prova social — toque de marca
5. **WhatsApp badge** no footer — verde proprio, destaque especial para canal direto
6. **Secao de prova social com cantos arredondados** — elegancia e destaque como bloco unico

### Acessibilidade
- Todos os elementos interativos com focus visible
- Reduced motion: todas as animacoes desabilitadas ou reduzidas
- Color contrast: todos os textos passam WCAG AA no minimo
- Tabs com role="tablist", role="tab", aria-selected
- Cards com role="link" quando clicaveis
- Imagens/avatares com alt text adequado
- Carousel com aria-live="polite" para screen readers
