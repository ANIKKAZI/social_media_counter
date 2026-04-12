/* LaMetric-style Retro LED Pixel Matrix Display
 * Large blocky glowing pixels, structured housing, per-LED diffusion glow
 */
import React, { useMemo } from 'react';

/* â”€â”€ 5Ã—7 dot-matrix glyph library â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  /* 5Ã—7 Instagram camera glyph */
  'IG': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
  ],
};

/* Build a flat row array from a text string.
 * Special token "[IG]" inserts the Instagram glyph. */
function textToGrid(text) {
  // Tokenise: replace [IG] with a special marker object
  const tokens = [];
  let remaining = text;
  while (remaining.length) {
    const m = remaining.match(/^\[IG\]/);
    if (m) { tokens.push('IG'); remaining = remaining.slice(4); }
    else    { tokens.push(remaining[0]); remaining = remaining.slice(1); }
  }

  const rows = 7;
  const grid = Array.from({ length: rows }, () => []);

  tokens.forEach((tok, ti) => {
    const glyph = G[tok] || G[' '];
    for (let r = 0; r < rows; r++) {
      if (ti > 0) grid[r].push(0); // 1-col char gap
      grid[r].push(...glyph[r]);
    }
  });

  return grid;
}

/* â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PIXEL  = 10;   // px per LED dot
const GAP    = 3;    // px gap between dots
const STEP   = PIXEL + GAP;

export default function LaMetricDisplay({
  value,
  label    = 'FOLLOWERS',
  color    = '#FF6B00',
  username,
}) {
  const displayText = typeof value === 'number' ? value.toLocaleString() : String(value);

  /* Optionally prefix with [IG] glyph */
  const tokenString = username ? `[IG] ${displayText}` : displayText;

  const grid = useMemo(() => textToGrid(tokenString), [tokenString]);
  const cols = grid[0]?.length || 0;

  /* Derived colour variations */
  const colorDim  = `${color}28`;   // off-state dot
  const colorGlow = `${color}cc`;   // on-state fill
  const glowS     = `0 0 ${PIXEL}px ${color}80, 0 0 ${PIXEL * 2.5}px ${color}38`;
  const glowL     = `0 0 ${PIXEL * 1.6}px ${color}, 0 0 ${PIXEL * 3.5}px ${color}55`;

  /* Title row (optional username in "pixel font" label) */
  const titleGrid = useMemo(
    () => username ? textToGrid(username.toUpperCase().split('').join(' ')) : null,
    [username],
  );
  const titleCols = titleGrid?.[0]?.length || 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      {/* â”€â”€ Outer bezel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{
        background: 'linear-gradient(180deg, #1e1e1e 0%, #111 10%, #0a0a0a 100%)',
        borderRadius: '14px',
        padding: '0',
        border: '1.5px solid #2c2c2c',
        boxShadow: [
          '0 2px 0 #3a3a3a',
          '0 20px 48px rgba(0,0,0,0.7)',
          `0 0 60px ${color}18`,
          'inset 0 1px 0 rgba(255,255,255,0.06)',
        ].join(', '),
        overflow: 'hidden',
      }}>

        {/* Top badge strip */}
        <div style={{
          background: 'linear-gradient(90deg, #151515 0%, #1c1c1c 50%, #151515 100%)',
          borderBottom: '1px solid #1e1e1e',
          padding: '7px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#333', letterSpacing: '3px', textTransform: 'uppercase' }}>
            {label}
          </span>
          {/* Status indicator LEDs */}
          <div style={{ display: 'flex', gap: '5px' }}>
            {[color, '#1a1a1a', '#1a1a1a'].map((c, i) => (
              <div key={i} style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: c,
                boxShadow: i === 0 ? `0 0 6px ${color}` : 'none',
              }} />
            ))}
          </div>
        </div>

        {/* â”€â”€ Pixel matrix panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{
          background: '#020202',
          padding: `${GAP * 3}px ${GAP * 4}px`,
          /* Subtle scanline texture */
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(255,255,255,0.012) 12px, rgba(255,255,255,0.012) 13px)',
        }}>
          {/* Optional small title row */}
          {titleGrid && titleCols > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${titleCols}, ${PIXEL * 0.6}px)`,
              gridTemplateRows: `repeat(7, ${PIXEL * 0.6}px)`,
              gap: `${GAP * 0.7}px`,
              marginBottom: `${GAP * 3}px`,
              opacity: 0.55,
            }}>
              {titleGrid.flatMap((row, ri) =>
                row.map((px, ci) => (
                  <div key={`t-${ri}-${ci}`} style={{
                    width: PIXEL * 0.6, height: PIXEL * 0.6,
                    borderRadius: '1px',
                    background: px ? colorGlow : colorDim,
                    boxShadow: px ? `0 0 ${PIXEL * 0.6}px ${color}60` : 'none',
                  }} />
                ))
              )}
            </div>
          )}

          {/* Main counter row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${PIXEL}px)`,
            gridTemplateRows: `repeat(7, ${PIXEL}px)`,
            gap: `${GAP}px`,
          }}>
            {grid.flatMap((row, ri) =>
              row.map((px, ci) => (
                <div key={`${ri}-${ci}`} style={{
                  width: PIXEL,
                  height: PIXEL,
                  borderRadius: '2px',
                  background: px ? colorGlow : colorDim,
                  boxShadow: px ? glowS : 'none',
                  transition: 'background 0.25s, box-shadow 0.25s',
                }} />
              ))
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{
          background: 'linear-gradient(90deg, #0e0e0e 0%, #151515 50%, #0e0e0e 100%)',
          borderTop: '1px solid #1a1a1a',
          padding: '5px 18px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '60px', height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
            borderRadius: '1px',
          }} />
        </div>
      </div>
    </div>
  );
}

