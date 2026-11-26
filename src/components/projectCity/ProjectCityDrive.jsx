import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaArrowRight,
  FaXmark,
  FaArrowUpRightFromSquare,
  FaArrowRightLong,
} from 'react-icons/fa6';
import './project-city.css';

const BUILDING_GAP = 460;
const START_X = 240;
const CAR_SPEED = 6.5;
const DRIFT = 0.14;

const ARCHETYPES = [
  { name: 'tower', floors: 4, width: 220, accent: '#c9a227' },
  { name: 'mid', floors: 3, width: 240, accent: '#7d9a6f' },
  { name: 'wide', floors: 3, width: 260, accent: '#6f90a8' },
  { name: 'slim', floors: 5, width: 210, accent: '#a87a90' },
  { name: 'mid', floors: 4, width: 230, accent: '#8a7a5c' },
  { name: 'tower', floors: 4, width: 225, accent: '#9a6b5a' },
];

function buildingMeta(index) {
  const arch = ARCHETYPES[index % ARCHETYPES.length];
  const height = 280 + arch.floors * 22 + ((index * 11) % 20);
  return { ...arch, height };
}

function shortText(text, max = 110) {
  if (!text) return '';
  const clean = String(text).trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

function RealisticCar({ moving }) {
  return (
    <svg className="project-city__car-svg" viewBox="0 0 220 90" aria-hidden="true">
      <ellipse cx="110" cy="80" rx="74" ry="5" fill="rgba(0,0,0,0.32)" />
      <path
        d="M28 58 C34 42 48 34 72 32 L98 20 C112 14 132 14 148 22 L176 34 C192 38 202 46 206 58 L206 66 C206 70 202 74 196 74 L30 74 C24 74 20 70 20 66 Z"
        fill="url(#carBody)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <path
        d="M86 34 L104 22 C116 16 132 16 144 24 L166 36 L152 36 C138 28 118 28 104 34 Z"
        fill="url(#carGlass)"
      />
      <path d="M48 56 H188" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <rect x="198" y="50" width="10" height="8" rx="2" fill="#ffe08a" className="project-city__headlight" />
      <rect x="22" y="50" width="8" height="8" rx="2" fill="#ff6b5a" className="project-city__taillight" />

      {/* Rodas: só o miolo gira, com origem fixa no centro da roda */}
      <circle cx="62" cy="72" r="12" fill="#151515" stroke="#3a3a3a" strokeWidth="2" />
      <g className={`project-city__hub${moving ? ' is-spinning' : ''}`}>
        <circle cx="62" cy="72" r="4.5" fill="#9a9a9a" />
        <line x1="62" y1="64" x2="62" y2="80" stroke="#555" strokeWidth="1.5" />
        <line x1="54" y1="72" x2="70" y2="72" stroke="#555" strokeWidth="1.5" />
      </g>

      <circle cx="168" cy="72" r="12" fill="#151515" stroke="#3a3a3a" strokeWidth="2" />
      <g className={`project-city__hub${moving ? ' is-spinning' : ''}`}>
        <circle cx="168" cy="72" r="4.5" fill="#9a9a9a" />
        <line x1="168" y1="64" x2="168" y2="80" stroke="#555" strokeWidth="1.5" />
        <line x1="160" y1="72" x2="176" y2="72" stroke="#555" strokeWidth="1.5" />
      </g>

      <defs>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eceef2" />
          <stop offset="55%" stopColor="#9aa0ab" />
          <stop offset="100%" stopColor="#5c616c" />
        </linearGradient>
        <linearGradient id="carGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b8e4f8" />
          <stop offset="100%" stopColor="#3a6f8c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ProjectCityDrive({ projects = [] }) {
  const viewportRef = useRef(null);
  const keysRef = useRef({ left: false, right: false });
  const pointerDirRef = useRef(0);
  const carXRef = useRef(40);
  const facingRef = useRef(1);
  const turningRef = useRef(false);
  const movingRef = useRef(false);
  const rafRef = useRef(0);

  const [carX, setCarX] = useState(40);
  const [cameraX, setCameraX] = useState(0);
  const [facing, setFacing] = useState(1);
  const [laneY, setLaneY] = useState(0);
  const [moving, setMoving] = useState(false);
  const [turning, setTurning] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hintVisible, setHintVisible] = useState(true);

  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [projects]
  );

  const worldWidth = useMemo(() => {
    const n = Math.max(orderedProjects.length, 1);
    return START_X + n * BUILDING_GAP + 1000;
  }, [orderedProjects.length]);

  const buildings = useMemo(
    () =>
      orderedProjects.map((project, index) => {
        const meta = buildingMeta(index);
        return {
          ...project,
          index,
          x: START_X + index * BUILDING_GAP,
          ...meta,
        };
      }),
    [orderedProjects]
  );

  const nearestBuilding = useMemo(() => {
    if (!buildings.length) return null;
    let best = buildings[0];
    let bestDist = Infinity;
    for (const b of buildings) {
      const center = b.x + b.width / 2;
      const dist = Math.abs(center - (carX + 90));
      if (dist < bestDist) {
        bestDist = dist;
        best = b;
      }
    }
    return bestDist < 210 ? best : null;
  }, [buildings, carX]);

  const startTurn = useCallback((nextFacing) => {
    if (turningRef.current || facingRef.current === nextFacing) return;
    turningRef.current = true;
    setTurning(true);
    const nextLane = nextFacing < 0 ? 34 : 0;
    setLaneY(nextLane);
    facingRef.current = nextFacing;
    setFacing(nextFacing);
    window.setTimeout(() => {
      turningRef.current = false;
      setTurning(false);
    }, 520);
  }, []);

  const tick = useCallback(() => {
    let dir = 0;
    if (keysRef.current.right) dir += 1;
    if (keysRef.current.left) dir -= 1;
    dir += pointerDirRef.current;

    const isMoving = dir !== 0;
    if (movingRef.current !== isMoving) {
      movingRef.current = isMoving;
      setMoving(isMoving);
    }

    if (isMoving) {
      setHintVisible(false);
      if (dir !== facingRef.current) startTurn(dir);
      carXRef.current = Math.max(
        0,
        Math.min(worldWidth - 280, carXRef.current + dir * CAR_SPEED)
      );
      setCarX(carXRef.current);
    }

    const vw = viewportRef.current?.clientWidth || 1000;
    const targetCam = Math.max(0, carXRef.current - vw * 0.3);
    setCameraX((prev) => prev + (targetCam - prev) * DRIFT);
    rafRef.current = requestAnimationFrame(tick);
  }, [worldWidth, startTurn]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        keysRef.current.right = true;
        setFocused(true);
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        keysRef.current.left = true;
        setFocused(true);
      }
      if (e.key === 'Enter' && nearestBuilding) {
        e.preventDefault();
        setSelected(nearestBuilding);
      }
      if (e.key === 'Escape') setSelected(null);
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [nearestBuilding]);

  const onPointerMove = (e) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    if (ratio > 0.62) pointerDirRef.current = 1;
    else if (ratio < 0.38) pointerDirRef.current = -1;
    else pointerDirRef.current = 0;
  };

  if (!orderedProjects.length) {
    return (
      <div className="project-city project-city--empty">
        <p>Nenhum projeto para exibir nesta avenida ainda.</p>
      </div>
    );
  }

  return (
    <div className="project-city">
      <div
        ref={viewportRef}
        className={`project-city__viewport${focused ? ' is-focused' : ''}${moving ? ' is-driving' : ''}`}
        tabIndex={0}
        role="application"
        aria-label="Dirija pela avenida de projetos. Use setas ou mouse nas laterais."
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          keysRef.current = { left: false, right: false };
          pointerDirRef.current = 0;
        }}
        onMouseEnter={() => setFocused(true)}
        onMouseMove={onPointerMove}
        onMouseLeave={() => {
          pointerDirRef.current = 0;
        }}
        onTouchStart={(e) => {
          setFocused(true);
          const touch = e.touches[0];
          const rect = viewportRef.current?.getBoundingClientRect();
          if (!rect) return;
          const ratio = (touch.clientX - rect.left) / rect.width;
          pointerDirRef.current = ratio > 0.5 ? 1 : -1;
        }}
        onTouchEnd={() => {
          pointerDirRef.current = 0;
        }}
      >
        <div className="project-city__sky" aria-hidden="true">
          <span className="project-city__moon" />
          <span className="project-city__stars" />
          <span className="project-city__haze" />
        </div>

        <div
          className="project-city__world"
          style={{
            width: worldWidth,
            transform: `translate3d(${-cameraX}px, 0, 0)`,
          }}
        >
          <div className="project-city__distant" aria-hidden="true" />

          {buildings.map((b) => {
            const isNear =
              nearestBuilding?.id === b.id || nearestBuilding?.index === b.index;
            const floors = Array.from({ length: b.floors });
            return (
              <div key={b.id || b.index} className="project-city__plot" style={{ left: b.x }}>
                <div
                  className={`project-city__building project-city__building--${b.name}${isNear ? ' is-near' : ''}`}
                  style={{
                    width: b.width,
                    height: b.height,
                    '--accent': b.accent,
                  }}
                >
                  <span className="project-city__building-depth" aria-hidden="true" />
                  <span className="project-city__parapet" aria-hidden="true" />

                  <div className="project-city__copy">
                    <span className="project-city__copy-num">
                      {String(b.index + 1).padStart(2, '0')}
                    </span>
                    <strong className="project-city__copy-title">{b.title}</strong>
                    <p className="project-city__copy-desc">{shortText(b.subtitle, 120)}</p>
                  </div>

                  <div className="project-city__tower">
                    {floors.map((_, fi) => (
                      <span key={fi} className="project-city__floor">
                        <span className="project-city__pane" />
                        <span className="project-city__pane" />
                      </span>
                    ))}
                  </div>

                  <div className="project-city__ground">
                    <span className="project-city__door" />
                    <span className="project-city__bush project-city__bush--l" />
                    <span className="project-city__bush project-city__bush--r" />
                    <button
                      type="button"
                      className="project-city__more"
                      onClick={() => setSelected(b)}
                    >
                      Ver mais <FaArrowRightLong />
                    </button>
                  </div>
                </div>

                <div className="project-city__garden" aria-hidden="true">
                  <span className="project-city__tree project-city__tree--tall" />
                  <span className="project-city__tree project-city__tree--short" />
                  <span className="project-city__lamp">
                    <span className="project-city__lamp-pole" />
                    <span className="project-city__lamp-glow" />
                  </span>
                </div>
              </div>
            );
          })}

          <div className="project-city__sidewalk" aria-hidden="true" />

          <div className="project-city__road">
            <div className="project-city__lane project-city__lane--fwd" />
            <div className="project-city__lane project-city__lane--back" />
            <div
              className={`project-city__car${turning ? ' is-turning' : ''}${moving ? ' is-moving' : ''}`}
              style={{
                transform: `translate3d(${carX}px, ${laneY}px, 0) scaleX(${facing})`,
              }}
              aria-hidden="true"
            >
              <span className="project-city__dust" />
              <span className="project-city__dust project-city__dust--b" />
              <span className="project-city__dust project-city__dust--c" />
              <span className="project-city__exhaust" />
              <RealisticCar moving={moving} />
              <span className={`project-city__beam${facing > 0 ? ' is-front' : ' is-back'}`} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {hintVisible && (
            <motion.div
              className="project-city__hint"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <p>Use as setas ou o mouse nas laterais para dirigir entre os empreendimentos.</p>
              <div className="project-city__controls">
                <span>
                  <FaArrowLeft /> <FaArrowRight /> setas
                </span>
                <span>clique no prédio</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="project-city__edge project-city__edge--left" aria-hidden="true">
          <FaArrowLeft />
        </div>
        <div className="project-city__edge project-city__edge--right" aria-hidden="true">
          <FaArrowRight />
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="project-city__modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.article
              className="project-city__sheet"
              initial={{ y: 48, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 28, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="project-city__close"
                onClick={() => setSelected(null)}
                aria-label="Fechar"
              >
                <FaXmark />
              </button>
              <div className="project-city__sheet-media">
                {selected.image ? (
                  <motion.img
                    key={selected.image}
                    src={selected.image}
                    alt={selected.title}
                    className="project-city__sheet-img"
                    initial={{ scale: 1.08, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.55 }}
                  />
                ) : (
                  <div className="project-city__sheet-fallback" />
                )}
                <div className="project-city__sheet-overlay" />
              </div>
              <div className="project-city__sheet-body">
                <span className="project-city__sheet-type">
                  {selected.type === 'pessoal' ? 'Projeto pessoal' : 'Empreendimento'} ·{' '}
                  {String(selected.index + 1).padStart(2, '0')}
                </span>
                <h3>{selected.title}</h3>
                <p>{selected.subtitle}</p>
                {selected.url && (
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-city__sheet-link"
                  >
                    Abrir projeto <FaArrowUpRightFromSquare />
                  </a>
                )}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
