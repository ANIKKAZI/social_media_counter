import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAnimatedCount } from '../../hooks/useAnimatedCount';
import { formatCount } from '../shared';

const MAX_COUNT_SCALE = 7.2;
const COUNT_WIDTH_BUDGET = 19.8;
const GLYPH_WIDTH = 0.68;

/* Shrinks the count as it gets longer so it always fits beside the QR code. */
export function getCountScale(text) {
  const units = [...text].reduce((sum, ch) => sum + (/[.,]/.test(ch) ? 0.4 : 1), 0);
  return Math.min(MAX_COUNT_SCALE, COUNT_WIDTH_BUDGET / (Math.max(units, 1) * GLYPH_WIDTH));
}

export default function FollowerOverlay({
  followerCount,
  label,
  qrValue,
  qrLabel,
  callToAction,
  showCallToAction = true,
}) {
  const hasCount = typeof followerCount === 'number' && Number.isFinite(followerCount);
  const animated = useAnimatedCount(hasCount ? followerCount : 0);
  const finalText = hasCount ? formatCount(followerCount) : '—';
  const shownText = hasCount ? formatCount(animated) : '—';

  return (
    <section className="tp-panel" aria-label={`${label} counter`} aria-busy={!hasCount}>
      <div className="tp-panel__main">
        <div className="tp-counter">
          <div
            className="tp-count"
            style={{ '--tp-count-scale': getCountScale(finalText) }}
            aria-hidden="true"
          >
            {shownText}
          </div>
          <span className="tp-sr-only" role="status">{hasCount ? `${finalText} ${label}` : `${label} loading`}</span>
          <div className="tp-label">{label}</div>
        </div>
        <div className="tp-qr">
          <QRCodeSVG
            value={qrValue}
            size={256}
            level="M"
            marginSize={2}
            fgColor="#0a0a2e"
            bgColor="#ffffff"
            title={qrLabel}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      </div>
      {showCallToAction && <div className="tp-cta">{callToAction}</div>}
    </section>
  );
}
