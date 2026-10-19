import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { InstagramIcon } from '../components/shared';
import './spin-to-win.css';

export const DEFAULT_SPIN_REWARDS = [
    { label: '10% OFF', description: 'Enjoy 10% off your next visit', color: '#0879f9', active: true },
    { label: '15% OFF', description: 'Enjoy 15% off your next visit', color: '#00a9a8', active: true },
    { label: '20% OFF', description: 'Enjoy 20% off your next visit', color: '#0862e9', active: true },
    { label: 'FREE GIFT', description: 'A little gift from us', color: '#8100e8', active: true },
    { label: 'FREE ADD-ON', description: 'Choose a complimentary add-on', color: '#7900eb', active: true },
    { label: 'BUY 1 GET 1', description: 'Buy one, get one on your next visit', color: '#e40083', active: true },
    { label: 'BONUS POINTS', description: 'Bonus points added to your rewards', color: '#00a9a8', active: true },
    { label: 'TRY AGAIN', description: 'Thanks for playing—come back soon', color: '#dc0076', active: true },
];

function spinSettingsFromBuildEnv() {
  const rewards = DEFAULT_SPIN_REWARDS.map((reward, index) => {
    const number = index + 1;
    const active = process.env[`REACT_APP_SPIN_REWARD_${number}_ACTIVE`];
    return {
      ...reward,
      label: process.env[`REACT_APP_SPIN_REWARD_${number}_LABEL`] || reward.label,
      description: process.env[`REACT_APP_SPIN_REWARD_${number}_DESCRIPTION`] || reward.description,
      color: process.env[`REACT_APP_SPIN_REWARD_${number}_COLOR`] || reward.color,
      active: active == null ? reward.active : !/^false|0|no$/i.test(active),
    };
  });
  return {
    rewards,
    callToAction: process.env.REACT_APP_SPIN_CALL_TO_ACTION,
    redemption: process.env.REACT_APP_SPIN_REDEMPTION_INSTRUCTIONS,
    spinCampaignEnabled: process.env.REACT_APP_SPIN_CAMPAIGN_ENABLED !== 'false',
    spinCampaignStart: process.env.REACT_APP_SPIN_CAMPAIGN_START,
    spinCampaignEnd: process.env.REACT_APP_SPIN_CAMPAIGN_END,
    spinLimitPerCustomer: Number(process.env.REACT_APP_SPIN_LIMIT_PER_CUSTOMER || 1),
  };
}

export const DEFAULT_SPIN_CONFIG = {
  callToAction: 'Follow us or share a review to play',
  redemption: 'Show this screen to a team member to redeem. Valid for 30 days.',
  spinCampaignEnabled: true,
  spinCampaignStart: '',
  spinCampaignEnd: '',
  spinLimitPerCustomer: 1,
  rewards: DEFAULT_SPIN_REWARDS,
};

