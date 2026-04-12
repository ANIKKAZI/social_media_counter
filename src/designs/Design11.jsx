/* Design 11 – Photo-Realistic Smiirl Kiosk Mockup
 * Reclaimed-wood cafe counter | thick matte-black kiosk bezels
 * Skeuomorphic mechanical split-flap | 6 flaps, last 3 mid-flip
 * QR Code + Scan to Follow
 */
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { InstagramIcon, formatCount } from '../components/shared';

/* -- Flap geometry ------------------------------------------------------- */
const FW = 110;
const FH = 148;
const FR = 10;
const FG = 7;
const FONT = '"Rockwell", "Courier New", "Georgia", serif';

/* -- CSS keyframes ------------------------------------------------------- */
const CSS = `
  @keyframes d11Out {
    0%   { transform: rotateX(0deg);   filter: brightness(1.0); }
    55%  { filter: brightness(0.45) blur(2px); }
    100% { transform: rotateX(-90deg); filter: brightness(0.2) blur(5px); }
  }
  @keyframes d11In {
    0%   { transform: rotateX(90deg);  filter: brightness(0.2) blur(5px); }
    45%  { filter: brightness(0.5) blur(1.5px); }
    100% { transform: rotateX(0deg);   filter: brightness(1.0); }
  }
  @keyframes d11Blink {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.3; }
  }
`;

