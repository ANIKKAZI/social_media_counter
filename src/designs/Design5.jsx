/* Design 5: Luxury Theme (Black + Gold) */
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { InstagramIcon, formatCount } from '../components/shared';

const gold = '#d4af37';
const goldLight = '#f0d060';

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 100%)',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#fff',
    padding: '40px',
    boxSizing: 'border-box',
  },
  card: {
    background: 'linear-gradient(160deg, #111 0%, #1c1c1c 100%)',
    borderRadius: '24px',
    padding: '60px 80px',
    display: 'flex',
    alignItems: 'center',
    gap: '70px',
    border: `1px solid ${gold}33`,
    boxShadow: `0 0 60px rgba(212,175,55,0.08), 0 20px 60px rgba(0,0,0,0.4)`,
    maxWidth: '1100px',
    width: '100%',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  goldLine: {
    width: '80px',
    height: '2px',
    background: `linear-gradient(90deg, ${gold}, transparent)`,
    margin: '8px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  username: {
    fontSize: '26px',
    fontWeight: 600,
    color: gold,
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#777',
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },
  count: {
    fontSize: '130px',
    fontWeight: 800,
    lineHeight: 1,
    background: `linear-gradient(135deg, ${goldLight}, ${gold})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: `drop-shadow(0 0 20px rgba(212,175,55,0.3))`,
  },
  followersLabel: {
    fontSize: '22px',
    fontWeight: 300,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '8px',
  },
  growth: {
    display: 'inline-block',
    padding: '10px 24px',
    borderRadius: '30px',
    background: 'rgba(212,175,55,0.1)',
    color: gold,
    fontSize: '17px',
    fontWeight: 600,
    border: `1px solid ${gold}44`,
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
    background: '#fff',
    borderRadius: '16px',
    boxShadow: `0 0 30px rgba(212,175,55,0.1)`,
  },
  cta: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#777',
    textAlign: 'center',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
};

export default function Design5({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.header}>
            <InstagramIcon size={40} color={gold} />
            <span style={styles.username}>@{username}</span>
          </div>
          <div style={styles.subtitle}>Follow Us on Instagram</div>
          <div style={styles.goldLine} />
          <div style={styles.count}>{formatCount(animatedCount)}</div>
          <div style={styles.followersLabel}>Followers</div>
          <div style={styles.growth}>+{todayGrowth} Today</div>
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
