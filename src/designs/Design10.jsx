/* Design 10: Image Background (Food/Cafe Aesthetic) */
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
    /* Rich warm gradient that mimics a food/cafe photo aesthetic */
    background: `
      linear-gradient(135deg, rgba(30,20,10,0.92) 0%, rgba(40,25,15,0.88) 100%),
      linear-gradient(45deg, #8b4513 0%, #d2691e 25%, #a0522d 50%, #8b6914 75%, #654321 100%)
    `,
    backgroundColor: '#2c1810',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#fff',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  /* Decorative warm light circles mimicking bokeh in food photography */
  bokeh1: {
    position: 'absolute',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,180,50,0.12) 0%, transparent 70%)',
    top: '10%',
    right: '15%',
    pointerEvents: 'none',
  },
  bokeh2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,140,50,0.1) 0%, transparent 70%)',
    bottom: '15%',
    left: '10%',
    pointerEvents: 'none',
  },
  bokeh3: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,200,100,0.08) 0%, transparent 70%)',
    top: '60%',
    right: '30%',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    borderRadius: '28px',
    padding: '50px 70px',
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
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
  tagline: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#d4a574',
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginTop: '4px',
  },
  username: {
    fontSize: '26px',
    fontWeight: 700,
    color: '#fff',
  },
  subtitle: {
    fontSize: '15px',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  warmLine: {
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, #d4a574, transparent)',
    margin: '4px 0',
  },
  count: {
    fontSize: '120px',
    fontWeight: 800,
    lineHeight: 1,
    color: '#fff',
    textShadow: '0 4px 30px rgba(212,165,116,0.3)',
  },
  followersLabel: {
    fontSize: '20px',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '8px',
  },
  growth: {
    display: 'inline-block',
    padding: '10px 22px',
    borderRadius: '30px',
    background: 'rgba(212,165,116,0.15)',
    color: '#d4a574',
    fontSize: '17px',
    fontWeight: 600,
    border: '1px solid rgba(212,165,116,0.3)',
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
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
  },
  cta: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
};

export default function Design10({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <div style={styles.bokeh1} />
      <div style={styles.bokeh2} />
      <div style={styles.bokeh3} />
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.tagline}>Taste • Share • Follow</div>
          <div style={styles.header}>
            <InstagramIcon size={38} color="#d4a574" />
            <span style={styles.username}>@{username}</span>
          </div>
          <div style={styles.subtitle}>Follow Us on Instagram</div>
          <div style={styles.warmLine} />
          <div style={styles.count}>{formatCount(animatedCount)}</div>
          <div style={styles.followersLabel}>Followers</div>
          <div style={styles.growth}>+{todayGrowth} Today</div>
        </div>
        <div style={styles.right}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={160}
              fgColor="#2c1810"
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
