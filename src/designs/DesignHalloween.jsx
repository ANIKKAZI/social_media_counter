/* Halloween Special - haunted night scene: glowing jack-o'-lantern, floating ghost, flying bats, drifting fog and leaves */
import React, { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { formatCount, ProfileAvatar } from '../components/shared';

if (typeof document !== 'undefined' && !document.head.querySelector('style[data-halloween]')) {
  const tag = document.createElement('style');
  tag.setAttribute('data-halloween', 'true');
  tag.textContent = `
    @keyframes hw-float {
      0%, 100% { transform: translate(0, 0) rotate(-3deg); }
      50%      { transform: translate(6px, -20px) rotate(3deg); }
    }
    @keyframes hw-flicker {
      0%   { opacity: 0.86; }
      8%   { opacity: 1; }
      14%  { opacity: 0.72; }
      22%  { opacity: 0.96; }
      35%  { opacity: 0.8; }
      48%  { opacity: 1; }
      60%  { opacity: 0.74; }
      72%  { opacity: 0.98; }
      85%  { opacity: 0.82; }
      100% { opacity: 0.9; }
    }
    @keyframes hw-flame {
      0%, 100% { transform: scale(1, 1) skewX(0deg); }
      25%      { transform: scale(0.92, 1.1) skewX(4deg); }
      50%      { transform: scale(1.05, 0.94) skewX(-3deg); }
      75%      { transform: scale(0.96, 1.07) skewX(3deg); }
    }
    @keyframes hw-fly {
      from { transform: translateX(-180px); }
      to   { transform: translateX(1700px); }
    }
    @keyframes hw-fly-back {
      from { transform: translateX(1700px); }
      to   { transform: translateX(-180px); }
    }
    @keyframes hw-bob {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-12px); }
    }
    @keyframes hw-flap {
      0%, 100% { transform: rotate(-16deg) scaleY(1); }
      50%      { transform: rotate(24deg) scaleY(0.72); }
    }
    @keyframes hw-fog {
      from { transform: translateX(-9%); }
      to   { transform: translateX(9%); }
    }
    @keyframes hw-fall {
      0%   { transform: translateY(-4cqw); opacity: 0; }
      8%   { opacity: 1; }
      92%  { opacity: 1; }
      100% { transform: translateY(58cqw); opacity: 0; }
    }
    @keyframes hw-sway {
      from { transform: translateX(-2.6cqw) rotate(-45deg); }
      to   { transform: translateX(2.6cqw) rotate(55deg); }
    }
    @keyframes hw-card-glow {
      0%, 100% { border-color: rgba(168, 85, 247, 0.9); box-shadow: 0 0 1.4cqw rgba(168, 85, 247, 0.55), inset 0 0 1.2cqw rgba(168, 85, 247, 0.25); }
      50%      { border-color: rgba(255, 138, 26, 0.95); box-shadow: 0 0 2.2cqw rgba(255, 138, 26, 0.6), inset 0 0 1.4cqw rgba(255, 138, 26, 0.3); }
    }
    @keyframes hw-count-glow {
      0%, 100% { filter: drop-shadow(0 0 1cqw rgba(255, 138, 20, 0.55)) drop-shadow(0 0.3cqw 0 rgba(150, 60, 0, 0.9)); }
      50%      { filter: drop-shadow(0 0 2.2cqw rgba(255, 150, 30, 0.95)) drop-shadow(0 0.3cqw 0 rgba(150, 60, 0, 0.9)); }
    }
    @keyframes hw-ember {
      0%   { transform: translateY(0); opacity: 0; }
      20%  { opacity: 0.9; }
      100% { transform: translateY(-9cqw); opacity: 0; }
    }
    @keyframes hw-drip {
      0%   { transform: translateY(0) scaleY(0.6); opacity: 0; }
      15%  { opacity: 1; }
      80%  { opacity: 1; }
      100% { transform: translateY(3.2cqw) scaleY(1.2); opacity: 0; }
    }
    @keyframes hw-window {
      0%, 100% { opacity: 1; }
      40% { opacity: 0.55; }
      60% { opacity: 0.95; }
    }
    @keyframes hw-moon {
      0%, 100% { opacity: 0.75; }
      50%      { opacity: 1; }
    }
    @keyframes hw-witch {
      0%, 100% { transform: translate(0, 0) rotate(-2deg); }
      50%      { transform: translate(-14px, 8px) rotate(2deg); }
    }
  `;
  document.head.appendChild(tag);
}

/* Deterministic random so re-renders never reshuffle the decorations */
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SILHOUETTE = '#0d0618';
const LEAF_COLORS = ['#e8741a', '#c9561a', '#f2a03a', '#a8431a'];
const LEAF_PATH = 'M0 -9 C 7 -7 9 3 0 11 C -9 3 -7 -7 0 -9 Z';

/* ── Pumpkin (optionally carved and glowing) ─────────────────────────── */
function Pumpkin({ x, y, w, jack = false, delay = 0, tilt = 0 }) {
  const s = w / 200;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
      {jack && (
        <ellipse cx="0" cy="-70" rx="190" ry="140" fill="url(#hwHalo)" style={{ animation: `hw-flicker 2.7s linear ${delay}s infinite` }} />
      )}
      {[[-62, 62, 40], [62, 62, 40], [-34, 70, 44], [34, 70, 44], [0, 72, 42]].map(([cx, ry, rx], i) => (
        <ellipse key={i} cx={cx} cy={-ry} rx={rx} ry={ry + (i > 1 ? 4 : 0)} fill="url(#hwPumpkin)" stroke="#7a2406" strokeOpacity="0.55" strokeWidth="2" />
      ))}
      <path d="M-10 -142 C -12 -160 -2 -172 12 -176 L 20 -166 C 10 -164 6 -156 8 -142 Z" fill="#4d3a16" stroke="#2a1e0a" strokeWidth="2" />
      {jack ? (
        <g style={{ animation: `hw-flicker 2.7s linear ${delay + 0.4}s infinite`, filter: 'drop-shadow(0 0 7px #ffb02a)' }}>
          <path d="M-68 -82 L-30 -82 L-50 -118 Z" fill="url(#hwFace)" stroke="#5a1a04" strokeWidth="2" strokeLinejoin="round" />
          <path d="M30 -82 L68 -82 L50 -118 Z" fill="url(#hwFace)" stroke="#5a1a04" strokeWidth="2" strokeLinejoin="round" />
          <path d="M-9 -64 L9 -64 L0 -80 Z" fill="url(#hwFace)" stroke="#5a1a04" strokeWidth="2" strokeLinejoin="round" />
          <path d="M-74 -56 Q 0 -14 74 -56 Q 66 -24 34 -20 L 24 -34 L 12 -18 L 0 -32 L -12 -18 L -24 -34 L -34 -20 Q -66 -24 -74 -56 Z" fill="url(#hwFace)" stroke="#5a1a04" strokeWidth="2" strokeLinejoin="round" />
        </g>
      ) : (
        <ellipse cx="-30" cy="-98" rx="14" ry="28" fill="#fff2c8" opacity="0.14" />
      )}
    </g>
  );
}

