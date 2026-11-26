import { Suspense, useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox, Sparkles } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaArrowRight,
  FaXmark,
  FaArrowUpRightFromSquare,
  FaArrowRightLong,
} from 'react-icons/fa6';
import * as THREE from 'three';
import { createEngineAudio } from './engineAudio';
import './project-city-3d.css';

const GAP = 13;
const START = 8;
const SPEED = 0.18;
const CAR_Y = 0.2; // wheel radius — keeps tires on the asphalt
const BUILDING_Z = -1.55; // pulled back so trees/sidewalk stay clear

const FACADE = ['#8a909a', '#9a948c', '#87909a', '#948c86', '#84909a', '#9a8c90'];
const ACCENT = ['#c9a227', '#7d9a6f', '#6f90a8', '#a87a90', '#8a7a5c', '#9a6b5a'];

function shortText(text, max = 100) {
  if (!text) return '';
  const clean = String(text).trim();
  return clean.length <= max ? clean : `${clean.slice(0, max).trim()}…`;
}

function seeded(n) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function makeFacadeTexture(seed = 1) {
  const w = 256;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = FACADE[seed % FACADE.length];
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 1400; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${0.02 + seeded(seed * 10 + i) * 0.05})`;
    ctx.fillRect(seeded(i + seed) * w, seeded(i * 3 + seed) * h, 2, 2);
  }

  for (let y = 0; y < h; y += 48) {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, y, w, 2);
  }

  const cols = 5;
  const rows = 9;
  const padX = 22;
  const padY = 36;
  const cellW = (w - padX * 2) / cols;
  const cellH = (h - padY * 2 - 40) / rows;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = padX + col * cellW + 4;
      const y = padY + row * cellH + 4;
      const ww = cellW - 10;
      const wh = cellH - 10;
      const lit = seeded(seed * 17 + row * 11 + col * 3) > 0.72;

      ctx.fillStyle = '#2a323c';
      ctx.fillRect(x - 2, y - 2, ww + 4, wh + 4);

      if (lit) {
        const g = ctx.createLinearGradient(x, y, x, y + wh);
        g.addColorStop(0, '#d8ecff');
        g.addColorStop(1, '#7eb0d8');
        ctx.fillStyle = g;
        ctx.fillRect(x, y, ww, wh);
      } else {
        const g = ctx.createLinearGradient(x, y, x + ww, y + wh);
        g.addColorStop(0, '#9ec4e0');
        g.addColorStop(0.5, '#6a90b0');
        g.addColorStop(1, '#4a7088');
        ctx.fillStyle = g;
        ctx.fillRect(x, y, ww, wh);
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillRect(x, y, ww, wh * 0.28);
      }

      ctx.fillStyle = 'rgba(30,36,44,0.45)';
      ctx.fillRect(x + ww / 2 - 1, y, 2, wh);
      ctx.fillRect(x, y + wh / 2 - 1, ww, 2);
    }
  }

  ctx.fillStyle = '#1a222c';
  ctx.fillRect(16, h - 70, w - 32, 54);
  const shop = ctx.createLinearGradient(0, h - 70, 0, h - 16);
  shop.addColorStop(0, 'rgba(180,210,230,0.55)');
  shop.addColorStop(1, 'rgba(90,120,150,0.65)');
  ctx.fillStyle = shop;
  ctx.fillRect(20, h - 66, w - 40, 46);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeSidewalkTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b7b9be';
  ctx.fillRect(0, 0, size, size);

  const tile = 32;
  for (let y = 0; y < size; y += tile) {
    for (let x = 0; x < size; x += tile) {
      const shade = 170 + Math.floor(seeded(x * 3 + y * 7) * 28);
      ctx.fillStyle = `rgb(${shade},${shade + 1},${shade + 3})`;
      ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
      ctx.strokeStyle = 'rgba(90,94,100,0.35)';
      ctx.strokeRect(x + 0.5, y + 0.5, tile - 1, tile - 1);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 2.2);
  tex.anisotropy = 8;
  return tex;
}

function DaySky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPos;
          uniform float uTime;
          void main() {
            vec3 n = normalize(vPos);
            float h = n.y * 0.5 + 0.5;

            vec3 zenith = vec3(0.28, 0.55, 0.92);
            vec3 mid = vec3(0.52, 0.74, 0.95);
            vec3 horizon = vec3(0.82, 0.90, 0.98);
            vec3 ground = vec3(0.70, 0.78, 0.86);

            vec3 col = mix(horizon, mid, smoothstep(0.0, 0.45, h));
            col = mix(col, zenith, smoothstep(0.4, 0.95, h));
            col = mix(ground, col, smoothstep(-0.2, 0.08, n.y));

            vec3 sunDir = normalize(vec3(0.35, 0.55, -0.55));
            float sun = pow(max(dot(n, sunDir), 0.0), 220.0);
            float glow = pow(max(dot(n, sunDir), 0.0), 8.0);
            col += vec3(1.0, 0.95, 0.75) * sun * 2.2;
            col += vec3(1.0, 0.85, 0.45) * glow * 0.35;

            col += vec3(0.01, 0.015, 0.02) * sin(uTime * 0.2 + n.x * 2.0);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );

  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[95, 48, 32]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {/* visible sun disc */}
      <mesh position={[28, 42, -48]}>
        <sphereGeometry args={[3.2, 24, 24]} />
        <meshBasicMaterial color="#fff6c8" toneMapped={false} />
      </mesh>
      <mesh position={[28, 42, -48]}>
        <sphereGeometry args={[5.5, 24, 24]} />
        <meshBasicMaterial color="#ffe08a" transparent opacity={0.22} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function DistantSkyline({ length }) {
  const blocks = useMemo(() => {
    const list = [];
    for (let i = 0; i < 28; i += 1) {
      list.push({
        x: -10 + i * 6.2 + seeded(i) * 2,
        h: 4 + seeded(i * 2) * 12,
        w: 2.2 + seeded(i * 3) * 2.8,
        d: 2 + seeded(i * 5) * 2,
        z: -18 - seeded(i * 7) * 10,
      });
    }
    return list;
  }, []);

  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#9aa8b8" roughness={0.95} metalness={0.05} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[length / 2, -0.02, -22]} receiveShadow>
        <planeGeometry args={[length + 80, 60]} />
        <meshStandardMaterial color="#6f8a5e" roughness={1} />
      </mesh>
    </group>
  );
}

function Tree({ position, seed = 1 }) {
  const group = useRef();
  const phase = seeded(seed) * Math.PI * 2;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 1.1 + phase) * 0.06;
    group.current.rotation.x = Math.cos(t * 0.7 + phase) * 0.025;
  });

  const h = 1.4 + seeded(seed) * 0.6;
  const canopy = 0.55 + seeded(seed + 2) * 0.25;

  return (
    <group position={position} ref={group}>
      <mesh position={[0, h * 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, h, 6]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.9} />
      </mesh>
      <mesh position={[0, h + canopy * 0.35, 0]} castShadow>
        <sphereGeometry args={[canopy, 10, 10]} />
        <meshStandardMaterial color="#3f7a45" roughness={0.85} />
      </mesh>
      <mesh position={[canopy * 0.25, h + canopy * 0.55, 0.1]} castShadow>
        <sphereGeometry args={[canopy * 0.65, 8, 8]} />
        <meshStandardMaterial color="#4f8f52" roughness={0.85} />
      </mesh>
    </group>
  );
}

function WindLeaves({ count = 28, length = 60 }) {
  const ref = useRef();
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: seeded(i) * length,
        y: 1 + seeded(i + 2) * 5,
        z: -2 + seeded(i + 4) * 6,
        s: 0.04 + seeded(i + 6) * 0.05,
        sp: 0.35 + seeded(i + 8) * 0.9,
        ph: seeded(i + 10) * Math.PI * 2,
      })),
    [count, length]
  );

  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const meshes = ref.current.children;
    for (let i = 0; i < meshes.length; i += 1) {
      const d = data[i];
      const m = meshes[i];
      m.position.x = (d.x + t * d.sp * 1.6) % (length + 10);
      m.position.y = d.y + Math.sin(t * 1.4 + d.ph) * 0.4;
      m.position.z = d.z + Math.cos(t * 0.9 + d.ph) * 0.3;
      m.rotation.x += dt * 1.6;
      m.rotation.z += dt * 1.2;
    }
  });

  return (
    <group ref={ref}>
      {data.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]} scale={d.s}>
          <planeGeometry args={[1, 1.3]} />
          <meshStandardMaterial
            color={i % 2 ? '#7aaa4a' : '#c2a24a'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Wheel({ radius = 0.2, width = 0.14 }) {
  return (
    <group>
      {/* axle along Z so the tire stands upright for a car facing +X */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, width, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.55, radius * 0.55, width + 0.02, 16]} />
        <meshStandardMaterial color="#c0c4ca" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.18, radius * 0.18, width + 0.03, 10]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
    </group>
  );
}

function NpcCar({ color, wheelSpinRef }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[1.85, 0.36, 0.9]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.38} />
      </mesh>
      <mesh castShadow position={[-0.08, 0.48, 0]}>
        <boxGeometry args={[0.95, 0.3, 0.82]} />
        <meshStandardMaterial
          color="#9ec8e0"
          metalness={0.2}
          roughness={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0.95, 0.22, 0.32]}>
        <boxGeometry args={[0.06, 0.1, 0.16]} />
        <meshStandardMaterial color="#fff2c0" emissive="#ffe08a" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.95, 0.22, -0.32]}>
        <boxGeometry args={[0.06, 0.1, 0.16]} />
        <meshStandardMaterial color="#fff2c0" emissive="#ffe08a" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.95, 0.22, 0.32]}>
        <boxGeometry args={[0.06, 0.1, 0.16]} />
        <meshStandardMaterial color="#ff4a3a" emissive="#ff3a2a" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[-0.95, 0.22, -0.32]}>
        <boxGeometry args={[0.06, 0.1, 0.16]} />
        <meshStandardMaterial color="#ff4a3a" emissive="#ff3a2a" emissiveIntensity={0.7} />
      </mesh>
      <group ref={wheelSpinRef}>
        {[
          [0.58, 0, 0.48],
          [0.58, 0, -0.48],
          [-0.58, 0, 0.48],
          [-0.58, 0, -0.48],
        ].map((p, i) => (
          <group key={i} position={p}>
            <Wheel radius={0.17} width={0.12} />
          </group>
        ))}
      </group>
    </group>
  );
}

function Traffic({ length }) {
  // Same lane = same speed + large spacing so cars never overlap
  const cars = useMemo(
    () => [
      { z: 4.75, speed: 2.6, color: '#2f5f8a', phase: 0.05, lane: 0 },
      { z: 4.75, speed: 2.6, color: '#8a3a3a', phase: 0.38, lane: 0 },
      { z: 5.45, speed: 2.1, color: '#2f7a55', phase: 0.2, lane: 1 },
      { z: 5.45, speed: 2.1, color: '#6a5a2a', phase: 0.7, lane: 1 },
    ],
    []
  );
  const group = useRef();
  const wheelRefs = useRef([]);

  useFrame((_, dt) => {
    if (!group.current) return;
    const span = length + 40;
    group.current.children.forEach((child, i) => {
      const c = cars[i];
      const t = (performance.now() * 0.001 * c.speed) / span + c.phase;
      const loop = t - Math.floor(t);
      const x = length + 12 - loop * span;
      child.position.set(x, 0.17, c.z);
      child.rotation.y = Math.PI;
      const wheels = wheelRefs.current[i];
      if (wheels) {
        wheels.children.forEach((w) => {
          w.rotation.z -= c.speed * dt * 2.4;
        });
      }
    });
  });

  return (
    <group ref={group}>
      {cars.map((c, i) => (
        <group key={i}>
          <NpcCar
            color={c.color}
            wheelSpinRef={(el) => {
              wheelRefs.current[i] = el;
            }}
          />
        </group>
      ))}
    </group>
  );
}

function StreetLamp({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 2.5, 8]} />
        <meshStandardMaterial color="#6a7078" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0.35, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
        <meshStandardMaterial color="#6a7078" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0.65, 2.32, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#f2f0e8" emissive="#fff2c8" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function BuildingWindows({ width, height, depth, seed, active }) {
  const ref = useRef();
  const cols = 4;
  const rows = Math.max(3, Math.floor(height / 0.85));
  const count = cols * rows;
  const states = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        lit: seeded(seed * 9 + i) > 0.78,
        phase: seeded(seed + i) * Math.PI * 2,
      })),
    [count, seed]
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    if (!ref.current) return;
    const marginX = width * 0.18;
    const marginY = 0.55;
    const usableW = width - marginX * 2;
    const usableH = height - marginY - 0.9;
    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = -width / 2 + marginX + (c + 0.5) * (usableW / cols);
        const y = marginY + (r + 0.5) * (usableH / rows);
        dummy.position.set(x, y, depth / 2 + 0.02);
        dummy.scale.set(usableW / cols - 0.12, usableH / rows - 0.14, 1);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
        i += 1;
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [width, height, depth, rows, cols, dummy]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const s = states[i];
      if (s.lit || active) {
        const pulse = 0.85 + Math.sin(t * 1.1 + s.phase) * 0.08;
        tmpColor.set('#d7ecff').multiplyScalar(active ? pulse : 0.75);
      } else {
        tmpColor.set('#6f93ae');
      }
      ref.current.setColorAt(i, tmpColor);
    }
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.55} />
    </instancedMesh>
  );
}

function Building({ project, index, position, onOpen, active }) {
  const height = 3.6 + (index % 5) * 0.7 + (index % 3) * 0.35;
  const width = 3.5 + (index % 2) * 0.45;
  const depth = 2.7;
  const tex = useMemo(() => makeFacadeTexture(index + 1), [index]);
  const accent = ACCENT[index % ACCENT.length];
  const bodyRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (!bodyRef.current) return;
    const t = state.clock.elapsedTime;
    const s = active ? 1 + Math.sin(t * 2.2) * 0.008 : 1;
    bodyRef.current.scale.set(s, s, s);
    if (glowRef.current) {
      glowRef.current.material.opacity = active ? 0.18 + Math.sin(t * 3) * 0.05 : 0;
    }
  });

  return (
    <group position={position}>
      <group ref={bodyRef}>
        <RoundedBox
          args={[width, height, depth]}
          radius={0.05}
          smoothness={2}
          position={[0, height / 2, 0]}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project);
          }}
        >
          <meshStandardMaterial
            map={tex}
            color={active ? '#ffffff' : '#f2f4f8'}
            roughness={0.58}
            metalness={0.08}
            emissive={active ? accent : '#000000'}
            emissiveIntensity={active ? 0.1 : 0}
          />
        </RoundedBox>

        <BuildingWindows
          width={width}
          height={height}
          depth={depth}
          seed={index + 3}
          active={active}
        />

        <mesh position={[0, height + 0.1, 0]} castShadow>
          <boxGeometry args={[width * 0.94, 0.2, depth * 0.94]} />
          <meshStandardMaterial color="#5a626e" metalness={0.3} roughness={0.55} />
        </mesh>
        <mesh position={[0.5, height + 0.45, 0]} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color="#6a727c" roughness={0.7} />
        </mesh>
        <mesh position={[-0.6, height + 0.7, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.6, height + 1.25, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ff6a5a" emissive="#ff4a3a" emissiveIntensity={0.5} />
        </mesh>

        <mesh position={[0, 1.05, depth / 2 + 0.18]} castShadow>
          <boxGeometry args={[width * 0.42, 0.08, 0.45]} />
          <meshStandardMaterial color={accent} metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.42, depth / 2 + 0.03]}>
          <boxGeometry args={[width * 0.32, 0.85, 0.06]} />
          <meshStandardMaterial
            color="#1a2430"
            emissive={accent}
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>

        <mesh ref={glowRef} position={[0, height / 2, depth / 2 + 0.06]}>
          <planeGeometry args={[width * 1.05, height * 1.05]} />
          <meshBasicMaterial color={accent} transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      <StreetLamp position={[width / 2 + 0.85, 0, 0.9]} />

      <Html
        position={[0, height * 0.72, depth / 2 + 0.12]}
        center
        distanceFactor={12}
        style={{ pointerEvents: 'auto' }}
        zIndexRange={[20, 0]}
      >
        <div className={`city3d-card${active ? ' is-active' : ''}`}>
          <span className="city3d-card__num">{String(index + 1).padStart(2, '0')}</span>
          <strong>{project.title}</strong>
          <p>{shortText(project.subtitle, 90)}</p>
          <button type="button" className="city3d-card__more" onClick={() => onOpen(project)}>
            Ver mais <FaArrowRightLong />
          </button>
        </div>
      </Html>
    </group>
  );
}

function Road({ length }) {
  const sidewalkTex = useMemo(() => makeSidewalkTexture(), []);
  const mid = length / 2;
  const span = length + 48;

  return (
    <group>
      {/* base ground — kills the blue void at the ends */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, -0.06, 1]} receiveShadow>
        <planeGeometry args={[span + 40, 48]} />
        <meshStandardMaterial color="#6a8a58" roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0, 2.9]} receiveShadow>
        <planeGeometry args={[span, 9.2]} />
        <meshStandardMaterial color="#3a3d44" roughness={0.95} metalness={0.05} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.05, -1.05]} receiveShadow>
        <planeGeometry args={[span, 3.8]} />
        <meshStandardMaterial map={sidewalkTex} roughness={0.85} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.045, -2.85]} receiveShadow>
        <planeGeometry args={[span, 1.4]} />
        <meshStandardMaterial color="#5f8f4e" roughness={1} />
      </mesh>

      <mesh position={[mid, 0.1, 0.7]} castShadow receiveShadow>
        <boxGeometry args={[span, 0.2, 0.22]} />
        <meshStandardMaterial color="#d0d3d8" roughness={0.75} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.06, 0.35]}>
        <planeGeometry args={[span, 0.28]} />
        <meshStandardMaterial color="#c9a227" roughness={0.7} />
      </mesh>

      {Array.from({ length: Math.ceil(span / 3.4) }).map((_, i) => (
        <mesh key={`d-${i}`} position={[i * 3.4 - 8, 0.03, 2.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.12]} />
          <meshStandardMaterial color="#f0d36a" roughness={0.6} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.03, 0.95]}>
        <planeGeometry args={[span, 0.08]} />
        <meshStandardMaterial color="#f5f7fa" roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.03, 4.85]}>
        <planeGeometry args={[span, 0.08]} />
        <meshStandardMaterial color="#f5f7fa" roughness={0.5} />
      </mesh>

      {/* end plaza — closes the avenue so the camera never stares into empty sky */}
      <mesh position={[length + 6, 1.2, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[4, 2.4, 14]} />
        <meshStandardMaterial color="#8a94a2" roughness={0.8} />
      </mesh>
      <mesh position={[length + 6, 2.6, 1.2]}>
        <boxGeometry args={[4.2, 0.35, 14.2]} />
        <meshStandardMaterial color="#c9a227" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[-10, 1.0, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 14]} />
        <meshStandardMaterial color="#7e8896" roughness={0.85} />
      </mesh>
    </group>
  );
}

function ExhaustSmoke({ carRef, activeRef }) {
  const ref = useRef();
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        life: i / 14,
        x: 0,
        y: 0,
        z: 0,
        s: 0.08 + seeded(i + 2) * 0.12,
      })),
    []
  );

  useFrame((_, dt) => {
    if (!ref.current || !carRef.current) return;
    const on = activeRef.current;
    const base = carRef.current.position;
    const facing = carRef.current.rotation.y;
    const back = facing > Math.PI / 2 ? 1 : -1;
    ref.current.children.forEach((mesh, i) => {
      const p = particles[i];
      p.life += dt * (on ? 1.6 : 0.6);
      if (p.life > 1) {
        p.life = on ? 0 : 1;
        p.x = base.x + back * 1.15 + (Math.random() - 0.5) * 0.15;
        p.y = base.y + 0.18;
        p.z = base.z + (Math.random() - 0.5) * 0.2;
      }
      const t = p.life;
      mesh.visible = on || t < 0.85;
      mesh.position.set(p.x + back * t * 0.9, p.y + t * 0.7, p.z);
      const s = p.s * (0.6 + t * 1.8);
      mesh.scale.setScalar(s);
      mesh.material.opacity = on ? (1 - t) * 0.45 : (1 - t) * 0.12;
    });
  });

  return (
    <group ref={ref}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#c8c8c8"
            transparent
            opacity={0}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Car({ carRef, wheelsRef, lightsRef }) {
  return (
    <group ref={carRef} position={[0, CAR_Y, 2.2]}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[2.3, 0.38, 1.08]} />
        <meshStandardMaterial color="#e8ecf2" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh castShadow position={[0.62, 0.38, 0]}>
        <boxGeometry args={[0.85, 0.14, 1.02]} />
        <meshStandardMaterial color="#d5dae3" metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh castShadow position={[-0.15, 0.54, 0]}>
        <boxGeometry args={[1.15, 0.4, 0.98]} />
        <meshStandardMaterial
          color="#7eb8d8"
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh position={[-0.15, 0.76, 0]}>
        <boxGeometry args={[1.05, 0.05, 0.92]} />
        <meshStandardMaterial color="#cfd5de" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[1.18, 0.16, 0]}>
        <boxGeometry args={[0.12, 0.16, 1.05]} />
        <meshStandardMaterial color="#2a2e34" roughness={0.6} />
      </mesh>
      <mesh position={[-1.18, 0.16, 0]}>
        <boxGeometry args={[0.12, 0.16, 1.05]} />
        <meshStandardMaterial color="#2a2e34" roughness={0.6} />
      </mesh>

      <group ref={lightsRef}>
        <mesh position={[1.16, 0.28, 0.36]} name="hlL">
          <boxGeometry args={[0.08, 0.12, 0.2]} />
          <meshStandardMaterial color="#fff6d0" emissive="#ffe08a" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[1.16, 0.28, -0.36]} name="hlR">
          <boxGeometry args={[0.08, 0.12, 0.2]} />
          <meshStandardMaterial color="#fff6d0" emissive="#ffe08a" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[-1.16, 0.28, 0.36]} name="tlL">
          <boxGeometry args={[0.08, 0.12, 0.18]} />
          <meshStandardMaterial color="#ff5a4a" emissive="#ff3a2a" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[-1.16, 0.28, -0.36]} name="tlR">
          <boxGeometry args={[0.08, 0.12, 0.18]} />
          <meshStandardMaterial color="#ff5a4a" emissive="#ff3a2a" emissiveIntensity={0.6} />
        </mesh>
        <spotLight
          name="beam"
          position={[1.25, 0.3, 0]}
          angle={0.42}
          penumbra={0.55}
          intensity={1.4}
          distance={14}
          color="#fff2c8"
        />
      </group>

      {/* wheels sit on y=0 local → world y = CAR_Y, tire bottom on asphalt */}
      <group ref={wheelsRef}>
        {[
          [0.72, 0, 0.56],
          [0.72, 0, -0.56],
          [-0.72, 0, 0.56],
          [-0.72, 0, -0.56],
        ].map((p, i) => (
          <group key={i} position={p}>
            <Wheel radius={0.2} width={0.15} />
          </group>
        ))}
      </group>
    </group>
  );
}

function MovingShadows({ followRef, worldEnd }) {
  const lightRef = useRef();

  useFrame(() => {
    const x = followRef.current?.position.x ?? 0;
    if (lightRef.current) {
      lightRef.current.position.set(x + 10, 18, 8);
      lightRef.current.target.position.set(x + 2, 0, 1.5);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        castShadow
        position={[10, 18, 8]}
        intensity={1.55}
        color="#fff4dc"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.04}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-camera-left={-20}
        shadow-camera-right={24}
        shadow-camera-top={18}
        shadow-camera-bottom={-12}
      />
      <directionalLight position={[worldEnd * 0.5, 14, -6]} intensity={0.4} color="#cfe0ff" />
    </>
  );
}

function Driver({
  buildings,
  carRef,
  wheelsRef,
  lightsRef,
  keysRef,
  pointerDirRef,
  setActiveIndex,
  worldEnd,
  audioRef,
  smokeActiveRef,
}) {
  const { camera } = useThree();
  const xRef = useRef(0);
  const facing = useRef(1);
  const laneZ = useRef(2.2);
  const turning = useRef(false);
  const prevDir = useRef(0);

  useFrame((_, dt) => {
    let dir = 0;
    if (keysRef.current.right) dir += 1;
    if (keysRef.current.left) dir -= 1;
    dir += pointerDirRef.current;

    if (dir !== 0 && dir !== facing.current && !turning.current) {
      turning.current = true;
      facing.current = dir;
      laneZ.current = dir > 0 ? 2.2 : 3.4;
      window.setTimeout(() => {
        turning.current = false;
      }, 420);
    }

    if (dir !== 0) {
      xRef.current = THREE.MathUtils.clamp(xRef.current + dir * SPEED * (60 * dt), 0, worldEnd);
    }

    const braking = (dir !== 0 && prevDir.current !== 0 && prevDir.current !== dir) || dir < 0;
    if (smokeActiveRef) smokeActiveRef.current = dir > 0;
    if (audioRef?.current) {
      audioRef.current.setDrive({
        moving: dir !== 0,
        accel: dir > 0,
        braking,
      });
    }
    prevDir.current = dir;

    if (carRef.current) {
      carRef.current.position.x = xRef.current;
      carRef.current.position.z = THREE.MathUtils.damp(
        carRef.current.position.z,
        laneZ.current,
        6,
        dt
      );
      const targetRot = facing.current > 0 ? 0 : Math.PI;
      carRef.current.rotation.y = THREE.MathUtils.damp(
        carRef.current.rotation.y,
        targetRot,
        8,
        dt
      );
      // planted on asphalt — tiny bounce only while moving
      carRef.current.position.y =
        CAR_Y + (dir !== 0 ? Math.sin(performance.now() * 0.02) * 0.006 : 0);
      carRef.current.rotation.z = THREE.MathUtils.damp(
        carRef.current.rotation.z,
        (laneZ.current - carRef.current.position.z) * 0.05,
        5,
        dt
      );
    }

    if (wheelsRef.current && dir !== 0) {
      const spin = dir * dt * 16;
      wheelsRef.current.children.forEach((w) => {
        w.rotation.z += spin;
      });
    }

    if (lightsRef.current) {
      const mats = [];
      lightsRef.current.traverse((obj) => {
        if (obj.isMesh && obj.material?.emissive) mats.push(obj);
      });
      const hl = mats.filter((m) => m.name.startsWith('hl'));
      const tl = mats.filter((m) => m.name.startsWith('tl'));
      const reversing = dir < 0;
      hl.forEach((m) => {
        const pulse = dir > 0 ? 1.35 + Math.sin(performance.now() * 0.012) * 0.25 : 0.9;
        m.material.emissiveIntensity = reversing ? 0.55 : pulse;
      });
      tl.forEach((m) => {
        m.material.emissiveIntensity = reversing
          ? 2.2 + Math.sin(performance.now() * 0.02) * 0.35
          : dir !== 0
            ? 0.85
            : 0.55;
      });
      const beam = lightsRef.current.getObjectByName('beam');
      if (beam) beam.intensity = reversing ? 0.4 : dir !== 0 ? 2.1 : 1.1;
    }

    // keep look-at inside the avenue so the end never opens into empty sky
    const lookX = Math.min(xRef.current + 2.2, worldEnd + 1.5);
    const camX = THREE.MathUtils.clamp(xRef.current - 2.6, -2, worldEnd - 4);
    const targetCam = new THREE.Vector3(camX, 5.2, 11.8);
    camera.position.lerp(targetCam, 1 - Math.exp(-2.8 * dt));
    camera.lookAt(lookX, 1.35, 1.0);

    let best = 0;
    let bestDist = Infinity;
    buildings.forEach((b, i) => {
      const d = Math.abs(b.x - xRef.current);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActiveIndex(bestDist < 6.5 ? best : -1);
  });

  return null;
}

function DriftCloud({ position, scale = 1, speed = 0.08, color = '#ffffff' }) {
  const ref = useRef();
  const baseX = position[0];

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.x = baseX + Math.sin(t) * 5;
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.35;
  });

  return (
    <group ref={ref} position={position}>
      {[
        [0, 0, 0, 1],
        [1.2, 0.15, 0.2, 0.75],
        [-1.1, 0.1, -0.15, 0.7],
        [0.3, 0.45, 0.1, 0.55],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x * scale, y * scale, z * scale]} scale={s * scale}>
          <sphereGeometry args={[1.4, 12, 10]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.45}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Atmosphere({ length }) {
  return (
    <>
      <DaySky />
      <DriftCloud position={[12, 16, -24]} scale={2.4} speed={0.08} color="#ffffff" />
      <DriftCloud position={[40, 18, -32]} scale={3} speed={0.05} color="#f2f7ff" />
      <DriftCloud position={[62, 15, -20]} scale={2.1} speed={0.1} color="#ffffff" />
      <Sparkles
        count={28}
        scale={[length * 0.7, 6, 8]}
        position={[length / 2, 2.5, 1]}
        size={1.8}
        speed={0.3}
        opacity={0.28}
        color="#ffffff"
      />
      <WindLeaves count={24} length={length + 20} />
      <DistantSkyline length={length} />
    </>
  );
}

function Scene({ projects, onOpen, audioRef, muted }) {
  const ordered = useMemo(
    () => [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [projects]
  );

  const buildings = useMemo(
    () =>
      ordered.map((p, i) => ({
        ...p,
        index: i,
        x: START + i * GAP,
      })),
    [ordered]
  );

  const worldEnd = START + Math.max(ordered.length - 1, 0) * GAP + 10;
  const carRef = useRef();
  const wheelsRef = useRef();
  const lightsRef = useRef();
  const smokeActiveRef = useRef(false);
  const keysRef = useRef({ left: false, right: false });
  const pointerDirRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useThree((s) => s.gl.domElement);

  useEffect(() => {
    audioRef?.current?.setMuted(muted);
  }, [muted, audioRef]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        keysRef.current.right = true;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        keysRef.current.left = true;
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        onOpen(buildings[activeIndex]);
      }
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
  }, [activeIndex, buildings, onOpen]);

  useEffect(() => {
    const el = viewportRef;
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (ratio > 0.62) pointerDirRef.current = 1;
      else if (ratio < 0.38) pointerDirRef.current = -1;
      else pointerDirRef.current = 0;
    };
    const leave = () => {
      pointerDirRef.current = 0;
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [viewportRef]);

  return (
    <>
      <color attach="background" args={['#87b7ef']} />
      <fog attach="fog" args={['#b7d0ea', 55, 140]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#b8d4ff', '#7a8f5a', 0.55]} />

      <MovingShadows followRef={carRef} worldEnd={worldEnd} />
      <Atmosphere length={worldEnd + 28} />
      <Road length={worldEnd + 28} />
      <Traffic length={worldEnd + 28} />

      {buildings.map((b) => {
        const width = 3.5 + (b.index % 2) * 0.45;
        return (
          <group key={b.id || b.index}>
            <Building
              project={b}
              index={b.index}
              position={[b.x, 0, BUILDING_Z]}
              onOpen={onOpen}
              active={activeIndex === b.index}
            />
            {/* trees on the curb strip — never inside the building volume */}
            <Tree position={[b.x - width / 2 - 0.95, 0, 0.25]} seed={b.index * 3} />
            <Tree position={[b.x + width / 2 + 0.95, 0, 0.35]} seed={b.index * 3 + 1} />
          </group>
        );
      })}

      <Car carRef={carRef} wheelsRef={wheelsRef} lightsRef={lightsRef} />
      <ExhaustSmoke carRef={carRef} activeRef={smokeActiveRef} />

      <Driver
        buildings={buildings}
        carRef={carRef}
        wheelsRef={wheelsRef}
        lightsRef={lightsRef}
        keysRef={keysRef}
        pointerDirRef={pointerDirRef}
        setActiveIndex={setActiveIndex}
        worldEnd={worldEnd}
        audioRef={audioRef}
        smokeActiveRef={smokeActiveRef}
      />
    </>
  );
}

function LoaderOverlay() {
  return (
    <div className="city3d-loader">
      <div className="city3d-loader__spin" />
      <p>Ligando o motor…</p>
      <small>Vrum vrum — preparando a avenida</small>
    </div>
  );
}

export default function ProjectCity3D({ projects = [], onBack }) {
  const [selected, setSelected] = useState(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const rootRef = useRef(null);
  const leavingRef = useRef(false);
  const onOpen = useCallback((project) => setSelected(project), []);

  useEffect(() => {
    const audio = createEngineAudio();
    audioRef.current = audio;
    return () => audio.disposeSoft(0.85);
  }, []);

  // Leave início / jornada / outras seções → some o som com fade
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (leavingRef.current || !audioRef.current) return;
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.12;
        if (visible) audioRef.current.fadeIn(0.9);
        else audioRef.current.fadeOut(0.9);
      },
      { threshold: [0, 0.12, 0.25, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const startAudio = useCallback(async () => {
    if (!audioRef.current || leavingRef.current) return;
    await audioRef.current.unlock();
    audioRef.current.setMuted(muted);
    audioRef.current.playIntro();
  }, [muted]);

  const handleBack = useCallback(() => {
    leavingRef.current = true;
    audioRef.current?.fadeOut(0.75);
    window.setTimeout(() => onBack?.(), 280);
  }, [onBack]);

  return (
    <div className="city3d" ref={rootRef}>
      <div className="city3d__toolbar">
        <button type="button" className="city3d__back" onClick={handleBack}>
          ← Voltar às opções
        </button>
        <div className="city3d__hint-inline">
          <span>
            <FaArrowLeft /> <FaArrowRight /> dirigir
          </span>
          <span>clique no prédio ou em Ver mais</span>
          <button
            type="button"
            className="city3d__mute"
            onClick={() => {
              setMuted((m) => {
                const next = !m;
                audioRef.current?.setMuted(next);
                return next;
              });
            }}
          >
            {muted ? 'Som off' : 'Som on'}
          </button>
        </div>
      </div>

      <div className="city3d__stage">
        {!ready && <LoaderOverlay />}
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [-2.6, 5.2, 11.8], fov: 40, near: 0.1, far: 180 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          onCreated={async ({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            setReady(true);
            await startAudio();
          }}
          onPointerDown={startAudio}
        >
          <Suspense fallback={null}>
            <Scene projects={projects} onOpen={onOpen} audioRef={audioRef} muted={muted} />
          </Suspense>
        </Canvas>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="city3d-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.article
              className="city3d-sheet"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="city3d-sheet__close"
                onClick={() => setSelected(null)}
                aria-label="Fechar"
              >
                <FaXmark />
              </button>
              {selected.image && (
                <img src={selected.image} alt={selected.title} className="city3d-sheet__img" />
              )}
              <div className="city3d-sheet__body">
                <span>
                  {selected.type === 'pessoal' ? 'Projeto pessoal' : 'Empreendimento'}
                </span>
                <h3>{selected.title}</h3>
                <p>{selected.subtitle}</p>
                {selected.url && (
                  <a href={selected.url} target="_blank" rel="noopener noreferrer">
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
