/* Smiirl-style Mechanical Split-Flap Counter — skeuomorphic, photo-realistic */
import React, { useState, useEffect, useRef } from 'react';

const FLAP_W = 110;
const FLAP_H = 148;
const FLAP_RADIUS = 10;
const GAP = 7;

const CSS = `
  @keyframes flapDown {
    0%   { transform: rotateX(0deg);  filter: brightness(1);   }
    60%  { filter: brightness(0.55); }
    100% { transform: rotateX(-90deg); filter: brightness(0.3); }
  }
  @keyframes flapReveal {
    0%   { transform: rotateX(90deg);  filter: brightness(0.3); }
    40%  { filter: brightness(0.55); }
    100% { transform: rotateX(0deg);   filter: brightness(1);   }
  }
`;

/* Realistic serif / slab font stack that evokes physical embossed lettering */
const FLAP_FONT = '"Rockwell", "Courier New", "Georgia", serif';

function SingleFlap({ digit, prevDigit }) {
  const [phase, setPhase] = useState(null);

  useEffect(() => {
    if (digit === prevDigit) return;
    setPhase('out');
    const t1 = setTimeout(() => setPhase('in'),  320);
    const t2 = setTimeout(() => setPhase(null),  650);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [digit, prevDigit]);

  /* Shared card geometry */
  const halfH = FLAP_H / 2;
  const upper = {
    width: FLAP_W, height: halfH,
    overflow: 'hidden', position: 'relative',
    borderRadius: `${FLAP_RADIUS}px ${FLAP_RADIUS}px 0 0`,
  };
  const lower = {
    width: FLAP_W, height: halfH,
    overflow: 'hidden', position: 'relative',
    borderRadius: `0 0 ${FLAP_RADIUS}px ${FLAP_RADIUS}px`,
  };

  /* Number rendered at full height, clipped by the half-card */
  const numEl = (d, half) => (
    <span style={{
      position: 'absolute',
      left: 0, right: 0,
      fontSize: '98px',
      fontFamily: FLAP_FONT,
      fontWeight: 700,
      color: '#f0ede8',
      textAlign: 'center',
      letterSpacing: '-1px',
      userSelect: 'none',
      /* push the full glyph to align within its half */
      top: half === 'upper' ? 'auto' : `-${halfH * 0.04}px`,
      bottom: half === 'upper' ? `-${halfH * 0.04}px` : 'auto',
      lineHeight: `${FLAP_H}px`,
      textShadow: [
        '0 2px 0 rgba(0,0,0,0.55)',
        '0 -1px 0 rgba(255,255,255,0.08)',
        '2px 0 4px rgba(0,0,0,0.4)',
      ].join(', '),
    }}>{d}</span>
  );

  /* Matte plastic surface gradient — upper half */
  const upperBg  = 'linear-gradient(180deg, #323232 0%, #282828 40%, #1e1e1e 100%)';
  /* lower half is slightly darker (shadow side) */
  const lowerBg  = 'linear-gradient(180deg, #1a1a1a 0%, #202020 60%, #262626 100%)';

  return (
    <div style={{ width: FLAP_W, height: FLAP_H, position: 'relative', perspective: '600px' }}>

      {/* ── static upper ─────────────────────────────────── */}
      <div style={{
        ...upper,
        background: upperBg,
        boxShadow: [
          'inset 0 3px 0 rgba(255,255,255,0.09)',
          'inset 2px 0 4px rgba(0,0,0,0.3)',
          'inset -2px 0 4px rgba(0,0,0,0.3)',
        ].join(', '),
      }}>
        {numEl(digit, 'upper')}
        {/* Emboss highlight streak */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px',
          background: 'rgba(255,255,255,0.13)', borderRadius: '1px',
        }} />
        {/* Fine texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── static lower ─────────────────────────────────── */}
      <div style={{
        ...lower,
        background: lowerBg,
        marginTop: '2px',
        boxShadow: [
          'inset 0 -3px 0 rgba(255,255,255,0.04)',
          'inset 2px 0 4px rgba(0,0,0,0.35)',
          'inset -2px 0 4px rgba(0,0,0,0.35)',
        ].join(', '),
      }}>
        {numEl(digit, 'lower')}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)',
          pointerEvents: 'none',
        }} />
        {/* Bottom emboss shadow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
          background: 'rgba(0,0,0,0.3)',
        }} />
      </div>

      {/* ── falling top flap (old digit) ─────────────────── */}
      {phase === 'out' && (
        <div style={{
          ...upper,
          position: 'absolute', top: 0, left: 0,
          background: upperBg,
          transformOrigin: 'bottom center',
          animation: 'flapDown 0.32s cubic-bezier(0.55,0,1,1) forwards',
          zIndex: 5,
          boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
        }}>
          {numEl(prevDigit, 'upper')}
        </div>
      )}

      {/* ── rising bottom flap (new digit) ───────────────── */}
      {phase === 'in' && (
        <div style={{
          ...lower,
          position: 'absolute', top: halfH + 2, left: 0,
          background: lowerBg,
          transformOrigin: 'top center',
          animation: 'flapReveal 0.32s cubic-bezier(0,0,0.45,1) forwards',
          zIndex: 5,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
        }}>
          {numEl(digit, 'lower')}
        </div>
      )}

      {/* ── centre axle ──────────────────────────────────── */}
      {/* Shadow trough */}
      <div style={{
        position: 'absolute', top: halfH - 2, left: 0, right: 0, height: '6px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.5) 100%)',
        zIndex: 10,
      }} />
      {/* Metal axle rod */}
      <div style={{
        position: 'absolute', top: halfH, left: '-4px', right: '-4px', height: '4px',
        background: 'linear-gradient(180deg, #555 0%, #2a2a2a 50%, #444 100%)',
        zIndex: 12,
        borderRadius: '2px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.9), 0 -1px 0 #666',
      }} />

      {/* ── rivets ───────────────────────────────────────── */}
      {[{ side: 'left', pos: -5 }, { side: 'right', pos: 'auto' }].map(({ side, pos }) => (
        <div key={side} style={{
          position: 'absolute',
          top: halfH - 5,
          [side]: pos === 'auto' ? -5 : pos,
          right: pos === 'auto' ? -5 : 'auto',
          width: 10, height: 10,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 32%, #888 0%, #3a3a3a 55%, #111 100%)',
          zIndex: 13,
          boxShadow: '0 2px 4px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.15)',
        }} />
      ))}
    </div>
  );
}

