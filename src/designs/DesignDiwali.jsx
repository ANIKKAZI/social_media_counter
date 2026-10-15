/* Diwali Celebration Design - purple velvet stage, marigold garlands, animated fireworks, crackers and diyas */
import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { formatCount, ProfileAvatar } from '../components/shared';

if (typeof document !== 'undefined' && !document.head.querySelector('style[data-diwali]')) {
  const tag = document.createElement('style');
  tag.setAttribute('data-diwali', 'true');
  tag.textContent = `
    @keyframes dw-flame {
      0%   { transform: scale(1, 1) skewX(0deg); }
      20%  { transform: scale(0.93, 1.1) skewX(4deg); }
      40%  { transform: scale(1.05, 0.94) skewX(-3deg); }
      60%  { transform: scale(0.95, 1.08) skewX(3deg); }
      80%  { transform: scale(1.04, 0.97) skewX(-4deg); }
      100% { transform: scale(1, 1) skewX(0deg); }
    }
    @keyframes dw-flame-core {
      0%, 100% { transform: scale(1, 1); opacity: 0.95; }
      50%      { transform: scale(0.85, 1.12); opacity: 1; }
    }
    @keyframes dw-glow {
      0%, 100% { opacity: 0.55; transform: scale(0.92); }
      30%      { opacity: 0.9;  transform: scale(1.08); }
      65%      { opacity: 0.65; transform: scale(0.97); }
    }
    @keyframes dw-burst {
      0%   { transform: scale(0.05); opacity: 0; }
      8%   { opacity: 1; }
      65%  { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.18); opacity: 0; }
    }
    @keyframes dw-rocket {
      0%   { transform: translateY(0); opacity: 0; }
      10%  { opacity: 1; }
      100% { transform: translateY(-170px); opacity: 0; }
    }
    @keyframes dw-spark {
      0%   { transform: translate(0, 0) scale(1); opacity: 0; }
      12%  { opacity: 1; }
      60%  { transform: translate(calc(var(--dx) * 1cqw), calc(var(--dy) * 1cqw)) scale(0.8); opacity: 1; }
      100% { transform: translate(calc(var(--dx) * 1.25cqw), calc((var(--dy) + var(--fall)) * 1cqw)) scale(0.2); opacity: 0; }
    }
    @keyframes dw-fizz {
      0%, 100% { opacity: 0.7; transform: scale(0.9); }
      50%      { opacity: 1;   transform: scale(1.25); }
    }
    @keyframes dw-lightning {
      0%, 42%, 50%, 100% { opacity: 0; }
      44%, 48% { opacity: 1; }
      46%      { opacity: 0.2; }
    }
    @keyframes dw-sway {
      0%, 100% { transform: rotate(-1.6deg); }
      50%      { transform: rotate(1.6deg); }
    }
    @keyframes dw-twinkle {
      0%, 100% { opacity: 0.35; }
      50%      { opacity: 1; }
    }
    @keyframes dw-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes dw-spin-rev {
      from { transform: rotate(360deg); }
      to   { transform: rotate(0deg); }
    }
    @keyframes dw-ember {
      0%   { transform: translateY(0) translateX(0); opacity: 0; }
      15%  { opacity: 0.9; }
      100% { transform: translateY(-38cqw) translateX(calc(var(--drift) * 1cqw)); opacity: 0; }
    }
    @keyframes dw-shine {
      0%   { transform: translateX(-130%); }
      55%, 100% { transform: translateX(230%); }
    }
    @keyframes dw-text-glow {
      0%, 100% { filter: drop-shadow(0 0 1.2cqw rgba(255, 190, 60, 0.45)); }
      50%      { filter: drop-shadow(0 0 2.6cqw rgba(255, 210, 90, 0.95)); }
    }
    @keyframes dw-velvet {
      0%   { transform: translateX(-12%); }
      100% { transform: translateX(12%); }
    }
    @keyframes dw-bob {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-0.5cqw); }
    }
    @keyframes dw-star {
      0%, 100% { transform: scale(0.7) rotate(0deg); opacity: 0.5; }
      50%      { transform: scale(1.2) rotate(25deg); opacity: 1; }
    }
    @keyframes dw-pulse-ring {
      0%, 100% { box-shadow: 0 0 2.5cqw rgba(255, 200, 80, 0.35), inset 0 0 1cqw rgba(255, 200, 80, 0.2); }
      50%      { box-shadow: 0 0 4.5cqw rgba(255, 215, 100, 0.75), inset 0 0 1.6cqw rgba(255, 215, 100, 0.4); }
    }
  `;
  document.head.appendChild(tag);
}

/* Deterministic random so re-renders never reshuffle the effects */
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GOLD_TEXT = 'linear-gradient(180deg, #fff3b0 0%, #ffd45a 35%, #e8a020 70%, #ffd96b 100%)';

