import { useState, useEffect } from 'react';
import DisplayManager from './components/DisplayManager';
import './App.css';

const CONFIG = {
  username: 'your_brand',
  initialFollowers: 12847,
  initialGrowth: 42,
  // Simulate follower increase every 5 seconds
  updateIntervalMs: 5000,
};

function App() {
  const [followers, setFollowers] = useState(CONFIG.initialFollowers);
  const [todayGrowth, setTodayGrowth] = useState(CONFIG.initialGrowth);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 3) + 1;
      setFollowers((prev) => prev + increment);
      setTodayGrowth((prev) => prev + increment);
    }, CONFIG.updateIntervalMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <DisplayManager
      followers={followers}
      todayGrowth={todayGrowth}
      username={CONFIG.username}
    />
  );
}

export default App;
