import { motion } from 'framer-motion';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import Reveal from '../ui/Reveal';
import { useAtuacao } from '../../hooks/usePortfolioContent';
import './atuacao.css';

export default function AtuacaoSection() {
  const { items } = useAtuacao();

  return (
    <section id="atuacao" className="atuacao-section">
      <div className="container">
        <Reveal className="atuacao-section__head">
          <span className="atuacao-section__kicker">
            <span className="atuacao-section__kicker-dot" />
            Trabalhos atuais
          </span>
          <h2>
            Três frentes. Um propósito: <em>criar impacto real</em>.
          </h2>
        </Reveal>

        <ul className="atuacao-list">
          {items.map((r, i) => (
            <motion.li
              key={r.id || r.numero}
              className="atuacao-row cursor-target"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="atuacao-row__num">{r.numero}</span>
              <div className="atuacao-row__title">
                <h3>{r.titulo}</h3>
                <span>{r.local}</span>
              </div>
              <p className="atuacao-row__desc">{r.descricao}</p>
              <div className="atuacao-row__tags">
                {(r.tags || []).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <span className="atuacao-row__icon" aria-hidden="true">
                <FaArrowUpRightFromSquare />
              </span>
              <span className="atuacao-row__hover" aria-hidden="true" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
