import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import './Navbar.css';

const SECTIONS = [
  { id: 'inicio', label: 'Início' },
  { id: 'educadores', label: 'Educadores' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'trabalhos', label: 'Projetos' },
  { id: 'formacao', label: 'Formação' },
  { id: 'jornada', label: 'Jornada' },
  { id: 'atuacao', label: 'Atuação' },
  { id: 'contato', label: 'Contato' },
];

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isRadar = location.pathname === '/radar-ia';

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(isRadar ? 'radar-ia' : 'inicio');
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

      if (!isHome) return;

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

    if (isRadar) {
      setActive('radar-ia');
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, isRadar]);

  useEffect(() => {
    document.body.style.overflow = openMobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openMobile]);

  const sectionHref = (id) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <motion.header
        className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="site-nav__inner">
          <Link to="/" className="site-nav__brand cursor-target">
            <span className="site-nav__brand-mark">AB</span>
            <span className="site-nav__brand-text">
              <span>Alexandre</span>
              <span className="site-nav__brand-sub">Belloni — Software Engineer</span>
            </span>
          </Link>

          <nav className="site-nav__links" aria-label="Navegação principal">
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={sectionHref(s.id)}
                className={`site-nav__link cursor-target ${active === s.id ? 'is-active' : ''}`}
              >
                <span className="site-nav__link-index">0{i + 1}</span>
                <span className="site-nav__link-label">{s.label}</span>
              </a>
            ))}
            <Link
              to="/radar-ia"
              className={`site-nav__link cursor-target ${isRadar ? 'is-active' : ''}`}
              onClick={() => setOpenMobile(false)}
            >
              <span className="site-nav__link-index">09</span>
              <span className="site-nav__link-label">Radar IA</span>
            </Link>
          </nav>

          <a
            href={sectionHref('contato')}
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
                  href={sectionHref(s.id)}
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
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + SECTIONS.length * 0.06, duration: 0.5 }}
              >
                <Link
                  to="/radar-ia"
                  onClick={() => setOpenMobile(false)}
                  className={isRadar ? 'is-active' : ''}
                >
                  <span>09</span>
                  Radar IA
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
