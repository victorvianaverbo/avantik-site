/**
 * Avantik Academy fonte única de dados dos programas e mentores.
 *
 * Cada programa = um livro da coleção "Foco em Resultados".
 * Os dados de IDENTIDADE VISUAL (theme/cover) são PLACEHOLDER até chegarem
 * os manuais de marca do Bruno (6 pastas do Google Drive).
 *
 * MENTORES: por enquanto semeados com 3 palestrantes REAIS do banco
 * (tabela `speakers` do Supabase). O `hotmartCode` é PLACEHOLDER até o
 * mentor se afiliar na Hotmart e o Bruno enviar a planilha.
 *
 * CTA de afiliado é montado em academy-programa.js:
 *   `${programa.hotmartCheckout}?ap=${mentor.hotmartCode}`
 * Ajustar o parâmetro (`ap`) ao formato real do link que a Hotmart gerar.
 */

// Ordem em que os programas aparecem no hub.
export const PROGRAM_ORDER = [
  'empreender',
  'gestao',
  'inteligencia-emocional',
  'oratoria',
  'vendas',
  'lideranca',
];

// Preço padrão (igual para todos).
const PRECO_PADRAO = { por: '12x de R$ 197,00' };

// Coleção que dá origem aos programas.
export const COLECAO_NOME = 'Coleção Foco em Resultados';
export const COLECAO_LOGO = '/academy/assets/colecao-foco-em-resultados.png';

// Oferta/garantia padrão (iguais para todos os programas).
const OFERTA_INCLUI = 'Acesso ao conteúdo gravado, mentorias mensais ao vivo e comunidade. Por R$ 197, ou 12x de R$ 19,70.';
const GARANTIA = '7 dias de garantia. Se não fizer sentido, você é reembolsado.';
const FAQ_RITMO = { q: 'Quanto tempo leva para concluir?', a: 'Você avança no seu ritmo. As aulas ficam disponíveis e as mentorias acontecem todo mês.' };

// ── Mentores-exemplo (3 reais do banco) ───────────────────────────────
// Reutilizados como SEED em alguns programas só para demonstrar a
// personalização ?mentor=. Substituir pela lista real de cada livro.
const PHOTO_BASE = 'https://ajokzpjguhfxxudteetr.supabase.co/storage/v1/object/public/speaker-photos';

const CHRIS_NONATO = {
  slug: 'chris-nonato',
  nome: 'Chris Nonato',
  tema: 'Engenharia comportamental e oratória de alto impacto',
  bio: 'Há mais de 20 anos desenvolvendo líderes e equipes. Une Psicanálise, PNL e Hipnose Ericksoniana a um olhar estratégico de gestão para transformar comportamento em resultado.',
  foto: `${PHOTO_BASE}/1777578643810-hv5hxy7zh.png`,
  hotmartCode: 'PLACEHOLDER',
};

const ROBERTO_JUSTUS = {
  slug: 'roberto-justus',
  nome: 'Roberto Justus',
  tema: 'Liderança, posicionamento e alta performance',
  bio: 'Um dos empresários e comunicadores mais reconhecidos do Brasil. Referência em liderança, gestão empresarial, negociação e construção de marcas fortes.',
  foto: `${PHOTO_BASE}/roberto-justus.jpg`,
  hotmartCode: 'PLACEHOLDER',
};

const JR_GUZZO = {
  slug: 'j-r-guzzo',
  nome: 'J. R. Guzzo',
  tema: 'Pensamento crítico e leitura estratégica de cenários',
  bio: 'Um dos jornalistas e escritores mais respeitados do Brasil. Referência em análise, pensamento crítico e interpretação dos bastidores do poder.',
  foto: `${PHOTO_BASE}/j-r-guzzo.jpg`,
  hotmartCode: 'PLACEHOLDER',
};

