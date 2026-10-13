/* Diwali Celebration Design - Premium festive appearance with rich details */
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../hooks/useAnimatedCount';
import { formatCount } from '../components/shared';

// CSS animations and styling
if (typeof document !== 'undefined' && !document.head.querySelector('style[data-diwali]')) {
  const tag = document.createElement('style');
  tag.setAttribute('data-diwali', 'true');
  tag.textContent = `
    @keyframes sparkle {
      0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
      50% { opacity: 0.8; transform: scale(1.3) rotate(180deg); }
    }
    @keyframes glow-pulse {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4)); }
      50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9)); }
    }
    @keyframes diya-glow {
      0%, 100% { text-shadow: 0 0 10px rgba(255, 127, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.2); }
      50% { text-shadow: 0 0 20px rgba(255, 127, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5); }
    }
    @keyframes float-gentle {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(1deg); }
    }
    @keyframes flame-pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.15); }
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
    background: 'linear-gradient(135deg, #1a0f2e 0%, #3d1f5c 30%, #5c2f4f 50%, #3d1f5c 70%, #1a0f2e 100%)',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#fff',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  sparkle1: {
    position: 'absolute',
    top: '10%',
    right: '15%',
    fontSize: '60px',
    opacity: 0.4,
    animation: 'sparkle 2.5s ease-in-out infinite',
  },
  sparkle2: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    fontSize: '70px',
    opacity: 0.35,
    animation: 'sparkle 3s ease-in-out infinite 0.5s',
  },
  sparkle3: {
    position: 'absolute',
    bottom: '15%',
    right: '8%',
    fontSize: '65px',
    opacity: 0.38,
    animation: 'sparkle 2.8s ease-in-out infinite 1s',
  },
  sparkle4: {
    position: 'absolute',
    bottom: '20%',
    left: '15%',
    fontSize: '72px',
    opacity: 0.32,
    animation: 'sparkle 3.2s ease-in-out infinite 1.5s',
  },
  diya1: {
    position: 'absolute',
    top: '8%',
    left: '8%',
    fontSize: '85px',
    animation: 'diya-glow 2s ease-in-out infinite',
    opacity: 0.25,
  },
  diya2: {
    position: 'absolute',
    bottom: '10%',
    right: '12%',
    fontSize: '80px',
    animation: 'diya-glow 2.2s ease-in-out infinite 0.3s',
    opacity: 0.22,
  },
  rangoli1: {
    position: 'absolute',
    top: '45%',
    right: '5%',
    fontSize: '95px',
    animation: 'float-gentle 4s ease-in-out infinite',
    opacity: 0.18,
  },
  rangoli2: {
    position: 'absolute',
    top: '50%',
    left: '6%',
    fontSize: '100px',
    animation: 'float-gentle 4.5s ease-in-out infinite 0.5s',
    opacity: 0.16,
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
    fontSize: '52px',
    animation: 'glow-pulse 2s ease-in-out infinite',
  },
  username: {
    fontSize: '32px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #ffd700, #ffb700, #ff9500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 2px 15px rgba(255, 215, 0, 0.4)',
    letterSpacing: '-0.5px',
  },
  label: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#ffb700',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '12px',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.4)',
  },
  count: {
    fontSize: '140px',
    fontWeight: 900,
    lineHeight: 0.9,
    letterSpacing: '-3px',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffb700 40%, #ff9500 70%, #ffd700 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))',
    animation: 'diya-glow 2s ease-in-out infinite',
  },
  followersLabel: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffdd66',
    textTransform: 'uppercase',
    letterSpacing: '5px',
    marginTop: '8px',
    textShadow: '0 2px 12px rgba(255, 215, 0, 0.3)',
  },
  growth: {
    marginTop: '20px',
    padding: '12px 28px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 153, 0, 0.15))',
    color: '#ffdd66',
    fontSize: '18px',
    fontWeight: 700,
    border: '3px solid rgba(255, 215, 0, 0.5)',
    textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
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
    background: 'linear-gradient(135deg, #fef8f0, #fffbf5)',
    borderRadius: '24px',
    boxShadow: '0 0 50px rgba(255, 215, 0, 0.4), 0 0 25px rgba(0, 0, 0, 0.3)',
    border: '3px solid rgba(255, 215, 0, 0.3)',
  },
  cta: {
    fontSize: '16px',
    color: '#ffdd66',
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
  },
  ratingStars: {
    fontSize: '28px',
    color: '#ffd700',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.4)',
    marginBottom: '4px',
    letterSpacing: '2px',
  },
}

/**
 * Diwali Design - Works in both Instagram and Google Reviews modes
 * @param {Object} props - Component props
 * @param {number} props.followers - Instagram follower count or Google review count
 * @param {number} props.todayGrowth - Growth for Instagram mode
 * @param {string} props.username - Instagram username or Google business name
 * @param {string} props.platform - 'instagram' or 'google'
 * @param {number} props.rating - Google rating (for Google Reviews mode)
 * @param {string} props.platformLabel - Platform-specific label
 * @param {string} props.googleReviewUrl - Google review QR URL
 */
export default function DesignDiwali({
  followers,
  todayGrowth = 0,
  username,
  platform = 'instagram',
  rating,
  platformLabel,
  googleReviewUrl,
}) {
  const animatedCount = useAnimatedCount(followers);
  const isGoogle = platform === 'google';

  return (
    <div style={styles.container}>
      {/* Decorative Sparkles */}
      <div style={styles.sparkle1}>✨</div>
      <div style={styles.sparkle2}>💫</div>
      <div style={styles.sparkle3}>✨</div>
      <div style={styles.sparkle4}>💫</div>

      {/* Decorative Diyas (Oil Lamps) */}
      <div style={styles.diya1}>🕯️</div>
      <div style={styles.diya2}>🪔</div>

      {/* Decorative Rangoli Patterns */}
      <div style={styles.rangoli1}>🌸</div>
      <div style={styles.rangoli2}>🎇</div>

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
            🪔 {platformLabel || (isGoogle ? 'Google Reviews' : 'Follow Us on Instagram')} 🪔
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
              🎆 +{todayGrowth} Today
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div style={styles.right}>
          <div style={styles.qrWrap}>
            <QRCodeSVG
              value={
                isGoogle
                  ? googleReviewUrl || 'https://g.page/r/google-review'
                  : `https://instagram.com/${username}`
              }
              size={180}
              fgColor="#1a0f2e"
              bgColor="#fff"
              level="M"
            />
          </div>
          <div style={styles.cta}>
            🪔 {isGoogle ? 'Scan to Rate & Review' : 'Scan to Follow Us'} 🪔
          </div>
        </div>
      </div>
    </div>
  );
}
