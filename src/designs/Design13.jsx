/* Design 13 – Full-Screen LaMetric LED Matrix Display
 * Giant dot-matrix counter dominates screen · dark housing · per-LED glow
 * Platform colour theming · QR + growth + live indicator
 */
import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { formatCount } from '../components/shared';

/* ── 5×7 dot-matrix glyph library ─────────────────────────────────────── */
const G = {
  '0': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,1,1],[1,0,1,0,1],[1,1,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '1': [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
  '2': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,1,1,0],[0,1,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  '3': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,1,1,0],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '4': [[0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],
  '5': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '6': [[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '7': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  '8': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '9': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0]],
  ',': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,1,0,0,0]],
  '+': [[0,0,0,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0]],
  '-': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
  ' ': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
};

function textToGrid(text) {
  const tokens = text.split('');
  const rows = 7;
  const grid = Array.from({ length: rows }, () => []);
  tokens.forEach((ch, ti) => {
    const glyph = G[ch] || G[' '];
    for (let r = 0; r < rows; r++) {
      if (ti > 0) grid[r].push(0);
      grid[r].push(...glyph[r]);
    }
  });
  return grid;
}

/* ── LED dot ──────────────────────────────────────────────────────────── */
function Dot({ on, px, gap, color, colorDim, glowS }) {
  return (
    <div style={{
      width: px, height: px,
      borderRadius: Math.max(2, px * 0.22),
      background: on ? color : colorDim,
      boxShadow: on ? glowS : 'none',
      transition: 'background 0.3s, box-shadow 0.3s',
    }} />
  );
}

/* ── LED matrix ──────────────────────────────────────────────────────── */
function LEDMatrix({ text, px, gap, color }) {
  const colorDim  = `${color}20`;
  const colorFill = `${color}dd`;
  const glowS = `0 0 ${px}px ${color}90, 0 0 ${px * 2.5}px ${color}40`;

  const grid = useMemo(() => textToGrid(text), [text]);
  const cols = grid[0]?.length || 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${px}px)`,
      gridTemplateRows: `repeat(7, ${px}px)`,
      gap: `${gap}px`,
    }}>
      {grid.flatMap((row, ri) =>
        row.map((on, ci) => (
          <Dot key={`${ri}-${ci}`} on={on} px={px} gap={gap} color={colorFill} colorDim={colorDim} glowS={glowS} />
        ))
      )}
    </div>
  );
}

/* ── CSS ─────────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes d13blink {
    0%,100% { opacity:1; }
    50%      { opacity:0.25; }
  }
  @keyframes d13scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
`;