const TAU = Math.PI * 2;
const randomIndex = (length) => {
  // Rejection sampling avoids modulo bias; each active reward has the same chance.
  const range = 0x100000000;
  const limit = Math.floor(range / length) * length;
  const values = new Uint32Array(1);
  do { window.crypto.getRandomValues(values); } while (values[0] >= limit);
  return values[0] % length;
};
const point = (cx, cy, radius, angle) => [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
const segmentPath = (index, total) => {
  const start = -Math.PI / 2 + (index * TAU) / total;
  const end = -Math.PI / 2 + ((index + 1) * TAU) / total;
  const [sx, sy] = point(200, 200, 171, start);
  const [ex, ey] = point(200, 200, 171, end);
  return `M 200 200 L ${sx} ${sy} A 171 171 0 0 1 ${ex} ${ey} Z`;
};

function PrizeWheel({ rewards, rotation, spinning }) {
  const total = rewards.length;
  return <div className="stw-wheel-stage">
    <div className="stw-pointer" aria-hidden="true" />
    <div className="stw-wheel-shell">
      <svg className={`stw-wheel ${spinning ? 'is-spinning' : ''}`} viewBox="0 0 400 400" role="img" aria-label="Prize wheel with eight equal reward segments" style={{ transform: `rotate(${rotation}deg)` }}>
        <defs><radialGradient id="stw-center"><stop stopColor="#283b87"/><stop offset="1" stopColor="#070d2b"/></radialGradient></defs>
        {rewards.map((reward, index) => {
          const angle = -Math.PI / 2 + ((index + 0.5) * TAU) / total;
          const [tx, ty] = point(200, 200, 113, angle);
          const short = reward.label.length > 11;
          return <g key={`${reward.label}-${index}`}>
            <path d={segmentPath(index, total)} fill={reward.color} stroke="#fff" strokeOpacity=".4" strokeWidth="2" />
            <path d={segmentPath(index, total)} fill="url(#stw-center)" opacity=".13" />
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={short ? 12 : 14} fontWeight="800" letterSpacing=".5" transform={`rotate(${(index * 45) + 22.5}, ${tx}, ${ty})`}>
              {reward.label.split(' ').map((word, line) => <tspan key={line} x={tx} dy={line === 0 ? (reward.label.includes(' ') ? -5 : 0) : 15}>{word}</tspan>)}
            </text>
          </g>;
        })}
        <circle cx="200" cy="200" r="58" fill="url(#stw-center)" stroke="#f7c65d" strokeWidth="5" />
        <circle cx="200" cy="200" r="51" fill="none" stroke="#fff" strokeOpacity=".24" />
      </svg>
      <div className="stw-wheel-center"><span>SPIN</span><small>TO</small><span>WIN</span></div>
      <div className="stw-bulbs" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 15}deg) translateY(-185px)` }} />)}</div>
    </div>
  </div>;
}

export default function DesignSpinToWin({ followers = 0, username, profilePictureUrl, platform = 'instagram', googleReviewUrl, rating, spinConfig }) {
  const config = { ...DEFAULT_SPIN_CONFIG, ...spinSettingsFromBuildEnv(), ...(spinConfig || {}) };
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const previousCount = useRef(null);
  const spinState = useRef({ spinning: false, rotation: 0 });
  const spinRef = useRef(null);
  const resultTimer = useRef(null);
  const spinTimer = useRef(null);
  const rewards = useMemo(() => config.rewards || DEFAULT_SPIN_CONFIG.rewards, [config.rewards]);
  const activeRewards = rewards.map((r, index) => ({ ...r, index })).filter(r => r.active && r.label.trim());
  const cleanUsername = (username || '').replace(/^@/, '');
  const businessLabel = platform === 'google' ? (username || 'Google Business') : `@${cleanUsername}`;
  const destination = platform === 'google' ? (googleReviewUrl || 'https://www.google.com/maps') : `https://instagram.com/${cleanUsername}`;
  const countLabel = platform === 'google' ? 'REVIEWS' : 'FOLLOWERS';
  const countValue = Number(followers || 0).toLocaleString();
  const campaignActive = config.spinCampaignEnabled !== false && (!config.spinCampaignStart || Date.now() >= new Date(config.spinCampaignStart).getTime()) && (!config.spinCampaignEnd || Date.now() <= new Date(config.spinCampaignEnd).getTime());
  const spin = () => {
    if (!campaignActive || spinState.current.spinning || !activeRewards.length) return;
    const prize = activeRewards[randomIndex(activeRewards.length)];
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Segment centres are 45° apart; the pointer sits at twelve o'clock.
    const target = ((360 - ((prize.index + 0.5) * 45)) % 360 + 360) % 360;
    const normalizedCurrent = ((rotation % 360) + 360) % 360;
    const delta = (target - normalizedCurrent + 360) % 360;
    setResult(null); setConfetti(false); setSpinning(true);
    spinState.current.spinning = true;
    const finalRotation = spinState.current.rotation + (reduced ? 0 : 6 * 360) + delta;
    spinState.current.rotation = finalRotation;
    setRotation(finalRotation);
    spinTimer.current = window.setTimeout(() => {
      spinState.current.spinning = false;
      setSpinning(false);
      setResult(prize);
      if (prize.label !== 'TRY AGAIN') setConfetti(true);
      resultTimer.current = window.setTimeout(() => { setResult(null); setConfetti(false); }, 4000);
    }, reduced ? 50 : 5200);
  };
  spinRef.current = spin;
  useEffect(() => {
    const current = Number(followers) || 0;
    const previous = previousCount.current;
    previousCount.current = current;
    if (previous !== null && current > previous) spinRef.current();
  }, [followers]);

  useEffect(() => () => {
    window.clearTimeout(spinTimer.current);
    window.clearTimeout(resultTimer.current);
  }, []);
  return <main className="stw-page">
    <div className="stw-atmosphere" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></div>
    <header className="stw-brand">{platform === 'instagram' && profilePictureUrl ? <img className="stw-avatar" src={profilePictureUrl} alt="" referrerPolicy="no-referrer" onError={event => { event.currentTarget.style.display = 'none'; event.currentTarget.nextSibling.style.display = 'grid'; }} /> : null}<div className="stw-logo" style={{ display: platform === 'instagram' && profilePictureUrl ? 'none' : 'grid' }}>{platform === 'google' ? 'G' : <InstagramIcon size={26} color="#d946c5" />}</div><div className="stw-business"><strong>{businessLabel}</strong><span>FOLLOW&nbsp; • &nbsp;SHARE&nbsp; • &nbsp;WIN</span></div><div className="stw-live-count" aria-label={`${countValue} ${countLabel.toLowerCase()}`}><strong>{countValue}</strong><span>{platform === 'google' && rating ? `${Number(rating).toFixed(1)} ★  ·  ` : ''}{countLabel}</span></div></header>
    <section className="stw-main">
      <div className="stw-wheel-column"><div className="stw-campaign-tag"><b/> {businessLabel} <span>•</span> SPIN &amp; WIN</div>
        <PrizeWheel rewards={rewards} rotation={rotation} spinning={spinning} />
        <p className="stw-status" aria-live="polite">{!campaignActive ? 'This spin campaign is currently unavailable.' : spinning ? 'New activity detected — spinning your reward…' : result ? 'Reward revealed — congratulations!' : 'A new follow or review unlocks an automatic spin'}</p>
      </div>
      <aside className="stw-qr-card"><div className="stw-qr-frame"><QRCodeSVG value={destination} size={190} level="H" includeMargin fgColor="#080a1a" bgColor="#fff" /></div>
        <h1>SCAN TO FOLLOW<br/>&amp; UNLOCK YOUR SPIN</h1><div className="stw-divider"><i/><i/><i/></div><p>{config.callToAction}</p>
        <small className="stw-verification">A new verified count update triggers the spin automatically.</small>
      </aside>
    </section>
    <footer className="stw-footer"><div className="stw-next"><span>♧</span> Your next reward is one spin away</div><div className="stw-viral"><b>▮▮▮</b> VIRAL COUNTERS</div></footer>
    {result && <div className="stw-result-toast" role="status" aria-live="assertive"><section className="stw-result" aria-labelledby="stw-result-title">{confetti && <div className="stw-confetti" aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>}<div className="stw-result-icon">{result.label === 'TRY AGAIN' ? '↻' : '✦'}</div><small>{result.label === 'TRY AGAIN' ? 'THANKS FOR PLAYING' : 'YOUR REWARD'}</small><h2 id="stw-result-title">{result.label}</h2><p>{result.description}</p><div className="stw-toast-timer"><i/></div></section></div>}
  </main>;
}
