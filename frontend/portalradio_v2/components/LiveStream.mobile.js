'use client';

import { useState, useRef, useEffect } from 'react';
import ChatWidget from './ChatWidget';

// Helper to manage session ID for analytics
function getOrCreateSessionId() {
    let id = sessionStorage.getItem('rtm_sid');
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem('rtm_sid', id);
    }
    return id;
}

export default function LiveStreamMobile() {
  const [chatOpen, setChatOpen] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Fetch stream URL from API (runs once)
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';
    fetch(`${API_URL}/livestream-url`)
        .then(r => r.json())
        .then(d => setStreamUrl(d.livestream_url || null))
        .catch(() => setStreamUrl(null));
  }, []);

  // HLS setup with offline detection and play tracking
  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    const video = videoRef.current;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';
    let playTracked = false;

    (async () => {
      try {
        const HLS = (await import('hls.js')).default;
        if (HLS.isSupported()) {
          const hls = new HLS();
          hlsRef.current = hls;

          hls.on(HLS.Events.ERROR, (_, data) => {
            if (data.fatal) {
              setIsOffline(true);
              hls.destroy();
            }
          });

          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else if (video?.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else {
          setIsOffline(true);
        }
      } catch {
        // HLS not available, try native support
        if (video?.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else {
          setIsOffline(true);
        }
      }
    })();

    // Track play (fire once)
    const handlePlay = () => {
      if (playTracked) return;
      playTracked = true;

      fetch(`${API_URL}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id:  getOrCreateSessionId(),
          event_type:  'livestream_play',
          page_type:   'livestream',
          device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
        }),
      }).catch(() => {});
    };

    video.addEventListener('play', handlePlay, { once: true });

    // Native fallback error handling
    const handleVideoError = () => {
      setIsOffline(true);
    };
    video.addEventListener('error', handleVideoError, { once: true });

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('error', handleVideoError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl]);

  return (
    <section className="py-4">
      <div className="container-fluid px-3">
        <h2 className="section-heading" style={{ fontSize: '1.5rem' }}>Siaran Langsung</h2>

        {/* Video area */}
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          backgroundColor: '#000',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
        }}>
          {isOffline ? (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#111',
              color: '#aaa',
              gap: '10px',
            }}>
              <svg width="40" height="40" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
              <span style={{ fontWeight: 600 }}>Siaran Tidak Tersedia</span>
              <span style={{ fontSize: '0.85rem' }}>Sila cuba semula sebentar lagi</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          )}

          {/* Chat toggle button */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="btn-accent"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              zIndex: 2,
            }}
            title="Toggle chat"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 11.4a1 1 0 0 0-.8-.4H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a.5.5 0 0 1 .4.2l1.9 2.533a2 2 0 0 0 3.2.001l1.9-2.534a.5.5 0 0 1 .4-.2H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
              <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>
          </button>
        </div>

        {/* Info bar — compact for mobile */}
        <div className="card-dark" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 12px',
          borderRadius: '0 0 8px 8px',
          borderTop: 'none',
        }}>
          <span className="badge-live" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>LIVE</span>
          <span style={{
            marginLeft: 'auto',
            color: 'var(--color-muted)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-.828.34-1.752.96-2.55.425-.548.946-1.01 1.554-1.337A5 5 0 0 1 6.936 9.28M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
            </svg>
            1.2K
          </span>
        </div>

        {/* Chat panel — fullscreen overlay on mobile */}
        {chatOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Chat header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid rgba(63, 63, 143, 0.3)',
            }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Sembang Langsung</span>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-muted)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '4px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
              </button>
            </div>

            <ChatWidget fullHeight />
          </div>
        )}
      </div>
    </section>
  );
}