/* ── Main component ──────────────────────────────────────────────────── */
export default function Design13({ followers, todayGrowth, username }) {
  const animated = useAnimatedCount(followers);

  /* Format with thousands commas */
  const countText = Math.floor(animated).toLocaleString();
  const growthText = `+${todayGrowth.toLocaleString()}`;

  /* LED pixel size — big enough to read clearly across a room */
  const PX  = 18;
  const GAP = 5;

  const COLOR = '#FF6B00';

  const scanlineBg = 'repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(255,255,255,0.013) 14px, rgba(255,255,255,0.013) 15px)';

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #080808 0%, #0a0a0a 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      color: '#fff',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{CSS}</style>

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: scanlineBg,
        zIndex: 0,
      }} />

      {/* Ambient glow bloom behind the counter */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '120%', height: '60%', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${COLOR}12 0%, transparent 65%)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── TOP BAR ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        background: 'rgba(0,0,0,0.6)',
        borderBottom: `1px solid ${COLOR}22`,
      }}>
        {/* Brand / platform */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* LaMetric-style coloured status dot cluster */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[COLOR, `${COLOR}55`, `${COLOR}22`].map((c, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: c,
                boxShadow: i === 0 ? `0 0 8px ${COLOR}` : 'none',
              }} />
            ))}
          </div>
          <span style={{
            fontSize: '12px', fontWeight: 700,
            color: `${COLOR}cc`, letterSpacing: '4px', textTransform: 'uppercase',
          }}>Followers Counter</span>
        </div>

        {/* Handle */}
        <span style={{
          fontSize: '14px', fontWeight: 400, color: '#aaaaaa',
          letterSpacing: '2px',
        }}>@{username}</span>

        {/* Live pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#4ade80', boxShadow: '0 0 10px #4ade80',
            animation: 'd13blink 2s infinite',
          }} />
          <span style={{
            fontSize: '11px', fontWeight: 700,
            color: '#4ade80', letterSpacing: '3px',
          }}>LIVE</span>
        </div>
      </div>

      {/* ── MAIN LED PANEL ────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '28px',
        position: 'relative', zIndex: 1,
        padding: '20px 40px',
      }}>

        {/* Housing bezel */}
        <div style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 15%, #080808 100%)',
          borderRadius: '18px',
          border: `1.5px solid #242424`,
          boxShadow: [
            '0 2px 0 #333',
            `0 0 80px ${COLOR}15`,
            '0 30px 80px rgba(0,0,0,0.8)',
            'inset 0 1px 0 rgba(255,255,255,0.06)',
          ].join(', '),
          overflow: 'hidden',
        }}>

          {/* Top badge strip */}
          <div style={{
            background: 'linear-gradient(90deg, #111 0%, #181818 50%, #111 100%)',
            borderBottom: `1px solid #1e1e1e`,
            padding: '8px 22px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              fontSize: '9px', fontWeight: 700,
              color: '#888888', letterSpacing: '4px', textTransform: 'uppercase',
            }}>Followers</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[COLOR, '#1a1a1a', '#1a1a1a'].map((c, i) => (
                <div key={i} style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: c,
                  boxShadow: i === 0 ? `0 0 6px ${COLOR}` : 'none',
                }} />
              ))}
            </div>
          </div>

          {/* Pixel grid */}
          <div style={{
            background: '#020202',
            padding: `${GAP * 3}px ${GAP * 4}px`,
            backgroundImage: scanlineBg,
          }}>
            <LEDMatrix text={countText} px={PX} gap={GAP} color={COLOR} />
          </div>

          {/* Bottom accent strip */}
          <div style={{
            background: 'linear-gradient(90deg, #0e0e0e 0%, #141414 50%, #0e0e0e 100%)',
            borderTop: '1px solid #181818',
            padding: '6px 22px',
            display: 'flex', justifyContent: 'center',
          }}>
            <div style={{
              width: '80px', height: '2px',
              background: `linear-gradient(90deg, transparent, ${COLOR}50, transparent)`,
              borderRadius: '1px',
            }} />
          </div>
        </div>

        {/* Today's growth — smaller matrix below */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        }}>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            color: `${COLOR}cc`, letterSpacing: '5px', textTransform: 'uppercase',
          }}>Today's Growth</span>
          <LEDMatrix text={growthText} px={Math.round(PX * 0.55)} gap={Math.round(GAP * 0.6)} color={COLOR} />
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: `1px solid ${COLOR}18`,
        background: 'rgba(0,0,0,0.55)',
        padding: '18px 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Total count */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#888888', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: '28px', fontWeight: 800, color: `${COLOR}cc`, letterSpacing: '-0.5px' }}>
            {formatCount(animated)}
          </span>
        </div>

        {/* QR code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '10px', background: '#fff', borderRadius: '12px',
            boxShadow: `0 6px 28px ${COLOR}30, 0 2px 8px rgba(0,0,0,0.5)`,
          }}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={90}
              fgColor="#111"
              bgColor="#fff"
              level="M"
            />
          </div>
          <span style={{
            fontSize: '9px', fontWeight: 700,
            color: '#aaaaaa', letterSpacing: '3px', textTransform: 'uppercase',
          }}>Scan to Follow</span>
        </div>

        {/* Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#888888', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>Live Display</span>
          <span style={{
            fontSize: '22px', fontWeight: 800,
            color: `${COLOR}cc`, letterSpacing: '1px',
          }}>LED Counter</span>
        </div>
      </div>
    </div>
  );
}
