import React, { useState } from 'react';
import { InstagramIcon } from './shared';

/* ─── Platform configuration ───────────────────────────────────────────────
 *
 *  YouTube   → YouTube Data API v3 (free, public API key)
 *              GET /youtube/v3/channels?part=statistics&forHandle=@{handle}&key={apiKey}
 *
 *  Instagram → Instagram Graph API requires OAuth + Business account backend.
 *              Direct browser calls are blocked by CORS/auth. Runs in demo mode.
 *
 *  TikTok    → No public follower API. Runs in demo mode.
 *
 *  Twitter/X → v2 API requires Bearer token. Runs in demo mode.
 * ─────────────────────────────────────────────────────────────────────────── */

const PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube',
    placeholder: 'YourChannelHandle',
    prefix: '@',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #b30000 100%)',
    glow: 'rgba(255,0,0,0.28)',
    apiSupport: true,
    apiKeyLabel: 'YouTube Data API v3 Key',
    apiKeyLink: 'https://console.cloud.google.com/apis/api/youtube.googleapis.com',
    apiKeyHint: 'Enable the YouTube Data API v3 and create an API key in Google Cloud Console.',
    icon: (size, col) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 576 512" fill={col}>
        <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    placeholder: 'your_brand',
    prefix: '@',
    gradient: 'linear-gradient(135deg, #833AB4 0%, #E1306C 55%, #F77737 100%)',
    glow: 'rgba(225,48,108,0.28)',
    apiSupport: false,
    apiKeyLabel: null,
    apiKeyHint: 'Instagram\'s API requires OAuth and a business account. This runs in demo mode.',
    icon: (size, col) => <InstagramIcon size={size} color={col} />,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    placeholder: 'your_brand',
    prefix: '@',
    gradient: 'linear-gradient(135deg, #010101 0%, #69C9D0 100%)',
    glow: 'rgba(105,201,208,0.2)',
    apiSupport: false,
    apiKeyLabel: null,
    apiKeyHint: 'TikTok has no public follower API. This runs in demo mode with simulated data.',
    icon: (size, col) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 448 512" fill={col}>
        <path d="M448 209.9a210.1 210.1 0 01-122.8-39.3v178.8A162.6 162.6 0 11185 188.3v89.9a74.6 74.6 0 1052.2 71.2V0h88a121 121 0 00122.8 121.2z" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    placeholder: 'your_brand',
    prefix: '@',
    gradient: 'linear-gradient(135deg, #1d9bf0 0%, #0d6ebc 100%)',
    glow: 'rgba(29,155,240,0.25)',
    apiSupport: false,
    apiKeyLabel: null,
    apiKeyHint: 'The Twitter/X API requires a Bearer token and paid access. This runs in demo mode.',
    icon: (size, col) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 512 512" fill={col}>
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </svg>
    ),
  },
];

