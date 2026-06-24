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
    heroSub: 'A ideia raramente é o problema. O difícil é sustentar a decisão quando ouvem "você é doida, vai trocar o certo pelo duvidoso", definir quem é seu cliente ideal e dar ao negócio um motivo para existir. Aqui você troca o achismo por método, ao lado de especialistas que já saíram do zero.',
    descricao: 'Da decisão de começar à operação que cresce: mentalidade, cliente ideal, criatividade e propósito para empreender com método, não no improviso.',
    ctaTitle: 'Construa o negócio que se sustenta sozinho.',
    cover: '/academy/assets/empreender-capa.png', // PLACEHOLDER
    subtitulo: 'Uma visão 360° das oportunidades para empreender no Brasil',
    mockup: '/academy/assets/mockups/empreender.png',
    autoresImg: '/academy/assets/autores/empreender.jpg',
    livro: {
      descricao: 'Empreenday reúne especialistas que saíram do zero para mostrar, na prática, como sair da ideia e construir um negócio que cresce no cenário brasileiro. Da decisão de empreender ao cliente ideal, da criatividade ao negócio com propósito, do plano de negócios à permuta corporativa e ao planejamento estratégico, é um mapa 360° de quem fala do que viveu.',
      temas: ['Decidir e sustentar a decisão de empreender', 'Cliente ideal, precificação e fidelização', 'Criatividade como motor da inovação', 'Negócio com propósito e valor compartilhado', 'Plano de negócios, permuta corporativa e planejamento estratégico'],
      prefacio: 'Henrique Sales Magalhães',
      convidado: '',
    },
    theme: { primary: '#00A900', accent: '#00F900', dark: '#070C08' }, // Manual Empreenday (verde / verde neon)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-EMPREENDER',
    problema: {
      titulo: 'A ideia não é o difícil. O difícil é o que vem depois.',
      texto: 'Você decide empreender e a primeira reação ao redor costuma ser "não investe tanto nisso, você nem sabe se vai dar certo". Some o caixa que não fecha, o cliente que reclama de tudo e some sem voltar, e a compra por impulso que esvazia a conta. A maioria dos negócios não morre por falta de ideia. Morre por falta de método. No Empreenday você aprende com quem já passou por isso: a sustentar a decisão, escolher o cliente certo, preservar o caixa e crescer com propósito.',
    },
    metodo: {
      eyebrow: 'O caminho',
      titulo: 'Da ideia ao negócio que se sustenta.',
      intro: 'O difícil nunca foi ter a ideia. É sustentar a decisão, achar o cliente certo e dar ao negócio um motivo para existir. Veja o caminho que o programa percorre.',
      etapas: [
        { t: 'Sustentar a decisão', d: 'Seguir mesmo sem apoio ao redor e parar de se comparar com quem largou na frente.' },
        { t: 'Cliente ideal', d: 'Definir quem você serve, precificar sem medo e transformar cliente em fã que indica.' },
        { t: 'Criatividade e inovação', d: 'Ideia somada a ação para resolver problemas reais do seu mercado.' },
        { t: 'Propósito e valor', d: 'Dar ao negócio um motivo para existir e gerar valor compartilhado.' },
        { t: 'Validar e crescer', d: 'Testar a ideia antes de montar o plano e estruturar o crescimento.' },
      ],
    },
    oferta: { titulo: 'Comece a empreender com método agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'E se as pessoas à minha volta não acreditam na minha ideia?', a: 'Esse é um dos primeiros temas do programa. Você aprende a entender o medo de quem te ama, a parar de se comparar e a sustentar a decisão com método e clareza, em vez de depender da validação dos outros.' },
      { q: 'Preciso já ter um negócio aberto?', a: 'Não. O programa atende desde quem ainda está decidindo empreender até quem já fatura e quer definir cliente ideal, precificar melhor e estruturar o crescimento.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Sustentar a decisão de empreender mesmo sem apoio e parar de se comparar com quem largou na frente.',
      'Definir seu cliente ideal, precificar sem medo e transformar cliente em fã que indica.',
      'Usar a criatividade como matéria-prima da inovação: ideia somada a ação para resolver problemas reais.',
      'Dar propósito ao negócio, criar valor compartilhado e validar a ideia antes de montar o plano.',
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
    heroSub: 'Gestão é a ciência das causas: nada acontece na sua empresa sem que algo, antes, tenha sido bem ou mal gerido. Este programa cobre todo o organismo do negócio — estratégia, finanças, tributos, orçamento, custos, administração, qualidade, jurídico, pessoas e vendas — do diagnóstico que revela a causa raiz ao caixa que fecha no azul.',
    descricao: 'Os fundamentos da gestão moderna na prática: estratégia, finanças, processos, pessoas e segurança jurídica para decidir com segurança e elevar a lucratividade.',
    ctaTitle: 'Pare de apagar incêndio. Comece a gerir resultado.',
    cover: '/academy/assets/gestao-capa.png', // PLACEHOLDER
    subtitulo: 'Ações para reduzir riscos e aumentar a lucratividade',
    mockup: '/academy/assets/mockups/gestao.png',
    autoresImg: '/academy/assets/autores/gestao.jpg',
    livro: {
      descricao: 'Uma coletânea da Coleção Foco em Resultados (Editora Avantik, 2022) que reúne 28 especialistas em estratégia, finanças, tributos, orçamento, custos, administração, qualidade, segurança do trabalho, jurídico, pessoas, vendas, marketing e comportamento. Cada capítulo entrega um método aplicado e exercícios de reflexão para usar direto no seu negócio. Gestão na prática, não na teoria.',
      temas: ['Fundamentos da gestão e planejamento estratégico', 'Planejamento tributário, custos enxutos e orçamento', 'Departamento financeiro, crédito e investimentos', 'Gestão administrativa, qualidade e segurança do trabalho', 'Contratos, RH, sucessão e comportamento', 'Vendas, marketing, exportação e sustentabilidade'],
      prefacio: 'Alfredo Rocha',
      convidado: 'Mônia Souza',
      convidadoFem: true,
    },
    theme: { primary: '#0076F8', accent: '#004DBB', dark: '#05070D' }, // Manual Gestão (azul royal / azul elétrico)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-GESTAO',
    problema: {
      titulo: 'Empresa não quebra por falta de caixa. Quebra por falta de gestão.',
      texto: 'Em mais de 30 anos, Alfredo Rocha viu empresas líderes, com dinheiro em caixa e a melhor tecnologia, desaparecerem do mercado. E viu fundos de quintal virarem grandes negócios. O fator comum entre as que prosperaram e as que fracassaram tinha um nome: gestão. O que derruba a maioria é o achismo no lugar do indicador, o organograma que existe só no papel, a decisão tomada na pressão, o departamento financeiro fictício que só paga e recebe sem analisar nada, e o sócio que mistura o caixa da empresa com o bolso pessoal. Aqui você troca a causa raiz dos problemas pela causa raiz dos resultados.',
    },
    metodo: {
      eyebrow: 'As frentes',
      titulo: 'O negócio inteiro, não só um pedaço.',
      intro: 'Empresa não quebra por um motivo só. O programa cobre todas as frentes que sustentam, ou derrubam, o resultado.',
      etapas: [
        { t: 'Estratégia', d: 'Diagnóstico com SWOT e as 5 Forças de Porter, objetivos e indicadores no Balanced Scorecard.' },
        { t: 'Finanças e tributos', d: 'Regime certo pela elisão fiscal, custos enxutos e um financeiro que gera informação.' },
        { t: 'Administração e qualidade', d: 'PDCA, Kaizen, ISO 9001 e segurança do trabalho que reduz custo.' },
        { t: 'Pessoas', d: 'RH estratégico, perfil comportamental (DISC) para formar líderes e sucessão.' },
        { t: 'Jurídico', d: 'Contratos geridos do pré ao pós, com função social e segurança jurídica.' },
        { t: 'Vendas e mercado', d: 'Proposta de valor, A.I.D.A., ROI e até exportação para crescer com método.' },
      ],
    },
    stats: {
      eyebrow: 'Os números da gestão',
      itens: [
        { num: '28', label: 'especialistas, do estratégico ao jurídico' },
        { num: '10–40%', label: 'de redução de custo com gestão enxuta' },
        { num: '95%', label: 'dos optantes do Simples pagam imposto a mais' },
      ],
    },
    oferta: { titulo: 'Comece a gerir com método agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Serve para quem lidera time pequeno?', a: 'Sim. Os fundamentos valem da empresa de fundo de quintal à operação de grande porte. Diagnóstico, finanças, custos, qualidade e gestão de pessoas se aplicam em qualquer tamanho — e, em empresas menores, com recursos mais escassos, planejar é ainda mais vital.' },
      { q: 'Preciso entender de finanças e tributos?', a: 'Não. O conteúdo parte do essencial: como escolher o regime tributário, ler custos pela lógica Preço − Custo = Lucro, montar um departamento financeiro que gera informação, fazer o orçamento anual e acessar crédito. Explicado para você decidir com segurança.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Planejamento estratégico de verdade: diagnóstico com SWOT, análise PESTEL e as 5 Forças de Porter; propósito, missão, visão e valores; objetivos e indicadores no Balanced Scorecard. Porque o que não se mede não se controla.',
      'Finanças, tributos e orçamento: 95% dos optantes pelo Simples pagam mais imposto do que deveriam. Escolha o regime certo pela lógica da elisão fiscal, construa um departamento financeiro que gera informação (e não um fictício), monte o orçamento anual integrado à estratégia, segregue pessoa física de pessoa jurídica e acesse crédito com as melhores taxas.',
      'Custos enxutos, qualidade e processos: pensamento Lean, eliminação de desperdício (MUDA), melhoria contínua (Kaizen) e o giro do PDCA, com reduções de custo de 10% a 40% e de lead time de 30% a 80%. A lógica que muda tudo: Preço − Custo = Lucro.',
      'Pessoas, jurídico e vendas: RH estratégico em vez de "setor de festinhas", perfil comportamental (DISC) para formar líderes, feedback que muda comportamento, contratos geridos do pré ao pós, e vendas que levam solução — não só preço.',
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
    heroSub: 'Mais de 90% das suas decisões nascem fora da consciência, e seu cérebro decide se confia em alguém em fração de segundo. Quem aprende a ler isso, em si e nos outros, decide melhor sob pressão e conduz qualquer sala. Inteligência emocional não é dom: é treino, e o cérebro responde a esse treino.',
    descricao: 'Autoconhecimento, regulação emocional e relações sob pressão, com base em neurociência. A vantagem competitiva que a tecnologia não substitui.',
    ctaTitle: 'A vantagem competitiva que a tecnologia não substitui.',
    cover: '/academy/assets/inteligencia-emocional-capa.png', // PLACEHOLDER
    subtitulo: 'O jogo a favor de você e dos seus relacionamentos',
    mockup: '/academy/assets/mockups/ie.png',
    autoresImg: '/academy/assets/autores/ie.jpg',
    livro: {
      descricao: 'Uma coletânea de mais de trinta especialistas que une o quociente emocional de Daniel Goleman à neurociência do comportamento. Do autoconhecimento à ressignificação de traumas, da resiliência à neurovenda, das finanças pessoais à comunicação relacional, é ciência e prática para colocar o cérebro a seu favor no trabalho e na vida.',
      temas: ['Temperamentos, tipos psicológicos, crenças e diálogo interno', 'Cérebro trino, neuroplasticidade, emoções universais e micro expressões', 'As 5 competências de Goleman, regulação e decisão sob pressão', 'Resiliência, hábitos e saída do piloto automático', 'Comunicação relacional, finanças pessoais e neurovenda'],
      prefacio: 'Daniela do Lago',
      convidado: 'Alexandre Rodrigues',
    },
    theme: { primary: '#8D00FF', accent: '#9E55A0', dark: '#08020F' }, // Manual IE (violeta / magenta)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-IE',
    problema: {
      titulo: 'Competência técnica abre a porta. Emoção decide o jogo.',
      texto: 'As pessoas são contratadas pelas habilidades técnicas e demitidas pelos comportamentos. O que sabota não é falta de talento, é a reação impulsiva, o diálogo interno que derruba e a dificuldade de lidar com gente difícil. Como dizia Dale Carnegie, você não lida com seres lógicos, e sim com seres emocionais, a começar por você mesmo. Quem não reconhece o que sente é arrastado pelas emoções como folha ao vento. Aqui você aprende a reconhecer, regular e usar a emoção a seu favor, com base em neurociência, não em autoajuda.',
    },
    metodo: {
      eyebrow: 'O percurso',
      titulo: 'Da emoção crua à alta performance.',
      intro: 'Inteligência emocional não é dom, é treino, e o cérebro responde a esse treino. Este é o percurso que o programa faz.',
      etapas: [
        { t: 'Autoconhecimento', d: 'Temperamentos, tipos psicológicos de Jung e as crenças que governam suas decisões.' },
        { t: 'Cérebro e emoção', d: 'Cérebro trino, neuroplasticidade e ressignificação de traumas e crenças.' },
        { t: 'Decisão sob pressão', d: 'Os 4 níveis do processamento emocional, o método STOP, foco e produtividade.' },
        { t: 'Relações', d: 'Comunicação relacional, leitura comportamental e resiliência no dia a dia.' },
        { t: 'Dinheiro e propósito', d: 'Inteligência emocional aplicada às finanças e a um propósito de vida.' },
        { t: 'Encantamento', d: 'Neurovenda: a emoção que transforma cliente em fã, como faz a Disney.' },
      ],
    },
    stats: {
      eyebrow: 'O que a ciência mostra',
      itens: [
        { num: '90%', label: 'das decisões nascem fora da consciência' },
        { num: '7', label: 'emoções universais que todo rosto revela' },
        { num: '+50%', label: 'da comunicação é não verbal' },
      ],
    },
    oferta: { titulo: 'Comece a dominar o seu próprio jogo.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Isso é autoajuda?', a: 'Não. É um programa ancorado em neurociência e comportamento, do cérebro trino e da neuroplasticidade aos estudos de Ekman, Jung, Goleman e Damásio, aplicado à decisão, ao dinheiro e às relações no seu contexto profissional.' },
      { q: 'Funciona para quem é mais reservado?', a: 'Sim. Temperamento não é destino, e o cérebro é plástico: tudo o que foi aprendido pode mudar com um novo aprendizado. O foco é o autoconhecimento e o autodomínio, conduzir as próprias emoções, qualquer que seja o seu perfil.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Autoconhecimento: temperamentos de Hipócrates, tipos psicológicos de Jung e as crenças e o diálogo interno que governam suas decisões.',
      'Neurociência aplicada: cérebro trino, as emoções universais de Ekman e a leitura de micro expressões e linguagem corporal, que respondem por mais da metade de qualquer comunicação.',
      'As 5 competências da inteligência emocional de Goleman, o método STOP e a regulação para concentrar, decidir bem sob pressão e sustentar alta performance.',
      'Ressignificação de traumas e crenças limitantes, comunicação relacional e assertiva, e o equilíbrio entre as áreas da vida pela Roda da Vida.',
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
    heroSub: 'O que você fala pode entrar por um ouvido e sair pelo outro. O que você é fica na memória. Quem estrutura a fala, domina a voz e lê a plateia ganha espaço, fecha negócio e lidera sala. Oratória não é dom, é técnica, do exórdio à chave de ouro, e técnica se aprende.',
    descricao: 'Estrutura, presença, voz e persuasão para comunicar com clareza e impacto, do palco à mesa de negociação e ao digital.',
    ctaTitle: 'Torne-se impossível de ignorar quando abrir a boca.',
    cover: '/academy/assets/oratoria-capa.png', // PLACEHOLDER
    subtitulo: 'Sua comunicação nunca mais será a mesma',
    mockup: '/academy/assets/mockups/oratoria.png',
    autoresImg: '/academy/assets/autores/oratoria.jpg',
    livro: {
      descricao: 'Oratória e Persuasão reúne mais de vinte grandes comunicadores para transformar como você fala, apresenta e convence. Reinaldo Polito, com cinco décadas ensinando a arte de falar em público, assina o prefácio e o define como um curso completo: da estrutura do discurso à voz, do storytelling às micro expressões, da comunicação carismática ao copywriting. Técnica aplicada para falar de modo objetivo, prender a atenção e ter autoridade em qualquer situação, do palco à reunião, da venda ao digital.',
      temas: ['Estrutura de discurso, storytelling e os 3 obstáculos da oratória', 'Voz, presença e linguagem corporal', 'Leitura fria, micro expressões e emoção que retém a informação', 'Persuasão ética, comunicação carismática, copywriting, marca pessoal e oratória digital'],
      prefacio: 'Reinaldo Polito',
      convidado: 'JB Oliveira',
    },
    theme: { primary: '#FF4000', accent: '#FF6500', dark: '#0E0703' }, // Manual Oratória (laranja-fogo / âmbar)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-ORATORIA',
    problema: {
      titulo: 'Você tem a arma e a munição. Falta fazer pontaria.',
      texto: 'Você domina o assunto, mas trava na hora de apresentar. A garganta fecha, a voz some, dá o "branco" e a plateia desliga. São os três inimigos de todo orador: a inibição, a desconexão e a prolixidade. O problema quase nunca é falta de conteúdo, é falta de técnica para entregar. O medo de falar em público supera, em pesquisas, até o medo da morte, e ele não se vence acabando com ele, mas aprendendo a conduzi-lo. Aqui você aprende a falar de modo objetivo, coerente e preciso, prender a atenção e convencer com autoridade.',
    },
    metodo: {
      eyebrow: 'O percurso',
      titulo: 'Do medo travando a fala ao domínio do palco.',
      intro: 'Oratória não é dom, é técnica, do exórdio à chave de ouro. Veja o caminho que tira o medo do caminho e coloca autoridade na sua voz.',
      etapas: [
        { t: 'Vencer o medo', d: 'A inibição é o primeiro obstáculo: aprender a controlar, não a eliminar.' },
        { t: 'Estruturar a fala', d: 'Do exórdio à chave de ouro, com storytelling e a jornada do herói.' },
        { t: 'Dominar a voz', d: 'Tom, articulação, ressonância, projeção, pausas e modulação.' },
        { t: 'Presença e plateia', d: 'Linguagem corporal e leitura da plateia para nunca falar no vazio.' },
        { t: 'Persuadir com ética', d: 'Influência, Comunicação Não Violenta e copywriting que convence pela verdade.' },
        { t: 'Marca e digital', d: 'Comunicação carismática e oratória do palco ao online.' },
      ],
    },
    stats: {
      eyebrow: 'O que está em jogo',
      itens: [
        { num: '1º', label: 'falar em público vence até o medo da morte' },
        { num: '3', label: 'obstáculos derrubados: inibição, desconexão, prolixidade' },
        { num: '20+', label: 'grandes comunicadores reunidos no programa' },
      ],
    },
    oferta: { titulo: 'Comece a comunicar com impacto agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Sirvo se travo só de pensar em falar em público?', a: 'Especialmente. A inibição é o primeiro obstáculo que o programa ataca. Sentir medo é natural e até protege, o que muda é aprender a controlá-lo. Você recebe estrutura, voz e técnica para tirar o medo do caminho e falar com segurança.' },
      { q: 'É só para quem faz palestra?', a: 'Não. Vale para reuniões, vendas, vídeos, liderança e qualquer momento em que sua mensagem precisa chegar, presencial ou no digital. Com oratória, você não se torna só um comunicador melhor, mas alguém mais persuasivo e admirado.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Estrutura de discurso e storytelling, do exórdio à chave de ouro, com a jornada do herói e aberturas que prendem a atenção do início ao fim.',
      'A voz como sua principal ferramenta: tom, articulação, ressonância, projeção, pausas e modulação, mais presença de palco e linguagem corporal para vencer o medo e falar com segurança.',
      'Leitura da plateia, micro expressões e as emoções universais, para comunicar direto ao subconsciente e ser lembrado por gerar emoção.',
      'Persuasão com ética, técnicas de influência e linguagem hipnótica, empatia e Comunicação Não Violenta, copywriting, marca pessoal e oratória no digital.',
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
    heroSub: 'O mercado não quer mais vendedores de preço, que vivem de desconto e dinamitam a própria margem. Quem investiga o cliente, cria conexão e conduz a venda por etapas tem receita previsível. Da prospecção ao pós-venda, talento vira sistema que vende todo mês.',
    descricao: 'Da prospecção ao pós-venda: investigação, rapport, negociação e fidelização que transformam talento em receita previsível.',
    ctaTitle: 'Troque a sorte por um sistema que vende.',
    cover: '/academy/assets/vendas-capa.png', // PLACEHOLDER
    subtitulo: 'Uma imersão para superar limites',
    mockup: '/academy/assets/mockups/vendas.png',
    autoresImg: '/academy/assets/autores/vendas.jpg',
    livro: {
      descricao: 'Propulsão em Vendas reúne especialistas que vivem de vender e empreender, num manual de consulta diária para o profissional de vendas do século XXI. Do autoconceito do vendedor à investigação do cliente, do rapport ao pós-venda, é o que separa vender por sorte de vender por método.',
      temas: ['Prospecção, autoconceito e pitch de vendas', 'Rapport, investigação e Solution Selling', 'Negociação, objeções e fechamento', 'Pós-venda, fidelização e atendimento 5.0'],
      prefacio: 'Marcelo Ortega',
      convidado: '',
    },
    theme: { primary: '#FB0000', accent: '#A10000', dark: '#0C0303' }, // Manual Propulsão em Vendas (vermelho vivo / vermelho-sangue)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-VENDAS',
    problema: {
      titulo: 'Vender no improviso é montanha-russa de faturamento.',
      texto: 'Pipeline vazio, abordagem que não cria conexão, a pergunta certa que você não fez e a objeção que derruba o fechamento. Depois, o cliente some e nunca recompra. Sem processo, cada negociação recomeça do zero, e o mês bom vira refém da inspiração. Aqui você troca o achismo do "talento nato" por um caminho que se repete: investigar, conduzir, fechar e fidelizar.',
    },
    // Seção-assinatura "O método": as 6 etapas reais do livro (trilha vertical temática).
    metodo: {
      eyebrow: 'O método',
      titulo: 'Seis etapas que transformam talento em sistema.',
      intro: 'A venda deixa de recomeçar do zero a cada cliente. Vira um caminho que se repete, se mede e escala — da primeira abordagem ao cliente que volta e indica.',
      etapas: [
        { t: 'Prospecção', d: 'Pipeline cheio e um pitch que diz quem você é em menos de 7 segundos.' },
        { t: 'Investigação', d: 'Solution Selling: 25% de perguntas, 75% de escuta. A dor real antes do produto.' },
        { t: 'Rapport', d: 'Os 6 elementos que constroem confiança e baixam a guarda do cliente.' },
        { t: 'Negociação', d: 'CVBA e A.I.D.A. para conduzir valor sem entrar na guerra de desconto.' },
        { t: 'Fechamento', d: 'O perfil do vendedor sniper: contornar objeções e fechar com método.' },
        { t: 'Pós-venda', d: 'Adoção, retenção, expansão e evangelização. Reter custa até 5x menos.' },
      ],
    },
    // Faixa de provas numéricas (banda escura temática).
    stats: {
      eyebrow: 'Por que método vence talento',
      itens: [
        { num: '75%', label: 'da venda é escuta, não discurso' },
        { num: '7s', label: 'para um pitch que prende a atenção' },
        { num: '5x', label: 'mais barato reter do que conquistar um cliente' },
      ],
    },
    oferta: { titulo: 'Comece a vender com previsibilidade agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Funciona para qualquer produto ou serviço?', a: 'Sim. O livro reúne especialistas de B2C e B2B, e a mecânica é a mesma: o que muda é a adaptação. Investigação, rapport, negociação e pós-venda se aplicam ao que você vende.' },
      { q: 'Sou novo em vendas, dá conta?', a: 'Dá. O programa começa pelo essencial — o autoconceito do vendedor e o pitch — e te leva passo a passo até a investigação, o fechamento e a fidelização. "Nada acontece antes que uma venda aconteça", e você aprende a fazer a primeira.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Investigação e Solution Selling: 25% de perguntas, 75% de escuta — a dor real antes de você falar do produto.',
      'Rapport e conexão: os 6 elementos que criam confiança, mais o pitch que diz quem você é em menos de 7 segundos.',
      'Negociação e fechamento com método: CVBA, A.I.D.A. e o perfil do vendedor sniper para contornar objeções sem destruir margem.',
      'Pós-venda e fidelização: o funil de adoção, retenção, expansão e evangelização — reter custa até 5x menos que conquistar.',
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
    heroSub: 'Um líder não nasce pronto. Liderança é habilidade, e habilidade se desenvolve. A diferença entre dar ordens e ser seguido aparece no resultado do time e na vontade das pessoas de remar com você. Da autogestão ao mapeamento dos perfis da equipe, este programa forma o líder que as pessoas escolhem.',
    descricao: 'Mentalidade, mapeamento comportamental e ferramentas de gestão: o que separa um chefe de um líder que constrói resultado com pessoas.',
    ctaTitle: 'Seja o líder que as pessoas escolhem seguir.',
    cover: '/academy/assets/lideranca-capa.png', // PLACEHOLDER
    subtitulo: 'Autogestão e gestão de pessoas com foco em resultados',
    mockup: '/academy/assets/mockups/lideranca.png',
    autoresImg: '/academy/assets/autores/lideranca.jpg',
    livro: {
      descricao: 'Coletânea da coleção Foco em Resultados, reunindo dezenas de mentores em torno de uma ideia central: o líder extraordinário é o que faz algo diferente no mesmo nível de competência, é o guardião da cultura e a fonte de inspiração que extrai o melhor de cada liderado. Da autoconsciência ao engajamento, da delegação à formação de novos líderes, é o caminho de bom técnico a grande líder.',
      temas: ['Autogestão, tempo e produtividade humanizada', 'Autoconhecimento e a arte de liderar', 'Mapeamento comportamental da equipe', 'Delegação, feedback, conflitos e metodologias ágeis'],
      prefacio: 'Leila Navarro',
      convidado: 'Stella Aguiar',
      convidadoFem: true,
    },
    theme: { primary: '#EBB700', accent: '#FFD200', dark: '#0C0A02' }, // Manual Liderança (dourado / amarelo-ouro)
    preco: PRECO_PADRAO,
    hotmartCheckout: 'https://pay.hotmart.com/PLACEHOLDER-LIDERANCA',
    problema: {
      titulo: 'Promovido por competência, perdido na liderança.',
      texto: 'A maioria chega à liderança por entregar bem como técnico, não por saber conduzir gente. Aí trava: o medo de delegar, o feedback de melhoria que ninguém tem coragem de dar, o conflito que paralisa, a agenda que não cabe no dia. Uma pesquisa da Gallup mostra a conta: apenas 15% das pessoas remam a favor do negócio, 18% remam contra e 67% só fazem o mínimo. Liderar pessoas para resultado é uma habilidade que se desenvolve. É isso que você aprende aqui.',
    },
    metodo: {
      eyebrow: 'O percurso',
      titulo: 'Do bom técnico ao líder que as pessoas escolhem.',
      intro: 'Liderar é uma habilidade, e como toda habilidade, se desenvolve. Este é o caminho da transição que ninguém te ensina.',
      etapas: [
        { t: 'Autogestão', d: 'Priorização com a matriz de Eisenhower, domínio do tempo e fim da multitarefa.' },
        { t: 'Autoconhecimento', d: 'A arte de liderar e o que separa cargo de comando de gente.' },
        { t: 'Mapear a equipe', d: 'Perfis comportamentais para extrair o melhor de cada pessoa.' },
        { t: 'Delegar e dar feedback', d: 'Delegação sem largar e feedback humanizado que muda comportamento.' },
        { t: 'Mediar conflitos', d: 'Conduzir tensões com confiança em vez de deixar o conflito paralisar.' },
        { t: 'Engajar', d: 'Do Propósito ao Flow, liderança situacional e metodologias ágeis.' },
      ],
    },
    stats: {
      eyebrow: 'O que a Gallup revela',
      itens: [
        { num: '15%', label: 'das pessoas remam a favor do negócio' },
        { num: '18%', label: 'remam contra, ativamente' },
        { num: '67%', label: 'só fazem o mínimo, esperando direção' },
      ],
    },
    oferta: { titulo: 'Comece a liderar com preparo agora.', inclui: OFERTA_INCLUI, garantia: GARANTIA },
    faq: [
      { q: 'Sou líder de primeira viagem, serve?', a: 'Serve especialmente. O programa estrutura o que ninguém ensina na transição de bom técnico para bom líder: como delegar sem medo, dar feedback de melhoria e conduzir gente, não só tarefa.' },
      { q: 'E se eu já lidero há anos?', a: 'Também. O conteúdo aprofunda mapeamento de perfis, engajamento do propósito ao flow, liderança situacional e mediação de conflitos, úteis para refinar uma liderança já em andamento.' },
      FAQ_RITMO,
    ],
    aprende: [
      'Autogestão do líder: priorização (matriz de Eisenhower), domínio do tempo e fim da armadilha da multitarefa.',
      'Mapeamento comportamental e os perfis da equipe, para extrair o melhor de cada pessoa.',
      'Delegação sem largar, feedback humanizado e mediação de conflitos com confiança.',
      'Engajamento do Propósito ao Flow, liderança situacional e metodologias ágeis para alta performance.',
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
