import { useState, useEffect, useCallback } from 'react';
import DisplayManager from './components/DisplayManager';
import SetupPage from './components/SetupPage';
import './App.css';

const DEMO_INITIAL = 12847;
const DEMO_GROWTH_INITIAL = 42;
// How often to re-fetch live data (YouTube) or tick the demo counter (ms)
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

function App() {
  const [session, setSession] = useState(null); // null = not set up yet
  const [followers, setFollowers] = useState(DEMO_INITIAL);
  const [todayGrowth, setTodayGrowth] = useState(DEMO_GROWTH_INITIAL);

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

