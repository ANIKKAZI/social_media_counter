/* Design 2: Dark Mode Neon (Glow Effect) */
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { InstagramIcon, formatCount } from '../components/shared';

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0f',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#fff',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  glow1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(225,48,108,0.15) 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(64,93,230,0.15) 0%, transparent 70%)',
    bottom: '-80px',
    left: '-80px',
    pointerEvents: 'none',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '30px',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    fontSize: '26px',
    fontWeight: 600,
    color: '#fff',
    textShadow: '0 0 20px rgba(225,48,108,0.5)',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#888',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  countWrap: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px',
  },
  count: {
    fontSize: '140px',
    fontWeight: 800,
    lineHeight: 1,
    background: 'linear-gradient(135deg, #E1306C, #833AB4, #405DE6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 30px rgba(225,48,108,0.4))',
  },
  followersLabel: {
    fontSize: '20px',
    fontWeight: 300,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '4px',
  },
  growth: {
    padding: '10px 24px',
    borderRadius: '30px',
    background: 'rgba(225,48,108,0.15)',
    color: '#E1306C',
    fontSize: '18px',
    fontWeight: 600,
    border: '1px solid rgba(225,48,108,0.3)',
    boxShadow: '0 0 20px rgba(225,48,108,0.2)',
  },
  bottom: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginTop: '10px',
  },
  qrWrap: {
    padding: '12px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 0 30px rgba(225,48,108,0.2)',
  },
  cta: {
    fontSize: '16px',
    color: '#888',
    fontWeight: 400,
  },
  ctaHighlight: {
    color: '#E1306C',
    fontWeight: 600,
  },
};

export default function Design2({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.glow1} />
      <div style={styles.glow2} />
      <div style={styles.inner}>
        <div style={styles.header}>
          <InstagramIcon size={44} color="#E1306C" />
          <span style={styles.username}>@{username}</span>
        </div>
        <div style={styles.subtitle}>Follow Us on Instagram</div>
        <div style={styles.count}>{formatCount(animatedCount)}</div>
        <div style={styles.followersLabel}>Followers</div>
        <div style={styles.growth}>+{todayGrowth} Today</div>
        <div style={styles.bottom}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={140}
              fgColor="#0a0a0f"
              bgColor="#fff"
              level="M"
            />
          </div>
          <div>
            <div style={styles.cta}><span style={styles.ctaHighlight}>Scan</span> to Follow Us</div>
          </div>
        </div>
      </div>
    </div>
  );
}
