import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './MagneticButton.css';

export default function MagneticButton({
  children,
  onClick,
  active = false,
  variant = 'outline',
  className = '',
  id,
  ariaControls,
  ariaExpanded,
  strength = 22,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 14, mass: 0.6 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const innerX = useTransform(sx, (v) => v * 0.4);
  const innerY = useTransform(sy, (v) => v * 0.4);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const relX = e.clientX - (r.left + r.width / 2);
    const relY = e.clientY - (r.top + r.height / 2);
    x.set((relX / (r.width / 2)) * strength);
    y.set((relY / (r.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      id={id}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`magnetic-btn magnetic-btn--${variant} ${active ? 'is-active' : ''} cursor-target ${className}`}
    >
      <motion.span className="magnetic-btn__inner" style={{ x: innerX, y: innerY }}>
        <span className="magnetic-btn__dot" aria-hidden="true" />
        <span className="magnetic-btn__label">{children}</span>
      </motion.span>
      <span className="magnetic-btn__glow" aria-hidden="true" />
    </motion.button>
  );
}
