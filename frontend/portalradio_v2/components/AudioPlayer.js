'use client';

import { useState, useRef } from 'react';

export default function AudioPlayer({ streamUrl, accent }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const disabled = !streamUrl || streamUrl === '#';

  const toggle = () => {
    if (disabled) return;
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="card-dark p-3 d-flex align-items-center gap-3" style={{ borderRadius: '8px' }}>
      {!disabled && <audio ref={audioRef} src={streamUrl} />}

      {/* RTM Klik logo */}
      <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
        <img src="/rtmklik.png" alt="RTM Klik" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <button
        onClick={toggle}
        disabled={disabled}
        className="btn d-flex align-items-center justify-content-center"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: disabled ? '#555' : accent,
          border: 'none',
          color: '#fff',
          fontSize: '1.2rem',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          flexShrink: 0,
        }}
      >
        <i className={`bi ${playing ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
      </button>
      <div className="flex-grow-1">
        <div style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: '0.9rem' }}>
          {playing ? 'Sedang Dimainkan' : 'Siaran Langsung'}
        </div>
        <div style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>
          {disabled ? 'Strim belum tersedia' : 'Klik untuk mula mendengar'}
        </div>
      </div>
      {/* Animated bars when playing */}
      {playing && (
        <div className="d-flex align-items-end gap-1" style={{ height: '24px' }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                width: '3px',
                backgroundColor: accent,
                borderRadius: '2px',
                animation: `audioBar 0.${3 + i}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