/* ── Bat (wings flap, whole bat drifts across the sky) ───────────────── */
function BatWing() {
  return (
    <g style={{ transformBox: 'fill-box', transformOrigin: '100% 60%', animation: 'hw-flap 0.5s ease-in-out infinite' }}>
      <path d="M-2 -3 C -10 -14 -26 -16 -40 -8 C -34 -6 -31 -2 -30 4 C -26 -1 -21 -1 -18 6 C -14 1 -9 2 -4 7 Z" fill="#0a0412" />
    </g>
  );
}

function Bat({ y, scale = 1.5, dur, delay, dir = 1, bob = 0 }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <g style={{ animation: `${dir > 0 ? 'hw-fly' : 'hw-fly-back'} ${dur}s linear ${delay}s infinite` }}>
        <g style={{ animation: `hw-bob 3.6s ease-in-out ${bob}s infinite` }}>
          <g transform={`scale(${scale * dir} ${scale})`}>
            <BatWing />
            <g transform="scale(-1 1)"><BatWing /></g>
            <ellipse cx="0" cy="1" rx="4.6" ry="7" fill="#0a0412" />
            <path d="M-4 -6 L-3 -13 L0 -7 Z M4 -6 L3 -13 L0 -7 Z" fill="#0a0412" />
            <circle cx="-2.4" cy="-2" r="1.3" fill="#ff9a1a" style={{ filter: 'drop-shadow(0 0 2px #ff9a1a)' }} />
            <circle cx="2.4" cy="-2" r="1.3" fill="#ff9a1a" style={{ filter: 'drop-shadow(0 0 2px #ff9a1a)' }} />
          </g>
        </g>
      </g>
    </g>
  );
}

