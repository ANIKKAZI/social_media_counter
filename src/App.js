import { useState, useEffect, useCallback } from 'react';
import DisplayManager from './components/DisplayManager';
import SetupPage from './components/SetupPage';
import { InstagramIcon, GoogleIcon } from './components/shared';
import './App.css';
import GoogleReviews from './components/GoogleReviews';
import useRuntimeConfig from './hooks/useRuntimeConfig';
import { fetchInstagramProfile, isNativeApp } from './liveData';

const DEFAULT_FALLBACK_FETCH_INTERVAL_MS = 1_000;

function requestKioskFullscreen() {
  const el = document.documentElement;
  if (document.fullscreenElement || document.webkitFullscreenElement) return Promise.resolve();
  const p = el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : el.webkitRequestFullscreen?.();
  return p ? p.catch(() => {}) : Promise.resolve();
}

function KioskSplash({ visible, onStart, platform }) {
  const isGoogle = platform === 'google';
  const iconStyle = { width: 82, height: 82, display: 'grid', placeItems: 'center', padding: 16, borderRadius: 24 };
  return <div onClick={visible ? onStart : undefined} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'linear-gradient(160deg, #08080f, #10101c 60%, #0b0b14)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', fontFamily: "'Helvetica Neue', Arial, sans-serif", opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', transition: 'opacity 0.4s ease', overflow: 'hidden' }}>
    {platform ? <div style={{ ...iconStyle, marginBottom: 38, background: isGoogle ? '#fff' : 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)', boxShadow: isGoogle ? '0 0 32px rgba(66,133,244,0.35)' : '0 0 32px rgba(225,48,108,0.55)' }}>{isGoogle ? <GoogleIcon size={50} /> : <InstagramIcon size={46} color="#fff" />}</div> : <div style={{ display: 'flex', gap: 16, marginBottom: 38 }}><div style={{ ...iconStyle, background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)', boxShadow: '0 0 32px rgba(225,48,108,0.4)' }}><InstagramIcon size={46} color="#fff" /></div><div style={{ ...iconStyle, background: '#fff', boxShadow: '0 0 32px rgba(66,133,244,0.35)' }}><GoogleIcon size={50} /></div></div>}
    <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 14, textAlign: 'center' }}>Viral Counters</div>
    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.52)', marginBottom: 18, textAlign: 'center' }}>{platform ? (isGoogle ? 'Google Business Reviews' : 'Instagram Follower Counter') : 'Instagram Followers  •  Google Reviews'}</div>
    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center' }}>Tap anywhere to start</div>
  </div>;
}

function App() {
  const runtimeConfig = useRuntimeConfig();
  const [kioskReady, setKioskReady] = useState(false);
  const [session, setSession] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [todayGrowth, setTodayGrowth] = useState(0);
  const hasSession = Boolean(session);
  const handleStart = useCallback(() => { requestKioskFullscreen(); setTimeout(() => setKioskReady(true), 200); }, []);
  const handleConnect = useCallback((info) => { setSession(info); setFollowers(info.followers); setTodayGrowth(0); requestKioskFullscreen(); }, []);
  useEffect(() => {
    if (!hasSession) return undefined;
    let fallbackId;
    let fallbackInterval = runtimeConfig.fallbackPollIntervalMs || DEFAULT_FALLBACK_FETCH_INTERVAL_MS;
    const applyProfile = (fresh) => {
      setSession(prev => ({ ...prev, displayName: fresh.username }));
      setFollowers(prev => { const diff = fresh.followers - prev; if (diff > 0) setTodayGrowth(g => g + diff); return fresh.followers; });
    };
    const stream = isNativeApp ? null : new EventSource('/api/events');
    const startFallback = () => {
      if (!fallbackId) fallbackId = setInterval(async () => { try { applyProfile(await fetchInstagramProfile()); } catch (_) { /* Backend may still be starting. */ } }, fallbackInterval);
    };
    if (stream) {
      stream.onopen = () => { if (fallbackId) { clearInterval(fallbackId); fallbackId = undefined; } };
      stream.onmessage = (event) => { try { applyProfile(JSON.parse(event.data)); } catch (_) { /* Ignore malformed events. */ } };
      stream.onerror = startFallback;
    } else {
      startFallback();
    }
    return () => { stream?.close(); if (fallbackId) clearInterval(fallbackId); };
  }, [hasSession, runtimeConfig.fallbackPollIntervalMs]);
  return <><>{!session ? <SetupPage onConnect={handleConnect} /> : session.platform === 'google' ? <GoogleReviews config={runtimeConfig} onBack={() => setSession(null)} /> : <DisplayManager followers={followers} todayGrowth={todayGrowth} username={session.displayName} onBack={() => setSession(null)} />}</><KioskSplash visible={!kioskReady} platform={session?.platform} onStart={handleStart} /></>;
}

export default App;
