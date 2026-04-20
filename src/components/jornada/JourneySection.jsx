import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUpRightFromSquare, FaHeart, FaGraduationCap, FaRobot } from 'react-icons/fa6';
import Reveal from '../ui/Reveal';

import HTML from '../../assets/img/cursos/Project1.png';
import robotica from '../../assets/img/cursos/Project2.png';
import prof from '../../assets/img/cursos/Project5.png';

import './journey.css';

const ITEMS = [
  {
    id: 'html',
    numero: '01',
    categoria: 'Comunidade',
    icon: <FaHeart />,
    titulo: 'Aulas gratuitas de HTML & CSS',
    subtitulo: 'Programa noturno — 3 anos voluntários',
    imagem: HTML,
    descricao:
      'Durante três anos ministrei aulas 100% gratuitas no período noturno no Colégio Técnico Naiana Bavaresco, com o objetivo de aproximar jovens do mercado de tecnologia, independentemente da renda familiar.',
    destaques: [
      '100% gratuito',
      'Aulas presenciais',
      'Foco em empregabilidade',
    ],
    link: {
      href: 'https://www.instagram.com/p/Cy6YiVJA0Qp/',
      label: 'Ver no Instagram',
    },
  },
  {
    id: 'atuacao',
    numero: '02',
    categoria: 'Ensino público',
    icon: <FaGraduationCap />,
    titulo: 'Professor no ensino estadual',
    subtitulo: '4+ anos — Programação para adolescentes',
    imagem: prof,
    destaque: true,
    descricao:
      'Ministro aulas de programação para alunos de 14 a 17 anos em escolas estaduais. Trabalho desde a lógica computacional até o desenvolvimento de sites completos usando HTML, CSS, JavaScript e Bootstrap, além de landing pages com banco de dados.',
    destaques: [
      'Lógica computacional',
      'HTML · CSS · JS',
      'Projetos reais em sala',
    ],
  },
  {
    id: 'robotica',
    numero: '03',
    categoria: 'Extensão universitária',
    icon: <FaRobot />,
    titulo: 'Imersão em robótica básica',
    subtitulo: 'Centro Universitário Campo Real',
    imagem: robotica,
    descricao:
      'Em parceria com o Centro Universitário Campo Real, conduzi uma imersão de robótica com o objetivo de aproximar jovens do setor tecnológico, trabalhando noções de eletrônica, automação e montagem de projetos robóticos introdutórios.',
    destaques: [
      'Parceria com universidade',
      'Eletrônica + automação',
      'Jovens e iniciantes',
    ],
    link: {
      href: 'https://www.instagram.com/p/CiVA9rWgA-M/',
      label: 'Ver no Instagram',
    },
  },
];

export default function JourneySection() {
  const [active, setActive] = useState(ITEMS[1].id);
  const activeItem = ITEMS.find((i) => i.id === active) || ITEMS[0];

  return (
    <section id="jornada" className="journey-section">
      <div className="container">
        <Reveal className="journey-section__head">
          <span className="section-kicker">
            <span className="section-kicker__dot" />
            Ensino & Comunidade
          </span>
          <h2 className="section-title">
            Educação tecnológica, <em>acessível e gratuita</em>.
          </h2>
          <p className="section-lead">
            Acredito que o conhecimento tem que voltar pra comunidade. Por isso atuo há anos em
            escolas públicas e iniciativas voluntárias — formando novos desenvolvedores e
            incentivando a cultura técnica em quem normalmente não teria acesso.
          </p>
        </Reveal>

        <div className="journey-grid">
          {/* lista clicável */}
          <ul className="journey-list" role="tablist" aria-label="Iniciativas de ensino">
            {ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === item.id}
                  onClick={() => setActive(item.id)}
                  className={`journey-list__btn cursor-target ${active === item.id ? 'is-active' : ''}`}
                >
                  <span className="journey-list__num">{item.numero}</span>
                  <span className="journey-list__body">
                    <span className="journey-list__cat">
                      <span className="journey-list__icon">{item.icon}</span>
                      {item.categoria}
                    </span>
                    <span className="journey-list__title">{item.titulo}</span>
                    <span className="journey-list__sub">{item.subtitulo}</span>
                  </span>
                  <span className="journey-list__arrow">
                    <FaArrowUpRightFromSquare />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* detalhe */}
          <div className="journey-detail">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeItem.id}
                className="journey-detail__card"
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="journey-detail__media">
                  <img src={activeItem.imagem} alt={activeItem.titulo} loading="lazy" />
                  <span className="journey-detail__badge">
                    {activeItem.categoria}
                  </span>
                  {activeItem.destaque && (
                    <span className="journey-detail__ribbon">Atuação atual</span>
                  )}
                </div>

                <div className="journey-detail__body">
                  <h3>{activeItem.titulo}</h3>
                  <p>{activeItem.descricao}</p>

                  <ul className="journey-detail__tags">
                    {activeItem.destaques.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>

                  {activeItem.link && (
                    <a
                      href={activeItem.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="journey-detail__cta cursor-target"
                    >
                      {activeItem.link.label}
                      <FaArrowUpRightFromSquare />
                    </a>
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