/* ── Haunted castle silhouette ───────────────────────────────────────── */
function Castle() {
  const win = (x, y, w, h, d) => (
    <rect key={`${x}${y}`} x={x} y={y} width={w} height={h} rx="2" fill="#ff9a2a" style={{ filter: 'drop-shadow(0 0 4px #ff9a2a)', animation: `hw-window ${3 + d}s ease-in-out ${d}s infinite` }} />
  );
  return (
    <g fill="#120822">
      <rect x="100" y="238" width="172" height="90" />
      <rect x="140" y="120" width="36" height="200" />
      <path d="M138 120 L178 120 L158 66 Z" />
      <rect x="190" y="200" width="42" height="120" />
      <path d="M186 200 L236 200 L211 158 Z" />
      <rect x="98" y="192" width="32" height="130" />
      <path d="M94 192 L134 192 L116 150 Z" />
      <rect x="246" y="246" width="24" height="76" />
      <path d="M242 246 L274 246 L258 214 Z" />
      <rect x="62" y="262" width="26" height="60" />
      <path d="M58 262 L92 262 L75 234 Z" />
      {win(153, 176, 9, 22, 0)}
      {win(110, 214, 8, 18, 0.7)}
      {win(206, 232, 9, 20, 1.3)}
      {win(164, 276, 10, 18, 0.4)}
      {win(120, 280, 9, 16, 1.9)}
      {win(252, 270, 7, 14, 1)}
      {win(71, 286, 7, 14, 1.6)}
    </g>
  );
}

/* ── Ghost ───────────────────────────────────────────────────────────── */
function Ghost() {
  return (
    <g transform="translate(392 312)">
      <g style={{ animation: 'hw-float 4.2s ease-in-out infinite', filter: 'drop-shadow(0 0 14px rgba(210,170,255,0.7))' }}>
        <path
          d="M-30 -8 C -32 -34 -14 -48 4 -46 C 26 -44 36 -26 32 -6 C 30 8 26 18 22 26 C 14 40 -6 46 -22 54 C -36 62 -52 66 -62 70 C -48 58 -44 44 -36 32 C -28 18 -28 6 -30 -8 Z"
          fill="url(#hwGhost)"
        />
        <path d="M30 -4 C 42 -14 50 -20 56 -16 C 52 -8 44 -2 34 6 Z" fill="url(#hwGhost)" />
        <ellipse cx="-6" cy="-22" rx="4" ry="5.5" fill="#1b1030" />
        <ellipse cx="14" cy="-22" rx="4" ry="5.5" fill="#1b1030" />
        <circle cx="-5" cy="-24" r="1.4" fill="#fff" />
        <circle cx="15" cy="-24" r="1.4" fill="#fff" />
        <path d="M-4 -8 Q 5 2 14 -8" fill="none" stroke="#1b1030" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-16" cy="-10" rx="5" ry="3" fill="#ff9ac8" opacity="0.5" />
        <ellipse cx="24" cy="-10" rx="5" ry="3" fill="#ff9ac8" opacity="0.5" />
      </g>
    </g>
  );
}

/* ── Lantern with a living flame ─────────────────────────────────────── */
function Lantern() {
  return (
    <g>
      <ellipse cx="385" cy="560" rx="70" ry="95" fill="url(#hwHalo)" opacity="0.7" style={{ animation: 'hw-flicker 1.9s linear 0.3s infinite' }} />
      <circle cx="385" cy="456" r="8" fill="none" stroke="#1b1216" strokeWidth="4" />
      <path d="M356 486 L385 464 L414 486 Z" fill="#1b1216" stroke="#3b2c33" strokeWidth="2" />
      <rect x="364" y="486" width="42" height="112" rx="4" fill="url(#hwLantern)" stroke="#1b1216" strokeWidth="5" />
      <line x1="385" y1="486" x2="385" y2="598" stroke="#1b1216" strokeWidth="3" />
      <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'hw-flame 0.8s ease-in-out infinite' }}>
        <path d="M385 534 C 394 548 398 558 392 568 C 388 574 382 574 378 568 C 372 558 378 548 385 534 Z" fill="#ffd86a" style={{ filter: 'drop-shadow(0 0 5px #ff9a2a)' }} />
        <path d="M385 552 C 389 558 390 563 387 567 C 385 569 383 569 382 567 C 380 563 382 558 385 552 Z" fill="#fffbe6" />
      </g>
      <rect x="358" y="598" width="54" height="14" rx="3" fill="#1b1216" stroke="#3b2c33" strokeWidth="2" />
      <path d="M362 612 L358 632 M408 612 L412 632" stroke="#1b1216" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/* ── Static fences, crosses, trees ───────────────────────────────────── */
