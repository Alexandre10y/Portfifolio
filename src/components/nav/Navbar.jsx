import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import './Navbar.css';

const SECTIONS = [
  { id: 'inicio', label: 'Início' },
  { id: 'trabalhos', label: 'Trabalhos' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'jornada', label: 'Jornada' },
  { id: 'formacao', label: 'Formação' },
  { id: 'contato', label: 'Contato' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('inicio');
  const [openMobile, setOpenMobile] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const middle = window.innerHeight / 2;
      let current = 'inicio';
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= middle && r.bottom >= 160) {
          current = s.id;
        }
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openMobile]);

  return (
    <>
      <motion.header
        className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="site-nav__inner">
          <a href="#inicio" className="site-nav__brand cursor-target">
            <span className="site-nav__brand-mark">AB</span>
            <span className="site-nav__brand-text">
              <span>Alexandre</span>
              <span className="site-nav__brand-sub">Belloni — Software Engineer</span>
            </span>
          </a>

          <nav className="site-nav__links" aria-label="Navegação principal">
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`site-nav__link cursor-target ${active === s.id ? 'is-active' : ''}`}
              >
                <span className="site-nav__link-index">0{i + 1}</span>
                <span className="site-nav__link-label">{s.label}</span>
              </a>
            ))}
          </nav>

          <a
            href="#contato"
            className="site-nav__cta cursor-target"
            onClick={() => setOpenMobile(false)}
          >
            <span className="site-nav__cta-dot" />
            Disponível
          </a>

          <button
            type="button"
            className={`site-nav__burger cursor-target ${openMobile ? 'is-open' : ''}`}
            aria-label="Abrir menu"
            onClick={() => setOpenMobile((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>

        <motion.div
          className="site-nav__progress"
          style={{ scaleX: progress, transformOrigin: '0% 50%' }}
        />
      </motion.header>

      <AnimatePresence>
        {openMobile && (
          <motion.div
            className="site-nav__mobile"
            initial={{ clipPath: 'circle(0% at 90% 0%)' }}
            animate={{ clipPath: 'circle(150% at 90% 0%)' }}
            exit={{ clipPath: 'circle(0% at 90% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav>
              {SECTIONS.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpenMobile(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                  className={active === s.id ? 'is-active' : ''}
                >
                  <span>0{i + 1}</span>
                  {s.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
