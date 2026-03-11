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

export default function ChatPageComponent() {
  const [chatOpen, setChatOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [livestreamUrl, setLivestreamUrl] = useState(null);
  const audioRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    setChatOpen(window.innerWidth > 768);
  }, []);

  // Fetch livestream URL
  useEffect(() => {
    const fetchLivestreamUrl = async () => {
      try {
        const res = await fetch(`${API_URL}/frontend/livestream-url`);
        if (res.ok) {
          const data = await res.json();
          setLivestreamUrl(data.livestream_url);
        }
      } catch (error) {
        console.warn('Failed to fetch livestream URL:', error);
      }
    };

    fetchLivestreamUrl();
  }, []);

  // Cleanup HLS on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  const togglePlayback = async (e) => {
    e.stopPropagation();
    if (!livestreamUrl) return;

    const audio = audioRef.current;

    if (isPlaying) {
      // Stop playback
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // Start playback
    setIsPlaying(true);
    try {
      const HLS = (await import('hls.js')).default;
      if (HLS.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        const hls = new HLS();
        hlsRef.current = hls;
        hls.loadSource(livestreamUrl);
        hls.attachMedia(audio);
        hls.on(HLS.Events.MANIFEST_PARSED, () => audio.play());
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = livestreamUrl;
        audio.play();
      }
    } catch (error) {
      if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = livestreamUrl;
        audio.play();
      }
    }
  };

  return (
    <div className="container-fluid px-4 py-5">
      <audio ref={audioRef} />
      <div className="d-flex livestream-wrapper" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Video area */}
        <div className={`livestream-player ${chatOpen ? '' : 'chat-closed'}`} style={{ flexGrow: 1, minWidth: 0 }}>
          <div style={{
            position: 'relative',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundImage: 'url(/video-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Play icon */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <button
                onClick={togglePlayback}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: livestreamUrl ? 'pointer' : 'not-allowed',
                  opacity: livestreamUrl ? 1 : 0.5,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={livestreamUrl ? (isPlaying ? 'Stop livestream' : 'Play livestream') : 'Loading livestream...'}
              >
                <svg width="80" height="80" viewBox="0 0 16 16" fill="#ff6600" style={{ cursor: 'inherit' }}>
                  {isPlaying ? (
                    <>
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M5 6a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1"/>
                    </>
                  ) : (
                    <>
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                    </>
                  )}
                </svg>
              </button>
            </div>

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
