/* Design 1: Minimal Clean (White + Black) */
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
    background: '#FFFFFF',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#111',
    padding: '40px',
    boxSizing: 'border-box',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1100px',
    gap: '60px',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  label: {
    fontSize: '18px',
    fontWeight: 400,
    color: '#666',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  count: {
    fontSize: '120px',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '-2px',
    color: '#111',
  },
  followersLabel: {
    fontSize: '22px',
    fontWeight: 300,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '6px',
    marginTop: '4px',
  },
  growth: {
    marginTop: '20px',
    padding: '8px 20px',
    borderRadius: '30px',
    background: '#f0fdf4',
    color: '#16a34a',
    fontSize: '18px',
    fontWeight: 600,
    border: '1px solid #bbf7d0',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  qrWrap: {
    padding: '16px',
    border: '2px solid #eee',
    borderRadius: '16px',
  },
  cta: {
    fontSize: '14px',
    color: '#999',
    fontWeight: 400,
    textAlign: 'center',
  },
  username: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#111',
  },
};

export default function Design1({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <div style={styles.header}>
            <InstagramIcon size={40} color="#111" />
            <span style={styles.username}>@{username}</span>
          </div>
          <div style={styles.label}>Follow Us on Instagram</div>
          <div style={styles.count}>{formatCount(animatedCount)}</div>
          <div style={styles.followersLabel}>Followers</div>
          <div style={styles.growth}>+{todayGrowth} Today</div>
        </div>
        <div style={styles.right}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={180}
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
