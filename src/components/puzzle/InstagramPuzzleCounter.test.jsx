import React from 'react';
import { act, render, screen } from '@testing-library/react';
import InstagramPuzzleCounter, { resolvePuzzleStatus } from './InstagramPuzzleCounter';
import DesignTorontoPuzzle, { COMPLETED_DISPLAY_MS } from '../../designs/DesignTorontoPuzzle';
import { getCountScale } from './FollowerOverlay';

describe('resolvePuzzleStatus', () => {
  it('stays incomplete unless the follow is verified', () => {
    expect(resolvePuzzleStatus({})).toBe('incomplete');
    expect(resolvePuzzleStatus({ isFollowVerified: true })).toBe('completed');
  });

  it('lets an explicit status win', () => {
    expect(resolvePuzzleStatus({ status: 'verifying', isFollowVerified: true })).toBe('verifying');
    expect(resolvePuzzleStatus({ status: 'bogus', isFollowVerified: false })).toBe('incomplete');
  });
});

describe('getCountScale', () => {
  it('shrinks for longer counts', () => {
    expect(getCountScale('735')).toBeGreaterThan(getCountScale('1,234,567'));
  });
});

describe('InstagramPuzzleCounter', () => {
  it('renders count, labels and the QR for the configured URL', () => {
    const { container } = render(
      <InstagramPuzzleCounter followerCount={735} instagramUrl="https://instagram.com/shop" />
    );
    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('SCAN TO FOLLOW AND COMPLETE THE PUZZLE')).toBeInTheDocument();
    expect(screen.getByText(/waiting for the next follower/i)).toBeInTheDocument();
    expect(container.querySelector('svg title').textContent).toMatch(/Instagram/);
    expect(container.querySelector('.tp-root').dataset.status).toBe('incomplete');
  });

  it('shows the completed state only when verified', () => {
    const { container } = render(
      <InstagramPuzzleCounter followerCount={736} instagramUrl="https://instagram.com/shop" isFollowVerified />
    );
    expect(container.querySelector('.tp-root').dataset.status).toBe('completed');
    expect(screen.getByText(/Puzzle complete/i)).toBeInTheDocument();
    expect(screen.queryByText('SCAN TO FOLLOW AND COMPLETE THE PUZZLE')).not.toBeInTheDocument();
  });
});

describe('DesignTorontoPuzzle', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('completes on a count increase, hides the call to action, then resets after 10 seconds', () => {
    const { container, rerender } = render(<DesignTorontoPuzzle followers={735} username="shop" />);
    const status = () => container.querySelector('.tp-root').dataset.status;
    expect(status()).toBe('incomplete');

    rerender(<DesignTorontoPuzzle followers={736} username="shop" />);
    expect(status()).toBe('completed');
    expect(screen.queryByText(/SCAN TO FOLLOW/)).not.toBeInTheDocument();

    act(() => { jest.advanceTimersByTime(COMPLETED_DISPLAY_MS - 1); });
    expect(status()).toBe('completed');
    act(() => { jest.advanceTimersByTime(1); });
    expect(status()).toBe('incomplete');
    expect(screen.getByText('SCAN TO FOLLOW AND COMPLETE THE PUZZLE')).toBeInTheDocument();
    expect(screen.getByText('736', { selector: '.tp-count' })).toBeInTheDocument();
  });

  it('uses review wording for Google', () => {
    const { rerender } = render(<DesignTorontoPuzzle followers={50} username="Shop" platform="google" />);
    expect(screen.getByText('SCAN TO REVIEW AND COMPLETE THE PUZZLE')).toBeInTheDocument();
    rerender(<DesignTorontoPuzzle followers={51} username="Shop" platform="google" />);
    expect(screen.queryByText(/SCAN TO REVIEW/)).not.toBeInTheDocument();
    expect(screen.getByText(/thank you for the review/i)).toBeInTheDocument();
  });

  it('does not complete on the first value or a decrease', () => {
    const { container, rerender } = render(<DesignTorontoPuzzle followers={735} username="shop" />);
    rerender(<DesignTorontoPuzzle followers={734} username="shop" />);
    expect(container.querySelector('.tp-root').dataset.status).toBe('incomplete');
  });
});
