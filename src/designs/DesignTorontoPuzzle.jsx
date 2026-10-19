/* Design: Toronto Puzzle – the skyline jigsaw completes whenever the trusted count goes up, then resets. */
import React, { useEffect, useRef, useState } from 'react';
import InstagramPuzzleCounter from '../components/puzzle/InstagramPuzzleCounter';
import { ProfileAvatar, GoogleIcon } from '../components/shared';

export const COMPLETED_DISPLAY_MS = 10_000;

const GOOGLE_COPY = {
  label: 'Reviews',
  headline: 'Review us on Google',
  callToAction: 'SCAN TO REVIEW AND COMPLETE THE PUZZLE',
  qrLabel: 'QR code that opens our Google review page',
  statusText: {
    incomplete: 'Puzzle in progress — waiting for the next review',
    completed: 'Puzzle complete — thank you for the review!',
    error: 'We could not confirm the review. Please try again.',
  },
};

export default function DesignTorontoPuzzle({ followers, username, profilePictureUrl, platform = 'instagram', platformLabel, googleReviewUrl }) {
  const isGoogle = platform === 'google';
  const [isCompleted, setIsCompleted] = useState(false);
  const previousCount = useRef(null);
  const resetTimer = useRef(null);

  // Only a count increase reported by the backend completes the puzzle; a QR scan alone never does.
  useEffect(() => {
    const previous = previousCount.current;
    previousCount.current = followers;
    if (typeof followers !== 'number' || typeof previous !== 'number' || previous <= 0 || followers <= previous) return;
    setIsCompleted(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setIsCompleted(false), COMPLETED_DISPLAY_MS);
  }, [followers]);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const qrUrl = isGoogle
    ? googleReviewUrl || 'https://g.page/r/google-review'
    : `https://instagram.com/${username}`;

  const header = (
    <>
      {isGoogle ? <GoogleIcon size={40} /> : <ProfileAvatar url={profilePictureUrl} size={40} color="#5ff3ff" />}
      <span>{isGoogle ? username : `@${username}`}</span>
      <span className="tp-header__sub">{platformLabel || (isGoogle ? GOOGLE_COPY.headline : 'Follow us on Instagram')}</span>
    </>
  );

  return (
    <InstagramPuzzleCounter
      followerCount={followers}
      instagramUrl={qrUrl}
      isFollowVerified={isCompleted}
      header={header}
      copy={isGoogle ? GOOGLE_COPY : undefined}
    />
  );
}
