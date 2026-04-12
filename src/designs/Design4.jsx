/* Design 4: Cafe Theme (Warm Brown, Cozy) */
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
    background: 'linear-gradient(160deg, #f5ebe0 0%, #ede0d4 100%)',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    color: '#3c2415',
    padding: '40px',
    boxSizing: 'border-box',
  },
  card: {
    background: '#fdf8f3',
    borderRadius: '24px',
    padding: '50px 70px',
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
    boxShadow: '0 8px 40px rgba(60,36,21,0.08)',
    border: '1px solid #e6d5c3',
    maxWidth: '1060px',
    width: '100%',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  divider: {
    width: '60px',
    height: '2px',
    background: '#c9a87c',
    margin: '8px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '4px',
  },
  username: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#5c3d2e',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: '15px',
    fontWeight: 400,
    color: '#8b6f47',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  count: {
    fontSize: '110px',
    fontWeight: 700,
    lineHeight: 1,
    color: '#3c2415',
    fontFamily: "'Georgia', serif",
  },
  followersLabel: {
    fontSize: '20px',
    fontWeight: 400,
    color: '#8b6f47',
    textTransform: 'uppercase',
    letterSpacing: '6px',
  },
  growth: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 20px',
    borderRadius: '20px',
    background: '#f0e6d6',
    color: '#6b8e23',
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '10px',
    alignSelf: 'flex-start',
    border: '1px solid #ddd0b8',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  qrWrap: {
    padding: '14px',
    background: '#fff',
    borderRadius: '16px',
    border: '2px solid #e6d5c3',
  },
  cta: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#8b6f47',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  coffeeIcon: {
    fontSize: '28px',
    marginBottom: '4px',
  },
};

export default function Design4({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.coffeeIcon}>☕</div>
          <div style={styles.header}>
            <InstagramIcon size={36} color="#8b6f47" />
            <span style={styles.username}>@{username}</span>
          </div>
          <div style={styles.subtitle}>Follow Us on Instagram</div>
          <div style={styles.divider} />
          <div style={styles.count}>{formatCount(animatedCount)}</div>
          <div style={styles.followersLabel}>Followers</div>
          <div style={styles.growth}>☘ +{todayGrowth} Today</div>
        </div>
        <div style={styles.right}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={160}
              fgColor="#3c2415"
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
