import React, { useEffect, useState } from 'react';
import { InstagramIcon } from './shared';

const META_ACCESS_TOKEN = process.env.REACT_APP_META_ACCESS_TOKEN;

async function fetchInstagramProfile() {
  const url = `https://graph.instagram.com/v25.0/me?fields=id,username,followers_count&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return { username: data.username, followers: Number(data.followers_count) || 0 };
}

export default function SetupPage({ onConnect }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const connect = async () => {
      if (!META_ACCESS_TOKEN) { setError('Meta access token is missing. Add it to the .env file and restart the app.'); setLoading(false); return; }
      try {
        const profile = await fetchInstagramProfile();
        if (!cancelled) onConnect({ platform: 'instagram', displayName: profile.username, handle: profile.username, followers: profile.followers, isLive: true });
      } catch (err) {
        if (!cancelled) { setError(err.message || 'Unable to load Instagram data.'); setLoading(false); }
      }
    };
    connect();
    return () => { cancelled = true; };
  }, [onConnect]);

  return <div style={{ width: '100%', height: '100%', background: 'linear-gradient(145deg, #08080f, #10101c 55%, #0b0b14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#fff', position: 'fixed', inset: 0 }}>
    <div style={{ width: 420, maxWidth: '88vw', textAlign: 'center', background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: '42px 36px', boxShadow: '0 40px 100px rgba(0,0,0,0.55)' }}>
      <div style={{ width: 76, height: 76, borderRadius: 22, background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 26px', boxShadow: '0 12px 36px rgba(225,48,108,0.35)' }}><InstagramIcon size={38} color="#fff" /></div>
      <h1 style={{ fontSize: 26, marginBottom: 10 }}>Instagram Follower Counter</h1>
      <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6 }}>{loading ? 'Connecting to Meta Graph API…' : error}</p>
      {error && <button onClick={() => window.location.reload()} style={{ marginTop: 24, padding: '12px 22px', border: 0, borderRadius: 10, background: 'linear-gradient(135deg, #833AB4, #E1306C)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Retry connection</button>}
    </div>
  </div>;
}
