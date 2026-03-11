'use client';

import { useState, useEffect, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const messages = [
  { user: 'Ahmad', color: '#3F3F8F', text: 'Selamat pagi semua!', time: '8:01' },
  { user: 'Siti', color: '#DC2626', text: 'Lagu ni best! 🎵', time: '8:02' },
  { user: 'Rizal', color: '#059669', text: 'NASIONALfm memang terbaik 👍', time: '8:03' },
  { user: 'Aminah', color: '#D97706', text: 'Ada siapa dengar dari Sabah?', time: '8:04' },
  { user: 'Kumar', color: '#7C3AED', text: 'Morning! Dari Penang sini', time: '8:05' },
  { user: 'Fatimah', color: '#BE185D', text: 'Request lagu boleh?', time: '8:06' },
  { user: 'Hafiz', color: '#0284C7', text: 'Selamat pagi dari JB!', time: '8:07' },
  { user: 'Priya', color: '#EA580C', text: 'Love this station ❤️', time: '8:08' },
  { user: 'Zainab', color: '#F97316', text: 'Subhanallah lagu ni merdu', time: '8:09' },
  { user: 'Muthu', color: '#6366F1', text: 'Rajin dengar setiap pagi', time: '8:10' },
  { user: 'Linda', color: '#EC4899', text: 'Ada deejay baru ke?', time: '8:11' },
  { user: 'Karim', color: '#14B8A6', text: 'Playlist hari ini sangat bagus', time: '8:12' },
];

function getOrCreateSessionId() {
  let id = sessionStorage.getItem('rtm_sid');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('rtm_sid', id);
  }
  return id;
}

export default function ChatPageComponent() {
  const [chatOpen, setChatOpen] = useState(true);
  const [livestreamUrl, setLivestreamUrl] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    setChatOpen(window.innerWidth > 768);
  }, []);

  // Fetch livestream URL
  useEffect(() => {
    fetch(`${API_URL}/frontend/livestream-url`)
      .then(r => r.json())
      .then(d => setLivestreamUrl(d.livestream_url || null))
      .catch(() => setLivestreamUrl(null));
  }, []);

  // HLS setup
  useEffect(() => {
    if (!livestreamUrl || !videoRef.current) return;

    const video = videoRef.current;
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

          hls.loadSource(livestreamUrl);
          hls.attachMedia(video);
          hls.on(HLS.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {
              // Autoplay might be blocked, user needs to click play
            });
          });
        } else if (video?.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = livestreamUrl;
          video.play().catch(() => {});
        } else {
          setIsOffline(true);
        }
      } catch {
        if (video?.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = livestreamUrl;
          video.play().catch(() => {});
        } else {
          setIsOffline(true);
        }
      }
    })();

    // Track play
    const handlePlay = () => {
      if (playTracked) return;
      playTracked = true;

      fetch(`${API_URL}/frontend/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getOrCreateSessionId(),
          event_type: 'livestream_play',
          page_type: 'chat',
          device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
        }),
      }).catch(() => {});
    };

    video.addEventListener('play', handlePlay, { once: true });

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
  }, [livestreamUrl]);

  return (
    <div className="container-fluid px-4 py-5">
      <div className="d-flex livestream-wrapper" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Video area */}
        <div className={`livestream-player ${chatOpen ? '' : 'chat-closed'}`} style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Video player - match chat height */}
          <div style={{
            position: 'relative',
            flex: 1,
            backgroundColor: '#000',
            borderRadius: '12px 12px 0 0',
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
                backgroundColor: '#000',
                color: '#999',
                fontSize: '0.9rem',
              }}>
                <i className="bi bi-wifi-off" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <div>Siaran tidak tersedia</div>
              </div>
            ) : (
              <video
                ref={videoRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000',
                }}
                controls
                autoPlay
                muted
                crossOrigin="anonymous"
              />
            )}
            {/* Chat toggle button */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="btn-accent"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                zIndex: 2,
              }}
              title="Toggle chat"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 11.4a1 1 0 0 0-.8-.4H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a.5.5 0 0 1 .4.2l1.9 2.533a2 2 0 0 0 3.2.001l1.9-2.534a.5.5 0 0 1 .4-.2H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Chat sidebar */}
        {chatOpen && (
          <div className="chat-panel card-dark" style={{
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid rgba(63, 63, 143, 0.3)',
          }}>
            {/* Chat header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
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

            {/* Messages */}
            <div className="chat-messages" style={{
              flexGrow: 1,
              minHeight: 0,
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
            }}>
              {messages.map((msg, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ color: msg.color, fontWeight: 600, fontSize: '0.85rem' }}>{msg.user}</span>
                    <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', marginTop: '2px' }}>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(63, 63, 143, 0.3)',
              display: 'flex',
              gap: '8px',
            }}>
              <input
                type="text"
                placeholder="Taip mesej..."
                readOnly
                style={{
                  flexGrow: 1,
                  background: 'var(--color-bg)',
                  border: '1px solid rgba(63, 63, 143, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button className="btn-accent" style={{
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
              }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M16 12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-2h16zm0-5H0v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4z"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