/* ── Mandala ─────────────────────────────────────────────────────────── */
function Mandala({ style, reverse = false, duration = 120, opacity = 0.35 }) {
  const petals = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg
      viewBox="-100 -100 200 200"
      style={{
        position: 'absolute',
        opacity,
        animation: `${reverse ? 'dw-spin-rev' : 'dw-spin'} ${duration}s linear infinite`,
        ...style,
      }}
    >
      <g fill="none" stroke="#d9a441" strokeWidth="0.9">
        <circle r="96" />
        <circle r="90" strokeDasharray="2 3" />
        <circle r="62" />
        <circle r="34" />
        <circle r="10" />
        {petals.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -62 C 12 -76 12 -88 0 -98 C -12 -88 -12 -76 0 -62 Z" />
            <path d="M0 -34 C 7 -44 7 -54 0 -62 C -7 -54 -7 -44 0 -34 Z" />
            <circle cy="-26" r="1.8" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ── Marigold flower ─────────────────────────────────────────────────── */
function Flower({ x, y, r, tone }) {
  const fill = tone === 'white' ? 'url(#dwFlowerWhite)' : tone === 'yellow' ? 'url(#dwFlowerYellow)' : 'url(#dwFlowerOrange)';
  const ring = tone === 'white' ? '#e9e2cf' : tone === 'yellow' ? '#e6a700' : '#d96a00';
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={ring} strokeWidth="0.8" />
      <circle cx={x} cy={y} r={r * 0.68} fill="none" stroke={ring} strokeWidth="0.7" strokeDasharray={`${r * 0.5} ${r * 0.35}`} />
      <circle cx={x} cy={y} r={r * 0.32} fill={ring} opacity="0.55" />
    </g>
  );
}

function Garlands() {
  const { swags, strands, bulbs } = useMemo(() => {
    const rand = rng(11);
    const tone = () => {
      const v = rand();
      return v < 0.55 ? 'orange' : v < 0.9 ? 'yellow' : 'white';
    };
    const anchors = [-560, -420, -280, -140, -10, 95, 230, 370, 515, 655, 800, 950, 1090, 1230, 1370, 1510];
    const swagList = [];
    const bulbList = [];
    for (let s = 0; s < anchors.length - 1; s++) {
      const x0 = anchors[s];
      const x1 = anchors[s + 1];
      const n = Math.max(3, Math.round((x1 - x0) / 23));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = x0 + (x1 - x0) * t;
        const y = 24 + 30 * Math.sin(Math.PI * t);
        swagList.push({ x, y, r: 12.5, tone: tone() });
      }
      for (let i = 1; i < 5; i++) {
        const t = i / 5;
        bulbList.push({
          x: x0 + (x1 - x0) * t,
          y: 68 + 26 * Math.sin(Math.PI * t),
          delay: rand() * 2,
        });
      }
    }
    const strandDefs = [
      { x: -420, len: 120, delay: 0.9 },
      { x: -140, len: 200, delay: 0.2 },
      { x: 95, len: 280, delay: 0 },
      { x: 370, len: 90, delay: 0.7 },
      { x: 655, len: 90, delay: 0.3 },
      { x: 800, len: 80, delay: 1.1 },
      { x: 950, len: 290, delay: 0.5 },
      { x: 1140, len: 200, delay: 0.6 },
      { x: 1420, len: 120, delay: 0.4 },
    ];
    const strandList = strandDefs.map((d) => {
      const flowers = [];
      const count = Math.floor(d.len / 22);
      for (let i = 0; i < count; i++) {
        flowers.push({ x: d.x + (rand() - 0.5) * 4, y: 50 + i * 22, r: 12, tone: tone() });
      }
      return { ...d, flowers };
    });
    return { swags: swagList, strands: strandList, bulbs: bulbList };
  }, []);

  return (
    <svg viewBox="0 0 1000 750" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
          <defs>
            <radialGradient id="dwFlowerOrange" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#ffb54a" />
          <stop offset="100%" stopColor="#f0720a" />
        </radialGradient>
        <radialGradient id="dwFlowerYellow" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffe36a" />
          <stop offset="100%" stopColor="#f4b400" />
        </radialGradient>
        <radialGradient id="dwFlowerWhite" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ede5cf" />
        </radialGradient>
        <linearGradient id="dwLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="100%" stopColor="#b8791a" />
        </linearGradient>
      </defs>

      {bulbs.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r="3.4"
          fill="#fff0b3"
          style={{ filter: 'drop-shadow(0 0 5px #ffd45a)', animation: `dw-twinkle 1.8s ease-in-out ${b.delay}s infinite` }}
        />
      ))}

      {swags.map((f, i) => <Flower key={i} {...f} />)}

      {strands.map((s) => (
        <g
          key={s.x}
          style={{
            transformBox: 'fill-box',
            transformOrigin: '50% 0%',
            animation: `dw-sway ${4 + s.delay}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {s.flowers.map((f, i) => <Flower key={i} {...f} />)}
          <path
            d={`M${s.x} ${50 + s.flowers.length * 22 - 6} c 12 6 14 18 0 40 c -14 -22 -12 -34 0 -40 Z`}
            fill="url(#dwLeaf)"
            stroke="#8a5a10"
            strokeWidth="0.8"
          />
        </g>
      ))}
    </svg>
  );
}

/* ── Fireworks ───────────────────────────────────────────────────────── */
const BURSTS = [
  { x: 205, y: 275, size: 62, color: '#ffd45a', delay: 0, dur: 3.4 },
  { x: 150, y: 345, size: 50, color: '#ff8a3d', delay: 1.1, dur: 3.6 },
  { x: 265, y: 360, size: 58, color: '#ffe27a', delay: 2.0, dur: 3.2 },
  { x: 195, y: 225, size: 36, color: '#ff5fa2', delay: 0.6, dur: 3.0 },
  { x: 240, y: 205, size: 30, color: '#53e08a', delay: 2.4, dur: 3.3 },
  { x: 140, y: 250, size: 28, color: '#6ec8ff', delay: 1.6, dur: 3.1 },
  { x: 590, y: 355, size: 52, color: '#ffd45a', delay: 0.9, dur: 3.5 },
  { x: 480, y: 235, size: 34, color: '#ff8a3d', delay: 2.8, dur: 3.8 },
];

function Fireworks() {
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="0 0 1000 750" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {BURSTS.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y})`} style={{ color: b.color }}>
          <g style={{ transformOrigin: '0 0', animation: `dw-burst ${b.dur}s ease-out ${b.delay}s infinite`, opacity: 0 }}>
            {rays.map((a, k) => {
              const long = k % 2 === 0;
              return (
                <g key={a} transform={`rotate(${a})`}>
                  <line
                    x1={b.size * 0.14}
                    y1="0"
                    x2={b.size * (long ? 1 : 0.7)}
                    y2="0"
                    stroke="currentColor"
                    strokeWidth={long ? 2.4 : 1.6}
                    strokeLinecap="round"
                    strokeDasharray={long ? '0' : '6 4'}
                  />
                  <circle cx={b.size * (long ? 1.08 : 0.8)} cy="0" r={long ? 2.6 : 1.8} fill="#fff6c8" />
                </g>
              );
            })}
            <circle r={b.size * 0.12} fill="#fff6c8" />
          </g>
        </g>
      ))}

      {[{ x: 203, y: 520, d: 0.4 }, { x: 109, y: 530, d: 1.8 }, { x: 305, y: 525, d: 2.6 }].map((r, i) => (
        <g key={i} transform={`translate(${r.x} ${r.y})`}>
          <g style={{ animation: `dw-rocket 2.6s ease-in ${r.d}s infinite`, opacity: 0 }}>
            <line x1="0" y1="0" x2="0" y2="26" stroke="#ffd45a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 4" />
            <circle r="3.5" fill="#fff6c8" />
          </g>
        </g>
      ))}

      {[
        { x: 235, y: 205, c: '#ff5fa2' }, { x: 120, y: 215, c: '#53e08a' }, { x: 300, y: 280, c: '#ffd45a' },
        { x: 160, y: 300, c: '#ff8a3d' }, { x: 275, y: 235, c: '#6ec8ff' }, { x: 205, y: 180, c: '#ffd45a' },
      ].map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          <path
            d="M0 -11 L3 -3 L11 0 L3 3 L0 11 L-3 3 L-11 0 L-3 -3 Z"
            fill={s.c}
            style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `dw-star ${2 + (i % 3) * 0.6}s ease-in-out ${i * 0.4}s infinite` }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ── Anar (cone cracker) with live sparks ────────────────────────────── */
function Cracker({ left, top, width, delay = 0, seed = 1, lightning = null }) {
  const sparks = useMemo(() => {
    const rand = rng(seed);
    return Array.from({ length: 22 }, () => {
      const angle = (rand() - 0.5) * Math.PI * 0.9;
      const dist = 5 + rand() * 10;
      return {
        dx: Math.sin(angle) * dist,
        dy: -Math.cos(angle) * dist,
        fall: 1 + rand() * 3,
        dur: 0.9 + rand() * 1.1,
        delay: rand() * 2,
        size: 0.35 + rand() * 0.45,
        hue: rand() < 0.5 ? '#ffe27a' : rand() < 0.5 ? '#ff9a3d' : '#fff6c8',
      };
    });
  }, [seed]);

  return (
    <div style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, width: `${width}%`, aspectRatio: '3 / 4' }}>
      {sparks.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '6%',
            width: `${s.size}cqw`,
            height: `${s.size}cqw`,
            borderRadius: '50%',
            background: s.hue,
            boxShadow: `0 0 ${s.size * 3}cqw ${s.hue}`,
            '--dx': s.dx,
            '--dy': s.dy,
            '--fall': s.fall,
            opacity: 0,
            animation: `dw-spark ${s.dur}s ease-out ${s.delay + delay}s infinite`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '4%',
          width: '60%',
          aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff9d6 0%, #ffd45a 35%, rgba(255,150,40,0) 70%)',
          animation: `dw-fizz 0.35s ease-in-out ${delay}s infinite`,
        }}
      />
      {lightning && (
        <svg
          viewBox="0 0 100 60"
          style={{
            position: 'absolute',
            top: '30%',
            width: '130%',
            [lightning]: '90%',
            transform: lightning === 'right' ? 'none' : 'scaleX(-1)',
            overflow: 'visible',
            animation: `dw-lightning ${1.6 + delay}s linear ${delay}s infinite`,
            filter: 'drop-shadow(0 0 4px #ffe9a0)',
          }}
        >
          <polyline points="0,30 18,18 30,34 48,14 62,32 82,10 100,26" fill="none" stroke="#fff3c4" strokeWidth="2" strokeLinejoin="round" />
          <polyline points="30,34 40,50 52,40 66,56" fill="none" stroke="#ffd45a" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
      <svg viewBox="0 0 60 80" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`dwCone${seed}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b3150f" />
            <stop offset="45%" stopColor="#ff5a1f" />
            <stop offset="100%" stopColor="#9b1008" />
          </linearGradient>
        </defs>
        <path d="M30 6 L55 70 Q30 82 5 70 Z" fill={`url(#dwCone${seed})`} stroke="#ffd45a" strokeWidth="1.2" />
        <path d="M14 52 Q30 60 46 52 L50 64 Q30 74 10 64 Z" fill="#2aa84a" stroke="#ffd45a" strokeWidth="0.8" />
        <circle cx="30" cy="38" r="7" fill="#ffd45a" stroke="#b3150f" strokeWidth="1.2" />
        <circle cx="30" cy="38" r="3" fill="#ff5a1f" />
        <path d="M18 70 Q30 76 42 70" fill="none" stroke="#ffd45a" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ── Diya with a living flame ────────────────────────────────────────── */
function Diya({ left, top, width, delay = 0 }) {
  return (
    <div style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, width: `${width}%`, aspectRatio: '100 / 80' }}>
      <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`dwGlow${left}${top}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd45a" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff9a2e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff9a2e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`dwBowl${left}${top}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0813a" />
            <stop offset="55%" stopColor="#b9531b" />
            <stop offset="100%" stopColor="#7a2f0e" />
          </linearGradient>
          <radialGradient id={`dwFlame${left}${top}`} cx="50%" cy="75%" r="65%">
            <stop offset="0%" stopColor="#fffbe0" />
            <stop offset="40%" stopColor="#ffd45a" />
            <stop offset="100%" stopColor="#ff6a10" />
          </radialGradient>
        </defs>

        <circle
          cx="50" cy="28" r="40"
          fill={`url(#dwGlow${left}${top})`}
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `dw-glow 1.3s ease-in-out ${delay}s infinite` }}
        />
        <path d="M6 44 Q50 36 94 44 Q92 74 50 78 Q8 74 6 44 Z" fill={`url(#dwBowl${left}${top})`} stroke="#ffcf7a" strokeWidth="1.2" />
        <path d="M10 46 Q50 38 90 46" fill="none" stroke="#ffe0a0" strokeWidth="1.6" opacity="0.8" />
        <path d="M22 58 Q50 66 78 58" fill="none" stroke="#ffcf7a" strokeWidth="0.9" strokeDasharray="2 3" />
        <line x1="50" y1="42" x2="50" y2="36" stroke="#3b1a0a" strokeWidth="2" strokeLinecap="round" />

        <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: `dw-flame ${0.9 + (delay % 0.4)}s ease-in-out ${delay}s infinite` }}>
          <path d="M50 2 C 62 16 68 26 62 34 C 58 40 42 40 38 34 C 32 26 40 16 50 2 Z" fill={`url(#dwFlame${left}${top})`} style={{ filter: 'drop-shadow(0 0 4px #ffb23a)' }} />
          <path
            d="M50 16 C 56 24 58 29 55 33 C 52 36 48 36 45 33 C 42 29 45 24 50 16 Z"
            fill="#fffdf0"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: `dw-flame-core 0.7s ease-in-out ${delay}s infinite` }}
          />
        </g>
      </svg>
    </div>
  );
}