function Fence({ x0, count, gap, topY, rise, baseY, tone }) {
  return (
    <g fill={tone}>
      {Array.from({ length: count }, (_, i) => {
        const x = x0 + i * gap;
        const top = topY - i * rise;
        return <path key={i} d={`M${x} ${baseY} L${x} ${top + 12} L${x + 7} ${top} L${x + 14} ${top + 12} L${x + 14} ${baseY} Z`} />;
      })}
      <rect x={x0 - 6} y={topY + 24} width={count * gap + 6} height="6" transform={`rotate(${-Math.atan(rise / gap) * 57.3} ${x0} ${topY + 27})`} />
      <rect x={x0 - 6} y={topY + 50} width={count * gap + 6} height="6" transform={`rotate(${-Math.atan(rise / gap) * 57.3} ${x0} ${topY + 53})`} />
    </g>
  );
}

function Trees() {
  return (
    <g fill="none" strokeLinecap="round" stroke="#0e0619">
      <path d="M-20 250 C 10 160 50 100 120 76 C 190 52 280 30 420 -6" strokeWidth="30" />
      <path d="M90 82 C 120 40 150 20 190 10" strokeWidth="12" />
      <path d="M200 56 C 230 70 262 74 300 70" strokeWidth="9" />
      <path d="M20 170 C 40 190 40 210 30 240" strokeWidth="14" />
      <path d="M-20 250 C 10 160 50 100 120 76 C 190 52 280 30 420 -6" strokeWidth="2" stroke="#8a3d14" opacity="0.5" transform="translate(2 -10)" />
      <path d="M1420 300 C 1390 220 1360 140 1320 100 C 1290 70 1250 40 1200 -10" strokeWidth="26" />
      <path d="M1340 130 C 1300 110 1270 120 1240 140" strokeWidth="9" />
      <path d="M1350 210 C 1320 200 1300 210 1280 230" strokeWidth="8" />
      <path d="M1312 90 C 1290 60 1300 30 1330 10" strokeWidth="8" />
    </g>
  );
}

function Leaf({ x, y, r = 0, s = 1, c }) {
  return <path d={LEAF_PATH} transform={`translate(${x} ${y}) rotate(${r}) scale(${s * 0.9} ${s * 0.5})`} fill={c} />;
}