/* -- Single flap digit — full card, flips only on digit change ----------- */
function Flap({ digit, prevDigit }) {
  const [phase, setPhase]     = useState(null);
  const [shown, setShown]     = useState(digit);

  useEffect(() => {
    if (digit === prevDigit) return;
    setPhase('out');
    const t1 = setTimeout(() => { setShown(digit); setPhase('in'); }, 330);
    const t2 = setTimeout(() => setPhase(null), 680);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [digit, prevDigit]);

  const halfH = FH / 2;
  const cardBg = 'linear-gradient(180deg, #2e2e2e 0%, #222 45%, #1a1a1a 100%)';
  const scan   = 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)';

  const anim = phase === 'out' ? 'd11Out 0.33s cubic-bezier(0.55,0,1,1) forwards'
             : phase === 'in'  ? 'd11In  0.33s cubic-bezier(0,0,0.45,1) forwards'
             : 'none';

  return (
    <div style={{ width: FW, height: FH, position: 'relative', perspective: '700px', flexShrink: 0 }}>

      {/* Full-height card */}
      <div style={{
        width: FW, height: FH,
        background: cardBg,
        borderRadius: FR,
        overflow: 'hidden',
        position: 'absolute', top: 0, left: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.08), inset 2px 0 4px rgba(0,0,0,0.3), inset -2px 0 4px rgba(0,0,0,0.3)',
        transformOrigin: 'center center',
        animation: anim,
        zIndex: 2,
      }}>
        <span style={{
          fontSize: '100px', fontFamily: FONT, fontWeight: 700,
          color: '#f0ede8', letterSpacing: '-1px', userSelect: 'none',
          lineHeight: 1,
          textShadow: '0 2px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.07), 2px 0 4px rgba(0,0,0,0.4)',
        }}>{shown}</span>
        {/* Top highlight streak */}
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: 'rgba(255,255,255,0.12)', borderRadius: '1px' }} />
        {/* Scan texture */}
        <div style={{ position: 'absolute', inset: 0, background: scan, pointerEvents: 'none' }} />
        {/* Centre shadow line (decorative axle hint) */}
        <div style={{ position: 'absolute', top: halfH - 1, left: 0, right: 0, height: '2px', background: 'rgba(0,0,0,0.55)', zIndex: 3 }} />
      </div>

      {/* Metal axle rod on top of card */}
      <div style={{ position: 'absolute', top: halfH, left: '-4px', right: '-4px', height: '4px', background: 'linear-gradient(180deg, #555 0%, #2a2a2a 50%, #444 100%)', borderRadius: '2px', zIndex: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.9), 0 -1px 0 #666' }} />
      {/* Rivets */}
      {['left', 'right'].map(s => (
        <div key={s} style={{ position: 'absolute', top: halfH - 5, [s]: -5, width: 10, height: 10, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #888 0%, #3a3a3a 55%, #111 100%)', zIndex: 13, boxShadow: '0 2px 4px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.15)' }} />
      ))}
    </div>
  );
}

/* -- Main component ------------------------------------------------------ */
export default function Design11({ followers, todayGrowth, username }) {
  const animated = useAnimatedCount(followers);

  // Use the actual (non-interpolated) follower count for flap digits.
  // If we used `animated` here, every animation frame would be a new digit
  // value, retriggering the flip and leaving cards stuck at rotateX(-90deg).
  const strVal  = String(Math.max(0, Math.floor(followers))).padStart(6, '0');
  const digits  = strVal.split('');
  const prevRef = useRef(digits);
  const [prevDigits, setPrevDigits] = useState(digits);

  useEffect(() => {
    setPrevDigits(prevRef.current);
    prevRef.current = digits;
  }, [followers]); // eslint-disable-line react-hooks/exhaustive-deps

  /* -- Reclaimed-wood background ---------------------------------------- */
  const woodBg = [
    'repeating-linear-gradient(91deg, transparent 0, transparent 22px, rgba(180,100,30,0.045) 22px, rgba(180,100,30,0.045) 23px)',
    'repeating-linear-gradient(89deg, transparent 0, transparent 38px, rgba(100,55,10,0.03) 38px, rgba(100,55,10,0.03) 40px)',
    'repeating-linear-gradient(90.5deg, transparent 0, transparent 61px, rgba(60,30,5,0.025) 61px, rgba(60,30,5,0.025) 62px)',
    'linear-gradient(170deg, #3e2808 0%, #4b300b 20%, #3a2607 40%, #4e3310 60%, #3d2809 80%, #4a2f0a 100%)',
  ].join(', ');

  return (
    <div style={{
      width: '100%', height: '100%',
      background: woodBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      overflow: 'hidden', position: 'relative',
    }}>
      <style>{CSS}</style>

      {/* Edge vignette — simulates camera depth of field */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.62) 100%)' }} />
      {/* Warm ambient light from above */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '140px', pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(255,165,60,0.08) 0%, transparent 100%)' }} />

      {/* -- Kiosk device — slight camera-perspective tilt --------------- */}
      <div style={{
        position: 'relative',
        transform: 'perspective(1500px) rotateX(2deg) rotateY(-1.5deg)',
        transformStyle: 'preserve-3d',
        zIndex: 1,
      }}>

        {/* Outer matte-black bezel */}
        <div style={{
          background: 'linear-gradient(160deg, #1c1c1c 0%, #0e0e0e 55%, #141414 100%)',
          borderRadius: '20px',
          padding: '24px 24px 72px',
          border: '1px solid #2c2c2c',
          boxShadow: [
            '0 2px 0 #3e3e3e',
            '0 -1px 0 #0a0a0a',
            '0 70px 140px rgba(0,0,0,0.75)',
            '0 30px 60px rgba(0,0,0,0.55)',
            '0 10px 20px rgba(0,0,0,0.4)',
            'inset 0 1px 0 rgba(255,255,255,0.06)',
            'inset 0 -2px 0 rgba(0,0,0,0.8)',
          ].join(', '),
        }}>

          {/* Bezel sheen */}
          <div style={{ position: 'absolute', top: '9px', left: '35px', right: '35px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.11) 30%, rgba(255,255,255,0.11) 70%, transparent)', borderRadius: '1px' }} />

          {/* -- Screen ----------------------------------------------- */}
          <div style={{
            background: '#080808',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            width: '900px',
            height: '500px',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7)',
          }}>
            {/* Screen warm top-glow reflection */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% -10%, rgba(255,200,90,0.05) 0%, transparent 60%)' }} />
            {/* Screen glare — angled highlight */}
            <div style={{ position: 'absolute', top: 0, left: '-25%', width: '55%', height: '45%', background: 'linear-gradient(135deg, rgba(255,255,255,0.028) 0%, transparent 65%)', transform: 'skewX(-12deg)', pointerEvents: 'none' }} />

            {/* -- Content layout ---------------------------------- */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', padding: '22px 28px 0', boxSizing: 'border-box', gap: 0,
            }}>

              {/* Handle row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
                <InstagramIcon size={18} color="#aaa" />
                <span style={{ fontSize: '14px', fontWeight: 300, color: '#aaa', letterSpacing: '4px', textTransform: 'uppercase' }}>@{username}</span>
              </div>

              {/* Counter housing */}
              <div style={{
                background: 'linear-gradient(175deg, #2d2d2d 0%, #1a1a1a 12%, #111 100%)',
                borderRadius: '16px',
                padding: '22px 30px 20px',
                border: '1px solid #3a3a3a',
                boxShadow: [
                  '0 2px 0 #555',
                  '0 24px 52px rgba(0,0,0,0.8)',
                  '0 8px 18px rgba(0,0,0,0.65)',
                  'inset 0 1px 0 rgba(255,255,255,0.08)',
                  'inset 0 -3px 10px rgba(0,0,0,0.55)',
                ].join(', '),
              }}>
                {/* Brushed-metal top edge */}
                <div style={{ height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, #3a3a3a 0%, #666 30%, #888 50%, #666 70%, #3a3a3a 100%)', marginBottom: '16px', opacity: 0.6 }} />

                {/* Deep recess */}
                <div style={{
                  background: '#040404',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  boxShadow: 'inset 0 6px 22px rgba(0,0,0,0.95), inset 0 2px 6px rgba(0,0,0,0.85)',
                  display: 'flex', gap: `${FG}px`, alignItems: 'center',
                }}>
                  {digits.map((d, i) => (
                    <React.Fragment key={i}>
                      {/* Thousands-separator groove */}
                      {i === 3 && (
                        <div style={{
                          width: '4px', height: FH * 0.55,
                          background: 'linear-gradient(180deg, #000 0%, #1c1c1c 50%, #000 100%)',
                          borderRadius: '2px', margin: `0 ${FG / 2}px`, flexShrink: 0,
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.85)',
                        }} />
                      )}
                      <Flap
                        digit={d}
                        prevDigit={prevDigits[i] || '0'}
                      />
                    </React.Fragment>
                  ))}
                </div>

                {/* Bottom label bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1c1c1c' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i===1?'#444':'radial-gradient(circle,#666,#333)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)' }} />)}
                  <div style={{ fontSize: '7px', fontWeight: 700, color: '#888', letterSpacing: '5px', textTransform: 'uppercase' }}>FOLLOWERS</div>
                  {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i===1?'#444':'radial-gradient(circle,#666,#333)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)' }} />)}
                </div>
              </div>

              {/* -- Bottom strip: growth | QR | live ---------------- */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '14px 18px', marginTop: 'auto',
                borderTop: '1px solid rgba(255,255,255,0.035)',
                background: 'rgba(0,0,0,0.28)',
                flexShrink: 0,
              }}>
                {/* Today's growth */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '9px', color: '#888', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Today's Growth</span>
                  <span style={{ fontSize: '26px', fontWeight: 700, color: '#5ea84e', fontFamily: FONT, letterSpacing: '-0.5px' }}>
                    +{todayGrowth.toLocaleString()}
                  </span>
                </div>

                {/* QR code */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
                  <div style={{ padding: '9px', background: '#fff', borderRadius: '9px', boxShadow: '0 4px 18px rgba(0,0,0,0.6)' }}>
                    <QRCodeSVG
                      value={`https://instagram.com/${username}`}
                      size={76}
                      fgColor="#111111"
                      bgColor="#ffffff"
                      level="M"
                    />
                  </div>
                  <span style={{ fontSize: '9px', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Scan to Follow</span>
                </div>

                {/* Live + total */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', animation: 'd11Blink 2.2s infinite' }} />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#4ade80', letterSpacing: '2.5px' }}>LIVE</span>
                  </div>
                  <span style={{ fontSize: '9px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>{formatCount(animated)} Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Home button in bottom bezel */}
          <div style={{ position: 'absolute', bottom: '17px', left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 30%, #282828, #0e0e0e)', border: '1px solid #333', boxShadow: '0 2px 8px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)' }} />
          </div>

          {/* Subtle brand text */}
          <div style={{ position: 'absolute', bottom: '26px', right: '30px', fontSize: '7px', fontWeight: 700, color: '#252525', letterSpacing: '2px', textTransform: 'uppercase' }}>KIOSK</div>
        </div>

        {/* Device contact shadow on wood counter */}
        <div style={{ position: 'absolute', bottom: '-18px', left: '8%', right: '8%', height: '22px', background: 'rgba(0,0,0,0.45)', filter: 'blur(20px)', borderRadius: '50%' }} />
      </div>
    </div>
  );
}
