import palace from '../assets/img/projetos/palace.jpg';
import gh from '../assets/img/projetos/gh.jpg';
import AnguloZ from '../assets/img/projetos/angulo.jpg';
import Marechal from '../assets/img/projetos/marechal.jpeg';
import Farmacia from '../assets/img/projetos/Farmacia.png';
import noFoco from '../assets/img/projetos/nofoco.png';
import futebol from '../assets/img/pessoal/bi-champions.jpg';
import dash from '../assets/img/pessoal/dashboard.png';
import jogo from '../assets/img/pessoal/unity.png';
import buscador from '../assets/img/pessoal/Buscador.png';

export const DEFAULT_PROJECTS = [
  {
    id: 'emp-palace',
    type: 'empresarial',
    image: palace,
    title: 'Laranjeiras Palace Hotel',
    subtitle:
      'Sistema de gestão e controle de reservas, com integração às galerias e ao sistema do próprio hotel — a reserva é registrada automaticamente no fluxo do estabelecimento.',
    handle: '@Alexandre10y',
    borderColor: '#e5c346ff',
    gradient: 'linear-gradient(145deg, #e5d246ff, #000)',
    url: 'https://laranjeiraspalacehotel.vercel.app/',
    order: 0,
  },
  {
    id: 'emp-gh',
    type: 'empresarial',
    image: gh,
    title: 'GH Treinamentos',
    subtitle:
      'Site web para divulgação da empresa e compreensão das NRs de treinamento em segurança do trabalho, com conteúdo claro para quem busca capacitação na área.',
    handle: '@Alexandre10y',
    borderColor: '#10B981',
    gradient: 'linear-gradient(210deg, #10B981, #000)',
    url: 'https://www.ghtreinamento.com.br/',
    order: 1,
  },
  {
    id: 'emp-angulo',
    type: 'empresarial',
    image: AnguloZ,
    title: 'AnguloZ - Arquitetura',
    subtitle:
      'Sistema integrado com banco de dados para gerenciar projetos de arquitetura de uma arquiteta de Laranjeiras do Sul — organização de arquivos e acompanhamento das obras.',
    handle: '@Alexandre10y',
    borderColor: '#0b36f5ff',
    gradient: 'linear-gradient(165deg, #220bf5ff, #000)',
    url: 'https://anguloz.vercel.app',
    order: 2,
  },
  {
    id: 'emp-marechal',
    type: 'empresarial',
    image: Marechal,
    title: 'Hotel Marechal Express',
    subtitle:
      'Sistema de gestão e controle de reservas no mesmo princípio do Laranjeiras Palace Hotel, com integração ao fluxo operacional do hotel.',
    handle: '@Alexandre10y',
    borderColor: '#efef44ff',
    gradient: 'linear-gradient(195deg, #efef44ff, #000)',
    url: 'https://www.hotelmarechal.com.br',
    order: 3,
  },
  {
    id: 'emp-farmacia',
    type: 'empresarial',
    image: Farmacia,
    title: 'Farmácia Solidaria - PRIVADO',
    subtitle:
      'Projeto organizacional de controle de medicamentos, estoques e produtos de uma farmácia — gestão prática do inventário e do dia a dia do estabelecimento.',
    handle: '@Alexandre10y',
    borderColor: '#8B5CF6',
    gradient: 'linear-gradient(225deg, #8B5CF6, #000)',
    url: 'https://farmacia-solidaria-ara.vercel.app',
    order: 4,
  },
  {
    id: 'emp-nofoco',
    type: 'empresarial',
    image: noFoco,
    title: 'No Foco da Noticia - PRIVADO',
    subtitle: 'Desenvolvido através da plataform Hostinger para terceiros',
    handle: '@Alexandre10y',
    borderColor: '#5c95f6ff',
    gradient: 'linear-gradient(225deg, #5c8af6ff, #000)',
    url: 'https://nofocodanoticia.com.br/',
    order: 5,
  },
  {
    id: 'pes-champions',
    type: 'pessoal',
    image: futebol,
    title: 'Analise da Champions League',
    subtitle:
      'Utilizando PowerBI conecta a API de dados da champions conseguimos ter analises precisas.',
    handle: '@Alexandre10y',
    borderColor: '#4F46E5',
    gradient: 'linear-gradient(145deg, #4F46E5, #000)',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiODQxZWRiNTgtNTI0OS00MzZjLTgyYzItM2JhYTQ2ZjdkODM2IiwidCI6IjBiYWIxNGQ4LTEyNTktNDQyYi05MDQ0LTk2NjU4MWRjOWM2MyJ9',
    order: 0,
  },
  {
    id: 'pes-metas',
    type: 'pessoal',
    image: dash,
    title: 'Controle de metas empresarias',
    subtitle:
      'Com Power BI e suas ferramentas desenvolvemos um metódo para acompanhar metas',
    handle: '@Alexandre10y',
    borderColor: '#10B981',
    gradient: 'linear-gradient(210deg, #10B981, #000)',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiNDVjMTIxMDctNWI5OS00NWZlLTgxYzctZTM0N2ZmMmViYjZhIiwidCI6IjBiYWIxNGQ4LTEyNTktNDQyYi05MDQ0LTk2NjU4MWRjOWM2MyJ9',
    order: 1,
  },
  {
    id: 'pes-aracnidio',
    type: 'pessoal',
    image: jogo,
    title: 'Aracnidio - Jogo da Aranha',
    subtitle:
      'Desenvolvido durante a faculdade, intuito de desenvolver com o raciocinio lógico e orientação a objetos.',
    handle: '@Alexandre10y',
    borderColor: '#F59E0B',
    gradient: 'linear-gradient(165deg, #F59E0B, #000)',
    url: 'https://play.unity.com/en/games/89c5b01e-a2bc-409f-b210-6f683feff0eb/jogo-aracnidio-pule-e-viva',
    order: 2,
  },
  {
    id: 'pes-cep',
    type: 'pessoal',
    image: buscador,
    title: 'Buscador de CEP',
    subtitle:
      'Utilizando React e APIs do google, foi realizada a criação de localizador de CEP online',
    handle: '@Alexandre10y',
    borderColor: '#EF4444',
    gradient: 'linear-gradient(195deg, #EF4444, #000)',
    url: 'https://github.com/Alexandre10y/BuscadorDeCep-React',
    order: 3,
  },
];

