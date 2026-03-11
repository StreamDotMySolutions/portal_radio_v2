'use client';

import { useState, useEffect, useRef } from 'react';

// Helper to manage session ID for analytics
function getOrCreateSessionId() {
    let id = sessionStorage.getItem('rtm_sid');
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem('rtm_sid', id);
    }
    return id;
}

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
  { user: 'Sara', color: '#8B5CF6', text: 'Lagu nostalgia ni 90s kan?', time: '8:13' },
  { user: 'David', color: '#F59E0B', text: 'Dari UK sini, still listening', time: '8:14' },
  { user: 'Lina', color: '#06B6D4', text: 'Dulu dengar ni di kereta ke sekolah', time: '8:15' },
  { user: 'Ravi', color: '#EF4444', text: 'Best banget radio Malaysia!', time: '8:16' },
  { user: 'Nur', color: '#10B981', text: 'Malam ni ada special program ke?', time: '8:17' },
  { user: 'Amir', color: '#3B82F6', text: 'Kalau ada giveaway kasih tahu ya', time: '8:18' },
  { user: 'Jasmine', color: '#D946EF', text: 'Sambil kerja dengar radio ni 😊', time: '8:19' },
  { user: 'Ali', color: '#FB923C', text: 'NASIONALfm sudah 50 tahun bukan?', time: '8:20' },
];

export default function LiveStream() {
  const [chatOpen, setChatOpen] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    setChatOpen(window.innerWidth > 768);
  }, []);

  // Fetch stream URL from API (runs once)
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';
    fetch(`${API_URL}/livestream-url`)
        .then(r => r.json())
        .then(d => setStreamUrl(d.stream_url || null))
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
    <section className="py-5">
      <div className="container">
        <h2 className="section-heading">Siaran Langsung</h2>

        <div className="d-flex livestream-wrapper">
          {/* Video area */}
          <div className={`livestream-player ${chatOpen ? '' : 'chat-closed'}`} style={{ flexGrow: 1, minWidth: 0 }}>
            {/* 16:9 video player */}
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
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

            {/* Info bar */}
            <div className="card-dark" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 20px',
              borderRadius: '0 0 12px 12px',
              borderTop: 'none',
            }}>
              <span className="badge-live">LIVE</span>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>NASIONALfm</span>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Berita Utama Pagi</span>
              <span style={{
                marginLeft: 'auto',
                color: 'var(--color-muted)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-.828.34-1.752.96-2.55.425-.548.946-1.01 1.554-1.337A5 5 0 0 1 6.936 9.28M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                </svg>
                1.2K penonton
              </span>
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
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}>
                  Hantar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
