/* Design 9: Bold Typography Focus */
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
    background: '#f5f5f5',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#111',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  bgText: {
    position: 'absolute',
    fontSize: '320px',
    fontWeight: 900,
    color: 'rgba(0,0,0,0.03)',
    lineHeight: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '-10px',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1100px',
    position: 'relative',
    zIndex: 1,
    gap: '40px',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  username: {
    fontSize: '20px',
    fontWeight: 500,
    color: '#E1306C',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  bigLabel: {
    fontSize: '80px',
    fontWeight: 900,
    lineHeight: 0.9,
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: '-3px',
  },
  count: {
    fontSize: '160px',
    fontWeight: 900,
    lineHeight: 0.95,
    color: '#E1306C',
    letterSpacing: '-5px',
  },
  followersLabel: {
    fontSize: '80px',
    fontWeight: 900,
    lineHeight: 0.9,
    color: '#111',
    textTransform: 'uppercase',
    letterSpacing: '-3px',
  },
  growth: {
    display: 'inline-block',
    padding: '8px 20px',
    background: '#111',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '2px',
    marginTop: '12px',
    alignSelf: 'flex-start',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  qrWrap: {
    padding: '12px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  cta: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#111',
    textAlign: 'center',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#888',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginTop: '4px',
  },
};

export default function Design9({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.bgText}>INSTA</div>
      <div style={styles.inner}>
        <div style={styles.left}>
          <div style={styles.header}>
            <InstagramIcon size={32} color="#E1306C" />
            <span style={styles.username}>@{username}</span>
          </div>
          <div style={styles.subtitle}>Follow Us on Instagram</div>
          <div style={styles.bigLabel}>We Have</div>
          <div style={styles.count}>{formatCount(animatedCount)}</div>
          <div style={styles.followersLabel}>Followers</div>
          <div style={styles.growth}>+{todayGrowth} TODAY</div>
        </div>
        <div style={styles.right}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={160}
              fgColor="#111"
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
