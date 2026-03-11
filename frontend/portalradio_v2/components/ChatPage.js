'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatWidget, { ChatAuthForm } from './ChatWidget';
import { getChatUser, setChatUser as storeChatUser } from '../utils/chatApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';

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
  const [chatFullScreen, setChatFullScreen] = useState(false);
  const [livestreamUrl, setLivestreamUrl] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [authView, setAuthView] = useState(null); // null | 'login' | 'register'
  const [chatUser, setChatUser] = useState(null);
  const [verifiedBanner, setVerifiedBanner] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    setChatOpen(window.innerWidth > 768);
    const saved = getChatUser();
    if (saved) setChatUser(saved);

    // Show verified banner if redirected from email verification
    if (searchParams.get('verified') === '1') {
      setVerifiedBanner(true);
      // Update local storage with verified status
      if (saved) {
        const updated = { ...saved, email_verified_at: new Date().toISOString() };
        storeChatUser(updated);
        setChatUser(updated);
      }
      // Auto-hide after 5 seconds
      setTimeout(() => setVerifiedBanner(false), 5000);
    }
  }, [searchParams]);

  // Fetch livestream URL
  useEffect(() => {
    fetch(`${API_URL}/livestream-url`)
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
            video.play().catch(() => {});
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

    const handlePlay = () => {
      if (playTracked) return;
      playTracked = true;
      fetch(`${API_URL}/track`, {
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

    const handleVideoError = () => setIsOffline(true);
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

  const handleAuthSuccess = (user) => {
    setChatUser(user);
    setAuthView(null);
  };

  return (
    <div className="container-fluid px-4 py-5">
      {verifiedBanner && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: '#10B981', fontSize: '0.9rem', fontWeight: 600 }}>
            Akaun anda berjaya diaktifkan! Anda kini boleh mengemaskini profil.
          </span>
          <button onClick={() => setVerifiedBanner(false)} style={{
            background: 'none', border: 'none', color: '#10B981', cursor: 'pointer', fontSize: '1.1rem',
          }}>&times;</button>
        </div>
      )}
      <div className="d-flex livestream-wrapper" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Video player area — shows auth form when active */}
        <div className={`livestream-player ${chatOpen ? '' : 'chat-closed'}`} style={{
          flexGrow: chatFullScreen ? 0 : 1,
          minWidth: 0,
          display: chatFullScreen ? 'none' : 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            position: 'relative',
            flex: 1,
            backgroundColor: '#000',
            borderRadius: '12px 12px 0 0',
            overflow: 'hidden',
          }}>
            {isOffline ? (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#000', color: '#999', fontSize: '0.9rem',
              }}>
                <i className="bi bi-wifi-off" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <div>Siaran tidak tersedia</div>
              </div>
            ) : (
              <video
                ref={videoRef}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  backgroundColor: '#000',
                }}
                controls autoPlay muted crossOrigin="anonymous"
              />
            )}
            {authView && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
                <ChatAuthForm
                  view={authView}
                  onSuccess={handleAuthSuccess}
                  onBack={() => setAuthView(null)}
                  onSwitchView={setAuthView}
                />
              </div>
            )}
            {/* Chat toggle button */}
            {!authView && (
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="btn-accent"
                style={{
                  position: 'absolute', top: '12px', right: '12px',
                  border: 'none', borderRadius: '8px', padding: '8px 12px',
                  cursor: 'pointer', fontSize: '1.1rem', zIndex: 2,
                }}
                title="Toggle chat"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 11.4a1 1 0 0 0-.8-.4H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a.5.5 0 0 1 .4.2l1.9 2.533a2 2 0 0 0 3.2.001l1.9-2.534a.5.5 0 0 1 .4-.2H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                  <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Chat sidebar or full-screen */}
        {chatOpen && (
          <div className="chat-panel card-dark" style={{
            borderRadius: chatFullScreen ? '0' : '12px',
            display: 'flex', flexDirection: 'column',
            borderLeft: chatFullScreen ? 'none' : '1px solid rgba(63, 63, 143, 0.3)',
            flex: chatFullScreen ? 1 : '0 0 auto',
            minWidth: chatFullScreen ? '100%' : 'auto',
            width: chatFullScreen ? '100%' : 'auto',
            maxWidth: chatFullScreen ? 'none' : '400px',
          }}>
            {/* Chat header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px', borderBottom: '1px solid rgba(63, 63, 143, 0.3)',
            }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Sembang Langsung</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setChatFullScreen(!chatFullScreen)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--color-muted)',
                    cursor: 'pointer', fontSize: '1rem', padding: '4px',
                  }}
                  title={chatFullScreen ? 'Show player' : 'Hide player'}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    {chatFullScreen ? (
                      <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1-5 0zm5 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/>
                    ) : (
                      <path d="M1.5 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H2v3a.5.5 0 0 1-1 0V2zm6 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zM1 7.5a.5.5 0 0 1 1 0v3H5a.5.5 0 0 1 0 1H2a.5.5 0 0 1-.5-.5v-3zm12-3a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3z"/>
                    )}
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (chatFullScreen) setChatFullScreen(false);
                    else setChatOpen(false);
                  }}
                  style={{
                    background: 'none', border: 'none', color: 'var(--color-muted)',
                    cursor: 'pointer', fontSize: '1.2rem', padding: '4px',
                  }}
                  title={chatFullScreen ? 'Show player' : 'Close chat'}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                  </svg>
                </button>
              </div>
            </div>

            <ChatWidget
              fullHeight
              onAuthAction={setAuthView}
              user={chatUser}
              onUserChange={setChatUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}
