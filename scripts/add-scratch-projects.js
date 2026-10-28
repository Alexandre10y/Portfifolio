/**
 * Cadastra os 3 projetos Scratch Aulas no Firebase (empresarial).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const PROJECT_ID = 'portifoliopessoal-eb91b';
const BUCKET = 'portifoliopessoal-eb91b.firebasestorage.app';
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const ROOT = path.join(__dirname, '..');

const PROJECTS = [
  {
    file: path.join(ROOT, 'Scratch Aulas (1).png'),
    type: 'empresarial',
    title: 'Pesqueiro Dos Mojolos',
    subtitle:
      'Sistema de gestão para restaurante e pesqueiro: mesas, vendas, estoque, atendimento e comandas — lançamento de pedidos, controle do fluxo da casa e pagamento.',
    handle: '@Alexandre10y',
    borderColor: '#0EA5E9',
    gradient: 'linear-gradient(165deg, #0EA5E9, #000)',
    url: 'https://exemplo.com/pesqueiro-dos-mojolos',
    order: 10,
  },
  {
    file: path.join(ROOT, 'Scratch Aulas (4).png'),
    type: 'empresarial',
    title: 'Portfólio Pessoal — Alexandre Belloni',
    subtitle:
      'Site portfólio completo com vitrine de projetos, formação, áreas de atuação e painel administrativo conectado ao Firebase para gestão do conteúdo sem alterar código.',
    handle: '@Alexandre10y',
    borderColor: '#D4A24C',
    gradient: 'linear-gradient(145deg, #D4A24C, #000)',
    url: 'https://exemplo.com/portfolio-alexandre',
    order: 11,
  },
  {
    file: path.join(ROOT, 'Scratch Aulas (6).png'),
    type: 'empresarial',
    title: 'Ateliê Doces',
    subtitle:
      'CRM completo para ateliê de doces: catálogo online, vendas, canecas personalizadas, gestão de estoque, financeiro e clientes — com vitrine na internet para divulgação dos produtos.',
    handle: '@Alexandre10y',
    borderColor: '#EC4899',
    gradient: 'linear-gradient(195deg, #EC4899, #000)',
    url: 'https://exemplo.com/atelie-doces',
    order: 12,
  },
];

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function toFirestoreValue(value) {
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map((v) => toFirestoreValue(v)) } };
  }
  return { stringValue: String(value) };
}

function toFirestoreDoc(data) {
  const fields = {};
  for (const [k, v] of Object.entries(data)) fields[k] = toFirestoreValue(v);
  return { fields };
}

function getAccessToken() {
  const toolsPath = path.join(
    os.homedir(),
    '.config',
    'configstore',
    'firebase-tools.json'
  );
  const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  const access = tools.tokens?.access_token;
  const expiresAt = tools.tokens?.expires_at || 0;
  if (!access || Date.now() >= expiresAt - 60_000) {
    throw new Error('Token do Firebase CLI expirou. Rode: npx firebase login');
  }
  return access;
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
    throw new Error(`${res.status}: ${json?.error?.message || text}`);
  }
  return json;
}

async function uploadImage(token, localFile, storagePath) {
  const original = fs.statSync(localFile).size;
  const buffer = await sharp(localFile)
    .rotate()
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();

  const downloadToken = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const uploadUrl =
    `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o` +
    `?uploadType=media&name=${encodeURIComponent(storagePath)}`;

  await api(token, uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'image/webp' },
    body: buffer,
  });

  await api(
    token,
    `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(storagePath)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        contentType: 'image/webp',
        cacheControl: 'public,max-age=31536000',
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      }),
    }
  );

  const url =
    `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/` +
    `${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;

  return { url, path: storagePath, original, compressed: buffer.length };
}

async function main() {
  console.log('\nCadastrando Scratch Aulas (empresarial)…\n');
  const token = getAccessToken();

  for (const project of PROJECTS) {
    if (!fs.existsSync(project.file)) {
      throw new Error(`Arquivo não encontrado: ${project.file}`);
    }
    const slug = project.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const storagePath = `projects/scratch/${Date.now()}-${slug}.webp`;
    const uploaded = await uploadImage(token, project.file, storagePath);
    const { file, ...data } = project;
    await api(token, `${FIRESTORE}/projects`, {
      method: 'POST',
      body: JSON.stringify(
        toFirestoreDoc({
          ...data,
          imageUrl: uploaded.url,
          imagePath: uploaded.path,
        })
      ),
    });
    console.log(
      `✓ ${project.title} (${formatBytes(uploaded.original)} → ${formatBytes(uploaded.compressed)})`
    );
  }

  console.log('\nPronto. Links placeholder em exemplo.com — edite no /admin/projetos.\n');
}

main().catch((err) => {
  console.error('\nFalha:', err.message || err);
  process.exit(1);
});
