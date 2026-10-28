/**
 * Sobe o conteúdo atual do portfólio para Firestore + Storage.
 * Autentica com o login do Firebase CLI (sem service account).
 *
 * Uso: npm run seed:firebase
 *      npm run seed:firebase:force
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const sharp = require('sharp');

const PROJECT_ID = 'portifoliopessoal-eb91b';
const BUCKET = 'portifoliopessoal-eb91b.firebasestorage.app';
const FORCE = process.argv.includes('--force');
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const FIREBASE_CLI_CLIENT = {
  client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
  client_secret: 'jEQPV7uwoFqElLP_XYljCl81',
};

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'src', 'assets', 'img');

const PROJECTS = [
  {
    type: 'empresarial',
    file: path.join(ASSETS, 'projetos', 'palace.jpg'),
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
    type: 'empresarial',
    file: path.join(ASSETS, 'projetos', 'gh.jpg'),
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
    type: 'empresarial',
    file: path.join(ASSETS, 'projetos', 'angulo.jpg'),
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
    type: 'empresarial',
    file: path.join(ASSETS, 'projetos', 'marechal.jpeg'),
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
    type: 'empresarial',
    file: path.join(ASSETS, 'projetos', 'Farmacia.png'),
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
    type: 'empresarial',
    file: path.join(ASSETS, 'projetos', 'nofoco.png'),
    title: 'No Foco da Noticia - PRIVADO',
    subtitle: 'Desenvolvido através da plataform Hostinger para terceiros',
    handle: '@Alexandre10y',
    borderColor: '#5c95f6ff',
    gradient: 'linear-gradient(225deg, #5c8af6ff, #000)',
    url: 'https://nofocodanoticia.com.br/',
    order: 5,
  },
  {
    type: 'pessoal',
    file: path.join(ASSETS, 'pessoal', 'bi-champions.jpg'),
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
    type: 'pessoal',
    file: path.join(ASSETS, 'pessoal', 'dashboard.png'),
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
    type: 'pessoal',
    file: path.join(ASSETS, 'pessoal', 'unity.png'),
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
    type: 'pessoal',
    file: path.join(ASSETS, 'pessoal', 'Buscador.png'),
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

const FORMACAO = [
  {
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

const ATUACAO = [
  {
    numero: '01',
    titulo: 'Analista de Dados — Business Intelligence',
    local: 'Cresol · 3ª maior cooperativa de crédito do Brasil',
    descricao:
      'Atuação principal no desenvolvimento de painéis gerenciais de BI, modelagem de dados e dashboards analíticos usados para decisões estratégicas dentro da cooperativa.',
    tags: ['Power BI', 'Modelagem', 'SQL', 'Análise'],
    order: 0,
  },
  {
    numero: '02',
    titulo: 'Suporte de TI, IA & Marketing Digital',
    local: 'Hotéis e empresas do setor hoteleiro',
    descricao:
      'Prestação de serviços de tecnologia, inteligência artificial, marketing de TI e desenvolvimento de sistemas para empresas do ramo: configuração de contas Google, automações, chatbots, sites, Booking e inovação no dia a dia do negócio.',
    tags: ['IA', 'Google Workspace', 'Chatbots', 'Automação'],
    order: 1,
  },
  {
    numero: '03',
    titulo: 'Freelancer — Desenvolvimento & Dados',
    local: 'Projetos sob demanda',
    descricao:
      'Desenvolvimento de sites, landing pages, sistemas web, dashboards e integrações com APIs. Foco em interfaces modernas, performance e identidade visual coerente com cada cliente.',
    tags: ['React', 'Power BI', 'APIs', 'UI/UX'],
    order: 2,
  },
];

const SOBRE = {
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

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((v) => toFirestoreValue(v)),
      },
    };
  }
  if (typeof value === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function toFirestoreDoc(data) {
  const fields = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = toFirestoreValue(v);
  }
  return { fields };
}

async function getAccessToken() {
  const toolsPath = path.join(
    os.homedir(),
    '.config',
    'configstore',
    'firebase-tools.json'
  );
  if (!fs.existsSync(toolsPath)) {
    throw new Error('Faça login no Firebase CLI: npx firebase login');
  }
  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  const access = tools.tokens?.access_token;
  const expiresAt = tools.tokens?.expires_at || 0;
  const userRefresh = tools.tokens?.refresh_token;

  // Prefer token já válido do CLI (evita refresh com client_secret desatualizado)
  if (access && Date.now() < expiresAt - 60_000) {
    return access;
  }

  if (!userRefresh) {
    throw new Error('Refresh token ausente. Rode: npx firebase login');
  }

  const client = new OAuth2Client(
    FIREBASE_CLI_CLIENT.client_id,
    FIREBASE_CLI_CLIENT.client_secret
  );
  client.setCredentials({ refresh_token: userRefresh });
  try {
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse?.token || tokenResponse;
    if (!token) throw new Error('empty');
    return token;
  } catch {
    throw new Error(
      'Token do Firebase CLI expirou. Rode: npx firebase login e tente de novo.'
    );
  }
}

async function api(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body && !(options.body instanceof Buffer)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = json?.error?.message || text || res.statusText;
    throw new Error(`${res.status} ${url}: ${msg}`);
  }
  return json;
}

async function listDocuments(token, collection) {
  const json = await api(
    token,
    `${FIRESTORE}/${collection}?pageSize=300`
  ).catch((err) => {
    if (String(err.message).includes('404')) return { documents: [] };
    throw err;
  });
  return json.documents || [];
}

async function deleteDocument(token, name) {
  // name is full resource path projects/.../documents/col/id
  await api(token, `https://firestore.googleapis.com/v1/${name}`, {
    method: 'DELETE',
  });
}

async function clearCollection(token, collection) {
  const docs = await listDocuments(token, collection);
  for (const doc of docs) {
    await deleteDocument(token, doc.name);
  }
  return docs.length;
}

async function createDocument(token, collection, data) {
  return api(token, `${FIRESTORE}/${collection}`, {
    method: 'POST',
    body: JSON.stringify(toFirestoreDoc(data)),
  });
}

async function upsertSobre(token, data) {
  return api(token, `${FIRESTORE}/siteContent/sobre`, {
    method: 'PATCH',
    body: JSON.stringify(toFirestoreDoc(data)),
  });
}

async function compressToWebp(filePath) {
  const original = fs.statSync(filePath).size;
  const buffer = await sharp(filePath)
    .rotate()
    .resize({
      width: 1400,
      height: 1400,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 78 })
    .toBuffer();
  return { buffer, original, compressed: buffer.length };
}

async function uploadImage(token, localFile, storagePath) {
  const { buffer, original, compressed } = await compressToWebp(localFile);
  const downloadToken = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const uploadUrl =
    `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o` +
    `?uploadType=media&name=${encodeURIComponent(storagePath)}`;

  await api(token, uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/webp',
    },
    body: buffer,
  });

  // metadata com token de download do Firebase Storage
  await api(
    token,
    `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(storagePath)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        contentType: 'image/webp',
        cacheControl: 'public,max-age=31536000',
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      }),
    }
  );

  const url =
    `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/` +
    `${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;

  return { url, path: storagePath, original, compressed };
}

async function deleteStorageObject(token, objectPath) {
  if (!objectPath) return;
  await api(
    token,
    `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(objectPath)}`,
    { method: 'DELETE' }
  ).catch(() => {});
}

async function main() {
  console.log(`\nSeed Firebase → ${PROJECT_ID}${FORCE ? ' (force)' : ''}\n`);
  const token = await getAccessToken();

  const formacaoDocs = await listDocuments(token, 'formacao');
  if (FORCE || formacaoDocs.length === 0) {
    if (FORCE && formacaoDocs.length) {
      await clearCollection(token, 'formacao');
    }
    for (const item of FORMACAO) {
      await createDocument(token, 'formacao', item);
    }
    console.log(`✓ formacao: ${FORMACAO.length} itens`);
  } else {
    console.log('· formacao: já existe (use --force para recriar)');
  }

  const atuacaoDocs = await listDocuments(token, 'atuacao');
  if (FORCE || atuacaoDocs.length === 0) {
    if (FORCE && atuacaoDocs.length) await clearCollection(token, 'atuacao');
    for (const item of ATUACAO) {
      await createDocument(token, 'atuacao', item);
    }
    console.log(`✓ atuacao: ${ATUACAO.length} itens`);
  } else {
    console.log('· atuacao: já existe (use --force para recriar)');
  }

  const sobreList = await listDocuments(token, 'siteContent');
  const hasSobre = sobreList.some((d) => d.name?.endsWith('/sobre'));
  if (FORCE || !hasSobre) {
    await upsertSobre(token, SOBRE);
    console.log('✓ siteContent/sobre');
  } else {
    console.log('· sobre: já existe (use --force para recriar)');
  }

  const projectDocs = await listDocuments(token, 'projects');
  if (FORCE || projectDocs.length === 0) {
    if (FORCE && projectDocs.length) {
      for (const doc of projectDocs) {
        const imagePath = doc.fields?.imagePath?.stringValue;
        await deleteStorageObject(token, imagePath);
      }
      await clearCollection(token, 'projects');
    }

    for (const project of PROJECTS) {
      if (!fs.existsSync(project.file)) {
        throw new Error(`Arquivo não encontrado: ${project.file}`);
      }
      const slug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const storagePath = `projects/seed/${Date.now()}-${slug}.webp`;
      const uploaded = await uploadImage(token, project.file, storagePath);
      const { file, ...data } = project;
      await createDocument(token, 'projects', {
        ...data,
        imageUrl: uploaded.url,
        imagePath: uploaded.path,
      });
      console.log(
        `✓ projeto: ${project.title} (${formatBytes(uploaded.original)} → ${formatBytes(uploaded.compressed)})`
      );
    }
  } else {
    console.log('· projects: já existe (use --force para recriar)');
  }

  console.log('\nConcluído. Atualize a home (/ ) para ver tudo no Firebase.\n');
}

main().catch((err) => {
  console.error('\nFalha no seed:', err.message || err);
  process.exit(1);
});