export const DEFAULT_FORMACAO = [
  {
    id: 'f1',
    periodo: '2019 — 2021',
    titulo: 'Técnico em Informática',
    instituicao: 'Colégio Técnico Naiana Bavaresco de Souza',
    tipo: 'Técnico',
    detalhes:
      'Formação técnica com foco em suporte de TI (redes, desktops, impressoras), manutenção preventiva e construção dos primeiros sites estáticos.',
    tags: ['Redes', 'Suporte TI', 'HTML/CSS'],
    order: 0,
  },
  {
    id: 'f2',
    periodo: '2020 — 2024',
    titulo: 'Engenharia de Software',
    instituicao: 'Centro Universitário Campo Real',
    tipo: 'Graduação',
    detalhes:
      'Foco em desenvolvimento web, bancos de dados, arquitetura de software, engenharia de requisitos e padrões de projeto.',
    tags: ['Arquitetura', 'Banco de Dados', 'Engenharia de Requisitos'],
    order: 1,
  },
  {
    id: 'f3',
    periodo: '2022 — 2025',
    titulo: 'Docência em Programação e Robótica',
    instituicao: 'Escolas estaduais · Campo Real (robótica)',
    tipo: 'Histórico',
    detalhes:
      'Aulas para adolescentes de 14 a 17 anos em escolas estaduais e imersões de robótica no Campo Real. Atividade encerrada no ensino estadual; mantém apoio pontual a ex-alunos com dúvidas de carreira e projetos.',
    tags: ['Docência', 'Robótica', 'Mentoria'],
    order: 2,
  },
  {
    id: 'f4',
    periodo: '2024 — 2025',
    titulo: 'Pós-graduação em Inteligência Artificial',
    instituicao: 'Especialização',
    tipo: 'Pós-graduação',
    detalhes:
      'Aprofundamento em aprendizado de máquina, modelos generativos, NLP e aplicação prática de IA em soluções de negócio, automação e análise de dados.',
    tags: ['Machine Learning', 'NLP', 'IA aplicada'],
    order: 3,
  },
  {
    id: 'f5',
    periodo: '2025 — Atual',
    titulo: 'Pós-graduação em Desenvolvimento de Dispositivos Móveis',
    instituicao: 'UTFPR — Universidade Tecnológica Federal do Paraná',
    tipo: 'Pós-graduação',
    detalhes:
      'Especialização em andamento com foco em apps nativos e multiplataforma, UX mobile, arquitetura de aplicações e publicação nas lojas.',
    tags: ['Mobile', 'Android/iOS', 'UX'],
    order: 4,
  },
  {
    id: 'f6',
    periodo: 'Atual',
    titulo: 'Analista de Dados — BI',
    instituicao: 'Cresol · 3ª maior cooperativa de crédito do Brasil',
    tipo: 'Atuação principal',
    detalhes:
      'Desenvolvimento de painéis gerenciais de BI para apoiar decisões estratégicas, modelagem de dados e criação de dashboards analíticos em escala cooperativa.',
    tags: ['Power BI', 'Modelagem de dados', 'SQL'],
    order: 5,
  },
  {
    id: 'f7',
    periodo: 'Atual',
    titulo: 'Suporte de TI, IA & Marketing Digital',
    instituicao: 'Hotéis e empresas do setor',
    tipo: 'Profissional',
    detalhes:
      'Serviços de tecnologia, inteligência artificial, marketing de TI e desenvolvimento de sistemas para empresas do ramo hoteleiro: Google Workspace, Booking, sites, chatbots e automações.',
    tags: ['IA', 'Google', 'Chatbots', 'Hotelaria'],
    order: 6,
  },
];