function Scene() {
  const planks = useMemo(() => {
    const rows = [645, 662, 682, 706, 735, 772];
    const seams = [];
    rows.slice(0, -1).forEach((y, r) => {
      const y2 = rows[r + 1];
      const step = 230 + r * 60;
      for (let x = -1000 + ((r * 97) % step); x < 2400; x += step) {
        seams.push({ x, y1: y, y2 });
      }
    });
    return { rows, seams };
  }, []);

  return (
    <svg viewBox="0 0 1386 768" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <linearGradient id="hwSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a33" />
          <stop offset="50%" stopColor="#2a1050" />
          <stop offset="100%" stopColor="#1a0a2e" />
        </linearGradient>
        <radialGradient id="hwMoon" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#ffc662" />
          <stop offset="60%" stopColor="#f59a2c" />
          <stop offset="100%" stopColor="#d9731a" />
        </radialGradient>
        <radialGradient id="hwMoonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9a2a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff9a2a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hwHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9a1a" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#ff7a10" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ff7a10" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hwPumpkin" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffa23a" />
          <stop offset="55%" stopColor="#e8600f" />
          <stop offset="100%" stopColor="#8a2a08" />
        </radialGradient>
        <linearGradient id="hwFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff0a0" />
          <stop offset="100%" stopColor="#ffa31a" />
        </linearGradient>
        <linearGradient id="hwGhost" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#efd8ff" />
          <stop offset="100%" stopColor="#c79cff" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="hwLantern" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb04a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="hwFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d2d3c" />
          <stop offset="35%" stopColor="#2c1632" />
          <stop offset="100%" stopColor="#150921" />
        </linearGradient>
        <filter id="hwBlur"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="hwBlurS"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>

      {/* sky and moon */}
      <rect x="-1000" y="-1000" width="3400" height="1800" fill="url(#hwSky)" />
      <circle cx="1185" cy="120" r="190" fill="url(#hwMoonGlow)" style={{ animation: 'hw-moon 6s ease-in-out infinite' }} />
      <circle cx="1185" cy="120" r="92" fill="url(#hwMoon)" />
      <g fill="#c9651a" opacity="0.35">
        <circle cx="1160" cy="95" r="14" /><circle cx="1210" cy="140" r="18" /><circle cx="1150" cy="150" r="9" />
      </g>
      <ellipse cx="1080" cy="215" rx="120" ry="20" fill="#2a1450" opacity="0.7" filter="url(#hwBlur)" />
      <ellipse cx="1300" cy="200" rx="110" ry="24" fill="#2a1450" opacity="0.7" filter="url(#hwBlur)" />

      {/* witch on a broom across the moon */}
      <g style={{ animation: 'hw-witch 7s ease-in-out infinite' }}>
        <g fill={SILHOUETTE} stroke={SILHOUETTE}>
          <path d="M1138 152 L1250 106" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M1138 152 L1112 142 M1138 152 L1110 154 M1138 152 L1114 164" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M1170 138 C 1180 112 1198 104 1210 112 L 1216 132 C 1200 138 1184 144 1170 138 Z" stroke="none" />
          <path d="M1170 138 C 1154 142 1146 150 1140 158 C 1156 154 1166 152 1176 146 Z" stroke="none" />
          <path d="M1184 128 L1172 156" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="1208" cy="98" r="7" stroke="none" />
          <path d="M1190 98 L1230 98 L1212 94 L1204 66 Z" stroke="none" />
          <path d="M1204 112 L1236 110" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      </g>

      <Trees />

      {/* distant hills and castle */}
      <path d="M-1000 420 L-1000 700 L480 700 L480 430 Q 400 400 330 360 Q 260 306 160 318 Q 60 330 -40 420 Z" fill="#150a26" />
      <path d="M800 650 Q 900 590 980 600 Q 1100 580 1200 620 L 1400 630 L 2400 640 L 2400 700 L800 700 Z" fill="#150a26" />
      <Castle />

      {/* bats drifting across the sky */}
      <Bat y={170} scale={1.7} dur={70} delay={-30} dir={1} bob={0} />
      <Bat y={100} scale={1.2} dur={85} delay={-14} dir={1} bob={1} />
      <Bat y={138} scale={1.5} dur={64} delay={-24} dir={-1} bob={0.6} />
      <Bat y={345} scale={1.2} dur={92} delay={-18} dir={-1} bob={1.4} />

      {/* graveyard */}
      <Fence x0={425} count={6} gap={28} topY={528} rise={1} baseY={620} tone="#160c26" />
      <Fence x0={1012} count={10} gap={30} topY={596} rise={5} baseY={650} tone="#150b25" />
      <g fill={SILHOUETTE} transform="rotate(-2 53 500)">
        <rect x="42" y="350" width="22" height="310" rx="2" />
        <rect x="-30" y="420" width="140" height="22" rx="2" />
      </g>
      <g fill={SILHOUETTE} transform="rotate(3 1298 560)">
        <rect x="1288" y="456" width="20" height="200" rx="2" />
        <rect x="1250" y="516" width="140" height="18" rx="2" />
      </g>

      {/* wooden floor */}
      <rect x="-1000" y="645" width="3400" height="700" fill="url(#hwFloor)" />
      <g stroke="#0a0415" strokeWidth="2" opacity="0.8">
        {planks.rows.slice(1).map((y) => <line key={y} x1="-1000" y1={y} x2="2400" y2={y} />)}
        {planks.seams.map((s, i) => <line key={i} x1={s.x} y1={s.y1} x2={s.x} y2={s.y2} strokeWidth="1.5" />)}
      </g>
      <rect x="-1000" y="645" width="3400" height="4" fill="#8a4a5a" opacity="0.5" />
      <ellipse cx="222" cy="700" rx="230" ry="30" fill="url(#hwHalo)" style={{ animation: 'hw-flicker 2.7s linear 0.2s infinite' }} />
      <ellipse cx="385" cy="650" rx="70" ry="12" fill="url(#hwHalo)" style={{ animation: 'hw-flicker 1.9s linear 0.3s infinite' }} />
      <ellipse cx="1180" cy="700" rx="200" ry="22" fill="#ff8a2a" opacity="0.12" filter="url(#hwBlurS)" />
      <ellipse cx="700" cy="735" rx="360" ry="16" fill="#ff8a2a" opacity="0.07" filter="url(#hwBlurS)" />

      {/* pumpkins and lantern */}
      <Pumpkin x={48} y={642} w={140} delay={0.9} tilt={-4} />
      <Pumpkin x={222} y={650} w={268} jack delay={0} />
      <Pumpkin x={158} y={668} w={88} delay={0} tilt={4} />
      <Lantern />
      <Pumpkin x={428} y={652} w={92} />

      {/* leaves resting on the floor */}
      <Leaf x={518} y={638} r={-20} s={1.3} c="#c9561a" />
      <Leaf x={456} y={650} r={30} s={1} c="#e8741a" />
      <Leaf x={620} y={630} r={10} s={0.9} c="#a8431a" />
      <Leaf x={1055} y={654} r={-10} s={1.2} c="#e8741a" />
      <Leaf x={1228} y={612} r={40} s={1} c="#c9561a" />
      <Leaf x={1205} y={668} r={-30} s={1.3} c="#f2a03a" />
      <Leaf x={1308} y={654} r={15} s={1} c="#a8431a" />

      {/* foreground silhouettes */}
      <path d="M-60 768 L-60 690 Q 20 660 90 690 Q 150 702 210 744 L 260 768 Z" fill={SILHOUETTE} />
      <path d="M1450 768 L1450 706 Q 1380 672 1320 694 Q 1250 706 1200 752 L1170 768 Z" fill={SILHOUETTE} />

      <Ghost />
    </svg>
  );
}

