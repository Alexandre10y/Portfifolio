import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fotoPerfil from '../../assets/img/Foto Perfil.jpeg';
import videoApresentacao from '../../assets/img/Vídeo Apresentação.mov';
import { scheduleScrollToEducadores } from '../../utils/scrollToEducadores';
import './page-preloader.css';

const PHRASES = [
  'Preparando a experiência…',
  'Algo interessante está chegando…',
  'Organizando projetos e histórias…',
  'Quase na hora de revelar…',
];

const MIN_MS = 2400;
const MAX_MS = 6500;
const SESSION_KEY = 'portfolio-preloader-seen';

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

function preloadVideo(src) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    const done = () => {
      video.removeAttribute('src');
      video.load();
      resolve();
    };
    video.addEventListener('loadeddata', done, { once: true });
    video.addEventListener('error', done, { once: true });
    video.src = src;
    video.load();
  });
}

export default function PagePreloader({ children }) {
  const skip =
    typeof window !== 'undefined' &&
    (sessionStorage.getItem(SESSION_KEY) === '1' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const [visible, setVisible] = useState(!skip);
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const displayProgress = useRef(0);

  useEffect(() => {
    if (!visible) return undefined;

    document.body.classList.add('preloader-active');

    let cancelled = false;
    let rafId = 0;
    let phraseTimer = null;
    let finishTimer = null;

    const assets = [
      preloadImage(fotoPerfil),
      preloadVideo(videoApresentacao),
    ];

    const start = performance.now();

    phraseTimer = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }, 820);

    const animateProgress = () => {
      const elapsed = performance.now() - start;
      const timeRatio = Math.min(1, elapsed / MIN_MS);
      const target = Math.min(92, 12 + timeRatio * 78);
      displayProgress.current += (target - displayProgress.current) * 0.08;
      setProgress(Math.round(displayProgress.current));
      if (!cancelled && displayProgress.current < 99) {
        rafId = requestAnimationFrame(animateProgress);
      }
    };
    rafId = requestAnimationFrame(animateProgress);

    const maxTimeout = window.setTimeout(() => {
      if (!cancelled) finish();
    }, MAX_MS);

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      window.clearTimeout(maxTimeout);
      window.clearInterval(phraseTimer);
      cancelAnimationFrame(rafId);
      setProgress(100);
      finishTimer = window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, '1');
        setVisible(false);
        document.body.classList.remove('preloader-active');
        scheduleScrollToEducadores(720);
      }, 520);
    };

    Promise.all([
      ...assets,
      new Promise((r) => window.setTimeout(r, MIN_MS)),
    ]).then(finish);

    return () => {
      cancelled = true;
      window.clearTimeout(maxTimeout);
      window.clearInterval(phraseTimer);
      window.clearTimeout(finishTimer);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('preloader-active');
    };
  }, [visible]);

  useEffect(() => {
    if (visible || !skip) return undefined;
    return scheduleScrollToEducadores(180);
  }, [visible, skip]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="page-preloader"
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Carregando portfólio"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="page-preloader__veil" aria-hidden="true" />
            <div className="page-preloader__grid" aria-hidden="true" />
            <div className="page-preloader__glow" aria-hidden="true" />

            <div className="page-preloader__inner">
              <motion.span
                className="page-preloader__kicker"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="page-preloader__kicker-dot" />
                Portfólio · 2026
              </motion.span>

              <motion.h1
                className="page-preloader__name"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
              >
                Alexandre
                <em>Belloni</em>
              </motion.h1>

              <div className="page-preloader__phrase-wrap" aria-hidden="true">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phraseIndex}
                    className="page-preloader__phrase"
                    initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35 }}
                  >
                    {PHRASES[phraseIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="page-preloader__bar-wrap">
                <div className="page-preloader__bar">
                  <motion.div
                    className="page-preloader__bar-fill"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  />
                  <span className="page-preloader__bar-shine" aria-hidden="true" />
                </div>
                <span className="page-preloader__percent">{progress}%</span>
              </div>

              <div className="page-preloader__pulse" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={visible ? 'page-preloader__content--hidden' : undefined}>
        {children}
      </div>
    </>
  );
}
