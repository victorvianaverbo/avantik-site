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
    heroSub: 'Começar esbarra menos na ideia e mais na desmotivação de quem está à volta e na falta de método. Aqui você aprende a sustentar a decisão, definir o cliente certo e crescer com propósito, ao lado de quem já construiu negócio de verdade.',
    descricao: 'Da decisão de começar à operação que cresce: mentalidade, cliente ideal, criatividade e propósito para empreender com método, não no improviso.',
    ctaTitle: 'Construa o negócio que se sustenta sozinho.',
    cover: '/academy/assets/empreender-capa.png', // PLACEHOLDER
    subtitulo: 'Uma visão 360° das oportunidades para empreender no Brasil',
    mockup: '/academy/assets/mockups/empreender.png',
    autoresImg: '/academy/assets/autores/empreender.jpg',
    livro: {
      descricao: 'Empreenday reúne dezenas de especialistas para mostrar, na prática, como sair da ideia e construir um negócio que cresce no cenário brasileiro. Da decisão de empreender ao cliente ideal, da criatividade ao negócio com propósito, é um mapa 360° para quem quer empreender com método.',
      temas: ['Mentalidade e primeiros desafios de empreender', 'Cliente ideal e fidelização', 'Criatividade e inovação no negócio', 'Negócio com propósito e valor compartilhado'],
      prefacio: 'Edson Mackeenzy',
      convidado: 'Marcelo Pimenta',
    },
    theme: { primary: '#00A900', accent: '#00F900', dark: '#070C08' }, // Manual Empreenday (verde / verde neon)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-EMPREENDER',
    problema: {
      titulo: 'A ideia não é o difícil. O difícil é o que vem depois.',
      texto: 'Você decide empreender e a primeira reação ao redor costuma ser desânimo, não apoio. Some a isso o caixa que não fecha, o cliente que não volta e a decisão tomada no escuro. A maioria dos negócios não morre por falta de ideia, morre por falta de método. Aqui você troca o achismo por um caminho testado por quem já fez.',
    },
    oferta: { titulo: 'Comece a empreender com método agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Preciso já ter um negócio aberto?', a: 'Não. O programa atende desde quem ainda está decidindo empreender até quem já fatura e quer estruturar o crescimento.' },
      { q: 'E se as pessoas à minha volta não acreditam na ideia?', a: 'Esse é um dos primeiros temas do programa. Você aprende a sustentar a decisão com método e clareza, em vez de depender da validação dos outros.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Mentalidade para decidir e seguir mesmo sem apoio ao redor',
      'Definição do cliente ideal e como transformar cliente em fã',
      'Criatividade e inovação aplicadas ao seu negócio',
      'Negócio com propósito: gerar valor e crescer com diferença',
    ],
    mentorPadrao: null,
    mentores: [
      { ...ROBERTO_JUSTUS, conexao: 'Quem construiu e posicionou marcas fortes mostra como sair da ideia e fazer o negócio crescer.' },
      { ...JR_GUZZO, conexao: 'Leitura crítica de cenários para enxergar oportunidade onde a maioria só vê risco.' },
    ],
  },

  gestao: {
    nome: 'Gestão',
    brand: 'Gestão de Negócios na Prática',
    pilar: 'Gestão',
    slug: 'gestao',
    tagline: 'Decisões melhores, equipes mais fortes, resultados consistentes.',
    heroSub: 'Gestor bom não é o que trabalha mais, é o que decide melhor, com processo no lugar do achismo e gente engajada ao lado. Este programa cobre o estratégico, o financeiro, o administrativo, o jurídico e as pessoas, do organograma que funciona ao caixa que fecha.',
    descricao: 'Os fundamentos da gestão moderna na prática: estratégia, finanças, processos, pessoas e segurança jurídica para decidir com segurança e elevar a lucratividade.',
    ctaTitle: 'Pare de apagar incêndio. Comece a gerir resultado.',
    cover: '/academy/assets/gestao-capa.png', // PLACEHOLDER
    subtitulo: 'Ações para reduzir riscos e aumentar a lucratividade',
    mockup: '/academy/assets/mockups/gestao.png',
    autoresImg: '/academy/assets/autores/gestao.jpg',
    livro: {
      descricao: 'Gestão de Negócios na Prática reúne especialistas em estratégia, finanças, administração, jurídico e pessoas para entregar as ferramentas que reduzem riscos e elevam a lucratividade. É gestão aplicada, com exercícios para usar direto no seu negócio.',
      temas: ['Estratégia e fundamentos da gestão', 'Gestão financeira, tributária e de custos', 'Gestão administrativa, qualidade e pessoas', 'Negociação e contratos empresariais'],
      prefacio: 'Alfredo Rocha',
      convidado: 'Mônia Souza',
    },
    theme: { primary: '#0076F8', accent: '#004DBB', dark: '#05070D' }, // Manual Gestão (azul royal / azul elétrico)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-GESTAO',
    problema: {
      titulo: 'Liderar no achismo cobra um preço alto.',
      texto: 'Organograma que existe só no papel, time desalinhado, custo fora de controle e decisão tomada na pressão. Sem processo e sem indicador, todo mês repete o anterior, às vezes pior. Aqui você aprende a enxergar o negócio por dados e a conduzir pessoas para o mesmo resultado.',
    },
    oferta: { titulo: 'Comece a gerir com método agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Serve para quem lidera time pequeno?', a: 'Sim. Os princípios de estratégia, finanças e gestão de pessoas valem de equipes enxutas a operações maiores.' },
      { q: 'Preciso de conhecimento financeiro avançado?', a: 'Não. O conteúdo parte do essencial: custos, tributos, crédito e orçamento explicados para você decidir com segurança.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Planejamento estratégico e fundamentos da gestão',
      'Gestão financeira: custos, tributos, crédito e orçamento',
      'Processos, qualidade e gestão de pessoas',
      'Contratos e segurança jurídica do negócio',
    ],
    mentorPadrao: null,
    mentores: [
      { ...ROBERTO_JUSTUS, conexao: 'Décadas à frente de empresas traduzidas em decisões de gestão que sustentam resultado.' },
    ],
  },

  'inteligencia-emocional': {
    nome: 'Inteligência Emocional',
    brand: 'Inteligência Emocional e Neurociência',
    pilar: 'Inteligência Emocional',
    slug: 'inteligencia-emocional',
    tagline: 'Domine o pulso humano que as máquinas não simulam.',
    heroSub: 'A tecnologia igualou as ferramentas. O que separa os profissionais agora é manter a cabeça no lugar, ler pessoas e decidir bem sob pressão. Inteligência emocional e neurociência se aprendem, e essa é a vantagem que não se automatiza.',
    descricao: 'Autoconhecimento, regulação emocional e relações sob pressão, com base em neurociência. A vantagem competitiva que a tecnologia não substitui.',
    ctaTitle: 'A vantagem competitiva que a tecnologia não substitui.',
    cover: '/academy/assets/inteligencia-emocional-capa.png', // PLACEHOLDER
    subtitulo: 'O jogo a favor de você e dos seus relacionamentos',
    mockup: '/academy/assets/mockups/ie.png',
    autoresImg: '/academy/assets/autores/ie.jpg',
    livro: {
      descricao: 'Inteligência Emocional e Neurociência reúne especialistas para mostrar como colocar o cérebro a seu favor: do autoconhecimento à ressignificação de traumas, da psicologia positiva à mente resiliente. Ciência e prática para dominar as próprias emoções no trabalho e na vida.',
      temas: ['Autoconhecimento e diálogo interno', 'Neurociência e comportamento de alta performance', 'Regulação emocional e resiliência', 'Relacionamento interpessoal e equilíbrio de vida'],
      prefacio: 'Daniela do Lago',
      convidado: 'Alexandre Rodrigues',
    },
    theme: { primary: '#8D00FF', accent: '#9E55A0', dark: '#08020F' }, // Manual IE (violeta / magenta)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-IE',
    problema: {
      titulo: 'Competência técnica abre a porta. Emoção decide o jogo.',
      texto: 'Talento não falta. O que sabota é o diálogo interno que derruba, a reação impulsiva e a dificuldade de lidar com gente difícil. Inteligência emocional não é dom, é treino, e o cérebro responde a esse treino. Aqui você aprende a entender o que sente e a usar isso a seu favor.',
    },
    oferta: { titulo: 'Comece a dominar o seu próprio jogo.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Isso é autoajuda?', a: 'Não. É um programa baseado em comportamento e neurociência, aplicado à decisão e às relações no seu contexto profissional.' },
      { q: 'Funciona para quem é mais reservado?', a: 'Sim. O foco é entender e conduzir as próprias emoções, qualquer que seja o seu perfil ou temperamento.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Autoconhecimento: temperamentos, crenças e diálogo interno',
      'Neurociência aplicada ao comportamento e à decisão',
      'Regulação emocional e mente resiliente sob pressão',
      'Relações interpessoais e equilíbrio entre as áreas da vida',
    ],
    mentorPadrao: null,
    mentores: [
      { ...CHRIS_NONATO, conexao: 'Vinte anos unindo Psicanálise, PNL e hipnose para transformar comportamento em resultado.' },
    ],
  },

  oratoria: {
    nome: 'Oratória',
    brand: 'Oratória e Persuasão',
    pilar: 'Oratória',
    slug: 'oratoria',
    tagline: 'Fale para ser ouvido. Impossível de ignorar.',
    heroSub: 'Não importa o quanto você sabe se a mensagem não chega. Quem estrutura a fala, domina a voz e lê a plateia ganha espaço, fecha negócio e lidera sala. Oratória é técnica, do storytelling à linguagem do corpo, e técnica se aprende.',
    descricao: 'Estrutura, presença, voz e persuasão para comunicar com clareza e impacto, do palco à mesa de negociação e ao digital.',
    ctaTitle: 'Torne-se impossível de ignorar quando abrir a boca.',
    cover: '/academy/assets/oratoria-capa.png', // PLACEHOLDER
    subtitulo: 'Sua comunicação nunca mais será a mesma',
    mockup: '/academy/assets/mockups/oratoria.png',
    autoresImg: '/academy/assets/autores/oratoria.jpg',
    livro: {
      descricao: 'Oratória e Persuasão reúne grandes comunicadores para transformar como você fala, apresenta e convence. Da estrutura do discurso à voz, do storytelling às microexpressões, é técnica aplicada para prender a atenção e falar com autoridade em qualquer situação.',
      temas: ['Estrutura de discurso e storytelling', 'Voz, presença e linguagem corporal', 'Leitura da plateia e comunicação não-verbal', 'Persuasão, marca pessoal e oratória digital'],
      prefacio: 'Reinaldo Polito',
      convidado: 'Fred Marques',
    },
    theme: { primary: '#FF4000', accent: '#FF6500', dark: '#0E0703' }, // Manual Oratória (laranja-fogo / âmbar)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-ORATORIA',
    problema: {
      titulo: 'Conteúdo bom, comunicação fraca, resultado invisível.',
      texto: 'Você domina o assunto, mas trava na hora de apresentar. A voz some, a estrutura se perde, o medo fala mais alto e a plateia desliga. O problema raramente é falta de conteúdo, é falta de técnica para entregar. Aqui você aprende a vencer o medo, prender a atenção e falar com autoridade.',
    },
    oferta: { titulo: 'Comece a comunicar com impacto agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Sirvo se travo só de pensar em falar em público?', a: 'Especialmente. O programa trata do medo e da timidez do palco e te dá estrutura e voz para falar com segurança.' },
      { q: 'É só para quem faz palestra?', a: 'Não. Vale para reuniões, vendas, vídeos, mundo digital e qualquer momento em que sua mensagem precisa chegar.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Estrutura de discurso e storytelling que prendem a atenção',
      'Presença de palco, linguagem corporal e leitura da plateia',
      'Domínio da voz e controle do medo de falar em público',
      'Persuasão, marca pessoal e comunicação no digital',
    ],
    mentorPadrao: null,
    mentores: [
      { ...CHRIS_NONATO, conexao: 'Oratória de alto impacto e engenharia comportamental para você comunicar e convencer.' },
    ],
  },

  vendas: {
    nome: 'Vendas',
    brand: 'Propulsão em Vendas',
    pilar: 'Vendas',
    slug: 'vendas',
    tagline: 'Venda com método, não com sorte.',
    heroSub: 'Vendedor que depende de inspiração tem mês bom e mês ruim. Quem trata venda como processo tem receita previsível. Este programa vai da investigação do cliente ao fechamento e ao pós-venda, e transforma talento em sistema que vende todo mês.',
    descricao: 'Do primeiro contato ao pós-venda: processo comercial, perfis de cliente, negociação e fidelização que geram receita previsível.',
    ctaTitle: 'Troque a sorte por um sistema que vende.',
    cover: '/academy/assets/vendas-capa.png', // PLACEHOLDER
    subtitulo: 'Uma imersão para superar limites',
    mockup: '/academy/assets/mockups/vendas.png',
    autoresImg: '/academy/assets/autores/vendas.jpg',
    livro: {
      descricao: 'Propulsão em Vendas é uma imersão nas ferramentas das melhores equipes comerciais do país. Do processo de investigação do cliente às técnicas de comunicação, negociação e pós-venda, é o que separa vender por sorte de vender por método.',
      temas: ['Processo de vendas e investigação do cliente', 'Comunicação, perfis e storytelling na venda', 'Negociação, objeções e fechamento', 'Pós-venda, fidelização e produtividade'],
      prefacio: 'Paulo Mariottini',
      convidado: 'Daniel Morato',
    },
    theme: { primary: '#FB0000', accent: '#A10000', dark: '#0C0303' }, // Manual Propulsão em Vendas (vermelho vivo / vermelho-sangue)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-VENDAS',
    problema: {
      titulo: 'Vender no improviso é montanha-russa de faturamento.',
      texto: 'Pipeline vazio, abordagem que não conecta, objeção que derruba a venda e cliente que some depois da primeira compra. Sem processo, cada negociação recomeça do zero. Aqui você aprende a investigar o cliente, conduzir a venda e fidelizar, num caminho que se repete e escala.',
    },
    oferta: { titulo: 'Comece a vender com previsibilidade agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Funciona para qualquer produto ou serviço?', a: 'Sim. O processo de investigação, negociação e pós-venda se adapta ao que você vende.' },
      { q: 'Sou novo em vendas, dá conta?', a: 'Dá. O programa parte do essencial, vendas como processo, e te leva passo a passo até a fidelização.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Vendas como processo: investigação e perfis de cliente',
      'Comunicação, storytelling e estado emocional na venda',
      'Negociação, objeções e fechamento',
      'Pós-venda, fidelização e recompra',
    ],
    mentorPadrao: null,
    mentores: [
      { ...ROBERTO_JUSTUS, conexao: 'Negociação e construção de marca aplicadas a vender com método e previsibilidade.' },
    ],
  },

  lideranca: {
    nome: 'Liderança',
    brand: 'Liderança Extraordinária',
    pilar: 'Liderança',
    slug: 'lideranca',
    tagline: 'Lidere pessoas, não apenas tarefas.',
    heroSub: 'Virar chefe é questão de cargo. Virar líder é questão de preparo. A diferença aparece no resultado do time e na vontade das pessoas de seguir você. Da mentalidade ao mapeamento dos perfis da equipe, este programa forma o líder que as pessoas escolhem.',
    descricao: 'Mentalidade, mapeamento comportamental e ferramentas de gestão: o que separa um chefe de um líder que constrói resultado com pessoas.',
    ctaTitle: 'Seja o líder que as pessoas escolhem seguir.',
    cover: '/academy/assets/lideranca-capa.png', // PLACEHOLDER
    subtitulo: 'Autogestão e gestão de pessoas com foco em resultados',
    mockup: '/academy/assets/mockups/lideranca.png',
    autoresImg: '/academy/assets/autores/lideranca.jpg',
    livro: {
      descricao: 'Liderança Extraordinária une mentalidade, mapeamento comportamental e ferramentas de gestão para formar o líder que entrega resultado com inspiração e técnica. Da arte de liderar ao feedback e à mediação de conflitos, é o caminho de bom técnico a grande líder.',
      temas: ['Mentalidade e arte de liderar', 'Gestão do tempo e produtividade do líder', 'Mapeamento comportamental da equipe', 'Feedback, conflitos e metodologias ágeis'],
      prefacio: 'Leila Navarro',
      convidado: 'Professor Gretz',
    },
    theme: { primary: '#EBB700', accent: '#FFD200', dark: '#0C0A02' }, // Manual Liderança (dourado / amarelo-ouro)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-LIDERANCA',
    problema: {
      titulo: 'Promovido por competência, perdido na liderança.',
      texto: 'A maioria chega à liderança por entregar bem, não por saber conduzir gente. Aí vem o time desmotivado, o feedback que ninguém dá, o conflito que trava e a agenda que não cabe no dia. Liderar é uma habilidade, e como toda habilidade, se desenvolve. Aqui você aprende a conduzir pessoas para resultado.',
    },
    oferta: { titulo: 'Comece a liderar com preparo agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Sou líder de primeira viagem, serve?', a: 'Serve especialmente. O programa estrutura o que ninguém ensina na transição de bom técnico para bom líder.' },
      { q: 'E se eu já lidero há anos?', a: 'Também. O conteúdo aprofunda mapeamento de perfis, feedback e mediação de conflitos, úteis para refinar uma liderança já em andamento.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Mentalidade do líder e gestão do próprio tempo',
      'Mapeamento comportamental e perfis da equipe',
      'Feedback, comunicação e mediação de conflitos',
      'Engajamento, metodologias ágeis e alta performance',
    ],
    mentorPadrao: null,
    mentores: [
      { ...ROBERTO_JUSTUS, conexao: 'Referência em liderança e alta performance conduzindo você do cargo ao comando de gente.' },
      { ...CHRIS_NONATO, conexao: 'Engenharia comportamental aplicada a desenvolver líderes e equipes.' },
    ],
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
