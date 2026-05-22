import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaChalkboardUser,
  FaShieldHalved,
  FaWandMagicSparkles,
  FaUsers,
  FaArrowRight,
} from 'react-icons/fa6';
import Reveal from '../ui/Reveal';
import './educator-intro.css';

const HEYGEN_EMBED =
  'https://app.heygen.com/embeds/debeaff29d1d47f4abf0f15918992658';

const TOPICS = [
  {
    icon: <FaWandMagicSparkles />,
    title: 'Ferramentas que economizam tempo',
    text: 'Planejamento de aulas, materiais e avaliações com IA — sem perder sua autoria pedagógica.',
  },
  {
    icon: <FaShieldHalved />,
    title: 'Uso seguro e ético',
    text: 'Boas práticas com dados de alunos, transparência em sala e limites claros do que a tecnologia pode fazer.',
  },
  {
    icon: <FaUsers />,
    title: 'Troca entre escolas',
    text: 'Uma oportunidade de capacitação pensada para quem está na linha de frente do ensino público.',
  },
];

export default function EducatorIntro() {
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadVideo(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      id="educadores"
      className="educator-intro"
      aria-labelledby="educator-intro-title"
    >
      <div className="educator-intro__glow" aria-hidden="true" />
      <div className="educator-intro__grid" aria-hidden="true" />

      <div className="container educator-intro__inner">
        <div className="educator-intro__content">
          <Reveal className="educator-intro__head">
            <span className="section-kicker educator-intro__kicker">
              <span className="educator-intro__kicker-dot" />
              Para educadores
            </span>

            <h2 id="educator-intro-title" className="section-title">
              IA na escola, <em>com você no centro</em>.
            </h2>

            <p className="section-lead educator-intro__lead">
              Antes de conhecer minha trajetória e projetos, deixei uma mensagem em vídeo para
              quem ensina e quer usar inteligência artificial de forma prática — reforçando o que
              você já faz, sem medo e sem substituir o professor.
            </p>
          </Reveal>

          <ul className="educator-intro__topics">
            {TOPICS.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <span className="educator-intro__topic-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="educator-intro__actions">
            <a href="#contato" className="educator-intro__cta">
              Quero saber mais
              <FaArrowRight />
            </a>
            <a href="#jornada" className="educator-intro__link">
              Ver minha atuação em escolas
            </a>
          </div>
        </div>

        <Reveal className="educator-intro__media-wrap">
          <div className="educator-intro__frame">
            <div className="educator-intro__frame-head">
              <span className="educator-intro__live">
                <span className="educator-intro__live-dot" />
                Mensagem em vídeo
              </span>
              <span className="educator-intro__frame-label">
                <FaChalkboardUser aria-hidden="true" />
                Capacitação · IA &amp; educação
              </span>
            </div>

            <div className="educator-intro__video">
              {loadVideo ? (
                <iframe
                  src={HEYGEN_EMBED}
                  title="Mensagem para educadores — IA nas escolas"
                  allow="encrypted-media; fullscreen"
                  allowFullScreen
                  loading="eager"
                />
              ) : (
                <div className="educator-intro__video-placeholder" aria-hidden="true">
                  <FaChalkboardUser />
                  <span>Carregando vídeo…</span>
                </div>
              )}
            </div>

            <p className="educator-intro__caption">
              Assista com som ligado · cerca de 1 min
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
