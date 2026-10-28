'use client';

import { useState, useEffect } from 'react';

const SEEN_COOKIE = 'rtmklik-popup-seen';

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // A session cookie (no expiry) is shared by every tab and cleared when the browser closes,
    // unlike sessionStorage which is per tab, so the popup shows once per browser session
    const popupSeen = document.cookie.split('; ').some((c) => c.startsWith(`${SEEN_COOKIE}=`));
    if (!popupSeen) {
      setShow(true);
      document.cookie = `${SEEN_COOKIE}=1; path=/; SameSite=Lax`;
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
