/**
 * Radar IA — atualiza src/data/ai-news.json com a notícia mais recente de IA.
 * Uso local:  $env:GEMINI_API_KEY="sua-chave"; node scripts/update-radar-ia.js
 * CI:         GitHub Actions com secret GEMINI_API_KEY
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const Parser = require('rss-parser');

const ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'src', 'data', 'ai-news.json');
const IMAGE_DIR = path.join(ROOT, 'public', 'images', 'radar-ia');
const MAX_POSTS = 18;
const LOOKBACK_MS = 24 * 60 * 60 * 1000;

const RSS_FEEDS = [
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://www.technologyreview.com/feed/',
];

// gemini-2.5-flash foi descontinuado para contas novas; 3.6 é o substituto atual.
const GEMINI_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.0-flash',
].filter(Boolean);

function log(step, message) {
  console.log(`[radar-ia] ${step} — ${message}`);
}

function fail(message) {
  console.error(`[radar-ia] ERRO — ${message}`);
  process.exit(1);
}

function stripHtml(html = '') {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeUrl(url = '') {
  try {
    const u = new URL(url);
    u.hash = '';
    return u.toString().replace(/\/$/, '');
  } catch {
    return String(url || '').trim().replace(/\/$/, '');
  }
}

function sourceFromFeed(feed, item) {
  if (feed?.title) return stripHtml(feed.title).slice(0, 80);
  try {
    return new URL(item.link).hostname.replace(/^www\./, '');
  } catch {
    return 'RSS';
  }
}

function loadNewsFile() {
  if (!fs.existsSync(JSON_PATH)) {
    return { updatedAt: null, posts: [] };
  }
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  const data = JSON.parse(raw);
  return {
    updatedAt: data.updatedAt ?? null,
    posts: Array.isArray(data.posts) ? data.posts : [],
  };
}

function saveNewsFile(data) {
  fs.writeFileSync(JSON_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function fetchLatestItem() {
  const parser = new Parser({
    timeout: 20000,
    headers: {
      'User-Agent': 'Portfifolio-RadarIA/1.0 (+https://github.com/Alexandre10y/Portfifolio)',
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
  });

  const since = Date.now() - LOOKBACK_MS;
  let lastError = null;

  for (const feedUrl of RSS_FEEDS) {
    try {
      log('rss', `Consultando ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      const items = (feed.items || [])
        .map((item) => {
          const publishedAt = item.isoDate || item.pubDate;
          const ts = publishedAt ? Date.parse(publishedAt) : NaN;
          return { item, feed, ts };
        })
        .filter(({ item, ts }) => item.link && Number.isFinite(ts))
        .sort((a, b) => b.ts - a.ts);

      const recent = items.find(({ ts }) => ts >= since);
      if (recent) {
        log('rss', `Notícia recente encontrada: ${recent.item.title}`);
        return recent;
      }

      log('rss', 'Nenhuma notícia nas últimas 24h neste feed.');
    } catch (err) {
      lastError = err;
      log('rss', `Falha no feed (${err.message}). Tentando fallback...`);
    }
  }

  if (lastError) {
    fail(`Todos os feeds falharam. Último erro: ${lastError.message}`);
  }

  return null;
}

function extractJson(text = '') {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini não retornou JSON válido.');
    return JSON.parse(match[0]);
  }
}

async function summarizeWithGemini(item) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) fail('GEMINI_API_KEY não definida.');

  const ai = new GoogleGenAI({ apiKey });
  const originalTitle = item.title || '';
  const originalDescription = stripHtml(item.contentSnippet || item.content || item.summary || '');

  const prompt = [
    'Resuma a seguinte notícia de IA em 2 a 3 frases em Português do Brasil.',
    'O tom deve ser informativo, dinâmico e direto para um portfólio de tecnologia.',
    'Crie também um título atraente e 2 tags em português.',
    'Responda APENAS com JSON válido no formato:',
    '{"title":"...","summary":"...","tags":["...","..."],"imagePrompt":"..."}',
    'O campo imagePrompt deve ser curto, em inglês, descrevendo uma capa ilustrativa (sem texto na imagem).',
    '',
    `Título original: ${originalTitle}`,
    `Descrição original: ${originalDescription.slice(0, 2500)}`,
  ].join('\n');

  let response = null;
  let usedModel = null;
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      log('gemini', `Gerando resumo com ${model}...`);
      response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      usedModel = model;
      break;
    } catch (err) {
      lastError = err;
      const msg = err?.message || String(err);
      log('gemini', `Modelo ${model} falhou (${msg.slice(0, 180)}). Tentando próximo...`);
    }
  }

  if (!response) {
    fail(`Nenhum modelo Gemini respondeu. Último erro: ${lastError?.message || lastError}`);
  }

  const parsed = extractJson(response.text || '');
  const title = String(parsed.title || originalTitle).trim();
  const summary = String(parsed.summary || '').trim();
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 2)
    : [];
  const imagePrompt = String(parsed.imagePrompt || `${title} artificial intelligence cover art`).trim();

  if (!title || !summary) {
    fail('Resposta do Gemini incompleta (title/summary).');
  }

  log('gemini', `OK com ${usedModel}. Título: ${title}`);
  return { title, summary, tags, imagePrompt };
}

function buildImageUrl(imagePrompt) {
  const prompt = `${imagePrompt}, modern tech editorial illustration, clean composition, no text, no watermark`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=450&nologo=true`;
}

async function downloadThumbnail(imagePrompt, dateStamp) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });

  const remoteUrl = buildImageUrl(imagePrompt);
  const fileName = `post-${dateStamp}.jpg`;
  const absolutePath = path.join(IMAGE_DIR, fileName);
  const publicPath = `/images/radar-ia/${fileName}`;

  log('image', `Baixando thumbnail via Pollinations...`);

  try {
    const res = await fetch(remoteUrl, {
      headers: { 'User-Agent': 'Portfifolio-RadarIA/1.0' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) {
      throw new Error('Arquivo de imagem muito pequeno/inválido.');
    }

    fs.writeFileSync(absolutePath, buffer);
    log('image', `Salva em ${publicPath}`);
    return publicPath;
  } catch (err) {
    log('image', `Download falhou (${err.message}). Usando URL remota no JSON.`);
    return remoteUrl;
  }
}

function alreadyExists(posts, sourceUrl, publishedAt) {
  const normalized = normalizeUrl(sourceUrl);
  return posts.some((post) => {
    if (post.sourceUrl && normalizeUrl(post.sourceUrl) === normalized) return true;
    if (post.publishedAt && post.publishedAt === publishedAt && post.sourceUrl) {
      return normalizeUrl(post.sourceUrl) === normalized;
    }
    return false;
  });
}

function toDateStamp(date) {
  return date.toISOString().slice(0, 10);
}

async function main() {
  log('start', 'Iniciando atualização do Radar IA');

  const news = loadNewsFile();
  const latest = await fetchLatestItem();

  if (!latest) {
    log('done', 'Nenhuma notícia nova nas últimas 24h. Encerrando sem alterações.');
    process.exit(0);
  }

  const { item, feed, ts } = latest;
  const sourceUrl = item.link;
  const publishedDate = new Date(ts);
  const publishedAt = toDateStamp(publishedDate);

  if (alreadyExists(news.posts, sourceUrl, publishedAt)) {
    log('done', 'Post já existe no JSON (URL/data). Sem duplicar.');
    process.exit(0);
  }

  const summarized = await summarizeWithGemini(item);
  const image = await downloadThumbnail(summarized.imagePrompt, publishedAt);

  const post = {
    id: `radar-${publishedAt}-${Buffer.from(normalizeUrl(sourceUrl)).toString('base64url').slice(0, 10)}`,
    title: summarized.title,
    summary: summarized.summary,
    image,
    source: sourceFromFeed(feed, item),
    sourceUrl,
    publishedAt,
    tags: summarized.tags,
  };

  news.updatedAt = new Date().toISOString();
  news.posts = [post, ...news.posts].slice(0, MAX_POSTS);
  saveNewsFile(news);

  log('json', `Atualizado ${path.relative(ROOT, JSON_PATH)} (${news.posts.length} posts)`);
  log('done', 'Radar IA atualizado com sucesso.');
}

main().catch((err) => {
  fail(err?.stack || err?.message || String(err));
});
