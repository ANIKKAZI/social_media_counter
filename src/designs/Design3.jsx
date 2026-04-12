/* Design 3: Instagram Gradient Theme */
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
    background: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#fff',
    padding: '40px',
    boxSizing: 'border-box',
  },
  card: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    padding: '60px 80px',
    display: 'flex',
    alignItems: 'center',
    gap: '80px',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    maxWidth: '1100px',
    width: '100%',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '8px',
  },
  username: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  count: {
    fontSize: '130px',
    fontWeight: 900,
    lineHeight: 1,
    color: '#fff',
    textShadow: '0 4px 30px rgba(0,0,0,0.2)',
  },
  followersLabel: {
    fontSize: '24px',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: '8px',
  },
  growth: {
    display: 'inline-block',
    padding: '10px 24px',
    borderRadius: '30px',
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 600,
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
    padding: '16px',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  },
  cta: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    letterSpacing: '1px',
  },
};

export default function Design3({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.header}>
            <InstagramIcon size={42} color="#fff" />
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
              size={170}
              fgColor="#833AB4"
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
