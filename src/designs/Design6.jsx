/* Design 6: Playful Confetti Theme */
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { InstagramIcon, formatCount } from '../components/shared';

const confettiColors = ['#E1306C', '#833AB4', '#405DE6', '#F77737', '#FCAF45', '#58c322'];

function ConfettiDots() {
  const [dots] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 6 + Math.random() * 14,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      opacity: 0.15 + Math.random() * 0.3,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      rotation: Math.random() * 360,
    }))
  );

  return (
    <>
      {dots.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            background: d.color,
            opacity: d.opacity,
            borderRadius: d.borderRadius,
            transform: `rotate(${d.rotation}deg)`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff8f0',
    fontFamily: "'Poppins', 'Helvetica Neue', Arial, sans-serif",
    color: '#333',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  username: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#E1306C',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#888',
    letterSpacing: '1px',
  },
  count: {
    fontSize: '140px',
    fontWeight: 900,
    lineHeight: 1,
    color: '#333',
    textShadow: '3px 3px 0 #F77737, 6px 6px 0 #FCAF4533',
  },
  followersLabel: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#833AB4',
    textTransform: 'uppercase',
    letterSpacing: '6px',
  },
  growth: {
    padding: '10px 28px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #E1306C, #F77737)',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 700,
    boxShadow: '0 4px 20px rgba(225,48,108,0.3)',
  },
  bottom: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginTop: '16px',
  },
  qrWrap: {
    padding: '12px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '2px dashed #E1306C44',
  },
  cta: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#833AB4',
  },
  emoji: {
    fontSize: '24px',
  },
};

export default function Design6({ followers, todayGrowth, username }) {
  const animatedCount = useAnimatedCount(followers);

  return (
    <div style={styles.container}>
      <ConfettiDots />
      <div style={styles.inner}>
        <span style={styles.emoji}>🎉</span>
        <div style={styles.header}>
          <InstagramIcon size={42} color="#E1306C" />
          <span style={styles.username}>@{username}</span>
        </div>
        <div style={styles.subtitle}>Follow Us on Instagram</div>
        <div style={styles.count}>{formatCount(animatedCount)}</div>
        <div style={styles.followersLabel}>Followers</div>
        <div style={styles.growth}>+{todayGrowth} Today 🎊</div>
        <div style={styles.bottom}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={`https://instagram.com/${username}`}
              size={140}
              fgColor="#833AB4"
              bgColor="#fff"
              level="M"
            />
          </div>
          <div style={styles.cta}>👈 Scan to Follow Us!</div>
        </div>
      </div>
    </div>
  );
}
