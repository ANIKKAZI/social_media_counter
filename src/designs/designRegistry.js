/**
 * Central Design Registry
 * Single source of truth for all themes available in both Instagram and Google Reviews modes.
 * Each design is available on both platforms with platform-specific data rendering.
 */

import Design1 from './Design1';
import Design2 from './Design2';
import Design3 from './Design3';
import Design4 from './Design4';
import Design5 from './Design5';
import Design6 from './Design6';
import Design7 from './Design7';
import Design8 from './Design8';
import Design9 from './Design9';
import Design10 from './Design10';
import Design11 from './Design11';
import Design12 from './Design12';
import Design13 from './Design13';
import DesignHalloween from './DesignHalloween';
import DesignDiwali from './DesignDiwali';

export const DESIGNS = [
  { id: 'minimal-clean', Component: Design1, name: 'Minimal Clean', category: 'instagram' },
  { id: 'dark-neon', Component: Design2, name: 'Dark Mode Neon', category: 'instagram' },
  { id: 'instagram-gradient', Component: Design3, name: 'Instagram Gradient', category: 'instagram' },
  { id: 'cafe', Component: Design4, name: 'Cafe Theme', category: 'instagram' },
  { id: 'luxury', Component: Design5, name: 'Luxury Black & Gold', category: 'instagram' },
  { id: 'confetti', Component: Design6, name: 'Playful Confetti', category: 'instagram' },
  { id: 'flip-counter', Component: Design7, name: 'Retro Flip Counter', category: 'instagram' },
  { id: 'glassmorphism', Component: Design8, name: 'Glassmorphism', category: 'instagram' },
  { id: 'bold-typography', Component: Design9, name: 'Bold Typography', category: 'instagram' },
  { id: 'cafe-background', Component: Design10, name: 'Cafe Background', category: 'instagram' },
  { id: 'kiosk-dashboard', Component: Design11, name: 'Kiosk Dashboard', category: 'instagram' },
  { id: 'instagram-flip', Component: Design12, name: 'Instagram Flip', category: 'instagram' },
  { id: 'lametric-led', Component: Design13, name: 'LaMetric LED', category: 'instagram' },
  { id: 'halloween', Component: DesignHalloween, name: 'Halloween Special', category: 'holiday' },
  { id: 'diwali', Component: DesignDiwali, name: 'Diwali Celebration', category: 'holiday' },
];

/**
 * Get all available designs.
 * All designs are available on both platforms.
 */
export function getAllDesigns() {
  return DESIGNS;
}

/**
 * Get a specific design by ID.
 */
export function getDesignById(id) {
  return DESIGNS.find(d => d.id === id);
}

/**
 * Get design index by ID (for array-based indexing).
 */
export function getDesignIndexById(id) {
  return DESIGNS.findIndex(d => d.id === id);
}
