import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaArrowRightLong,
} from 'react-icons/fa6';
import Reveal from '../ui/Reveal';
import './contact.css';

const CONTACTS = [
  {
    label: 'Email',
    value: 'alexandrebelloni10@gmail.com',
    href: 'mailto:alexandrebelloni10@gmail.com',
    icon: <FaEnvelope />,
  },
  {
    label: 'LinkedIn',
    value: '/in/alexandre-belloni',
    href: 'https://www.linkedin.com/in/alexandre-belloni/',
    icon: <FaLinkedinIn />,
  },
  {
    label: 'GitHub',
    value: '/Alexandre10y',
    href: 'https://github.com/Alexandre10y',
    icon: <FaGithub />,
  },
  {
    label: 'Instagram',
    value: '@alexandre10y',
    href: 'https://www.instagram.com/alexandre10y/',
    icon: <FaInstagram />,
  },
  {
    label: 'WhatsApp',
    value: 'Fale agora',
    href: 'https://wa.me/5542999999999',
    icon: <FaWhatsapp />,
  },
];

function ContactCTA() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 18 });
  const sy = useSpring(my, { stiffness: 140, damping: 18 });
  const rotateX = useTransform(sy, [-1, 1], [6, -6]);
  const rotateY = useTransform(sx, [-1, 1], [-6, 6]);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 2);
    my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 2);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="mailto:alexandrebelloni10@gmail.com"
      className="contact-cta cursor-target"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
    >
      <motion.span className="contact-cta__label" style={{ x: useTransform(sx, [-1, 1], [-10, 10]) }}>
        Vamos conversar
      </motion.span>
      <motion.span className="contact-cta__arrow" style={{ x: useTransform(sx, [-1, 1], [-6, 6]) }}>
        <FaArrowRightLong />
      </motion.span>
    </motion.a>
  );
}

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('alexandrebelloni10@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section id="contato" className="contact-section">
      <div className="contact-section__bg" aria-hidden="true" />

      <div className="contact-section__inner">
        <Reveal direction="up" className="contact-section__head">
          <span className="contact-section__kicker">
            <span className="contact-section__kicker-dot" />
            Próximo passo
          </span>
          <h2>
            <span>Vamos construir</span>
            <span className="contact-section__outline">algo memorável</span>
            <span>juntos.</span>
          </h2>
          <p>
            Disponível para projetos freelance, consultorias e novas oportunidades profissionais
            em desenvolvimento web, dados e educação tecnológica.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.15} className="contact-section__cta-wrap">
          <ContactCTA />
          <button
            type="button"
            onClick={copyEmail}
            className={`contact-section__copy cursor-target ${copied ? 'is-copied' : ''}`}
          >
            <span>{copied ? 'Copiado!' : 'Copiar email'}</span>
          </button>
        </Reveal>

        <Reveal direction="up" delay={0.25} className="contact-section__grid">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card cursor-target"
            >
              <span className="contact-card__icon">{c.icon}</span>
              <div>
                <div className="contact-card__label">{c.label}</div>
                <div className="contact-card__value">{c.value}</div>
              </div>
              <span className="contact-card__arrow">
                <FaArrowRightLong />
              </span>
            </a>
          ))}
        </Reveal>
      </div>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <div className="site-footer__mark">AB</div>
            <div>
              <strong>Alexandre Belloni</strong>
              <span>Software Engineer · Professor · Criador</span>
            </div>
          </div>
          <div className="site-footer__meta">
            <span>
              © {new Date().getFullYear()} Alexandre Belloni. Feito com café, código e muita
              curiosidade.
            </span>
            <a href="#inicio" className="site-footer__top cursor-target">
              Voltar ao topo ↑
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
