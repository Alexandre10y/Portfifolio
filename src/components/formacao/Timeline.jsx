import { useRef } from 'react';
import { Container } from 'react-bootstrap';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '../ui/Reveal';
import './timeline.css';

const ITEMS = [
  {
    periodo: '2019 — 2021',
    titulo: 'Técnico em Informática',
    instituicao: 'Colégio Técnico Naiana Bavaresco de Souza',
    tipo: 'Técnico',
    detalhes:
      'Formação técnica com foco em suporte de TI (redes, desktops, impressoras), manutenção preventiva e construção dos primeiros sites estáticos.',
    tags: ['Redes', 'Suporte TI', 'HTML/CSS'],
  },
  {
    periodo: '2020 — 2024',
    titulo: 'Engenharia de Software',
    instituicao: 'Centro Universitário Campo Real',
    tipo: 'Graduação',
    detalhes:
      'Foco em desenvolvimento web, bancos de dados, arquitetura de software, engenharia de requisitos e padrões de projeto.',
    tags: ['Arquitetura', 'Banco de Dados', 'Engenharia de Requisitos'],
  },
  {
    periodo: '2022 — Atual',
    titulo: 'Professor de Programação e Robótica',
    instituicao: 'Escolas estaduais · Campo Real (robótica)',
    tipo: 'Docência',
    detalhes:
      'Aulas para adolescentes de 14 a 17 anos em escolas estaduais, além de imersões de robótica básica já ministradas em centros universitários como o Campo Real.',
    tags: ['Docência', 'Robótica', 'Front-end'],
  },
  {
    periodo: '2024 — 2025',
    titulo: 'Pós-graduação em Inteligência Artificial',
    instituicao: 'Especialização',
    tipo: 'Pós-graduação',
    detalhes:
      'Aprofundamento em aprendizado de máquina, modelos generativos, NLP e aplicação prática de IA em soluções de negócio, automação e análise de dados.',
    tags: ['Machine Learning', 'NLP', 'IA aplicada'],
  },
  {
    periodo: 'Atual',
    titulo: 'Analista de Dados — BI',
    instituicao: 'Cresol · 3ª maior cooperativa de crédito do Brasil',
    tipo: 'Atuação principal',
    detalhes:
      'Desenvolvimento de painéis gerenciais de BI para apoiar decisões estratégicas, modelagem de dados e criação de dashboards analíticos em escala cooperativa.',
    tags: ['Power BI', 'Modelagem de dados', 'SQL'],
  },
  {
    periodo: 'Atual',
    titulo: 'Freelancer & Suporte de TI',
    instituicao: 'Hotelaria, web e automações',
    tipo: 'Profissional',
    detalhes:
      'Manutenção de equipamentos em redes hoteleiras, administração de sistemas como Booking, suporte a sites, e-mail corporativo, chatbots e robôs automatizados para clientes.',
    tags: ['Booking', 'Chatbots', 'Automação', 'Sites'],
  },
];

export default function Timeline() {
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
            Entre salas de aula, clientes reais e projetos pessoais, cada experiência moldou um
            profissional que entrega tecnologia com propósito.
          </p>
        </Reveal>

        <div ref={ref} className="timeline">
          <div className="timeline__track" aria-hidden="true">
            <motion.span className="timeline__fill" style={{ height: lineHeight }} />
          </div>

          {ITEMS.map((item, i) => (
            <motion.article
              key={item.titulo}
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
                  {item.tags.map((t) => (
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
