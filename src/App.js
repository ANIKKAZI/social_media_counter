import { useState, useEffect, useCallback } from 'react';
import DisplayManager from './components/DisplayManager';
import SetupPage from './components/SetupPage';
import './App.css';

const DEFAULT_FALLBACK_FETCH_INTERVAL_MS = 1_000;

function requestKioskFullscreen() {
  const el = document.documentElement;
  if (document.fullscreenElement || document.webkitFullscreenElement) return Promise.resolve();
  const p = el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : el.webkitRequestFullscreen?.();
  return p ? p.catch(() => {}) : Promise.resolve();
}

function KioskSplash({ visible, onStart }) {
  return <div onClick={visible ? onStart : undefined} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'linear-gradient(160deg, #08080f, #10101c 60%, #0b0b14)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', fontFamily: "'Helvetica Neue', Arial, sans-serif", opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', transition: 'opacity 0.4s ease', overflow: 'hidden' }}>
    <img src="/instagram-logo.svg" alt="Instagram" width="82" height="82" style={{ marginBottom: 38, padding: 18, borderRadius: 24, background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)', boxShadow: '0 0 32px rgba(225,48,108,0.55)' }} />
    <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 14, textAlign: 'center' }}>Instagram Follower Counter</div>
    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center' }}>Tap anywhere to start</div>
  </div>;
}

function App() {
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
    let fallbackInterval = DEFAULT_FALLBACK_FETCH_INTERVAL_MS;
    const applyProfile = (fresh) => {
      setSession(prev => ({ ...prev, displayName: fresh.username }));
      setFollowers(prev => { const diff = fresh.followers - prev; if (diff > 0) setTodayGrowth(g => g + diff); return fresh.followers; });
    };
    const stream = new EventSource('/api/events');
    stream.onopen = () => { if (fallbackId) { clearInterval(fallbackId); fallbackId = undefined; } };
    stream.onmessage = (event) => { try { applyProfile(JSON.parse(event.data)); } catch (_) { /* Ignore malformed events. */ } };
    const startFallback = () => {
      if (!fallbackId) fallbackId = setInterval(async () => { try { const res = await fetch('/api/followers', { cache: 'no-store' }); if (res.ok) applyProfile(await res.json()); } catch (_) { /* Backend may still be starting. */ } }, fallbackInterval);
    };
    fetch('/api/config', { cache: 'no-store' }).then(res => res.ok ? res.json() : null).then(config => { if (config?.fallbackPollIntervalMs) fallbackInterval = config.fallbackPollIntervalMs; }).catch(() => {});
    stream.onerror = startFallback;
    return () => { stream.close(); if (fallbackId) clearInterval(fallbackId); };
  }, [hasSession]);
  return <><>{!session ? <SetupPage onConnect={handleConnect} /> : <DisplayManager followers={followers} todayGrowth={todayGrowth} username={session.displayName} />}</><KioskSplash visible={!kioskReady} onStart={handleStart} /></>;
}

export default App;
