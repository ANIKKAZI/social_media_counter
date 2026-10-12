/* Halloween Special Design - Premium spooky appearance with rich details */
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { formatCount } from '../components/shared';

// CSS animations and styling
if (typeof document !== 'undefined' && !document.head.querySelector('style[data-halloween]')) {
  const tag = document.createElement('style');
  tag.setAttribute('data-halloween', 'true');
  tag.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(2deg); }
    }
    @keyframes pulse-glow {
      0%, 100% { text-shadow: 0 0 10px rgba(255, 127, 0, 0.4), 0 0 20px rgba(255, 127, 0, 0.2); }
      50% { text-shadow: 0 0 20px rgba(255, 127, 0, 0.8), 0 0 40px rgba(255, 127, 0, 0.4); }
    }
    @keyframes bat-flight {
      0%, 100% { transform: translateX(-50%) translateY(-50%); }
      25% { transform: translateX(-45%) translateY(-55%); }
      50% { transform: translateX(-50%) translateY(-45%); }
      75% { transform: translateX(-55%) translateY(-55%); }
    }
    @keyframes spider-web {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
    @keyframes glow-spin {
      0% { filter: drop-shadow(0 0 5px rgba(255, 127, 0, 0.5)); }
      50% { filter: drop-shadow(0 0 15px rgba(255, 127, 0, 0.9)); }
      100% { filter: drop-shadow(0 0 5px rgba(255, 127, 0, 0.5)); }
    }
  `;
  document.head.appendChild(tag);
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a33 25%, #2d1b4d 50%, #3d1a4d 75%, #1a0f2e 100%)',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#fff',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  decorTop1: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    fontSize: '120px',
    opacity: 0.2,
    animation: 'float 6s ease-in-out infinite',
    zIndex: 0,
  },
  decorTop2: {
    position: 'absolute',
    top: '8%',
    right: '18%',
    fontSize: '100px',
    opacity: 0.15,
    animation: 'bat-flight 8s ease-in-out infinite',
    zIndex: 0,
  },
  decorMid: {
    position: 'absolute',
    left: '8%',
    top: '45%',
    fontSize: '110px',
    opacity: 0.18,
    animation: 'float 7s ease-in-out infinite reverse',
    zIndex: 0,
  },
  decorBottom1: {
    position: 'absolute',
    bottom: '8%',
    right: '10%',
    fontSize: '90px',
    opacity: 0.12,
    animation: 'float 8s ease-in-out infinite',
    zIndex: 0,
  },
  decorBottom2: {
    position: 'absolute',
    bottom: '12%',
    left: '12%',
    fontSize: '95px',
    opacity: 0.14,
    animation: 'bat-flight 9s ease-in-out infinite reverse',
    zIndex: 0,
  },
  spiderWeb: {
    position: 'absolute',
    top: '2%',
    right: '2%',
    fontSize: '60px',
    opacity: 0.15,
    animation: 'spider-web 3s ease-in-out infinite',
    zIndex: 0,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1100px',
    gap: '80px',
    position: 'relative',
    zIndex: 1,
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
    marginBottom: '16px',
  },
  headerIcon: {
    fontSize: '48px',
    animation: 'glow-spin 2s ease-in-out infinite',
  },
  username: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#fff',
    textShadow: '0 2px 15px rgba(255, 127, 0, 0.4), 0 0 20px rgba(255, 50, 0, 0.2)',
    letterSpacing: '-0.5px',
  },
  label: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#ff8a00',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '12px',
    textShadow: '0 0 8px rgba(255, 127, 0, 0.4)',
  },
  count: {
    fontSize: '140px',
    fontWeight: 900,
    lineHeight: 0.9,
    letterSpacing: '-3px',
    background: 'linear-gradient(135deg, #ff8a00 0%, #ff5500 50%, #ff8a00 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 0 40px rgba(255, 127, 0, 0.4)',
    animation: 'pulse-glow 2s ease-in-out infinite',
    filter: 'drop-shadow(0 0 10px rgba(255, 127, 0, 0.3))',
  },
  followersLabel: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffaa44',
    textTransform: 'uppercase',
    letterSpacing: '5px',
    marginTop: '8px',
    textShadow: '0 2px 10px rgba(255, 127, 0, 0.3)',
  },
  growth: {
    marginTop: '20px',
    padding: '12px 28px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, rgba(255, 127, 0, 0.25), rgba(255, 50, 0, 0.15))',
    color: '#ffaa44',
    fontSize: '18px',
    fontWeight: 700,
    border: '3px solid rgba(255, 127, 0, 0.5)',
    textShadow: '0 0 8px rgba(255, 127, 0, 0.5)',
    letterSpacing: '1px',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  qrWrap: {
    padding: '20px',
    background: 'linear-gradient(135deg, #fff9f0, #fffef8)',
    borderRadius: '24px',
    boxShadow: '0 0 40px rgba(255, 127, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.3)',
    border: '3px solid rgba(255, 127, 0, 0.3)',
  },
  cta: {
    fontSize: '16px',
    color: '#ffaa44',
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textShadow: '0 0 8px rgba(255, 127, 0, 0.3)',
  },
  ratingStars: {
    fontSize: '28px',
    color: '#ff8a00',
    textShadow: '0 0 8px rgba(255, 127, 0, 0.4)',
    marginBottom: '4px',
    letterSpacing: '2px',
  },
}

export default function DesignHalloween({
  followers,
  todayGrowth = 0,
  username,
  platform = 'instagram',
  rating,
  platformLabel,
}) {
  const animatedCount = useAnimatedCount(followers);
  const isGoogle = platform === 'google';

  return (
    <div style={styles.container}>
      {/* Decorative elements */}
      <div style={styles.decorTop1}>🎃</div>
      <div style={styles.decorTop2}>🦇</div>
      <div style={styles.decorMid}>👻</div>
      <div style={styles.decorBottom1}>🎃</div>
      <div style={styles.decorBottom2}>🦇</div>
      <div style={styles.spiderWeb}>🕷️</div>

      <div style={styles.inner}>
        {/* LEFT SECTION */}
        <div style={styles.left}>
          <div style={styles.header}>
            <div style={styles.headerIcon}>
              {isGoogle ? '⭐' : '📱'}
            </div>
            <span style={styles.username}>
              {isGoogle ? username : `@${username}`}
            </span>
          </div>

          <div style={styles.label}>
            🎃 {platformLabel || (isGoogle ? 'Google Reviews' : 'Follow Us on Instagram')} 🎃
          </div>

          <div style={styles.count}>{formatCount(animatedCount)}</div>

          <div style={styles.followersLabel}>
            {isGoogle ? (
              <>
                <div style={styles.ratingStars}>
                  ★★★★★
                </div>
                {rating ? `${rating.toFixed(1)}` : '5'} Star Reviews
              </>
            ) : (
              'Followers'
            )}
          </div>

          {!isGoogle && todayGrowth > 0 && (
            <div style={styles.growth}>
              ✨ +{todayGrowth} Today
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div style={styles.right}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={
                isGoogle
                  ? process.env.REACT_APP_GOOGLE_REVIEW_URL || 'https://g.page/r/google-review'
                  : `https://instagram.com/${username}`
              }
              size={180}
              fgColor="#1a1a2e"
              bgColor="#fff"
              level="M"
            />
          </div>
          <div style={styles.cta}>
            👻 {isGoogle ? 'Scan to Rate & Review' : 'Scan to Follow Us'} 👻
          </div>
        </div>
      </div>
    </div>
  );
}