/* ── Nameplate ───────────────────────────────────────────────────────── */
function Nameplate() {
  const shape =
    'M58 16 Q125 6 168 18 Q200 28 232 18 Q275 6 342 16 Q394 26 398 95 Q394 164 342 174 Q275 184 232 172 Q200 162 168 172 Q125 184 58 174 Q6 164 2 95 Q6 26 58 16 Z';
  const inset = (sx, sy) => `translate(200 95) scale(${sx} ${sy}) translate(-200 -95)`;
  return (
    <div style={{ position: 'absolute', left: '35.1%', top: '74.3%', width: '32.3%', aspectRatio: '400 / 190' }}>
      <svg viewBox="0 0 400 190" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="dwPlateEdge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3b8" />
            <stop offset="45%" stopColor="#d49a2a" />
            <stop offset="100%" stopColor="#f6d77a" />
          </linearGradient>
          <linearGradient id="dwPlateRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9801f" />
            <stop offset="50%" stopColor="#f3d27a" />
            <stop offset="100%" stopColor="#a8701a" />
          </linearGradient>
          <linearGradient id="dwPlateFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b77f2e" />
            <stop offset="55%" stopColor="#8a5517" />
            <stop offset="100%" stopColor="#5f360c" />
          </linearGradient>
          <linearGradient id="dwPlateText" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff2b8" />
            <stop offset="100%" stopColor="#e9b038" />
          </linearGradient>
          <clipPath id="dwPlateClip">
            <path d={shape} />
          </clipPath>
        </defs>
        <path d={shape} transform="translate(0 8)" fill="#4f2d06" />
        <path d={shape} fill="url(#dwPlateEdge)" />
        <path d={shape} transform={inset(0.965, 0.92)} fill="url(#dwPlateRim)" />
        <path d={shape} transform={inset(0.93, 0.84)} fill="url(#dwPlateFace)" stroke="#ffe9a0" strokeWidth="1.6" />
        <g clipPath="url(#dwPlateClip)">
          <rect x="0" y="0" width="80" height="190" fill="rgba(255,255,255,0.25)" transform="skewX(-20)" style={{ animation: 'dw-shine 5s ease-in-out infinite' }} />
        </g>
        <g fill="#fffbe6" stroke="#c9891f" strokeWidth="1.2">
          <path d="M2 95 L12 84 L22 95 L12 106 Z" />
          <path d="M398 95 L388 84 L378 95 L388 106 Z" />
        </g>
        <g fontFamily="Georgia, 'Times New Roman', serif" fontSize="50" fontWeight="700" fill="url(#dwPlateText)" stroke="#4f2d06" strokeWidth="0.8" textAnchor="middle">
          <text x="200" y="90" textLength="185" lengthAdjust="spacingAndGlyphs">SHUBH</text>
          <text x="200" y="142" textLength="255" lengthAdjust="spacingAndGlyphs">DEEPAWALI</text>
        </g>
      </svg>
    </div>
  );
}

