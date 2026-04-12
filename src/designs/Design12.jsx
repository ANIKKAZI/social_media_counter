/* Design 12 – Instagram Flip Counter
 * Cream/linen pill housing · Instagram-gradient flap cards · white bold digits
 * Matches reference: IG icon left, 6 gradient flaps right, QR + growth below
 */
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { formatCount } from '../components/shared';

/* ── Dimensions ─────────────────────────────────────────────────────────── */
const FW = 148;  // flap width
const FH = 184;  // flap height
const FR = 20;   // flap corner radius
const FG = 10;   // gap between flaps

/* ── Keyframes ──────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes d12Out {
    0%   { transform: rotateX(0deg);   filter: brightness(1.0); }
    55%  { filter: brightness(0.45) blur(2px); }
    100% { transform: rotateX(-90deg); filter: brightness(0.18) blur(5px); }
  }
  @keyframes d12In {
    0%   { transform: rotateX(90deg);  filter: brightness(0.18) blur(5px); }
    45%  { filter: brightness(0.55) blur(1px); }
    100% { transform: rotateX(0deg);   filter: brightness(1.0); }
  }
  @keyframes d12pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.3; }
  }
  @media (max-width: 1200px) {
    .d12-content { transform: scale(0.78); transform-origin: center center; }
  }
  @media (max-width: 900px) {
    .d12-content { transform: scale(0.64); transform-origin: center center; }
  }
`;

/* ── Instagram gradient (bottom-left → top-right, brand accurate) ───────── */
const IG_BG = 'linear-gradient(135deg, #F77737 0%, #E1306C 45%, #C13584 70%, #833AB4 100%)';

/* ── Instagram icon with full gradient fill ─────────────────────────────── */
function IGIcon({ size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={size} height={size}>
      <defs>
        <linearGradient id="ig12grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#F77737" />
          <stop offset="45%"  stopColor="#E1306C" />
          <stop offset="70%"  stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <path fill="url(#ig12grad)" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.6-74.7-74.7s33.6-74.7 74.7-74.7 74.7 33.6 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S4.4 127.5 2.6 163.4c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
    </svg>
  );
}

