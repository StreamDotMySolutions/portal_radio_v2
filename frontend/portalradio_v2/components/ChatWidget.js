'use client';

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { getChatUser, setChatUser, chatRegister, chatLogin, chatForgotPassword, fetchMessages, sendMessage, getAvatarUrl } from '../utils/chatApi';
import { subscribeChat } from '../utils/chatSocket';
import ChatProfileModal from './ChatProfileModal';
import ChatPublicProfile from './ChatPublicProfile';

/**
 * ChatAuthForm — renders login or register form. Used by parents to show in the video area.
 * Props: view ('login'|'register'), onSuccess(user), onBack(), onSwitchView(view)
 */
export function ChatAuthForm({ view, onSuccess, onBack, onSwitchView }) {
  const [error, setError] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const inputStyle = {
    width: '100%',
    background: 'var(--color-bg)',
    border: '1px solid rgba(63, 63, 143, 0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text)',
    fontSize: '1rem',
    outline: 'none',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await chatLogin(loginUsername.trim(), loginPassword);
      onSuccess(u);
    } catch (err) {
      setError(err?.data?.message || 'Username atau kata laluan tidak sah.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await chatRegister(regUsername.trim(), regEmail.trim(), regPassword);
      onSuccess(u);
    } catch (err) {
      const data = err?.data;
      if (data?.errors) {
        const first = Object.values(data.errors)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError(data?.message || 'Pendaftaran gagal.');
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setForgotLoading(true);
    try {
      await chatForgotPassword(forgotEmail.trim());
      setForgotSent(true);
    } catch (err) {
      setError(err?.data?.message || 'Gagal menghantar emel.');
    } finally {
      setForgotLoading(false);
    }
  };

  if (view === 'forgot-password') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
            Lupa Kata Laluan
          </h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            Masukkan emel anda untuk menerima pautan set semula kata laluan.
          </p>
          {forgotSent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#10B981', fontSize: '0.95rem', marginBottom: '1rem' }}>
                Pautan set semula telah dihantar ke emel anda. Sila semak peti masuk anda.
              </div>
              <button type="button" onClick={() => { onSwitchView('login'); setError(''); setForgotSent(false); setForgotEmail(''); }} style={{
                background: 'none', border: 'none', color: 'var(--accent-color, #6C63FF)',
                cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline',
              }}>
                Kembali ke Log Masuk
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="email"
                placeholder="Emel anda"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                style={inputStyle}
                autoFocus
                required
              />
              {error && <div style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</div>}
              <button type="submit" className="btn-accent" disabled={forgotLoading} style={{
                border: 'none', borderRadius: '8px', padding: '10px 20px', width: '100%',
                cursor: 'pointer', fontWeight: 600, fontSize: '1rem', opacity: forgotLoading ? 0.7 : 1,
              }}>
                {forgotLoading ? 'Menghantar...' : 'Hantar Pautan'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { onSwitchView('login'); setError(''); }} style={{
                  background: 'none', border: 'none', color: 'var(--color-muted)',
                  cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline',
                }}>
                  Kembali ke Log Masuk
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
            Log Masuk ke Sembang
          </h3>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={e => setLoginUsername(e.target.value)}
              style={inputStyle}
              autoFocus
              required
            />
            <div style={{ position: 'relative' }}>
              <input
                type={showLoginPw ? 'text' : 'password'}
                placeholder="Kata laluan"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '42px' }}
                required
              />
              <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '2px',
              }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  {showLoginPw ? (
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829M3.35 5.47q-.27.238-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zM13.646 14.354l-12-12 .708-.708 12 12z"/>
                  ) : (
                    <><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></>
                  )}
                </svg>
              </button>
            </div>
            {onSwitchView && (
              <div style={{ textAlign: 'right', marginTop: '-6px' }}>
                <button type="button" onClick={() => { onSwitchView('forgot-password'); setError(''); }} style={{
                  background: 'none', border: 'none', color: 'var(--color-muted)',
                  cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', padding: 0,
                }}>
                  Lupa kata laluan?
                </button>
              </div>
            )}
            {error && <div style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</div>}
            <button type="submit" className="btn-accent" style={{
              border: 'none', borderRadius: '8px', padding: '10px 20px', width: '100%',
              cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
            }}>
              Masuk
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '0.5rem' }}>
              <button type="button" onClick={onBack} style={{
                background: 'none', border: 'none', color: 'var(--color-muted)',
                cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline',
              }}>
                Kembali
              </button>
              {onSwitchView && (
                <button type="button" onClick={() => { onSwitchView('register'); setError(''); }} style={{
                  background: 'none', border: 'none', color: 'var(--accent-color, #6C63FF)',
                  cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline',
                }}>
                  Daftar akaun baru
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Register
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
          Daftar Akaun Sembang
        </h3>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            placeholder="Username (huruf, nombor, _ sahaja)"
            value={regUsername}
            onChange={e => setRegUsername(e.target.value)}
            style={inputStyle}
            autoFocus
            required
            minLength={2}
            maxLength={30}
          />
          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={e => setRegEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showRegPw ? 'text' : 'password'}
              placeholder="Kata laluan (min. 6 aksara)"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '42px' }}
              required
              minLength={6}
            />
            <button type="button" onClick={() => setShowRegPw(!showRegPw)} style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '2px',
            }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                {showRegPw ? (
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829M3.35 5.47q-.27.238-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zM13.646 14.354l-12-12 .708-.708 12 12z"/>
                ) : (
                  <><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></>
                )}
              </svg>
            </button>
          </div>
          {error && <div style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</div>}
          <button type="submit" className="btn-accent" style={{
            border: 'none', borderRadius: '8px', padding: '10px 20px', width: '100%',
            cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
          }}>
            Daftar
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '0.5rem' }}>
            <button type="button" onClick={onBack} style={{
              background: 'none', border: 'none', color: 'var(--color-muted)',
              cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline',
            }}>
              Kembali
            </button>
            {onSwitchView && (
              <button type="button" onClick={() => { onSwitchView('login'); setError(''); }} style={{
                background: 'none', border: 'none', color: 'var(--accent-color, #6C63FF)',
                cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline',
              }}>
                Sudah ada akaun? Log masuk
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const POLL_ACTIVE_MS = 3000;
const POLL_IDLE_MS = 10000;
const POLL_SOCKET_MS = 30000;   // safety sweep while the WebSocket is connected
const IDLE_AFTER_MS = 60000;

// Merge server/optimistic messages: dedupe by id, drop optimistic entries once the
// server copy (same client_id) arrives, keep confirmed messages sorted by id and
// unconfirmed (pending/failed) ones at the end.
function mergeMessages(prev, incoming) {
  if (!incoming.length) return prev;
  const confirmed = new Map();
  const unconfirmed = new Map();
  for (const m of prev) {
    if (m.id != null) confirmed.set(m.id, m);
    else unconfirmed.set(m.client_id, m);
  }
  for (const m of incoming) {
    if (m.client_id) unconfirmed.delete(m.client_id);
    confirmed.set(m.id, m);
  }
  return [...[...confirmed.values()].sort((a, b) => a.id - b.id), ...unconfirmed.values()];
}

function maxId(list) {
  return list.reduce((max, m) => (m.id != null && m.id > max ? m.id : max), 0);
}

const pad2 = (n) => String(n).padStart(2, '0');

function messageTime(msg) {
  if (!msg.created_at_iso) return msg.created_at;
  const d = new Date(msg.created_at_iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function dayKey(msg) {
  if (!msg.created_at_iso) return null;
  return new Date(msg.created_at_iso).toDateString();
}

function dayLabel(msg) {
  const d = new Date(msg.created_at_iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Hari ini';
  if (d.toDateString() === yesterday.toDateString()) return 'Semalam';
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function newClientId() {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * ChatWidget — live chat over WebSocket (Laravel Reverb) with HTTP polling as fallback
 * (3s active, 10s idle, 30s safety sweep while the socket is connected, paused while the tab is hidden).
 * Props:
 *   fullHeight: boolean — fill parent height
 *   onAuthAction: (action: 'login'|'register') => void — if provided, delegate auth UI to parent
 *   user: object|null — controlled user state (from parent)
 *   onUserChange: (user|null) => void — called on logout
 *   onProfileView: (userId) => void — called when username clicked to view profile
 *   flushInput: boolean — no desktop bottom clearance under the input (container already clears the accessibility button)
 */
export default function ChatWidget({ fullHeight = false, flushInput = false, onAuthAction, user: controlledUser, onUserChange, onProfileView }) {
  const [internalUser, setInternalUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [input, setInput] = useState('');
  const [view, setView] = useState('chat');
  const [error, setError] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [viewingPublicProfileId, setViewingPublicProfileId] = useState(null);

  const isControlled = controlledUser !== undefined;
  const user = isControlled ? controlledUser : internalUser;

  const messagesRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const lastIdRef = useRef(0);              // highest confirmed id received from the server feed
  const initialLoadedRef = useRef(false);
  const lastActivityRef = useRef(Date.now());
  const pollTimerRef = useRef(null);
  const pollingRef = useRef(false);
  const scrollIntentRef = useRef(null);     // { type: 'bottom' } | { type: 'preserve', height, top }
  const socketConnectedRef = useRef(false);
  const kickPollRef = useRef(() => {});     // poll immediately (set by the polling effect)
  const userRef = useRef(user);
  userRef.current = user;

  // Load user from localStorage on mount (uncontrolled mode only)
  useEffect(() => {
    if (!isControlled) {
      const saved = getChatUser();
      if (saved) setInternalUser(saved);
    }
  }, [isControlled]);

  // Apply the requested scroll adjustment right after the DOM reflects new messages
  useLayoutEffect(() => {
    const el = messagesRef.current;
    const intent = scrollIntentRef.current;
    if (!el || !intent) return;
    if (intent.type === 'bottom') el.scrollTop = el.scrollHeight;
    else el.scrollTop = el.scrollHeight - intent.height + intent.top;
    scrollIntentRef.current = null;
  }, [messages]);

  // Keep the newest message in view when the list resizes (mobile keyboard opening, overlay resize)
  useEffect(() => {
    const el = messagesRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (isAtBottomRef.current) el.scrollTop = el.scrollHeight;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [view]);

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    isAtBottomRef.current = true;
    setHasNewMessages(false);
  }, []);

  // advance=false for WebSocket pushes: an earlier message may have been missed while
  // reconnecting, so only the polled feed moves lastIdRef forward
  const applyIncoming = useCallback((incoming, advance = true) => {
    if (!incoming.length) return;
    if (advance) lastIdRef.current = Math.max(lastIdRef.current, maxId(incoming));
    if (isAtBottomRef.current) scrollIntentRef.current = { type: 'bottom' };
    else setHasNewMessages(true);
    setMessages(prev => mergeMessages(prev, incoming));
  }, []);

  const loadInitial = useCallback(async () => {
    const { messages: latest, hasMore: more } = await fetchMessages();
    lastIdRef.current = Math.max(lastIdRef.current, maxId(latest));
    initialLoadedRef.current = true;
    scrollIntentRef.current = { type: 'bottom' };
    setHasMore(more);
    setMessages(prev => mergeMessages(prev, latest));
  }, []);

  const pollNew = useCallback(async () => {
    if (!initialLoadedRef.current) {
      await loadInitial();
      return;
    }
    const { messages: fresh } = await fetchMessages({ after: lastIdRef.current || undefined });
    if (fresh.length) {
      lastActivityRef.current = Date.now();
      applyIncoming(fresh);
    }
  }, [loadInitial, applyIncoming]);

  // Adaptive polling loop: 3s while active, 10s after a quiet minute, 30s while the WebSocket
  // is connected, paused while the tab is hidden
  useEffect(() => {
    let cancelled = false;

    const schedule = () => {
      if (cancelled) return; // a stale run must not clear the timer owned by the current run
      clearTimeout(pollTimerRef.current);
      if (document.hidden) return;
      const idle = Date.now() - lastActivityRef.current > IDLE_AFTER_MS;
      const delay = socketConnectedRef.current ? POLL_SOCKET_MS : idle ? POLL_IDLE_MS : POLL_ACTIVE_MS;
      pollTimerRef.current = setTimeout(tick, delay);
    };

    const tick = async () => {
      // A fetch from a previous run of this effect is still in flight: retry shortly instead of
      // returning, otherwise that run's (cancelled) schedule() is the only one left and polling stops
      if (pollingRef.current) {
        if (cancelled) return;
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = setTimeout(tick, 500);
        return;
      }
      pollingRef.current = true;
      try {
        await pollNew();
      } catch {}
      pollingRef.current = false;
      schedule();
    };

    const onVisibility = () => {
      clearTimeout(pollTimerRef.current);
      if (!document.hidden) {
        lastActivityRef.current = Date.now();
        tick();
      }
    };

    kickPollRef.current = () => {
      clearTimeout(pollTimerRef.current);
      tick();
    };

    tick();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      kickPollRef.current = () => {};
      clearTimeout(pollTimerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pollNew]);

  // Real-time push. Polling keeps running (slowed to a sweep) so nothing is lost if the socket drops.
  useEffect(() => {
    return subscribeChat({
      onMessage: (msg) => {
        if (!msg || !initialLoadedRef.current) return;
        lastActivityRef.current = Date.now();
        applyIncoming([msg], false);
      },
      onRemoved: ({ ids, all }) => {
        if (all) {
          setMessages(prev => prev.filter(m => m.id == null));
          setHasMore(false);
          return;
        }
        const removed = new Set(ids);
        setMessages(prev => prev.filter(m => !removed.has(m.id)));
      },
      onUserUpdated: ({ chat_user_id, is_banned }) => {
        const current = userRef.current;
        if (!current || current.id !== chat_user_id || !!current.is_banned === is_banned) return;
        const updated = { ...current, is_banned };
        setChatUser(updated);
        if (isControlled) onUserChange?.(updated);
        else setInternalUser(updated);
      },
      onStatus: (state) => {
        const connected = state === 'connected';
        const wasConnected = socketConnectedRef.current;
        socketConnectedRef.current = connected;
        // On (re)connect, fetch once to fill any gap; on drop, return to fast polling
        if (connected !== wasConnected) kickPollRef.current();
      },
    });
  }, [applyIncoming, isControlled, onUserChange]);

  const loadOlder = useCallback(async () => {
    const el = messagesRef.current;
    const oldest = messages.find(m => m.id != null);
    if (!el || !oldest || loadingOlder || !hasMore) return;

    setLoadingOlder(true);
    try {
      const { messages: older, hasMore: more } = await fetchMessages({ before: oldest.id });
      scrollIntentRef.current = { type: 'preserve', height: el.scrollHeight, top: el.scrollTop };
      setHasMore(more);
      setMessages(prev => mergeMessages(prev, older));
    } catch {
    } finally {
      setLoadingOlder(false);
    }
  }, [messages, loadingOlder, hasMore]);

  const handleMessagesScroll = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (isAtBottomRef.current) setHasNewMessages(false);
    if (el.scrollTop < 60) loadOlder();
  }, [loadOlder]);

  const patchUnconfirmed = (clientId, patch) => {
    setMessages(prev => prev.map(m => (m.id == null && m.client_id === clientId ? { ...m, ...patch } : m)));
  };

  const submitMessage = async (text, clientId) => {
    setError('');
    try {
      const msg = await sendMessage(text, clientId);
      lastActivityRef.current = Date.now();
      // lastIdRef is not advanced here: messages from others with lower ids may not be polled yet
      setMessages(prev => mergeMessages(prev, [{ ...msg, client_id: clientId }]));
    } catch (err) {
      if (err?.status === 403) {
        setMessages(prev => prev.filter(m => m.id != null || m.client_id !== clientId));
        // Update user as banned in localStorage and state
        const updated = { ...user, is_banned: true };
        setChatUser(updated);
        if (isControlled) onUserChange?.(updated);
        else setInternalUser(updated);
        return;
      }
      patchUnconfirmed(clientId, { pending: false, failed: true });
      if (err?.status === 429) setError('Terlalu banyak mesej. Sila tunggu sebentar.');
      else setError('Gagal menghantar mesej.');
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !user || user.is_banned) return;

    const clientId = newClientId();
    scrollIntentRef.current = { type: 'bottom' };
    isAtBottomRef.current = true;
    setHasNewMessages(false);
    setMessages(prev => [...prev, {
      id: null,
      client_id: clientId,
      chat_user_id: user.id,
      username: user.username,
      color: user.color,
      avatar_filename: user.avatar_filename,
      message: text,
      created_at_iso: new Date().toISOString(),
      pending: true,
    }]);
    setInput('');
    submitMessage(text, clientId);
  };

  const handleRetry = (msg) => {
    patchUnconfirmed(msg.client_id, { pending: true, failed: false });
    submitMessage(msg.message, msg.client_id);
  };

  const handleLogout = () => {
    setChatUser(null);
    if (isControlled) {
      onUserChange?.(null);
    } else {
      setInternalUser(null);
    }
    setView('chat');
  };

  // Internal auth handlers (used when onAuthAction is NOT provided, e.g. mobile)
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await chatRegister(regUsername.trim(), regEmail.trim(), regPassword);
      setInternalUser(u);
      setView('chat');
      setRegUsername(''); setRegEmail(''); setRegPassword('');
    } catch (err) {
      const data = err?.data;
      if (data?.errors) {
        const first = Object.values(data.errors)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError(data?.message || 'Pendaftaran gagal.');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await chatLogin(loginUsername.trim(), loginPassword);
      setInternalUser(u);
      setView('chat');
      setLoginUsername(''); setLoginPassword('');
    } catch (err) {
      setError(err?.data?.message || 'Username atau kata laluan tidak sah.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setForgotLoading(true);
    try {
      await chatForgotPassword(forgotEmail.trim());
      setForgotSent(true);
    } catch (err) {
      setError(err?.data?.message || 'Gagal menghantar emel.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleAuthClick = (action) => {
    if (onAuthAction) {
      onAuthAction(action);
    } else {
      setView(action);
      setError('');
    }
  };

  const handleUsernameClick = (chatUserId) => {
    // Show public profile as modal
    setViewingPublicProfileId(chatUserId);
  };

  const inlineInputStyle = {
    width: '100%',
    background: 'var(--color-bg)',
    border: '1px solid rgba(63, 63, 143, 0.3)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'var(--color-text)',
    fontSize: '0.9rem',
    outline: 'none',
  };

  const renderHeader = () => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px', borderBottom: '1px solid rgba(63, 63, 143, 0.3)', minHeight: '44px',
    }}>
      {user ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden',
              background: user.avatar_filename ? 'none' : user.color, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {user.avatar_filename ? (
                <img src={getAvatarUrl(user.avatar_filename)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>{user.username.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span style={{ color: user.color, fontWeight: 700, fontSize: '0.85rem' }}>{user.username}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setShowProfileModal(true)} title="Profil" style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
            </button>
            <button onClick={handleLogout} style={{
              background: 'none', border: 'none', color: 'var(--color-muted)',
              cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline',
            }}>Log Keluar</button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
          <button onClick={() => handleAuthClick('login')} style={{
            background: 'none', border: 'none', color: 'var(--accent-color, #6C63FF)',
            cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0,
          }}>LOG MASUK</button>
          <span style={{ color: 'var(--color-muted)' }}>|</span>
          <button onClick={() => handleAuthClick('register')} style={{
            background: 'none', border: 'none', color: 'var(--accent-color, #6C63FF)',
            cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0,
          }}>DAFTAR</button>
        </div>
      )}
    </div>
  );

  // Inline login form (fallback when onAuthAction is not provided)
  if (!onAuthAction && view === 'login') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: fullHeight ? '100%' : undefined, flex: fullHeight ? 1 : undefined }}>
        {renderHeader()}
        <div style={{ padding: '24px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Log Masuk</h3>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="Username" value={loginUsername}
              onChange={e => setLoginUsername(e.target.value)} style={inlineInputStyle} autoFocus required />
            <div style={{ position: 'relative' }}>
              <input type={showLoginPw ? 'text' : 'password'} placeholder="Kata laluan" value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)} style={{ ...inlineInputStyle, paddingRight: '38px' }} required />
              <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '2px',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  {showLoginPw ? (
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829M3.35 5.47q-.27.238-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zM13.646 14.354l-12-12 .708-.708 12 12z"/>
                  ) : (
                    <><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></>
                  )}
                </svg>
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: '-4px' }}>
              <button type="button" onClick={() => { setView('forgot-password'); setError(''); setForgotSent(false); setForgotEmail(''); }} style={{
                background: 'none', border: 'none', color: 'var(--color-muted)',
                cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline', padding: 0,
              }}>Lupa kata laluan?</button>
            </div>
            {error && <div style={{ color: '#EF4444', fontSize: '0.85rem' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-accent" style={{
                border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
              }}>Masuk</button>
              <button type="button" onClick={() => { setView('chat'); setError(''); }} style={{
                background: 'none', border: '1px solid rgba(63, 63, 143, 0.3)', borderRadius: '8px',
                padding: '8px 20px', color: 'var(--color-text)', cursor: 'pointer', fontSize: '0.9rem',
              }}>Kembali</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Inline forgot-password form (fallback when onAuthAction is not provided)
  if (!onAuthAction && view === 'forgot-password') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: fullHeight ? '100%' : undefined, flex: fullHeight ? 1 : undefined }}>
        {renderHeader()}
        <div style={{ padding: '24px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Lupa Kata Laluan</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Masukkan emel anda untuk menerima pautan set semula.
          </p>
          {forgotSent ? (
            <div>
              <div style={{ color: '#10B981', fontSize: '0.85rem', marginBottom: '12px' }}>
                Pautan set semula telah dihantar ke emel anda.
              </div>
              <button type="button" onClick={() => { setView('login'); setError(''); setForgotSent(false); setForgotEmail(''); }} style={{
                background: 'none', border: 'none', color: 'var(--accent-color, #6C63FF)',
                cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', padding: 0,
              }}>Kembali ke Log Masuk</button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="email" placeholder="Emel anda" value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)} style={inlineInputStyle} autoFocus required />
              {error && <div style={{ color: '#EF4444', fontSize: '0.85rem' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn-accent" disabled={forgotLoading} style={{
                  border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontWeight: 600,
                  fontSize: '0.9rem', opacity: forgotLoading ? 0.7 : 1,
                }}>{forgotLoading ? 'Menghantar...' : 'Hantar'}</button>
                <button type="button" onClick={() => { setView('login'); setError(''); }} style={{
                  background: 'none', border: '1px solid rgba(63, 63, 143, 0.3)', borderRadius: '8px',
                  padding: '8px 20px', color: 'var(--color-text)', cursor: 'pointer', fontSize: '0.9rem',
                }}>Kembali</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Inline register form (fallback when onAuthAction is not provided)
  if (!onAuthAction && view === 'register') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: fullHeight ? '100%' : undefined, flex: fullHeight ? 1 : undefined }}>
        {renderHeader()}
        <div style={{ padding: '24px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Daftar Akaun</h3>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="Username (huruf, nombor, _ sahaja)" value={regUsername}
              onChange={e => setRegUsername(e.target.value)} style={inlineInputStyle} autoFocus required minLength={2} maxLength={30} />
            <input type="email" placeholder="Email" value={regEmail}
              onChange={e => setRegEmail(e.target.value)} style={inlineInputStyle} required />
            <div style={{ position: 'relative' }}>
              <input type={showRegPw ? 'text' : 'password'} placeholder="Kata laluan (min. 6 aksara)" value={regPassword}
                onChange={e => setRegPassword(e.target.value)} style={{ ...inlineInputStyle, paddingRight: '38px' }} required minLength={6} />
              <button type="button" onClick={() => setShowRegPw(!showRegPw)} style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '2px',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  {showRegPw ? (
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829M3.35 5.47q-.27.238-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zM13.646 14.354l-12-12 .708-.708 12 12z"/>
                  ) : (
                    <><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></>
                  )}
                </svg>
              </button>
            </div>
            {error && <div style={{ color: '#EF4444', fontSize: '0.85rem' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-accent" style={{
                border: 'none', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
              }}>Daftar</button>
              <button type="button" onClick={() => { setView('chat'); setError(''); }} style={{
                background: 'none', border: '1px solid rgba(63, 63, 143, 0.3)', borderRadius: '8px',
                padding: '8px 20px', color: 'var(--color-text)', cursor: 'pointer', fontSize: '0.9rem',
              }}>Kembali</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Chat view (always shown when onAuthAction is provided, or when view === 'chat')
  return (
    // flex-basis 0 (not height: 100%) so header + messages + input fit inside a parent that also has its own header
    <div style={{ display: 'flex', flexDirection: 'column', height: fullHeight ? '100%' : undefined, flex: fullHeight ? '1 1 0' : undefined, minHeight: 0, position: 'relative' }}>
      {renderHeader()}

      <div ref={messagesRef} onScroll={handleMessagesScroll} className="chat-messages" style={{
        flexGrow: 1, minHeight: 0, padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto',
      }}>
        {/* Pushes messages to the bottom so the newest sits just above the input, like a messaging app */}
        <div aria-hidden="true" style={{ marginTop: 'auto' }} />
        {loadingOlder && (
          <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
            Memuatkan mesej lama...
          </div>
        )}
        {messages.length === 0 && (
          <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
            Belum ada mesej. Jadilah yang pertama!
          </div>
        )}
        {messages.map((msg, i) => {
          const key = dayKey(msg);
          const showDay = key && key !== dayKey(messages[i - 1] || {});
          return (
            <div key={msg.id ?? msg.client_id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {showDay && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-muted)', fontSize: '0.7rem' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(63, 63, 143, 0.2)' }} />
                  <span>{dayLabel(msg)}</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(63, 63, 143, 0.2)' }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', opacity: msg.pending ? 0.6 : 1 }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, marginTop: '2px',
                  background: msg.avatar_filename ? 'none' : msg.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.avatar_filename ? (
                    <img src={getAvatarUrl(msg.avatar_filename)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '0.55rem', fontWeight: 700, color: '#fff' }}>{msg.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <button
                      onClick={() => msg.chat_user_id && handleUsernameClick(msg.chat_user_id)}
                      style={{
                        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                        color: msg.color, fontWeight: 600, fontSize: '0.85rem',
                      }}
                    >{msg.username}</button>
                    <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                      {msg.pending ? 'Menghantar...' : messageTime(msg)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.message}</div>
                  {msg.failed && (
                    <button onClick={() => handleRetry(msg)} style={{
                      background: 'none', border: 'none', padding: 0, marginTop: '2px', cursor: 'pointer',
                      color: '#EF4444', fontSize: '0.75rem', textDecoration: 'underline',
                    }}>Gagal dihantar. Cuba lagi</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasNewMessages && (
        <div style={{ textAlign: 'center', padding: '4px' }}>
          <button onClick={scrollToBottom} style={{
            background: 'var(--accent-color, #6C63FF)', border: 'none', borderRadius: '12px',
            padding: '4px 12px', color: '#fff', fontSize: '0.8rem', cursor: 'pointer',
          }}>Mesej baru ↓</button>
        </div>
      )}

      {user?.is_banned ? (
        <div style={{
          padding: '10px 16px', borderTop: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'rgba(239, 68, 68, 0.08)', textAlign: 'center',
          flexShrink: 0,
        }}>
          <div style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
            Akaun anda telah disekat.
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
            Anda tidak boleh menghantar mesej.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSend} className={flushInput ? 'chat-input-bar chat-input-bar--flush' : 'chat-input-bar'} style={{
          padding: '12px 16px', borderTop: '1px solid rgba(63, 63, 143, 0.3)', display: 'flex', gap: '8px',
          flexShrink: 0, backgroundColor: 'var(--color-surface)',
        }}>
          <input type="text" placeholder={user ? 'Taip mesej...' : 'Sila log masuk untuk sembang'}
            readOnly={!user} value={input} onChange={e => setInput(e.target.value)} maxLength={500}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && user) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            style={{
              flexGrow: 1, background: 'var(--color-bg)', border: '1px solid rgba(63, 63, 143, 0.3)',
              borderRadius: '8px', padding: '8px 12px', color: 'var(--color-text)',
              fontSize: '0.9rem', outline: 'none', opacity: user ? 1 : 0.5,
            }}
          />
          <button type="submit" className="btn-accent" disabled={!user} style={{
            border: 'none', borderRadius: '8px', padding: '8px 16px',
            cursor: user ? 'pointer' : 'not-allowed', opacity: user ? 1 : 0.5,
          }} title="Send message">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"/>
            </svg>
          </button>
        </form>
      )}

      {error && view === 'chat' && (
        <div style={{ padding: '0 16px 8px', color: '#EF4444', fontSize: '0.8rem' }}>{error}</div>
      )}

      {showProfileModal && (
        <ChatProfileModal user={user} onClose={() => setShowProfileModal(false)} onUserChange={isControlled ? onUserChange : setInternalUser} />
      )}

      {viewingPublicProfileId && (
        <ChatPublicProfile userId={viewingPublicProfileId} onClose={() => setViewingPublicProfileId(null)} isModal={true} />
      )}
    </div>
  );
}
