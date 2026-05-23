const NAV_OFFSET = () => (window.innerWidth < 768 ? 72 : 88);
const MAX_ATTEMPTS = 12;
const RETRY_MS = 120;

function isNearEducadoresSection(el) {
  const top = el.getBoundingClientRect().top;
  return Math.abs(top - NAV_OFFSET()) < 48;
}

export function scrollToEducadoresSection(attempt = 0) {
  const el = document.getElementById('educadores');
  if (!el) {
    if (attempt < MAX_ATTEMPTS) {
      window.setTimeout(() => scrollToEducadoresSection(attempt + 1), RETRY_MS);
    }
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = window.__lenis;

  if (lenis) {
    lenis.resize();
    lenis.scrollTo(el, {
      offset: -NAV_OFFSET(),
      duration: reduceMotion ? 0 : 1.35,
      immediate: reduceMotion,
    });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET();
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }

  if (attempt >= MAX_ATTEMPTS) return;

  window.setTimeout(() => {
    if (isNearEducadoresSection(el)) return;
    scrollToEducadoresSection(attempt + 1);
  }, reduceMotion ? RETRY_MS : 280);
}

export function shouldScrollToEducadoresOnLoad() {
  const hash = window.location.hash;
  return !hash || hash === '#educadores' || hash === '#inicio';
}

export function scheduleScrollToEducadores(delayMs = 0) {
  if (!shouldScrollToEducadoresOnLoad()) return undefined;

  const run = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToEducadoresSection(0));
    });
  };

  if (delayMs <= 0) {
    run();
    return undefined;
  }

  const timer = window.setTimeout(run, delayMs);
  return () => window.clearTimeout(timer);
}