export const DEFAULT_ATUACAO = [
  {
    id: 'a1',
    numero: '01',
    titulo: 'Analista de Dados — Business Intelligence',
    local: 'Cresol · 3ª maior cooperativa de crédito do Brasil',
    descricao:
      'Atuação principal no desenvolvimento de painéis gerenciais de BI, modelagem de dados e dashboards analíticos usados para decisões estratégicas dentro da cooperativa.',
    tags: ['Power BI', 'Modelagem', 'SQL', 'Análise'],
    order: 0,
  },
  {
    id: 'a2',
    numero: '02',
    titulo: 'Suporte de TI, IA & Marketing Digital',
    local: 'Hotéis e empresas do setor hoteleiro',
    descricao:
      'Prestação de serviços de tecnologia, inteligência artificial, marketing de TI e desenvolvimento de sistemas para empresas do ramo: configuração de contas Google, automações, chatbots, sites, Booking e inovação no dia a dia do negócio.',
    tags: ['IA', 'Google Workspace', 'Chatbots', 'Automação'],
    order: 1,
  },
  {
    id: 'a3',
    numero: '03',
    titulo: 'Freelancer — Desenvolvimento & Dados',
    local: 'Projetos sob demanda',
    descricao:
      'Desenvolvimento de sites, landing pages, sistemas web, dashboards e integrações com APIs. Foco em interfaces modernas, performance e identidade visual coerente com cada cliente.',
    tags: ['React', 'Power BI', 'APIs', 'UI/UX'],
    order: 2,
  },
];

export const DEFAULT_SOBRE = {
  headline: 'Meu nome é Alexandre Belloni',
  cardName: 'Alexandre Belloni',
  cardTitle: 'Analista de Dados · Eng. Software',
  cardHandle: 'alexandre10y',
  paragraphs: [
    'Sou **Engenheiro de Software**, pós-graduado em **Inteligência Artificial** e em formação na **UTFPR** em **Desenvolvimento de Dispositivos Móveis**. Atualmente sou **Analista de Dados** na **Cresol**, 3ª maior cooperativa de crédito do Brasil, desenvolvendo painéis gerenciais de BI para decisões estratégicas.',
    'Meu segundo foco profissional é prestar **suporte de tecnologia, inteligência artificial, marketing de TI e desenvolvimento de sistemas** para **hotéis e empresas do setor** — configuração de contas Google, automações, chatbots, sites e inovação no dia a dia do negócio.',
    'Não ministro mais aulas no ensino estadual, mas sigo apoiando ex-alunos que têm dúvidas sobre carreira e projetos. Já formei turmas gratuitas em escolas e comunidade por mais de 4 anos.',
    '**Acredito que tecnologia só faz sentido quando gera impacto real.**',
  ],
  highlights: [
    'Engenheiro de Software · Pós em IA · Mobile (UTFPR)',
    'Analista de Dados na Cresol · 3ª maior cooperativa do Brasil',
    'TI, IA e marketing digital para hotéis e empresas do ramo',
    '4+ anos de docência social · apoio pontual a ex-alunos',
  ],
};
