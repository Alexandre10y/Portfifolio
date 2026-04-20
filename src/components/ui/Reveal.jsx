import { motion, useReducedMotion } from 'framer-motion';

const variantsMap = {
  up: {
    hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  down: {
    hidden: { opacity: 0, y: -40, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  left: {
    hidden: { opacity: 0, x: -50, filter: 'blur(6px)' },
    show: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  right: {
    hidden: { opacity: 0, x: 50, filter: 'blur(6px)' },
    show: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
    show: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  once = true,
  amount = 0.25,
  className = '',
  as: As = 'div',
  stagger = 0,
}) {
  const prefersReduced = useReducedMotion();
  const variants = variantsMap[direction] || variantsMap.up;

  if (prefersReduced) {
    return <As className={className}>{children}</As>;
  }

  const MotionTag = motion[As] || motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: stagger,
      }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

export function RevealText({ text, className = '', delay = 0, stagger = 0.035 }) {
  const prefersReduced = useReducedMotion();
  const words = text.split(' ');

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      style={{ display: 'inline-block' }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block', marginRight: '0.35ch' }}
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}
