import { motion } from 'framer-motion';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import Reveal from '../ui/Reveal';
import './atuacao.css';

const ROLES = [
  {
    numero: '01',
    titulo: 'Analista de Dados — Business Intelligence',
    local: 'Cresol · 3ª maior cooperativa de crédito do Brasil',
    descricao:
      'Atuação principal no desenvolvimento de painéis gerenciais de BI, modelagem de dados e dashboards analíticos usados para decisões estratégicas dentro da cooperativa.',
    tags: ['Power BI', 'Modelagem', 'SQL', 'Análise'],
  },
  {
    numero: '02',
    titulo: 'Suporte de TI, IA & Marketing Digital',
    local: 'Hotéis e empresas do setor hoteleiro',
    descricao:
      'Prestação de serviços de tecnologia, inteligência artificial, marketing de TI e desenvolvimento de sistemas para empresas do ramo: configuração de contas Google, automações, chatbots, sites, Booking e inovação no dia a dia do negócio.',
    tags: ['IA', 'Google Workspace', 'Chatbots', 'Automação'],
  },
  {
    numero: '03',
    titulo: 'Freelancer — Desenvolvimento & Dados',
    local: 'Projetos sob demanda',
    descricao:
      'Desenvolvimento de sites, landing pages, sistemas web, dashboards e integrações com APIs. Foco em interfaces modernas, performance e identidade visual coerente com cada cliente.',
    tags: ['React', 'Power BI', 'APIs', 'UI/UX'],
  },
];

export default function AtuacaoSection() {
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
          {ROLES.map((r, i) => (
            <motion.li
              key={r.numero}
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
                {r.tags.map((t) => (
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