/* ── Witch hat resting on the QR card ────────────────────────────────── */
function WitchHat() {
  return (
    <svg viewBox="0 0 1386 768" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <g transform="translate(1128 274) rotate(9) scale(1.3)">
        <path d="M-30 -3 C -26 -22 -14 -38 -4 -58 C 4 -72 24 -70 38 -58 C 28 -60 22 -52 24 -42 C 26 -24 30 -12 32 -3 Z" fill="#2c1850" stroke="#5b34a0" strokeWidth="1.5" />
        <path d="M-28 -12 L 30 -12 L 32 -3 L -30 -3 Z" fill="#ff8a1a" />
        <rect x="-5" y="-14" width="14" height="13" rx="2" fill="none" stroke="#ffd04a" strokeWidth="2.5" />
        <ellipse cx="0" cy="0" rx="54" ry="11" fill="#2a1448" stroke="#6a3cb8" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/* ── Drifting fog ────────────────────────────────────────────────────── */
function Fog() {
  const layers = [
    { top: '68%', h: '20%', o: 0.3, dur: 60, dir: 'alternate' },
    { top: '44%', h: '22%', o: 0.26, dur: 84, dir: 'alternate-reverse' },
    { top: '6%', h: '22%', o: 0.2, dur: 96, dir: 'alternate' },
  ];
  return layers.map((l, i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        top: l.top,
        height: l.h,
        left: '-30%',
        width: '160%',
        opacity: l.o,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 22% 50% at 25% 50%, rgba(175,135,235,0.55), transparent 100%), radial-gradient(ellipse 26% 45% at 58% 55%, rgba(190,150,240,0.45), transparent 100%), radial-gradient(ellipse 20% 50% at 85% 45%, rgba(255,150,70,0.25), transparent 100%)',
        animation: `hw-fog ${l.dur}s ease-in-out infinite ${l.dir}`,
      }}
    />
  ));
}

/* ── Falling leaves ──────────────────────────────────────────────────── */
function FallingLeaves() {
  const leaves = useMemo(() => {
    const rand = rng(31);
    return Array.from({ length: 14 }, (_, i) => ({
      left: rand() * 100,
      size: 1.3 + rand() * 1.1,
      fall: 16 + rand() * 12,
      sway: 3.2 + rand() * 2.6,
      delay: -rand() * 26,
      color: LEAF_COLORS[i % LEAF_COLORS.length],
    }));
  }, []);

  return leaves.map((l, i) => (
    <span
      key={i}
      style={{ position: 'absolute', top: 0, left: `${l.left}%`, pointerEvents: 'none', animation: `hw-fall ${l.fall}s linear ${l.delay}s infinite` }}
    >
      <span style={{ display: 'block', animation: `hw-sway ${l.sway}s ease-in-out ${l.delay}s infinite alternate` }}>
        <svg viewBox="-10 -12 20 24" style={{ width: `${l.size}cqw`, height: `${l.size * 1.2}cqw`, display: 'block' }}>
          <path d={LEAF_PATH} fill={l.color} />
          <path d="M0 -8 L0 10" stroke="#5a1f08" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </span>
    </span>
  ));
}

