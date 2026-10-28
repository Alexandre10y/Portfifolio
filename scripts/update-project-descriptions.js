/**
 * Atualiza subtítulos dos projetos empresariais no Firestore.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const PROJECT_ID = 'portifoliopessoal-eb91b';
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const UPDATES = [
  {
    match: /laranjeiras palace/i,
    subtitle:
      'Sistema de gestão e controle de reservas, com integração às galerias e ao sistema do próprio hotel — a reserva é registrada automaticamente no fluxo do estabelecimento.',
  },
  {
    match: /gh treinamentos/i,
    subtitle:
      'Site web para divulgação da empresa e compreensão das NRs de treinamento em segurança do trabalho, com conteúdo claro para quem busca capacitação na área.',
  },
  {
    match: /anguloz/i,
    subtitle:
      'Sistema integrado com banco de dados para gerenciar projetos de arquitetura de uma arquiteta de Laranjeiras do Sul — organização de arquivos e acompanhamento das obras.',
  },
  {
    match: /marechal/i,
    subtitle:
      'Sistema de gestão e controle de reservas no mesmo princípio do Laranjeiras Palace Hotel, com integração ao fluxo operacional do hotel.',
  },
  {
    match: /farmácia solidaria|farmacia solidaria/i,
    subtitle:
      'Projeto organizacional de controle de medicamentos, estoques e produtos de uma farmácia — gestão prática do inventário e do dia a dia do estabelecimento.',
  },
];

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
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`${res.status}: ${json?.error?.message || text}`);
  }
  return json;
}

async function main() {
  const token = getAccessToken();
  const list = await api(token, `${FIRESTORE}/projects?pageSize=100`);
  const docs = list.documents || [];
  let updated = 0;

  for (const doc of docs) {
    const title = doc.fields?.title?.stringValue || '';
    const rule = UPDATES.find((u) => u.match.test(title));
    if (!rule) continue;

    await api(token, `https://firestore.googleapis.com/v1/${doc.name}?updateMask.fieldPaths=subtitle`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          subtitle: { stringValue: rule.subtitle },
        },
      }),
    });
    console.log(`✓ ${title}`);
    updated += 1;
  }

  console.log(`\n${updated} projetos atualizados no Firebase.\n`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
