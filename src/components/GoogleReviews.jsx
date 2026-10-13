import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getAllDesigns } from '../designs';
import { fetchGoogleReviews } from '../liveData';

const designs = getAllDesigns();

function useGoogleReviews(config) {
  const fallbackCount = Number(config?.googleFallbackCount || 0);
  const fallbackRating = Number(config?.googleFallbackRating || 0);
  const [data, setData] = useState({ name: '', reviewCount: fallbackCount, rating: fallbackRating });
  useEffect(() => {
    setData(prev => ({
      name: prev.name,
      reviewCount: prev.reviewCount || fallbackCount,
      rating: prev.rating || fallbackRating,
    }));
  }, [fallbackCount, fallbackRating]);
  useEffect(() => {
    let active = true;
    const load = () => fetchGoogleReviews()
      .then(d => { console.log(`[Google Reviews] ${d.name}: ${d.rating} stars, ${d.reviewCount} reviews`); if (active) setData(d); })
      .catch(error => console.warn(`[Google Reviews] poll failed: ${error.message}`));
    load();
    const id = setInterval(load, 20000);
    return () => { active = false; clearInterval(id); };
  }, []);
  return data;
}

const panelStyles = {
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
    paddingRight: 'calc(env(safe-area-inset-right, 0px) + 12px)',
    paddingBottom: '12px',
    paddingLeft: '12px',
    gap: '8px',
    pointerEvents: 'none',
    maxHeight: '100vh',
    overflow: 'visible',
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
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    touchAction: 'pan-y',
  },
  label: {
    color: '#aaa',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  designBtn: (active) => ({
    background: active ? '#4285f4' : 'rgba(255,255,255,0.1)',
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

export default function GoogleReviews({ config, onBack }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [interval, setIntervalValue] = useState(30);
  const [showPanel, setShowPanel] = useState(false);
  const [visible, setVisible] = useState(true);
  const timer = useRef(null);
  const googleData = useGoogleReviews(config);

  const switchTo = useCallback((index) => {
    setVisible(false);
    setTimeout(() => {
      setActiveIndex(index);
      setVisible(true);
    }, 400);
  }, []);

  useEffect(() => {
    if (!autoRotate) {
      if (timer.current) clearInterval(timer.current);
      return;
    }

    timer.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % designs.length);
        setVisible(true);
      }, 400);
    }, interval * 1000);

    return () => clearInterval(timer.current);
  }, [autoRotate, interval]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const { Component } = designs[activeIndex];

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
        }}
      >
        <Component
          followers={googleData.reviewCount}
          username={googleData.name || 'Google Business'}
          platform="google"
          rating={googleData.rating}
          platformLabel="Google Reviews"
          googleReviewUrl={config?.googleReviewUrl}
        />
      </div>

      {/* Control Panel */}
      <div style={panelStyles.panel}>
        <button
          style={panelStyles.toggleBtn}
          onClick={() => setShowPanel(!showPanel)}
        >
          ⚙
        </button>

        {showPanel && (
          <div style={panelStyles.controls}>
            <button 
              style={panelStyles.fsBtn}
              onClick={onBack}
              title="Return to platform selection"
            >
              ← Back to Platforms
            </button>

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

            <div style={panelStyles.label}>Display</div>
            <button style={panelStyles.fsBtn} onClick={toggleFullscreen}>
              ⛶ Fullscreen
            </button>

            <div style={{ ...panelStyles.label, marginTop: '8px' }}>Auto Rotate</div>
            <div style={panelStyles.row}>
              <button
                style={panelStyles.autoBtn(autoRotate)}
                onClick={() => setAutoRotate(!autoRotate)}
              >
                {autoRotate ? 'ON' : 'OFF'}
              </button>
              <select
                value={interval}
                onChange={(e) => setIntervalValue(Number(e.target.value))}
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
          </div>
        )}
      </div>
    </div>
  );
}
