import { useRef } from 'react';
import { Container } from 'react-bootstrap';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '../ui/Reveal';
import { useFormacao } from '../../hooks/usePortfolioContent';
import './timeline.css';

export default function Timeline() {
  const { items } = useFormacao();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.7', 'end 0.3'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="formacao" className="timeline-section">
      <Container>
        <Reveal className="timeline-section__head">
          <span className="timeline-section__kicker">
            <span className="timeline-section__kicker-dot" />
            Formação & Trajetória
          </span>
          <h2>
            Uma trajetória construída por <em>estudo</em>, prática e ensino.
          </h2>
          <p>
            Entre dados na Cresol, tecnologia para empresas e uma trajetória sólida em educação,
            cada experiência moldou um profissional que entrega soluções com propósito.
          </p>
        </Reveal>

        <div ref={ref} className="timeline">
          <div className="timeline__track" aria-hidden="true">
            <motion.span className="timeline__fill" style={{ height: lineHeight }} />
          </div>

          {items.map((item, i) => (
            <motion.article
              key={item.id || item.titulo}
              className={`timeline__item ${i % 2 === 0 ? 'is-left' : 'is-right'}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="timeline__dot" aria-hidden="true">
                <span />
              </div>
              <div className="timeline__card cursor-target">
                <header>
                  <span className="timeline__type">{item.tipo}</span>
                  <span className="timeline__period">{item.periodo}</span>
                </header>
                <h3>{item.titulo}</h3>
                <p className="timeline__inst">{item.instituicao}</p>
                <p className="timeline__detail">{item.detalhes}</p>
                <ul className="timeline__tags">
                  {(item.tags || []).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
