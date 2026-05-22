import { useState } from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import Reveal from '../ui/Reveal';
import './StatsSection.css';

const STATS = [
  { value: 4,   suffix: '+', label: 'Anos formando em tecnologia',  sub: 'Escolas públicas e comunidade' },
  { value: 300, suffix: '+', label: 'Alunos impactados',            sub: 'Programação, robótica e BI' },
  { value: 20,  suffix: '+', label: 'Projetos entregues',           sub: 'Web, BI, automação e chatbots' },
  { value: 10,  suffix: '+', label: 'Empresas no setor hoteleiro',  sub: 'TI, IA e marketing digital' },
];

export default function StatsSection() {
  const [inView, setInView] = useState(false);

  return (
    <section className="stats-section">
      <div className="stats-section__bg" aria-hidden="true" />
      <div className="stats-section__inner">
        <Reveal className="stats-section__heading">
          <span className="stats-section__kicker">
            <span className="stats-section__kicker-dot" />
            Resultados
          </span>
          <h2>
            Dados, produtos digitais <em>e</em> impacto real.
          </h2>
        </Reveal>

        <motion.ul
          className="stats-section__grid"
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, amount: 0.3 }}
        >
          {STATS.map((s, i) => (
            <motion.li
              key={s.label}
              className="stat-card"
              initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="stat-card__number">
                {inView ? (
                  <CountUp end={s.value} duration={2.6} suffix={s.suffix} />
                ) : (
                  <span>0{s.suffix}</span>
                )}
              </div>
              <div className="stat-card__label">{s.label}</div>
              <div className="stat-card__sub">{s.sub}</div>
              <span className="stat-card__index">/ 0{i + 1}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
