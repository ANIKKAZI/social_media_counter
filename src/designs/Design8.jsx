/* Design 8: Glassmorphism UI */
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { InstagramIcon, formatCount } from '../components/shared';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#fff',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    top: '-120px',
    left: '-100px',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    bottom: '-80px',
    right: '-60px',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '28px',
    padding: '50px 70px',
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
    border: '1px solid rgba(255,255,255,0.25)',
    boxShadow: '0 8px 32px rgba(31,38,135,0.2)',
    maxWidth: '1080px',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  username: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#fff',
  },
  subtitle: {
    fontSize: '15px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  count: {
    fontSize: '120px',
    fontWeight: 800,
    lineHeight: 1,
    color: '#fff',
    textShadow: '0 2px 20px rgba(0,0,0,0.15)',
  },
  followersLabel: {
    fontSize: '20px',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '6px',
  },
  growth: {
    display: 'inline-block',
    padding: '10px 24px',
    borderRadius: '30px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    fontSize: '17px',
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.3)',
    marginTop: '8px',
    alignSelf: 'flex-start',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  qrWrap: {
    padding: '14px',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(31,38,135,0.15)',
  },
  cta: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    letterSpacing: '1px',
  },
};

export default function Design8({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.header}>
            <InstagramIcon size={40} color="#fff" />
            <span style={styles.username}>@{username}</span>
          </div>
          <div style={styles.subtitle}>Follow Us on Instagram</div>
          <div style={styles.count}>{formatCount(animatedCount)}</div>
          <div style={styles.followersLabel}>Followers</div>
          <div style={styles.growth}>+{todayGrowth} Today</div>
        </div>
        <div style={styles.right}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={160}
              fgColor="#764ba2"
              bgColor="#fff"
              level="M"
            />
          </div>
          <div style={styles.cta}>Scan to Follow Us</div>
        </div>
      </div>
    </div>
  );
}