/* ── Rangoli lotus behind the plate ──────────────────────────────────── */
function Rangoli({ left, top, width, scale = 1, rotate = 0, hue = 0 }) {
  const colors = ['#e83e8c', '#ff8a3d', '#ffd45a', '#8a3fd1'];
  return (
    <svg
      viewBox="-60 -40 120 60"
      style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, width: `${width}%`, transform: `rotate(${rotate}deg) scale(${scale})`, overflow: 'visible' }}
    >
      <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: `dw-bob ${3.4 + hue}s ease-in-out infinite` }}>
        {[-60, -35, -12, 12, 35, 60].map((a, i) => (
          <path
            key={a}
            transform={`rotate(${a})`}
            d="M0 0 C -14 -10 -14 -30 0 -40 C 14 -30 14 -10 0 0 Z"
            fill={colors[(i + hue) % colors.length]}
            stroke="#ffe08a"
            strokeWidth="1.2"
          />
        ))}
        <path d="M0 0 C -9 -8 -9 -22 0 -30 C 9 -22 9 -8 0 0 Z" fill="#ff5fa2" stroke="#ffe08a" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* ── Bottom marigold clusters ────────────────────────────────────────── */
const POMPOM_TONES = {
  orange: { outer: '#e8780c', mid: '#ff9a1a', inner: '#ffbb4d', edge: '#b84f00' },
  yellow: { outer: '#e5a800', mid: '#ffc81f', inner: '#ffe27a', edge: '#a87800' },
};