export default function SmirlCounter({ value, label = 'FOLLOWERS', username }) {
  const strVal = String(Math.max(0, Math.floor(value))).padStart(6, '0');
  const digits = strVal.split('');
  const prevRef = useRef(digits);
  const [prevDigits, setPrevDigits] = useState(digits);

  useEffect(() => {
    setPrevDigits(prevRef.current);
    prevRef.current = digits;
  }, [value]); // eslint-disable-line

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <style>{CSS}</style>

      {/* Username above housing */}
      {username && (
        <div style={{
          fontSize: '28px',
          fontWeight: 300,
          color: '#fff',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          marginBottom: '28px',
          textShadow: '0 0 40px rgba(255,255,255,0.15)',
        }}>
          @{username}
        </div>
      )}

      {/* ── Outer housing ──────────────────────────────────────────────── */}
      <div style={{
        /* Heavy matte plastic / anodised casing */
        background: 'linear-gradient(175deg, #2d2d2d 0%, #1a1a1a 12%, #111 100%)',
        borderRadius: '20px',
        padding: '28px 32px 26px',
        border: '1px solid #3e3e3e',
        boxShadow: [
          '0 2px 0 #555',                           /* top-edge highlight */
          '0 -1px 0 #1a1a1a',
          '0 28px 60px rgba(0,0,0,0.75)',
          '0 8px 16px rgba(0,0,0,0.6)',
          'inset 0 1px 0 rgba(255,255,255,0.08)',
          'inset 0 -3px 8px rgba(0,0,0,0.5)',
          'inset 1px 0 0 rgba(255,255,255,0.04)',
          'inset -1px 0 0 rgba(255,255,255,0.04)',
        ].join(', '),
      }}>
        {/* Brushed-metal top edge */}
        <div style={{
          height: '3px',
          borderRadius: '2px',
          background: 'linear-gradient(90deg, #3a3a3a 0%, #666 30%, #888 50%, #666 70%, #3a3a3a 100%)',
          marginBottom: '18px',
          opacity: 0.6,
        }} />

        {/* Inner deep recess */}
        <div style={{
          background: '#060606',
          borderRadius: '12px',
          padding: '16px 18px',
          boxShadow: [
            'inset 0 6px 20px rgba(0,0,0,0.95)',
            'inset 0 2px 6px rgba(0,0,0,0.8)',
            'inset 1px 0 4px rgba(0,0,0,0.6)',
            'inset -1px 0 4px rgba(0,0,0,0.6)',
          ].join(', '),
          display: 'flex',
          gap: `${GAP}px`,
          alignItems: 'center',
        }}>
          {digits.map((d, i) => (
            <React.Fragment key={i}>
              {/* Thousands-separator slot */}
              {i === 3 && (
                <div style={{
                  width: '4px',
                  height: FLAP_H * 0.55,
                  background: 'linear-gradient(180deg, #000 0%, #1c1c1c 50%, #000 100%)',
                  borderRadius: '2px',
                  margin: `0 ${GAP / 2}px`,
                  flexShrink: 0,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
                }} />
              )}
              <SingleFlap digit={d} prevDigit={prevDigits[i] || '0'} />
            </React.Fragment>
          ))}
        </div>

        {/* Bottom label bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '14px',
          paddingTop: '10px',
          borderTop: '1px solid #1c1c1c',
        }}>
          {/* Smiirl-style dot indicators */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '5px', height: '5px',
              borderRadius: '50%',
              background: i === 1 ? '#2a2a2a' : 'radial-gradient(circle, #3a3a3a, #111)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)',
            }} />
          ))}
          <div style={{
            fontSize: '8px',
            fontWeight: 700,
            color: '#2e2e2e',
            letterSpacing: '5px',
            textTransform: 'uppercase',
          }}>
            {label}
          </div>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '5px', height: '5px',
              borderRadius: '50%',
              background: i === 1 ? '#2a2a2a' : 'radial-gradient(circle, #3a3a3a, #111)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
