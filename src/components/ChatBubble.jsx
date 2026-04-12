/* Chat Bubble Setup Interface */
import React, { useState, useRef, useEffect } from 'react';

const SETUP_STEPS = [
  { bot: "Welcome! Let's set up your social media counter. What platform would you like to track?", options: ['Instagram', 'TikTok', 'YouTube', 'Twitter/X'] },
  { bot: "Great choice! Now enter your handle below and tap OK to start tracking.", options: null },
  { bot: "You're all set! Your live counter is now active. Enjoy! 🎉", options: null },
];

export default function ChatBubble({ onHandleSubmit, platform, onPlatformSelect, isSetupComplete }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: SETUP_STEPS[0].bot },
  ]);
  const [step, setStep] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOptionClick = (option) => {
    if (step === 0) {
      setMessages(prev => [
        ...prev,
        { type: 'user', text: option },
        { type: 'bot', text: SETUP_STEPS[1].bot },
      ]);
      setStep(1);
      onPlatformSelect(option);
    }
  };

  const handleSetupComplete = () => {
    setMessages(prev => [
      ...prev,
      { type: 'bot', text: SETUP_STEPS[2].bot },
    ]);
    setStep(2);
  };

  useEffect(() => {
    if (isSetupComplete && step === 1) {
      handleSetupComplete();
    }
  }, [isSetupComplete]);

  if (minimized) {
    return (
      <div
        onClick={() => setMinimized(false)}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(102,126,234,0.4)',
          zIndex: 100,
          transition: 'transform 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" fill="#fff" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      width: '300px',
      maxHeight: '360px',
      borderRadius: '16px',
      background: 'rgba(20, 20, 30, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 100,
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 6px #4ade80',
          }} />
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
          }}>
            Setup Assistant
          </span>
        </div>
        <div
          onClick={() => setMinimized(true)}
          style={{
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '18px',
            lineHeight: 1,
            padding: '0 4px',
          }}
        >
          −
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
          }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: msg.type === 'user'
                ? '12px 12px 2px 12px'
                : '12px 12px 12px 2px',
              background: msg.type === 'user'
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '12px',
              lineHeight: 1.5,
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Quick reply options */}
        {step === 0 && SETUP_STEPS[0].options && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '4px',
          }}>
            {SETUP_STEPS[0].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                style={{
                  background: 'rgba(102,126,234,0.15)',
                  border: '1px solid rgba(102,126,234,0.3)',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  color: '#8b9cf7',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(102,126,234,0.3)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(102,126,234,0.15)'}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