/* ─── YouTube API fetch ──────────────────────────────────────────────────── */
async function fetchYouTubeSubscribers(handle, apiKey) {
  // Try with forHandle first (works for @handle channels)
  const cleanHandle = handle.replace(/^@/, '');
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=%40${encodeURIComponent(cleanHandle)}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found. Check the handle and try again.');
  }
  const stats = data.items[0].statistics;
  return {
    followers: parseInt(stats.subscriberCount, 10) || 0,
    channelTitle: data.items[0].snippet?.title ?? cleanHandle,
  };
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function SetupPage({ onConnect }) {
  const [platformIndex, setPlatformIndex] = useState(0);
  const [handle, setHandle] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const platform = PLATFORMS[platformIndex];

  const handlePlatformChange = (i) => {
    setPlatformIndex(i);
    setError('');
    setHandle('');
    setApiKey('');
  };

  const handleConnect = async () => {
    const cleanHandle = handle.trim().replace(/^@/, '');
    if (!cleanHandle) {
      setError('Please enter a username or handle.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (platform.id === 'youtube') {
        if (!apiKey.trim()) {
          setError('An API key is required for YouTube. See the hint below.');
          setLoading(false);
          return;
        }
        const { followers, channelTitle } = await fetchYouTubeSubscribers(cleanHandle, apiKey.trim());
        onConnect({ platform: platform.id, handle: cleanHandle, displayName: channelTitle, followers, isLive: true, apiKey: apiKey.trim() });
      } else {
        // Demo mode for unsupported platforms
        onConnect({ platform: platform.id, handle: cleanHandle, displayName: cleanHandle, followers: null, isLive: false });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) handleConnect();
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(145deg, #08080f 0%, #10101c 55%, #0b0b14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      color: '#fff',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${platform.glow} 0%, transparent 65%)`,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        transition: 'background 0.5s ease',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '500px',
        maxWidth: '92vw',
        background: 'rgba(255,255,255,0.028)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '28px',
        padding: '52px 52px 44px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.55)',
      }}>

        {/* Platform icon */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '22px',
          background: platform.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: `0 12px 36px ${platform.glow}`,
          transition: 'box-shadow 0.4s, background 0.4s',
        }}>
          {platform.icon(36, '#fff')}
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 700, textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.3px' }}>
          Connect Your Account
        </h1>
        <p style={{ fontSize: '14px', color: '#555', textAlign: 'center', marginBottom: '36px', lineHeight: 1.6 }}>
          Select a platform and enter your handle to display live follower counts.
        </p>

        {/* Platform tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px',
          marginBottom: '28px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '14px',
          padding: '4px',
        }}>
          {PLATFORMS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handlePlatformChange(i)}
              style={{
                padding: '9px 4px',
                borderRadius: '10px',
                border: 'none',
                background: i === platformIndex ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: i === platformIndex ? '#fff' : '#444',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.2px',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ opacity: i === platformIndex ? 1 : 0.4 }}>
                {p.icon(16, '#fff')}
              </span>
              <span>{p.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Handle input */}
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#444', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
          {platform.label} Handle
        </label>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <span style={{
            position: 'absolute', left: '16px', top: '50%',
            transform: 'translateY(-50%)',
            color: '#444', fontSize: '16px', fontWeight: 500, pointerEvents: 'none',
          }}>@</span>
          <input
            type="text"
            value={handle}
            onChange={e => { setHandle(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder={platform.placeholder}
            autoFocus
            autoComplete="off"
            style={{
              width: '100%',
              padding: '14px 16px 14px 36px',
              borderRadius: '12px',
              border: `1px solid ${error && !handle.trim() ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.09)'}`,
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.04)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* API Key — YouTube only */}
        {platform.apiSupport && (
          <>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#444', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              {platform.apiKeyLabel}
            </label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => { setApiKey(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="AIza..."
                autoComplete="off"
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.04)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                onClick={() => setShowApiKey(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '13px', padding: '4px',
                }}
                title={showApiKey ? 'Hide key' : 'Show key'}
              >
                {showApiKey ? '🙈' : '👁'}
              </button>
            </div>
          </>
        )}

        {/* API hint */}
        <div style={{
          fontSize: '12px',
          color: '#3a3a4a',
          lineHeight: 1.6,
          marginBottom: '24px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
        }}>
          <span style={{ flexShrink: 0 }}>ℹ</span>
          <span>
            {platform.apiKeyHint}
            {platform.apiSupport && platform.apiKeyLink && (
              <> <a href={platform.apiKeyLink} target="_blank" rel="noreferrer" style={{ color: '#555', textDecoration: 'underline' }}>Get API key →</a></>
            )}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontSize: '13px', color: '#f87171', marginBottom: '16px',
            padding: '10px 14px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            {error}
          </div>
        )}

        {/* Connect button */}
        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '14px',
            border: 'none',
            background: loading ? 'rgba(255,255,255,0.06)' : platform.gradient,
            color: loading ? '#444' : '#fff',
            fontSize: '15px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.3px',
            boxShadow: loading ? 'none' : `0 6px 24px ${platform.glow}`,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
          onMouseOver={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 32px ${platform.glow}`; } }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : `0 6px 24px ${platform.glow}`; }}
        >
          {loading ? (
            <>
              <Spinner /> Fetching data…
            </>
          ) : (
            `Connect ${platform.label}`
          )}
        </button>

        {/* Demo mode notice for non-API platforms */}
        {!platform.apiSupport && (
          <p style={{ fontSize: '12px', color: '#2e2e3e', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
            Will run with simulated data — swap for a real backend when ready.
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: '16px', height: '16px',
      border: '2px solid rgba(255,255,255,0.2)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}