function MiniPumpkin({ size = 2.3 }) {
  return (
    <svg viewBox="-24 -26 48 40" style={{ width: `${size}cqw`, height: `${size * 0.83}cqw`, display: 'block' }}>
      <ellipse cx="-12" cy="0" rx="12" ry="12" fill="#e8600f" />
      <ellipse cx="12" cy="0" rx="12" ry="12" fill="#e8600f" />
      <ellipse cx="0" cy="0" rx="12" ry="13" fill="#ff8a1a" />
      <path d="M-2 -12 C -2 -18 2 -20 6 -22 L 8 -18 C 4 -17 3 -15 3 -12 Z" fill="#4d3a16" />
      <path d="M-8 -3 L-3 -3 L-5.5 -8 Z M3 -3 L8 -3 L5.5 -8 Z M-8 3 Q 0 11 8 3 L 5 7 L 2 4 L 0 8 L -2 4 L -5 7 Z" fill="#ffe27a" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 48 48" style={{ width: '3.7cqw', height: '3.7cqw', flexShrink: 0 }}>
      <defs>
        <linearGradient id="hwIg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="30%" stopColor="#fa7e1e" />
          <stop offset="55%" stopColor="#d62976" />
          <stop offset="80%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="12" fill="none" stroke="url(#hwIg)" strokeWidth="5" />
      <circle cx="24" cy="24" r="9" fill="none" stroke="url(#hwIg)" strokeWidth="5" />
      <circle cx="36" cy="12" r="3" fill="url(#hwIg)" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <div style={{ width: '3.7cqw', height: '3.7cqw', flexShrink: 0, borderRadius: '50%', background: '#fff', color: '#4285f4', fontWeight: 800, fontSize: '2.6cqw', lineHeight: '3.7cqw', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>G</div>
  );
}

const ORANGE_TEXT = 'linear-gradient(180deg, #ffe45a 0%, #ffb21a 45%, #ff7a0a 100%)';

/**
 * Halloween Design - works in both Instagram and Google Reviews modes
 * @param {number} props.followers - Instagram follower count or Google review count
 * @param {number} props.todayGrowth - Growth for Instagram mode
 * @param {string} props.username - Instagram username or Google business name
 * @param {string} props.platform - 'instagram' or 'google'
 * @param {number} props.rating - Google rating
 * @param {string} props.platformLabel - Platform-specific label
 * @param {string} props.googleReviewUrl - Business Google review URL used for the QR
 */
export default function DesignHalloween({
  followers,
  todayGrowth = 0,
  username,
  profilePictureUrl,
  platform = 'instagram',
  rating,
  platformLabel,
  googleReviewUrl,
}) {
  // Start at 0 so the count climbs up to the live total when the page loads
  const [liveTarget, setLiveTarget] = useState(0);
  useEffect(() => { setLiveTarget(followers || 0); }, [followers]);
  const animatedCount = useAnimatedCount(liveTarget, 2400);

  const isGoogle = platform === 'google';
  const countText = formatCount(animatedCount);
  const fullLength = Math.max(formatCount(followers || 0).length, countText.length, 1);
  const countSize = Math.min(15, 30 / (fullLength * 0.62));
  const handle = isGoogle ? username || 'Our Business' : `@${username}`;
  const handleSize = Math.min(2.5, 18 / (handle.length * 0.64));

  const embers = useMemo(() => {
    const rand = rng(9);
    return Array.from({ length: 14 }, () => ({
      left: 33 + rand() * 32,
      top: 38 + rand() * 24,
      size: 0.25 + rand() * 0.3,
      dur: 4 + rand() * 4,
      delay: -rand() * 8,
    }));
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        containerType: 'size',
        background: 'linear-gradient(180deg, #1a0a33 0%, #1a0a2e 60%, #120820 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(100cqw, 180.47cqh)',
          aspectRatio: '1386 / 768',
          containerType: 'inline-size',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          color: '#fff',
        }}
      >
        <Scene />
        <Fog />

        {/* Handle pill */}
        <div
          style={{
            position: 'absolute',
            left: '35.7%',
            top: '20.2%',
            width: '27.4%',
            height: '9.5%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.4cqw',
            padding: '0 1.6cqw',
            borderRadius: '2.2cqw',
            background: 'rgba(18, 8, 38, 0.82)',
            border: '0.1cqw solid rgba(168, 85, 247, 0.55)',
            boxShadow: '0 0 1.6cqw rgba(168, 85, 247, 0.35)',
          }}
        >
          {isGoogle ? <GoogleGlyph /> : <ProfileAvatar url={profilePictureUrl} size="3.9cqw" color="#a855f7" fallback={<InstagramGlyph />} />}
          <span style={{ fontSize: `${handleSize}cqw`, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {handle}
          </span>
        </div>

        {/* Count with ember sparks and dripping goo */}
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
              background: '#ffb02a',
              boxShadow: '0 0 0.8cqw #ff9a1a',
              opacity: 0,
              animation: `hw-ember ${e.dur}s ease-out ${e.delay}s infinite`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '29%',
            top: '34.5%',
            width: '40%',
            height: '25%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: `${countSize}cqw`,
              fontFamily: "'Arial Rounded MT Bold', 'Arial Black', Impact, Arial, sans-serif",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              background: ORANGE_TEXT,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'hw-count-glow 2.6s ease-in-out infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {countText}
          </div>
        </div>
        {[
          { left: 41.5, d: 0 },
          { left: 49, d: 1.3 },
          { left: 57, d: 0.7 },
        ].map((drop, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${drop.left}%`,
              top: '57.5%',
              width: '0.7cqw',
              height: '1.3cqw',
              borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
              background: '#ff9a1a',
              boxShadow: '0 0 0.8cqw rgba(255,138,20,0.8)',
              opacity: 0,
              animation: `hw-drip 3.4s ease-in ${drop.d}s infinite`,
            }}
          />
        ))}

        {/* Label, pumpkin divider, extra info */}
        <div style={{ position: 'absolute', left: '29%', top: '61.5%', width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9cqw' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.6cqw', width: '100%', justifyContent: 'center' }}>
            <span style={{ width: '4.6cqw', height: '0.18cqw', background: 'linear-gradient(90deg, transparent, #a855f7)' }} />
            <span style={{ fontSize: '2.1cqw', fontWeight: 600, letterSpacing: '0.5em', paddingLeft: '0.5em', color: '#d8c8ff', textTransform: 'uppercase', textShadow: '0 0 1cqw rgba(168,85,247,0.6)' }}>
              {isGoogle ? 'Reviews' : platformLabel || 'Followers'}
            </span>
            <span style={{ width: '4.6cqw', height: '0.18cqw', background: 'linear-gradient(270deg, transparent, #a855f7)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2cqw', width: '70%', justifyContent: 'center' }}>
            <span style={{ flex: 1, height: '0.15cqw', background: 'linear-gradient(90deg, transparent, #a855f7)' }} />
            <MiniPumpkin />
            <span style={{ flex: 1, height: '0.15cqw', background: 'linear-gradient(270deg, transparent, #a855f7)' }} />
          </div>

          {isGoogle ? (
            <div style={{ fontSize: '2.1cqw', fontWeight: 700, color: '#ffb02a', letterSpacing: '0.15em', textShadow: '0 0 1cqw rgba(255,138,20,0.6)' }}>
              ★★★★★ <span style={{ color: '#fff' }}>{rating ? rating.toFixed(1) : '5.0'}</span>
            </div>
          ) : (
            todayGrowth > 0 && (
              <div style={{ padding: '0.4cqw 1.8cqw', borderRadius: '2cqw', fontSize: '1.7cqw', fontWeight: 700, color: '#ffb02a', border: '0.15cqw solid rgba(255,138,20,0.6)', background: 'rgba(255,138,20,0.12)' }}>
                +{todayGrowth} Today
              </div>
            )
          )}
        </div>

        {/* QR card */}
        <div
          style={{
            position: 'absolute',
            left: '68.9%',
            top: '34.5%',
            width: '16.1%',
            boxSizing: 'border-box',
            padding: '1.8cqw 1.8cqw 1.5cqw',
            borderRadius: '1.7cqw',
            background: 'linear-gradient(180deg, rgba(40,18,70,0.92), rgba(24,10,44,0.95))',
            border: '0.18cqw solid rgba(168, 85, 247, 0.9)',
            animation: 'hw-card-glow 3.2s ease-in-out infinite',
          }}
        >
          <div style={{ background: '#fff', borderRadius: '0.9cqw', padding: '0.7cqw', lineHeight: 0 }}>
            <QRCodeSVG
              value={isGoogle ? googleReviewUrl || 'https://g.page/r/google-review' : `https://instagram.com/${username}`}
              style={{ width: '100%', height: 'auto' }}
              fgColor="#140a24"
              bgColor="#ffffff"
              level="M"
            />
          </div>
          <div style={{ marginTop: '1.3cqw', textAlign: 'center', fontSize: '1cqw', fontWeight: 500, lineHeight: 1.7, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#e6dcff' }}>
            {isGoogle ? 'Scan to review us' : 'Scan to connect'}
            <br />
            &amp; join the celebration
          </div>
        </div>
        <WitchHat />

        <FallingLeaves />
      </div>
    </div>
  );
}
