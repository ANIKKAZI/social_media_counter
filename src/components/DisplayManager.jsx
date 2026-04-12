import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Design1, Design2, Design3, Design4, Design5,
  Design6, Design7, Design8, Design9, Design10,
} from '../designs';

const designs = [
  { Component: Design1, name: 'Minimal Clean' },
  { Component: Design2, name: 'Dark Mode Neon' },
  { Component: Design3, name: 'Instagram Gradient' },
  { Component: Design4, name: 'Cafe Theme' },
  { Component: Design5, name: 'Luxury Black & Gold' },
  { Component: Design6, name: 'Playful Confetti' },
  { Component: Design7, name: 'Retro Flip Counter' },
  { Component: Design8, name: 'Glassmorphism' },
  { Component: Design9, name: 'Bold Typography' },
  { Component: Design10, name: 'Cafe Background' },
];

const panelStyles = {
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: '12px',
    gap: '8px',
    pointerEvents: 'none',
  },
  toggleBtn: {
    pointerEvents: 'auto',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  controls: {
    pointerEvents: 'auto',
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(12px)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '220px',
  },
  label: {
    color: '#aaa',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  designBtn: (active) => ({
    background: active ? '#E1306C' : 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: active ? 600 : 400,
    transition: 'background 0.2s',
  }),
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  autoBtn: (active) => ({
    background: active ? '#16a34a' : 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 600,
  }),
  fsBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default function DisplayManager({ followers, todayGrowth, username }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotateInterval, setRotateInterval] = useState(30);
  const [showPanel, setShowPanel] = useState(false);

  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  const switchTo = useCallback((index) => {
    setVisible(false);
    setTimeout(() => {
      setActiveIndex(index);
      setVisible(true);
    }, 400);
  }, []);

  useEffect(() => {
    if (!autoRotate) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % designs.length);
        setVisible(true);
      }, 400);
    }, rotateInterval * 1000);

    return () => clearInterval(timerRef.current);
  }, [autoRotate, rotateInterval]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const { Component } = designs[activeIndex];

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
        }}
      >
        <Component
          followers={followers}
          todayGrowth={todayGrowth}
          username={username}
        />
      </div>

      {/* Control Panel */}
      <div style={panelStyles.panel}>
        <button
          style={panelStyles.toggleBtn}
          onClick={() => setShowPanel(!showPanel)}
        >
          {showPanel ? '✕ Close' : '⚙ Controls'}
        </button>

        {showPanel && (
          <div style={panelStyles.controls}>
            <div style={panelStyles.label}>Designs</div>
            {designs.map((d, i) => (
              <button
                key={i}
                style={panelStyles.designBtn(i === activeIndex)}
                onClick={() => switchTo(i)}
              >
                {i + 1}. {d.name}
              </button>
            ))}

            <div style={{ ...panelStyles.label, marginTop: '8px' }}>Auto Rotate</div>
            <div style={panelStyles.row}>
              <button
                style={panelStyles.autoBtn(autoRotate)}
                onClick={() => setAutoRotate(!autoRotate)}
              >
                {autoRotate ? 'ON' : 'OFF'}
              </button>
              <select
                value={rotateInterval}
                onChange={(e) => setRotateInterval(Number(e.target.value))}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '12px',
                }}
              >
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={45}>45s</option>
                <option value={60}>60s</option>
              </select>
            </div>

            <div style={{ ...panelStyles.label, marginTop: '8px' }}>Display</div>
            <button style={panelStyles.fsBtn} onClick={toggleFullscreen}>
              ⛶ Fullscreen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