/* Layered-petal marigold bloom */
function PomPom({ x, y, r, tone }) {
  const c = POMPOM_TONES[tone];
  const rings = [
    { n: 18, at: 0.66, rx: 0.27, ry: 0.36, fill: c.outer, off: 0 },
    { n: 14, at: 0.5, rx: 0.25, ry: 0.32, fill: c.mid, off: 9 },
    { n: 10, at: 0.34, rx: 0.22, ry: 0.28, fill: c.mid, off: 14 },
    { n: 7, at: 0.18, rx: 0.2, ry: 0.24, fill: c.inner, off: 22 },
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={c.edge} />
      {rings.map((ring, k) =>
        Array.from({ length: ring.n }, (_, i) => (
          <ellipse
            key={`${k}-${i}`}
            transform={`rotate(${ring.off + (i * 360) / ring.n})`}
            cy={-r * ring.at}
            rx={r * ring.rx}
            ry={r * ring.ry}
            fill={ring.fill}
            stroke={c.edge}
            strokeWidth="0.6"
          />
        ))
      )}
      <circle r={r * 0.09} fill={c.edge} opacity="0.75" />
      <circle r={r} fill="url(#dwPomShade)" />
      <circle r={r} fill="url(#dwPomLight)" />
    </g>
  );
}

