/* Design 7: Retro Flip Counter Style */
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { InstagramIcon } from '../components/shared';

function FlipDigit({ digit }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#222',
        borderRadius: '10px',
        width: '80px',
        height: '110px',
        justifyContent: 'center',
        margin: '0 4px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* top half line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: '#111',
          zIndex: 2,
        }}
      />
      <span
        style={{
          fontSize: '72px',
          fontWeight: 700,
          color: '#fff',
          fontFamily: "'Courier New', monospace",
          lineHeight: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {digit}
      </span>
    </div>
  );
}

function FlipCounter({ value }) {
  const digits = value.toString().padStart(6, '0').split('');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {digits.map((d, i) => (
        <React.Fragment key={i}>
          {i > 0 && i % 3 === 0 && (
            <span
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: '#555',
                margin: '0 6px',
                fontFamily: "'Courier New', monospace",
              }}
            >
              ,
            </span>
          )}
          <FlipDigit digit={d} />
        </React.Fragment>
      ))}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    fontFamily: "'Courier New', monospace",
    color: '#fff',
    padding: '40px',
    boxSizing: 'border-box',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  username: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#e94560',
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#888',
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },
  followersLabel: {
    fontSize: '20px',
    fontWeight: 400,
    color: '#aaa',
    letterSpacing: '10px',
    textTransform: 'uppercase',
    marginTop: '4px',
  },
  growth: {
    padding: '10px 28px',
    borderRadius: '8px',
    background: '#e94560',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
  },
  bottom: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginTop: '10px',
  },
  qrWrap: {
    padding: '10px',
    background: '#fff',
    borderRadius: '12px',
  },
  cta: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#aaa',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
};

export default function Design7({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.header}>
          <InstagramIcon size={36} color="#e94560" />
          <span style={styles.username}>@{username}</span>
        </div>
        <div style={styles.subtitle}>Follow Us on Instagram</div>
        <FlipCounter value={animatedCount} />
        <div style={styles.followersLabel}>Followers</div>
        <div style={styles.growth}>+{todayGrowth} TODAY</div>
        <div style={styles.bottom}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={130}
              fgColor="#1a1a2e"
              bgColor="#fff"
              level="M"
            />
          </div>
          <div style={styles.cta}>Scan to Follow</div>
        </div>
      </div>
    </div>
  );
}