/* ── Single flap card — full height, Instagram gradient bg ──────────────── */
function Flap({ digit, prevDigit }) {
  const [phase, setPhase] = useState(null);
  const [shown, setShown] = useState(digit);

  useEffect(() => {
    if (digit === prevDigit) return;
    setPhase('out');
    const t1 = setTimeout(() => { setShown(digit); setPhase('in'); }, 330);
    const t2 = setTimeout(() => setPhase(null), 680);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [digit, prevDigit]);

  const anim = phase === 'out' ? 'd12Out 0.33s cubic-bezier(0.55,0,1,1) forwards'
             : phase === 'in'  ? 'd12In 0.33s cubic-bezier(0,0,0.45,1) forwards'
             : 'none';

  return (
    <div style={{ width: FW, height: FH, position: 'relative', perspective: '600px', flexShrink: 0 }}>
      <div style={{
        width: FW, height: FH,
        borderRadius: FR,
        background: IG_BG,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'absolute', inset: 0,
        transformOrigin: 'center center',
        animation: anim,
        overflow: 'hidden',
        boxShadow: [
          '0 6px 20px rgba(131,58,180,0.28)',
          '0 2px 6px rgba(0,0,0,0.12)',
          'inset 0 2px 0 rgba(255,255,255,0.22)',
          'inset 0 -2px 0 rgba(0,0,0,0.15)',
        ].join(', '),
      }}>
        {/* Upper half gloss */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%)',
          borderRadius: `${FR}px ${FR}px 0 0`,
          pointerEvents: 'none',
        }} />
        {/* Centre split line */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: '3px',
          background: 'rgba(0,0,0,0.22)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 'calc(50% + 0px)', left: 0, right: 0,
          height: '1px',
          background: 'rgba(255,255,255,0.18)',
          pointerEvents: 'none',
        }} />
        {/* Digit */}
        <span style={{
          fontSize: '118px',
          fontWeight: 800,
          color: '#fff',
          fontFamily: "'Helvetica Neue', 'Arial Black', Arial, sans-serif",
          letterSpacing: '-2px',
          userSelect: 'none',
          lineHeight: 1,
          textShadow: '0 2px 12px rgba(0,0,0,0.25), 0 0 30px rgba(255,255,255,0.1)',
          position: 'relative', zIndex: 1,
        }}>{shown}</span>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function Design12({ followers, todayGrowth, username }) {
  const animated = useAnimatedCount(followers);

  const strVal = String(Math.max(0, Math.floor(followers))).padStart(6, '0');
  const digits = strVal.split('');
  const prevRef = useRef(digits);
  const [prevDigits, setPrevDigits] = useState(digits);

  useEffect(() => {
    setPrevDigits(prevRef.current);
    prevRef.current = digits;
  }, [followers]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Soft Instagram-tinted cream background */
  const bgGrad = 'linear-gradient(145deg, #fdf2fb 0%, #f8eeff 35%, #fff5f0 70%, #fdf2fb 100%)';

  return (
    <div style={{
      width: '100%', height: '100%',
      background: bgGrad,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{CSS}</style>

      {/* Soft radial bloom behind the device */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '900px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(193,53,132,0.06) 0%, transparent 65%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* ── Scalable content wrapper ──────────────────────────────────── */}
      <div className="d12-content" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px',
      }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      }}>
        <div style={{
          fontSize: '15px', fontWeight: 400,
          background: IG_BG,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '3px', textTransform: 'uppercase',
        }}>
          Instagram
        </div>
        <div style={{
          fontSize: '28px', fontWeight: 700, color: '#2a1a2e',
          letterSpacing: '-0.3px',
        }}>
          @{username}
        </div>
      </div>

      {/* ── Counter housing (cream pill) ─────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #f0e9e0 0%, #e8dfd4 50%, #ede5db 100%)',
        borderRadius: '42px',
        padding: `24px 30px`,
        display: 'flex', alignItems: 'center',
        gap: '20px',
        boxShadow: [
          '0 20px 60px rgba(131,58,180,0.12)',
          '0 8px 24px rgba(0,0,0,0.09)',
          '0 2px 6px rgba(0,0,0,0.06)',
          'inset 0 2px 0 rgba(255,255,255,0.75)',
          'inset 0 -2px 0 rgba(0,0,0,0.06)',
        ].join(', '),
        border: '1px solid rgba(255,255,255,0.7)',
        position: 'relative',
      }}>
        {/* Instagram icon */}
        <div style={{ flexShrink: 0 }}>
          <IGIcon size={FH} />
        </div>

        {/* Vertical separator */}
        <div style={{
          width: '2px', height: FH * 0.65,
          background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent)',
          borderRadius: '1px', flexShrink: 0,
        }} />

        {/* Flaps */}
        <div style={{ display: 'flex', gap: `${FG}px`, alignItems: 'center' }}>
          {digits.map((d, i) => (
            <React.Fragment key={i}>
              {/* Thousands groove */}
              {i === 3 && (
                <div style={{
                  width: '10px', height: FH * 0.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: '3px', height: '100%',
                    background: 'rgba(0,0,0,0.12)',
                    borderRadius: '2px',
                  }} />
                </div>
              )}
              <Flap digit={d} prevDigit={prevDigits[i] || '0'} />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* FOLLOWERS label */}
      <div style={{
        fontSize: '11px', fontWeight: 700,
        color: '#b08090',
        letterSpacing: '6px', textTransform: 'uppercase',
        marginTop: '-16px',
      }}>
        Followers
      </div>

      {/* ── Bottom row: growth | QR | live ───────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '64px',
        marginTop: '4px',
      }}>
        {/* Today's growth */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 600,
            color: '#b098b8', letterSpacing: '2.5px', textTransform: 'uppercase',
          }}>Today's Growth</span>
          <span style={{
            fontSize: '48px', fontWeight: 800,
            background: IG_BG,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px',
          }}>+{todayGrowth.toLocaleString()}</span>
        </div>

        {/* QR code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '12px', background: '#fff', borderRadius: '16px',
            boxShadow: '0 6px 24px rgba(131,58,180,0.15), 0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid rgba(193,53,132,0.1)',
          }}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
                size={130}
              fgColor="#2a1a2e"
              bgColor="#ffffff"
              level="M"
            />
          </div>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            color: '#b098b8', letterSpacing: '3px', textTransform: 'uppercase',
          }}>Scan to Follow</span>
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 10px #4ade80',
              animation: 'd12pulse 2s infinite',
            }} />
            <span style={{
              fontSize: '11px', fontWeight: 800,
              color: '#4ade80', letterSpacing: '3px',
            }}>LIVE</span>
          </div>
          <span style={{
            fontSize: '10px', fontWeight: 600,
            color: '#b098b8', letterSpacing: '1.5px', textTransform: 'uppercase',
          }}>{formatCount(animated)} Total</span>
        </div>
      </div>

      </div>{/* end d12-content */}
    </div>
  );
}
