import React, { useEffect, useState } from 'react';
import { InstagramIcon, GoogleIcon } from './shared';

import { fetchInstagramProfile } from '../liveData';

export default function SetupPage({ onConnect }) {
  const [platform, setPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (platform !== 'instagram') return undefined;
    let cancelled = false;
    const connect = async () => {
      try {
        const profile = await fetchInstagramProfile();
        if (!cancelled) onConnect({ platform: 'instagram', displayName: profile.username, handle: profile.username, profilePictureUrl: profile.profilePictureUrl, followers: profile.followers, isLive: true });
      } catch (err) {
        if (!cancelled) { setError(err.message || 'Unable to load Instagram data.'); setLoading(false); }
      }
    };
    connect();
    return () => { cancelled = true; };
  }, [onConnect, platform]);

  if (!platform) return <div className="setup-page"><div className="setup-shell"><div className="setup-eyebrow">Social display</div><h1>Choose your audience action</h1><p className="setup-copy">Set up the live counter or invite guests to leave a Google Business review.</p><div className="platform-grid"><button className="platform-option instagram-option" onClick={() => setPlatform('instagram')}><span className="platform-icon instagram-icon"><InstagramIcon size={42} color="#fff" /></span><strong>Instagram</strong><small>Live follower counter</small></button><button className="platform-option google-option" onClick={() => onConnect({ platform: 'google', displayName: 'Google Business', handle: 'reviews', followers: 0, isLive: false })}><span className="platform-icon google-icon"><GoogleIcon size={42} /></span><strong>Google reviews</strong><small>QR code, ratings and review prompts</small></button></div></div></div>;

  return <div className="setup-page"><div className="setup-shell instagram-setup">
      <div className="instagram-setup-icon"><InstagramIcon size={38} color="#fff" /></div>
      <h1 style={{ fontSize: 26, marginBottom: 10 }}>Instagram Follower Counter</h1>
      <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6 }}>{loading ? 'Connecting to Meta Graph API…' : error}</p>
      {error && <button onClick={() => window.location.reload()} style={{ marginTop: 24, padding: '12px 22px', border: 0, borderRadius: 10, background: 'linear-gradient(135deg, #833AB4, #E1306C)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Retry connection</button>}
    </div></div>;
}
