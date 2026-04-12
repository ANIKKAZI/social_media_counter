import { useState, useEffect, useCallback } from 'react';
import DisplayManager from './components/DisplayManager';
import SetupPage from './components/SetupPage';
import './App.css';

const DEMO_INITIAL = 12847;
const DEMO_GROWTH_INITIAL = 42;
const LIVE_FETCH_INTERVAL_MS = 60_000;
const DEMO_TICK_INTERVAL_MS = 5_000;

async function fetchYouTubeSubscribers(handle, apiKey) {
  const cleanHandle = handle.replace(/^@/, '');
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=%40${encodeURIComponent(cleanHandle)}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.items?.length) throw new Error('Channel not found');
  return parseInt(data.items[0].statistics.subscriberCount, 10) || 0;
}

function requestKioskFullscreen() {
  const el = document.documentElement;
  if (document.fullscreenElement) return;
  if (el.requestFullscreen) el.requestFullscreen({ navigationUI: 'hide' });
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
  else if (el.msRequestFullscreen) el.msRequestFullscreen();
}

/* ── Kiosk splash — covers the whole screen on first load ─────────────── */
const SPLASH_PLATFORMS = [
  {
    label: 'Instagram',
    gradient: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)',
    glow: 'rgba(225,48,108,0.55)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 448 512" fill="#fff">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.6-74.7-74.7s33.6-74.7 74.7-74.7 74.7 33.6 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S4.4 127.5 2.6 163.4c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    gradient: 'linear-gradient(135deg, #FF0000, #b30000)',
    glow: 'rgba(255,0,0,0.45)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 576 512" fill="#fff">
        <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    gradient: 'linear-gradient(135deg, #010101, #69C9D0)',
    glow: 'rgba(105,201,208,0.4)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 448 512" fill="#fff">
        <path d="M448 209.9a210.1 210.1 0 01-122.8-39.3v178.8A162.6 162.6 0 11185 188.3v89.9a74.6 74.6 0 1052.2 71.2V0h88a121 121 0 00122.8 121.2z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    gradient: 'linear-gradient(135deg, #1d9bf0, #0d6ebc)',
    glow: 'rgba(29,155,240,0.4)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 512 512" fill="#fff">
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
      </svg>
    ),
  },
];

function KioskSplash({ onStart }) {
  return (
    <div
      onClick={onStart}
      onTouchStart={onStart}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(160deg, #08080f 0%, #10101c 60%, #0b0b14 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        gap: 0,
      }}
    >
      {/* Platform icon grid */}
      <div style={{
        display: 'flex', gap: 20, marginBottom: 40,
      }}>
        {SPLASH_PLATFORMS.map((p) => (
          <div key={p.label} style={{
            width: 72, height: 72, borderRadius: 20,
            background: p.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 32px ${p.glow}`,
          }}>
            {p.icon}
          </div>
        ))}
      </div>

      <div style={{
        fontSize: 36, fontWeight: 700, color: '#fff',
        letterSpacing: '-0.5px', marginBottom: 14,
      }}>Follower Counter</div>

      <div style={{
        fontSize: 13, color: 'rgba(255,255,255,0.3)',
        letterSpacing: 4, textTransform: 'uppercase',
      }}>Tap anywhere to start</div>
    </div>
  );
}

function App() {
  const [kioskReady, setKioskReady] = useState(false);
  const [session, setSession] = useState(null);
  const [followers, setFollowers] = useState(DEMO_INITIAL);
  const [todayGrowth, setTodayGrowth] = useState(DEMO_GROWTH_INITIAL);

  const handleStart = useCallback(() => {
    requestKioskFullscreen();
    setKioskReady(true);
  }, []);

  const handleConnect = useCallback((info) => {
    // info = { platform, handle, displayName, followers, isLive, apiKey? }
    setSession(info);
    if (info.followers != null) {
      setFollowers(info.followers);
      setTodayGrowth(0);
    } else {
      setFollowers(DEMO_INITIAL);
      setTodayGrowth(DEMO_GROWTH_INITIAL);
    }
  }, []);

  // Live refresh (YouTube) or demo tick
  useEffect(() => {
    if (!session) return;

    if (session.isLive) {
      // Periodically re-fetch the real count
      const id = setInterval(async () => {
        try {
          const fresh = await fetchYouTubeSubscribers(session.handle, session.apiKey);
          setFollowers(prev => {
            const diff = fresh - prev;
            if (diff > 0) setTodayGrowth(g => g + diff);
            return fresh;
          });
        } catch (_) {
          // Silently ignore transient errors; keep current count
        }
      }, LIVE_FETCH_INTERVAL_MS);
      return () => clearInterval(id);
    } else {
      // Demo mode: simulate small ticks
      const id = setInterval(() => {
        const inc = Math.floor(Math.random() * 3) + 1;
        setFollowers(p => p + inc);
        setTodayGrowth(p => p + inc);
      }, DEMO_TICK_INTERVAL_MS);
      return () => clearInterval(id);
    }
  }, [session]);

  if (!kioskReady) {
    return <KioskSplash onStart={handleStart} />;
  }

  if (!session) {
    return <SetupPage onConnect={handleConnect} />;
  }

  return (
    <DisplayManager
      followers={followers}
      todayGrowth={todayGrowth}
      username={session.displayName || session.handle}
    />
  );
}

export default App;