/* Positions mirror the reference: loose arcs of single blooms flanking the plate, back to front */
const MARIGOLDS = [
  { x: 318, y: 694, r: 24, tone: 'yellow' },
  { x: 722, y: 694, r: 24, tone: 'yellow' },
  { x: 330, y: 650, r: 26, tone: 'orange' },
  { x: 702, y: 650, r: 26, tone: 'orange' },
  { x: 300, y: 628, r: 28, tone: 'orange' },
  { x: 722, y: 628, r: 27, tone: 'orange' },
  { x: 252, y: 666, r: 28, tone: 'orange' },
  { x: 752, y: 654, r: 28, tone: 'orange' },
  { x: 771, y: 672, r: 30, tone: 'orange' },
  { x: 292, y: 684, r: 30, tone: 'orange' },
  { x: 730, y: 684, r: 30, tone: 'orange' },
  { x: 349, y: 690, r: 29, tone: 'orange' },
  { x: 678, y: 690, r: 29, tone: 'orange' },
];

function MarigoldClusters() {
  return (
    <svg viewBox="0 0 1000 750" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="dwPomShade" cx="50%" cy="50%" r="55%">
          <stop offset="60%" stopColor="#5a1a00" stopOpacity="0" />
          <stop offset="100%" stopColor="#5a1a00" stopOpacity="0.45" />
        </radialGradient>
        <radialGradient id="dwPomLight" cx="35%" cy="28%" r="55%">
          <stop offset="0%" stopColor="#fff2c8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff2c8" stopOpacity="0" />
        </radialGradient>
        <filter id="dwBlur"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      {MARIGOLDS.map((f, i) => (
        <ellipse key={`s${i}`} cx={f.x + 3} cy={f.y + f.r * 0.85} rx={f.r * 0.95} ry={f.r * 0.25} fill="#2a1408" opacity="0.4" filter="url(#dwBlur)" />
      ))}
      {MARIGOLDS.map((f, i) => <PomPom key={i} {...f} />)}
    </svg>
  );
}

/* Contact shadows and light pools that tie every object to the floor */
function GroundShadows() {
  const dark = [
    { cx: 109, cy: 559, rx: 38, ry: 6, o: 0.6 },
    { cx: 203, cy: 559, rx: 42, ry: 6.5, o: 0.6 },
    { cx: 305, cy: 559, rx: 38, ry: 6, o: 0.6 },
    { cx: 113, cy: 670, rx: 60, ry: 8, o: 0.45 },
    { cx: 914, cy: 670, rx: 60, ry: 8, o: 0.45 },
    { cx: 513, cy: 712, rx: 180, ry: 11, o: 0.5 },
  ];
  return (
    <svg viewBox="0 0 1000 750" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        <filter id="dwShadowBlur"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="dwStreakBlur"><feGaussianBlur stdDeviation="10" /></filter>
        <radialGradient id="dwFloorGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb23a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffb23a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dwStreak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb23a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffb23a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* glossy reflections of the diyas and the plate */}
      {[113, 914].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="672" rx="90" ry="22" fill="url(#dwFloorGlow)" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'dw-glow 1.4s ease-in-out infinite' }} />
          <rect x={cx - 14} y="675" width="28" height="75" fill="url(#dwStreak)" filter="url(#dwStreakBlur)" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'dw-glow 1.4s ease-in-out infinite' }} />
        </g>
      ))}
      <ellipse cx="513" cy="735" rx="160" ry="16" fill="#e2a83a" opacity="0.28" filter="url(#dwStreakBlur)" />
      {dark.map((s, i) => (
        <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={i < 3 ? '#0d0314' : '#2a1408'} opacity={s.o} filter="url(#dwShadowBlur)" />
      ))}
    </svg>
  );
}

/**
 * Diwali Design - works in both Instagram and Google Reviews modes
 * @param {number} props.followers - Instagram follower count or Google review count
 * @param {number} props.todayGrowth - Growth for Instagram mode
 * @param {string} props.username - Instagram username or Google business name
 * @param {string} props.platform - 'instagram' or 'google'
 * @param {number} props.rating - Google rating
 * @param {string} props.platformLabel - Platform-specific label
 * @param {string} props.googleReviewUrl - Business Google review URL used for the QR
 */
