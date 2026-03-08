'use client';

import { useState, useEffect } from 'react';

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if popup was already seen in this session
    const popupSeen = sessionStorage.getItem('rtmklik-popup-seen');
    if (!popupSeen) {
      setShow(true);
      sessionStorage.setItem('rtmklik-popup-seen', 'true');
    }
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      {/* Dark overlay backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1060,
        }}
      />

      {/* Popup container */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '480px',
          width: '90%',
          borderRadius: '12px',
          overflow: 'hidden',
          zIndex: 1061,
          backgroundColor: '#fff',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="promo-popup-close"
          aria-label="Close popup"
        >
          ✕
        </button>

        {/* Popup image */}
        <img
          src="/popup_image.png"
          alt="RTM Klik - Betul Betul Percuma!"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </>
  );
}