// ── Programas ─────────────────────────────────────────────────────────
export const PROGRAMS = {
  empreender: {
    nome: 'Empreender',
    brand: 'Empreenday',          // nome de marca do manual
    pilar: 'Empreender',
    slug: 'empreender',
    tagline: 'Tire a ideia do papel e construa um negócio que se sustenta.',
    heroSub: 'Quase todo mundo tem uma boa ideia. Poucos sabem transformar ideia em receita, e receita em operação que cresce sem depender de sorte. Este programa é o método de quem já fez.',
    descricao: 'Da validação ao crescimento: o caminho prático para empreender com método, do primeiro cliente à operação que escala.',
    ctaTitle: 'Construa o negócio que se sustenta sozinho.',
    cover: '/academy/assets/empreender-capa.png', // PLACEHOLDER
    subtitulo: 'Uma visão 360° das oportunidades para empreender no Brasil',
    mockup: '/academy/assets/mockups/empreender.png',
    autoresImg: '/academy/assets/autores/empreender.jpg',
    livro: {
      descricao: 'Empreenday reúne dezenas de especialistas para mostrar, na prática, como tirar uma ideia do papel e construir um negócio que cresce no cenário brasileiro. Da oportunidade à operação, é um mapa 360° para quem quer empreender com método, e não no improviso.',
      temas: ['Identificação de oportunidades', 'Modelagem e plano de negócio', 'Primeiras vendas e marketing', 'Gestão financeira e operação'],
      prefacio: 'Edson Mackeenzy',
      convidado: 'Marcelo Pimenta',
    },
    theme: { primary: '#00A900', accent: '#00F900', dark: '#070C08' }, // Manual Empreenday (verde / verde neon)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-EMPREENDER',
    problema: {
      titulo: 'A ideia não é o difícil. O difícil é o que vem depois.',
      texto: 'Empreender no improviso custa caro: caixa que não fecha, cliente que não volta, decisão tomada no escuro. A maioria dos negócios não morre por falta de ideia, morre por falta de método. Aqui você troca o achismo por um caminho testado.',
    },
    oferta: { titulo: 'Comece a empreender com método agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Preciso já ter um negócio aberto?', a: 'Não. O programa atende desde quem ainda está validando a ideia até quem já fatura e quer estruturar o crescimento.' },
      { q: 'Serve para qualquer ramo?', a: 'Os fundamentos de validação, vendas, finanças e operação se aplicam à grande maioria dos negócios.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Validação de ideia e modelo de negócio',
      'Primeiras vendas e aquisição de clientes',
      'Gestão financeira do início ao crescimento',
      'Estruturação de operação e processos',
    ],
    mentorPadrao: null,
    mentores: [ROBERTO_JUSTUS, JR_GUZZO],
  },

  gestao: {
    nome: 'Gestão',
    brand: 'Gestão de Negócios na Prática',
    pilar: 'Gestão',
    slug: 'gestao',
    tagline: 'Decisões melhores, equipes mais fortes, resultados consistentes.',
    heroSub: 'Gestor bom não é o que trabalha mais. É o que decide melhor, com dados na mão e gente engajada ao lado. Este programa te tira do modo apagar incêndio.',
    descricao: 'Os fundamentos da gestão moderna: pessoas, processos, indicadores e tomada de decisão sob pressão.',
    ctaTitle: 'Pare de apagar incêndio. Comece a gerir resultado.',
    cover: '/academy/assets/gestao-capa.png', // PLACEHOLDER
    subtitulo: 'Ações para reduzir riscos e aumentar a lucratividade',
    mockup: '/academy/assets/mockups/gestao.png',
    autoresImg: '/academy/assets/autores/gestao.jpg',
    livro: {
      descricao: 'Gestão de Negócios na Prática entrega as ferramentas usadas pelos maiores gestores para decidir com segurança e elevar a lucratividade. É gestão aplicada, do administrativo ao financeiro, com exercícios para usar direto no seu negócio.',
      temas: ['Gestão administrativa', 'Gestão comercial', 'Gestão financeira', 'Gestão de pessoas', 'Autoconhecimento do executivo'],
      prefacio: 'Alfredo Rocha',
      convidado: 'Mônia Souza',
    },
    theme: { primary: '#0076F8', accent: '#004DBB', dark: '#05070D' }, // Manual Gestão (azul royal / azul elétrico)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-GESTAO',
    problema: {
      titulo: 'Liderar no achismo cobra um preço alto.',
      texto: 'Time desalinhado, meta que não fecha, decisão tomada na pressão e no instinto. Sem método de gestão, todo mês vira repetição do anterior. Aqui você aprende a enxergar o negócio por indicadores e a conduzir pessoas para o mesmo resultado.',
    },
    oferta: { titulo: 'Comece a gerir com método agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Serve para quem lidera time pequeno?', a: 'Sim. Os princípios de decisão, indicadores e gestão de pessoas valem de equipes enxutas a operações maiores.' },
      { q: 'Preciso de conhecimento financeiro avançado?', a: 'Não. O conteúdo parte do essencial e te dá clareza para decidir com segurança.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Gestão de pessoas e times de alta performance',
      'Indicadores e tomada de decisão por dados',
      'Planejamento tributário e financeiro',
      'Contratos e segurança jurídica do negócio',
    ],
    mentorPadrao: null,
    mentores: [ROBERTO_JUSTUS],
  },

  'inteligencia-emocional': {
    nome: 'Inteligência Emocional',
    brand: 'Inteligência Emocional e Neurociência',
    pilar: 'Inteligência Emocional',
    slug: 'inteligencia-emocional',
    tagline: 'Domine o pulso humano que as máquinas não simulam.',
    heroSub: 'A tecnologia igualou as ferramentas. O que separa os profissionais agora é a capacidade de manter a cabeça no lugar, ler pessoas e decidir bem sob pressão. Essa é a vantagem que não se automatiza.',
    descricao: 'Autoconhecimento, regulação emocional e relações sob pressão. A vantagem competitiva que a tecnologia não substitui.',
    ctaTitle: 'A vantagem competitiva que a tecnologia não substitui.',
    cover: '/academy/assets/inteligencia-emocional-capa.png', // PLACEHOLDER
    subtitulo: 'O jogo a favor de você e dos seus relacionamentos',
    mockup: '/academy/assets/mockups/ie.png',
    autoresImg: '/academy/assets/autores/ie.jpg',
    livro: {
      descricao: 'Inteligência Emocional e Neurociência mostra como colocar o cérebro a seu favor para performar sob pressão e construir relações melhores. Une ciência e prática para você dominar as próprias emoções no trabalho e na vida.',
      temas: ['Autoconhecimento', 'Comportamento de alta performance', 'Desenvolvimento humano', 'Gestão emocional', 'Relacionamento interpessoal'],
      prefacio: 'Daniela do Lago',
      convidado: 'Alexandre Rodrigues',
    },
    theme: { primary: '#8D00FF', accent: '#9E55A0', dark: '#08020F' }, // Manual IE (violeta / magenta)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-IE',
    problema: {
      titulo: 'Competência técnica abre a porta. Emoção decide o jogo.',
      texto: 'Talento não falta. O que sabota é o nervosismo na hora errada, a reação impulsiva, a dificuldade de lidar com gente difícil. Inteligência emocional não é dom, é treino. Aqui você aprende a regular o que sente e a usar isso a seu favor.',
    },
    oferta: { titulo: 'Comece a dominar o seu próprio jogo.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Isso é autoajuda?', a: 'Não. É um programa prático sobre comportamento, regulação emocional e decisão, aplicado ao seu contexto profissional.' },
      { q: 'Funciona para quem é mais reservado?', a: 'Sim. O foco é entender e conduzir as próprias emoções, qualquer que seja o seu perfil.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Autoconhecimento e regulação emocional',
      'Comunicação e relações sob pressão',
      'Comportamento e decisão em momentos críticos',
      'Resiliência e equilíbrio de alta performance',
    ],
    mentorPadrao: null,
    mentores: [CHRIS_NONATO],
  },

  oratoria: {
    nome: 'Oratória',
    brand: 'Oratória e Persuasão',
    pilar: 'Oratória',
    slug: 'oratoria',
    tagline: 'Fale para ser ouvido. Impossível de ignorar.',
    heroSub: 'Não importa o quanto você sabe se a mensagem não chega. Quem comunica com clareza e presença ganha espaço, fecha negócio e lidera sala. Oratória é técnica, e técnica se aprende.',
    descricao: 'Estrutura, presença e técnica para comunicar com clareza e impacto, do palco à mesa de negociação.',
    ctaTitle: 'Torne-se impossível de ignorar quando abrir a boca.',
    cover: '/academy/assets/oratoria-capa.png', // PLACEHOLDER
    subtitulo: 'Sua comunicação nunca mais será a mesma',
    mockup: '/academy/assets/mockups/oratoria.png',
    autoresImg: '/academy/assets/autores/oratoria.jpg',
    livro: {
      descricao: 'Oratória e Persuasão reúne grandes comunicadores para transformar a forma como você fala, apresenta e convence. Da PNL à comunicação não-verbal, é técnica aplicada para prender a atenção e falar com autoridade em qualquer situação.',
      temas: ['PNL aplicada à comunicação', 'Comunicação não-verbal e microexpressões', 'Memorização de apresentações', 'Superação do medo de falar em público', 'Condução de reuniões'],
      prefacio: 'Reinaldo Polito',
      convidado: 'Fred Marques',
    },
    theme: { primary: '#FF4000', accent: '#FF6500', dark: '#0E0703' }, // Manual Oratória (laranja-fogo / âmbar)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-ORATORIA',
    problema: {
      titulo: 'Conteúdo bom, comunicação fraca, resultado invisível.',
      texto: 'Você domina o assunto, mas trava na hora de apresentar. A voz some, a estrutura se perde, a plateia desliga. O problema raramente é falta de conteúdo, é falta de método para entregar. Aqui você aprende a prender a atenção e a falar com autoridade.',
    },
    oferta: { titulo: 'Comece a comunicar com impacto agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Sirvo se travo só de pensar em falar em público?', a: 'Especialmente. O programa trata do controle do nervosismo e te dá estrutura para falar com segurança.' },
      { q: 'É só para quem faz palestra?', a: 'Não. Vale para reuniões, apresentações, vendas, vídeos e qualquer momento em que sua mensagem precisa chegar.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Estrutura de discurso que prende a atenção',
      'Presença de palco e linguagem corporal',
      'Controle do nervosismo e da voz',
      'Storytelling e persuasão ética',
    ],
    mentorPadrao: null,
    mentores: [CHRIS_NONATO],
  },

  vendas: {
    nome: 'Vendas',
    brand: 'Propulsão em Vendas',
    pilar: 'Vendas',
    slug: 'vendas',
    tagline: 'Venda com método, não com sorte.',
    heroSub: 'Vendedor que depende de inspiração tem mês bom e mês ruim. Vendedor com processo tem receita previsível. Este programa transforma talento em sistema que vende todo mês.',
    descricao: 'Do primeiro contato ao fechamento: processo de vendas, negociação e relacionamento que geram receita previsível.',
    ctaTitle: 'Troque a sorte por um sistema que vende.',
    cover: '/academy/assets/vendas-capa.png', // PLACEHOLDER
    subtitulo: 'Uma imersão para superar limites',
    mockup: '/academy/assets/mockups/vendas.png',
    autoresImg: '/academy/assets/autores/vendas.jpg',
    livro: {
      descricao: 'Propulsão em Vendas é uma imersão nas ferramentas das melhores equipes comerciais do país. Do processo de vendas às técnicas avançadas e à gestão de times de alta performance, é o que separa vender por sorte de vender por método.',
      temas: ['Processo comercial estruturado', 'Técnicas avançadas de vendas', 'Negociação e fechamento', 'Gestão de equipes de alta performance'],
      prefacio: 'Paulo Mariottini',
      convidado: 'Daniel Morato',
    },
    theme: { primary: '#FB0000', accent: '#A10000', dark: '#0C0303' }, // Manual Propulsão em Vendas (vermelho vivo / vermelho-sangue)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-VENDAS',
    problema: {
      titulo: 'Vender no improviso é montanha-russa de faturamento.',
      texto: 'Pipeline vazio, objeção que derruba a venda, cliente que some depois da primeira compra. Sem processo, cada negociação recomeça do zero. Aqui você aprende a construir um caminho de vendas que se repete e escala.',
    },
    oferta: { titulo: 'Comece a vender com previsibilidade agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Funciona para qualquer produto ou serviço?', a: 'Sim. O processo de prospecção, negociação e relacionamento se adapta ao que você vende.' },
      { q: 'Sou novo em vendas, dá conta?', a: 'Dá. O programa parte do essencial e te leva a um método estruturado, passo a passo.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Processo de vendas previsível e replicável',
      'Negociação e tratamento de objeções',
      'Prospecção e construção de pipeline',
      'Relacionamento e recompra',
    ],
    mentorPadrao: null,
    mentores: [ROBERTO_JUSTUS],
  },

  lideranca: {
    nome: 'Liderança',
    brand: 'Liderança Extraordinária',
    pilar: 'Liderança',
    slug: 'lideranca',
    tagline: 'Lidere pessoas, não apenas tarefas.',
    heroSub: 'Virar chefe é questão de cargo. Virar líder é questão de preparo. A diferença aparece no resultado do time e na vontade das pessoas de seguir você. Este programa forma a segunda.',
    descricao: 'Cultura, influência e desenvolvimento de times: o que separa um chefe de um líder que constrói resultados sustentáveis.',
    ctaTitle: 'Seja o líder que as pessoas escolhem seguir.',
    cover: '/academy/assets/lideranca-capa.png', // PLACEHOLDER
    subtitulo: 'Autogestão e gestão de pessoas com foco em resultados',
    mockup: '/academy/assets/mockups/lideranca.png',
    autoresImg: '/academy/assets/autores/lideranca.jpg',
    livro: {
      descricao: 'Liderança Extraordinária une autogestão e gestão de pessoas para formar o líder que entrega resultado com inspiração e técnica. Da mentalidade ao mapeamento comportamental do time, é o caminho de bom técnico a grande líder.',
      temas: ['Mentalidade do líder', 'Mapeamento comportamental do time', 'Autogestão e produtividade', 'Comunicação, conflitos e decisão', 'Gestão estratégica'],
      prefacio: 'Leila Navarro',
      convidado: 'Professor Gretz',
    },
    theme: { primary: '#EBB700', accent: '#FFD200', dark: '#0C0A02' }, // Manual Liderança (dourado / amarelo-ouro)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-LIDERANCA',
    problema: {
      titulo: 'Promovido por competência, perdido na liderança.',
      texto: 'A maioria chega à liderança por entregar bem, não por saber liderar. Aí vem o time desmotivado, o feedback que ninguém dá, a decisão que trava. Liderar é uma habilidade, e como toda habilidade, se desenvolve. Aqui você aprende a conduzir gente para resultado.',
    },
    oferta: { titulo: 'Comece a liderar com preparo agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Sou líder de primeira viagem, serve?', a: 'Serve especialmente. O programa estrutura o que ninguém ensina na transição de bom técnico para bom líder.' },
      { q: 'E se eu já lidero há anos?', a: 'Também. O conteúdo aprofunda cultura, delegação e decisão, úteis para refinar uma liderança já em andamento.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Cultura organizacional e influência',
      'Desenvolvimento e delegação de times',
      'Feedback e conversas difíceis',
      'Visão de longo prazo e tomada de decisão',
    ],
    mentorPadrao: null,
    mentores: [ROBERTO_JUSTUS, CHRIS_NONATO],
  },
};

/** Retorna os programas na ordem de exibição. */
export function getProgramsInOrder() {
  return PROGRAM_ORDER.map((slug) => PROGRAMS[slug]).filter(Boolean);
}

/** Busca um mentor pelo slug dentro de um programa. */
export function findMentor(program, mentorSlug) {
  if (!program || !mentorSlug) return null;
  return (program.mentores || []).find((m) => m.slug === mentorSlug) || null;
}

/** Monta o link de checkout, com afiliado quando há mentor. */
export function buildCheckoutUrl(program, mentor) {
  if (!program) return '#';
  const base = program.hotmartCheckout || '#';
  if (mentor && mentor.hotmartCode && mentor.hotmartCode !== 'PLACEHOLDER') {
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}ap=${encodeURIComponent(mentor.hotmartCode)}`;
  }
  return base;
}
