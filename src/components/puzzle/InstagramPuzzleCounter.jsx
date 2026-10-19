import React from 'react';
import PuzzleCityscape from './PuzzleCityscape';
import FollowerOverlay from './FollowerOverlay';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './puzzle.css';
import defaultIncompleteImage from '../../assets/toronto-puzzle-incomplete.webp';
import defaultCompletedImage from '../../assets/toronto-puzzle-complete.webp';

export const PUZZLE_STATUS = {
  INCOMPLETE: 'incomplete',
  VERIFYING: 'verifying',
  COMPLETED: 'completed',
  ERROR: 'error',
};

const DEFAULT_COPY = {
  label: 'Followers',
  callToAction: 'SCAN TO FOLLOW AND COMPLETE THE PUZZLE',
  headline: 'Follow us on Instagram',
  qrLabel: 'QR code that opens our Instagram profile',
  artAlt: 'Toronto night skyline with the CN Tower, built as a jigsaw puzzle',
  statusText: {
    incomplete: 'Puzzle in progress — waiting for the next follower',
    verifying: 'Verifying…',
    completed: 'Puzzle complete — thank you for following!',
    error: 'We could not confirm the follow. Please try again.',
  },
};

/* Completion is never inferred from a QR scan: an explicit status wins, otherwise the
   caller must pass a verified flag (e.g. the trusted backend count went up). */
export function resolvePuzzleStatus({ status, isFollowVerified }) {
  if (Object.values(PUZZLE_STATUS).includes(status)) return status;
  return isFollowVerified ? PUZZLE_STATUS.COMPLETED : PUZZLE_STATUS.INCOMPLETE;
}

export default function InstagramPuzzleCounter({
  followerCount,
  instagramUrl,
  isFollowVerified = false,
  status,
  incompleteImage = defaultIncompleteImage,
  completedImage = defaultCompletedImage,
  header = null,
  copy,
}) {
  const text = { ...DEFAULT_COPY, ...copy, statusText: { ...DEFAULT_COPY.statusText, ...copy?.statusText } };
  const resolved = resolvePuzzleStatus({ status, isFollowVerified });
  const isComplete = resolved === PUZZLE_STATUS.COMPLETED;
  const isWide = useMediaQuery('(min-aspect-ratio: 8/5)');
  const variant = isWide ? 'band' : 'split';

  const overlay = (
    <FollowerOverlay
      followerCount={followerCount}
      label={text.label}
      qrValue={instagramUrl}
      qrLabel={text.qrLabel}
      callToAction={text.callToAction}
      showCallToAction={!isComplete}
    />
  );

  return (
    <div className={`tp-root tp-root--${variant}`} data-status={resolved}>
      <div className="tp-content">
        {header && <header className="tp-header">{header}</header>}
        <PuzzleCityscape
          incompleteImage={incompleteImage}
          completedImage={completedImage}
          isComplete={isComplete}
          variant={variant}
          alt={`${text.artAlt}${isComplete ? ' — completed' : ' — with missing pieces'}`}
        >
          {overlay}
        </PuzzleCityscape>
        <div className={`tp-status tp-status--${resolved}`} role="status">
          {text.statusText[resolved]}
        </div>
      </div>
    </div>
  );
}
