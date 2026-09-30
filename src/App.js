import { useState, useEffect, useCallback } from 'react';
import DisplayManager from './components/DisplayManager';
import SetupPage from './components/SetupPage';
import './App.css';

const LIVE_FETCH_INTERVAL_MS = 50_000;
const META_ACCESS_TOKEN = process.env.REACT_APP_META_ACCESS_TOKEN;

async function fetchInstagramProfile() {
  if (!META_ACCESS_TOKEN) throw new Error('Meta access token is not configured.');
  const url = `https://graph.instagram.com/v25.0/me?fields=id,username,followers_count&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return { username: data.username, followers: Number(data.followers_count) || 0 };
}

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
  const handleStart = useCallback(() => { requestKioskFullscreen(); setTimeout(() => setKioskReady(true), 200); }, []);
  const handleConnect = useCallback((info) => { setSession(info); setFollowers(info.followers); setTodayGrowth(0); requestKioskFullscreen(); }, []);
  useEffect(() => {
    if (!session) return undefined;
    const refresh = async () => { try { const fresh = await fetchInstagramProfile(); setSession(prev => ({ ...prev, displayName: fresh.username })); setFollowers(prev => { const diff = fresh.followers - prev; if (diff > 0) setTodayGrowth(g => g + diff); return fresh.followers; }); } catch (_) { /* Preserve last successful value. */ } };
    const id = setInterval(refresh, LIVE_FETCH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [session]);
  return <><>{!session ? <SetupPage onConnect={handleConnect} /> : <DisplayManager followers={followers} todayGrowth={todayGrowth} username={session.displayName} />}</><KioskSplash visible={!kioskReady} onStart={handleStart} /></>;
}

export default App;
