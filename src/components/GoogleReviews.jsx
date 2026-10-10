import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GoogleIcon } from './shared';

const themes = [
  { name: 'Clean', background: '#f7f9fc', foreground: '#17202a', accent: '#1a73e8', card: '#fff' },
  { name: 'Midnight', background: '#0b1020', foreground: '#fff', accent: '#8ab4f8', card: '#18233a' },
  { name: 'Warm', background: '#f5efe5', foreground: '#2c2118', accent: '#b05b27', card: '#fffaf2' },
];

const reviewUrl = process.env.REACT_APP_GOOGLE_REVIEW_URL || '';
const fallbackCount = Number(process.env.REACT_APP_GOOGLE_REVIEW_COUNT || 0);
const fallbackRating = Number(process.env.REACT_APP_GOOGLE_RATING || 0);

function useGoogleReviews() {
  const [data, setData] = useState({ name: '', reviewCount: fallbackCount, rating: fallbackRating });
  useEffect(() => {
    let active = true;
    const load = () => {
      console.log(`[Google Reviews] polling at ${new Date().toLocaleTimeString()}`);
      return fetch('/api/google-reviews', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
        .then(d => { console.log(`[Google Reviews] ${d.name}: ${d.rating} stars, ${d.reviewCount} reviews`); if (active) setData(d); })
        .catch(error => console.warn(`[Google Reviews] poll failed: ${error.message}`));
    };
    load();
    const id = setInterval(load, 20000);
    return () => { active = false; clearInterval(id); };
  }, []);
  return data;
}

function GoogleTheme({ theme, data }) {
  const reviewCount = data.reviewCount;
  const rating = Math.min(5, Math.max(0, data.rating));
  return <div style={{ minHeight: '100%', background: theme.background, color: theme.foreground, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6vw', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
    <div style={{ width: 'min(1120px, 100%)', display: 'grid', gridTemplateColumns: '1fr 330px', gap: '8vw', alignItems: 'center' }}>
      <div><div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}><GoogleIcon size={46} /><span style={{ fontSize: 18, letterSpacing: 2, textTransform: 'uppercase', opacity: .65 }}>{data.name || 'Google Business Reviews'}</span></div><div style={{ fontSize: 'clamp(42px, 7vw, 96px)', fontWeight: 800, lineHeight: .95 }}>{rating.toFixed(1)}<span style={{ fontSize: '.35em', opacity: .55 }}> / 5</span></div><div style={{ color: '#f4b400', fontSize: 'clamp(28px, 4vw, 54px)', letterSpacing: 4, margin: '22px 0' }}>★★★★★</div><div style={{ fontSize: 'clamp(20px, 3vw, 32px)', opacity: .68 }}>{reviewCount.toLocaleString()} reviews</div><div style={{ marginTop: 28, fontSize: 20, opacity: .7 }}>Share your experience with us</div></div>
      <div style={{ background: theme.card, borderRadius: 18, padding: 26, textAlign: 'center', boxShadow: '0 18px 60px rgba(0,0,0,.14)' }}><QRCodeSVG value={reviewUrl || 'https://g.page/r/google-review'} size={240} includeMargin bgColor="#fff" fgColor="#17202a" /><div style={{ color: theme.foreground, fontSize: 16, fontWeight: 700, marginTop: 18 }}>Scan to rate and review</div><div style={{ color: theme.foreground, opacity: .55, fontSize: 12, marginTop: 6 }}>Your camera will open Google</div></div>
    </div>
  </div>;
}

export default function GoogleReviews({ onBack }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [interval, setIntervalValue] = useState(30);
  const [showPanel, setShowPanel] = useState(false);
  const timer = useRef(null);
  const googleData = useGoogleReviews();
  const activeTheme = themes[activeIndex];

  useEffect(() => { if (!autoRotate) return undefined; timer.current = setInterval(() => setActiveIndex(index => (index + 1) % themes.length), interval * 1000); return () => clearInterval(timer.current); }, [autoRotate, interval]);
  const fullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  return <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}><GoogleTheme theme={activeTheme} data={googleData} /><div style={{ position: 'fixed', top: 12, right: 12, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}><button onClick={() => setShowPanel(!showPanel)} style={buttonStyle}>⚙</button>{showPanel && <div style={panelStyle}><button onClick={onBack} style={buttonStyle}>← Platforms</button><strong>Google Review Themes</strong>{themes.map((theme, index) => <button key={theme.name} onClick={() => setActiveIndex(index)} style={{ ...buttonStyle, background: index === activeIndex ? activeTheme.accent : '#283241' }}>{index + 1}. {theme.name}</button>)}<button onClick={fullscreen} style={buttonStyle}>⛶ Fullscreen</button><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><button onClick={() => setAutoRotate(!autoRotate)} style={{ ...buttonStyle, background: autoRotate ? '#16803c' : '#283241' }}>{autoRotate ? 'ON' : 'OFF'}</button><select value={interval} onChange={event => setIntervalValue(Number(event.target.value))} style={{ padding: 7, borderRadius: 5 }}><option value={15}>15s</option><option value={30}>30s</option><option value={60}>60s</option></select></div></div>}</div></div>;
}

const buttonStyle = { border: 0, borderRadius: 6, padding: '8px 12px', background: '#17202a', color: '#fff', cursor: 'pointer', fontWeight: 600 };
const panelStyle = { display: 'flex', flexDirection: 'column', gap: 9, minWidth: 210, padding: 14, borderRadius: 10, background: 'rgba(0,0,0,.82)', color: '#fff', backdropFilter: 'blur(10px)' };
