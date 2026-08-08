import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/nav/Navbar';
import NoiseOverlay from '../../components/ui/NoiseOverlay';
import Reveal from '../../components/ui/Reveal';
import newsData from '../../data/ai-news.json';
import './style.css';

function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function RadarIa() {
  const posts = newsData.posts ?? [];
  const updatedLabel = newsData.updatedAt
    ? new Date(newsData.updatedAt).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="radar-page">
      <Navbar />
      <NoiseOverlay />

      <main className="radar-main">
        <header className="radar-hero">
          <Reveal>
            <span className="section-kicker">
              <span className="section-kicker__dot" />
              Curiosidades de IA
            </span>
            <h1 className="section-title">
              Radar <em>IA</em>
            </h1>
            <p className="section-lead">
              Um feed leve com novidades de inteligência artificial — resumos
              curtos, direto ao ponto, atualizados automaticamente.
            </p>
            {updatedLabel && (
              <p className="radar-updated">Última atualização: {updatedLabel}</p>
            )}
          </Reveal>
        </header>

        <section className="radar-feed" aria-label="Posts do Radar IA">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              className="radar-post"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.06, 0.24),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="radar-post__media">
                <img
                  src={post.image}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>

              <div className="radar-post__body">
                <div className="radar-post__meta">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  {post.source && <span>{post.source}</span>}
                </div>

                <h2 className="radar-post__title">{post.title}</h2>
                <p className="radar-post__summary">{post.summary}</p>

                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <ul className="radar-post__tags">
                    {post.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}

                {post.sourceUrl && (
                  <a
                    className="radar-post__link"
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver origem
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </section>

        <footer className="radar-footer">
          <Link to="/" className="radar-back">
            ← Voltar ao portfólio
          </Link>
        </footer>
      </main>
    </div>
  );
}
