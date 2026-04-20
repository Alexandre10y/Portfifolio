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
    titulo: 'Professor de Programação & Robótica',
    local: 'Escolas estaduais · Iniciativas comunitárias',
    descricao:
      'Ministro aulas presenciais de lógica computacional, HTML, CSS, JavaScript e robótica básica para adolescentes. As turmas no período noturno e em projetos sociais são 100% gratuitas.',
    tags: ['Docência', 'Gratuito', 'Robótica', 'Front-end'],
  },
  {
    numero: '03',
    titulo: 'Suporte de TI & Automação em hotelaria',
    local: 'Redes hoteleiras · Hotel Marechal Express',
    descricao:
      'Manutenção de equipamentos, administração da plataforma Booking, suporte a e-mails corporativos, sites, chatbots e robôs automatizados que operam no dia a dia do negócio.',
    tags: ['Booking', 'Chatbots', 'Automação', 'Infra'],
  },
  {
    numero: '04',
    titulo: 'Freelancer Full-Stack',
    local: 'Projetos autorais e sob demanda',
    descricao:
      'Desenvolvimento de sites, landing pages, sistemas web e integrações com APIs. Foco em interfaces modernas, performance e identidade visual coerente com cada cliente.',
    tags: ['React', 'UI/UX', 'APIs', 'Firebase'],
  },
];

export default function AtuacaoSection() {
  return (
    <section id="trabalhos-atuais" className="atuacao-section">
      <div className="container">
        <Reveal className="atuacao-section__head">
          <span className="atuacao-section__kicker">
            <span className="atuacao-section__kicker-dot" />
            Trabalhos atuais
          </span>
          <h2>
            Quatro frentes. Um propósito: <em>criar impacto real</em>.
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