export default function DesignDiwali({
  followers,
  todayGrowth = 0,
  username,
  profilePictureUrl,
  platform = 'instagram',
  rating,
  platformLabel,
  googleReviewUrl,
}) {
  const animatedCount = useAnimatedCount(followers);
  const isGoogle = platform === 'google';
  const countText = formatCount(animatedCount);
  const countSize = Math.min(15, 62 / Math.max(countText.length, 1));
  const handle = isGoogle ? username || 'Our Business' : `@${username}`;
  const handleSize = Math.max(1.9, Math.min(3.4, 38 / (handle.length * 0.62)));

  const embers = useMemo(() => {
    const rand = rng(5);
    return Array.from({ length: 26 }, () => ({
      left: rand() * 100,
      top: 45 + rand() * 50,
      size: 0.3 + rand() * 0.45,
      dur: 5 + rand() * 6,
      delay: rand() * 8,
      drift: (rand() - 0.5) * 8,
    }));
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        containerType: 'size',
        background: 'radial-gradient(ellipse at 50% 40%, #6a2590 0%, #45155f 45%, #240a38 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(100cqw, 133.333cqh)',
          aspectRatio: '4 / 3',
          containerType: 'inline-size',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          color: '#fff',
        }}
      >
        {/* Velvet folds (extend past the 4:3 stage so wide screens stay filled) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '-60%',
            right: '-60%',
            background:
              'repeating-linear-gradient(100deg, rgba(0,0,0,0.22) 0 4%, rgba(255,255,255,0.05) 7%, rgba(0,0,0,0) 10%, rgba(0,0,0,0.18) 13%)',
            animation: 'dw-velvet 14s ease-in-out infinite alternate',
          }}
        />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '-60%', right: '-60%', background: 'radial-gradient(ellipse at 50% 45%, rgba(255,170,60,0.12) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)' }} />

        {/* Mandalas */}
        <Mandala style={{ left: '-32%', top: '4%', width: '26%' }} reverse duration={150} opacity={0.3} />
        <Mandala style={{ right: '-32%', top: '4%', width: '26%' }} reverse duration={150} opacity={0.3} />
        <Mandala style={{ left: '-30%', bottom: '14%', width: '26%' }} duration={130} opacity={0.28} />
        <Mandala style={{ right: '-30%', bottom: '14%', width: '26%' }} duration={130} opacity={0.28} />
        <Mandala style={{ left: '-9%', top: '-6%', width: '28%' }} duration={140} />
        <Mandala style={{ left: '36%', top: '-12%', width: '30%' }} reverse duration={160} opacity={0.3} />
        <Mandala style={{ right: '-9%', top: '-5%', width: '28%' }} duration={150} />
        <Mandala style={{ right: '1%', top: '21%', width: '36%' }} reverse duration={130} opacity={0.4} />
        <Mandala style={{ left: '-8%', bottom: '8%', width: '24%' }} reverse duration={120} opacity={0.3} />
        <Mandala style={{ right: '-7%', bottom: '3%', width: '26%' }} duration={140} opacity={0.32} />

        {/* Arch alcove */}
        <svg viewBox="0 0 1000 750" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="dwArch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe08a" />
              <stop offset="100%" stopColor="#b9801f" />
            </linearGradient>
          </defs>
          <path
            d="M118 548 L118 250 Q118 205 150 185 Q175 168 195 130 Q205 112 215 130 Q235 168 262 185 Q292 205 292 250 L292 548 Z"
            fill="rgba(20,5,32,0.55)"
            stroke="url(#dwArch)"
            strokeWidth="3"
          />
          <path
            d="M130 548 L130 252 Q130 215 158 197 Q184 180 205 140 Q226 180 252 197 Q280 215 280 252 L280 548"
            fill="none"
            stroke="#d9a441"
            strokeWidth="1.2"
            strokeDasharray="3 4"
          />
        </svg>

        {/* Floating embers */}
        {embers.map((e, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${e.left}%`,
              top: `${e.top}%`,
              width: `${e.size}cqw`,
              height: `${e.size}cqw`,
              borderRadius: '50%',
              background: '#ffd45a',
              boxShadow: '0 0 1cqw #ffb23a',
              '--drift': e.drift,
              opacity: 0,
              animation: `dw-ember ${e.dur}s ease-out ${e.delay}s infinite`,
            }}
          />
        ))}

        <Fireworks />


        {/* Handle + count */}
        <div style={{ position: 'absolute', left: '32%', top: '24.5%', width: '38%', display: 'flex', alignItems: 'center', gap: '1cqw' }}>
          {isGoogle ? (
            <span style={{ fontSize: `${handleSize + 0.4}cqw`, filter: 'drop-shadow(0 0 0.6cqw #ffb23a)' }}>🏪</span>
          ) : (
            <ProfileAvatar
              url={profilePictureUrl}
              size="4.2cqw"
              color="#ffd96b"
              fallback={<span style={{ fontSize: `${handleSize + 0.4}cqw`, filter: 'drop-shadow(0 0 0.6cqw #ffb23a)' }}>📸</span>}
            />
          )}
          <span
            style={{
              fontSize: `${handleSize}cqw`,
              fontWeight: 700,
              color: '#ffd96b',
              textShadow: '0 0 1.4cqw rgba(255,190,60,0.55)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {handle}
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '31%',
            top: '31%',
            width: '40%',
            textAlign: 'center',
            fontSize: `${countSize}cqw`,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontFamily: "Georgia, 'Times New Roman', serif",
            background: GOLD_TEXT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'dw-text-glow 2.4s ease-in-out infinite',
          }}
        >
          {countText}
        </div>

        <div style={{ position: 'absolute', left: '31%', top: '57.5%', width: '36%', textAlign: 'center' }}>
          {isGoogle ? (
            <>
              <div style={{ fontSize: '3cqw', color: '#ffd45a', letterSpacing: '0.4cqw', textShadow: '0 0 1.2cqw rgba(255,190,60,0.7)' }}>★★★★★</div>
              <div style={{ fontSize: '1.9cqw', fontWeight: 700, color: '#ffe59a', letterSpacing: '0.2cqw', textTransform: 'uppercase', lineHeight: 1.3 }}>
                {rating ? rating.toFixed(1) : '5.0'} · {platformLabel || 'Google Reviews'}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '2.6cqw', fontWeight: 700, color: '#ffe59a', letterSpacing: '0.7cqw', textTransform: 'uppercase', textShadow: '0 0 1.2cqw rgba(255,190,60,0.5)' }}>
                {platformLabel || 'Followers'}
              </div>
              {todayGrowth > 0 && (
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '1.1cqw',
                    padding: '0.5cqw 2cqw',
                    borderRadius: '99cqw',
                    fontSize: '2cqw',
                    fontWeight: 700,
                    color: '#ffe59a',
                    border: '0.25cqw solid rgba(255,215,100,0.6)',
                    background: 'rgba(255,190,60,0.15)',
                  }}
                >
                  🎆 +{todayGrowth} Today
                </div>
              )}
            </>
          )}
        </div>

        {/* QR panel */}
        <div
          style={{
            position: 'absolute',
            left: '70.5%',
            top: '23.5%',
            width: '19.5%',
            padding: '1.5cqw',
            boxSizing: 'border-box',
            borderRadius: '2cqw',
            background: 'linear-gradient(145deg, #5a2a1e, #3a1a14)',
            border: '0.35cqw solid #d9a441',
            animation: 'dw-pulse-ring 3s ease-in-out infinite',
          }}
        >
          <div style={{ background: '#fff8ea', borderRadius: '1cqw', padding: '1cqw', lineHeight: 0 }}>
            <QRCodeSVG
              value={isGoogle ? googleReviewUrl || 'https://g.page/r/google-review' : `https://instagram.com/${username}`}
              style={{ width: '100%', height: 'auto' }}
              fgColor="#2a0b3d"
              bgColor="#fff8ea"
              level="M"
            />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '67.5%',
            top: '60.5%',
            width: '25.5%',
            textAlign: 'center',
            fontSize: '1.6cqw',
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: '0.2cqw',
            textTransform: 'uppercase',
            color: '#f4d9a0',
          }}
        >
          {isGoogle ? 'Scan to review us' : 'Scan to connect'}
          <br />
          &amp; join the celebration
        </div>

        {/* Diyas flanking the QR */}
        <Diya left={66} top={47.5} width={8} delay={0.2} />
        <Diya left={87.4} top={47.5} width={8} delay={0.6} />

        {/* Marble floor */}
        <div
          style={{
            position: 'absolute',
            left: '-60%',
            right: '-60%',
            bottom: 0,
            height: '16.7%',
            background:
              'linear-gradient(180deg, #b9aea4 0%, #e6dfd8 5%, #f4f0ec 35%, #ece6e0 70%, #ddd4cb 100%)',
            borderTop: '0.25cqw solid #6e5434',
            boxShadow: '0 -1.2cqw 3cqw rgba(0,0,0,0.45)',
          }}
        >
          <svg viewBox="0 0 1000 125" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}>
            <path d="M0 55 C 160 30 300 80 470 52 S 760 28 1000 70" fill="none" stroke="#8d7f73" strokeWidth="1" />
            <path d="M0 98 C 120 70 260 105 420 80" fill="none" stroke="#a39588" strokeWidth="0.8" />
            <path d="M560 125 C 650 85 800 105 940 60" fill="none" stroke="#a39588" strokeWidth="0.8" />
            <path d="M330 125 C 380 100 470 112 520 90" fill="none" stroke="#b3a699" strokeWidth="0.7" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(60,30,80,0.28) 0%, rgba(255,255,255,0) 28%)' }} />
        </div>

        {/* Plate, lotus and marigolds resting on the floor, in the order they overlap in the reference */}
        <GroundShadows />
        <Rangoli left={42.3} top={70} width={18} />
        <Rangoli left={31} top={78.7} width={12} rotate={-25} hue={1} />
        <Rangoli left={60} top={78.7} width={12} rotate={25} hue={2} />
        <Nameplate />
        <MarigoldClusters />

        <Cracker left={7.8} top={63.5} width={6.2} seed={3} delay={0} lightning="left" />
        <Cracker left={16.8} top={62} width={7} seed={8} delay={0.3} />
        <Cracker left={27.3} top={63} width={6.4} seed={14} delay={0.6} lightning="right" />

        <Diya left={6.3} top={78.5} width={10} delay={0.1} />
        <Diya left={86.4} top={78.5} width={10} delay={0.5} />

        <Garlands />
      </div>
    </div>
  );
}
