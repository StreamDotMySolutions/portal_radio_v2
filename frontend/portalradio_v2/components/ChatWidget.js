'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getChatUser, setChatUser, chatRegister, chatLogin, chatForgotPassword, fetchMessages, sendMessage, getAvatarUrl, chatGetPublicProfile } from '../utils/chatApi';

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

/**
 * ChatWidget — live chat with 3s polling.
 * Props:
 *   fullHeight: boolean — fill parent height
 *   onAuthAction: (action: 'login'|'register') => void — if provided, delegate auth UI to parent
 *   user: object|null — controlled user state (from parent)
 *   onUserChange: (user|null) => void — called on logout
 */
export default function ChatWidget({ fullHeight = false, onAuthAction, user: controlledUser, onUserChange }) {
  const [internalUser, setInternalUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [input, setInput] = useState('');
  const [view, setView] = useState('chat');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
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
  const [profilePopup, setProfilePopup] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const isControlled = controlledUser !== undefined;
  const user = isControlled ? controlledUser : internalUser;

  const messagesRef = useRef(null);
  const intervalRef = useRef(null);
  const isAtBottomRef = useRef(true);

  // Load user from localStorage on mount (uncontrolled mode only)
  useEffect(() => {
    if (!isControlled) {
      const saved = getChatUser();
      if (saved) setInternalUser(saved);
    }
  }, [isControlled]);

  const checkAtBottom = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (isAtBottomRef.current) setHasNewMessages(false);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
      setHasNewMessages(false);
    }
  }, []);

  const loadMessages = useCallback(async (afterId) => {
    try {
      const newMsgs = await fetchMessages(afterId);
      if (newMsgs.length > 0) {
        if (afterId) {
          setMessages(prev => [...prev, ...newMsgs]);
          if (!isAtBottomRef.current) setHasNewMessages(true);
        } else {
          setMessages(newMsgs);
        }
        setLastId(newMsgs[newMsgs.length - 1].id);
      }
    } catch {}
  }, []);

  useEffect(() => { loadMessages(null); }, [loadMessages]);

  useEffect(() => {
    if (isAtBottomRef.current) scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    intervalRef.current = setInterval(() => loadMessages(lastId), 3000);
    return () => clearInterval(intervalRef.current);
  }, [lastId, loadMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setError('');
    try {
      const msg = await sendMessage(text);
      setMessages(prev => [...prev, msg]);
      setLastId(msg.id);
      setInput('');
      isAtBottomRef.current = true;
      scrollToBottom();
    } catch (err) {
      if (err?.status === 429) setError('Terlalu banyak mesej. Sila tunggu sebentar.');
      else if (err?.status === 403) setError('Akaun anda telah disekat.');
      else setError('Gagal menghantar mesej.');
    } finally {
      setSending(false);
    }
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

  const handleUsernameClick = async (chatUserId) => {
    if (profilePopup?.id === chatUserId) {
      setProfilePopup(null);
      return;
    }
    setProfileLoading(true);
    setProfilePopup(null);
    try {
      const profile = await chatGetPublicProfile(chatUserId);
      setProfilePopup(profile);
    } catch {
      setProfilePopup(null);
    } finally {
      setProfileLoading(false);
    }
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
            <a href="/chat/profile" title="Profil" style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
            </a>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: fullHeight ? '100%' : undefined, flex: fullHeight ? 1 : undefined, position: 'relative' }}>
      {renderHeader()}

      <div ref={messagesRef} onScroll={checkAtBottom} className="chat-messages" style={{
        flexGrow: 1, minHeight: 0, padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto',
      }}>
        {messages.length === 0 && (
          <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
            Belum ada mesej. Jadilah yang pertama!
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: '8px' }}>
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
                <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>{msg.created_at}</span>
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '2px' }}>{msg.message}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile popup */}
      {profilePopup && (
        <div style={{
          position: 'absolute', bottom: '60px', left: '16px', right: '16px', zIndex: 10,
          background: 'var(--color-surface)', border: '1px solid rgba(63, 63, 143, 0.3)',
          borderRadius: '12px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          <button onClick={() => setProfilePopup(null)} style={{
            position: 'absolute', top: '8px', right: '10px', background: 'none',
            border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.1rem',
          }}>&times;</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              background: profilePopup.avatar_filename ? 'none' : profilePopup.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {profilePopup.avatar_filename ? (
                <img src={getAvatarUrl(profilePopup.avatar_filename)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{profilePopup.username.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: profilePopup.color, fontSize: '0.95rem' }}>{profilePopup.username}</div>
              {profilePopup.full_name && <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{profilePopup.full_name}</div>}
            </div>
          </div>
          {profilePopup.about_me && (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginBottom: '8px', lineHeight: 1.4 }}>
              {profilePopup.about_me}
            </div>
          )}
          {(profilePopup.location || profilePopup.hobby) && (
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '8px' }}>
              {profilePopup.location && <span>📍 {profilePopup.location}</span>}
              {profilePopup.location && profilePopup.hobby && <span> &middot; </span>}
              {profilePopup.hobby && <span>🎯 {profilePopup.hobby}</span>}
            </div>
          )}
          {[
            profilePopup.facebook_url && { label: 'Facebook', url: profilePopup.facebook_url },
            profilePopup.instagram_url && { label: 'Instagram', url: profilePopup.instagram_url },
            profilePopup.twitter_url && { label: 'Twitter/X', url: profilePopup.twitter_url },
            profilePopup.tiktok_url && { label: 'TikTok', url: profilePopup.tiktok_url },
            profilePopup.youtube_url && { label: 'YouTube', url: profilePopup.youtube_url },
          ].filter(Boolean).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                profilePopup.facebook_url && { label: 'Facebook', url: profilePopup.facebook_url },
                profilePopup.instagram_url && { label: 'Instagram', url: profilePopup.instagram_url },
                profilePopup.twitter_url && { label: 'Twitter/X', url: profilePopup.twitter_url },
                profilePopup.tiktok_url && { label: 'TikTok', url: profilePopup.tiktok_url },
                profilePopup.youtube_url && { label: 'YouTube', url: profilePopup.youtube_url },
              ].filter(Boolean).map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: '0.8rem', color: 'var(--accent-color, #6C63FF)', textDecoration: 'underline',
                }}>{link.label}</a>
              ))}
            </div>
          )}
        </div>
      )}

      {hasNewMessages && (
        <div style={{ textAlign: 'center', padding: '4px' }}>
          <button onClick={scrollToBottom} style={{
            background: 'var(--accent-color, #6C63FF)', border: 'none', borderRadius: '12px',
            padding: '4px 12px', color: '#fff', fontSize: '0.8rem', cursor: 'pointer',
          }}>Mesej baru ↓</button>
        </div>
      )}

      <form onSubmit={handleSend} style={{
        padding: '12px 16px', borderTop: '1px solid rgba(63, 63, 143, 0.3)', display: 'flex', gap: '8px',
      }}>
        <input type="text" placeholder={user ? 'Taip mesej...' : 'Sila log masuk untuk sembang'}
          readOnly={!user} value={input} onChange={e => setInput(e.target.value)} maxLength={500}
          style={{
            flexGrow: 1, background: 'var(--color-bg)', border: '1px solid rgba(63, 63, 143, 0.3)',
            borderRadius: '8px', padding: '8px 12px', color: 'var(--color-text)',
            fontSize: '0.9rem', outline: 'none', opacity: user ? 1 : 0.5,
          }}
        />
        <button type="submit" className="btn-accent" disabled={!user || sending} style={{
          border: 'none', borderRadius: '8px', padding: '8px 16px',
          cursor: user ? 'pointer' : 'not-allowed', opacity: user ? 1 : 0.5,
        }} title="Send message">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"/>
          </svg>
        </button>
      </form>

      {error && view === 'chat' && (
        <div style={{ padding: '0 16px 8px', color: '#EF4444', fontSize: '0.8rem' }}>{error}</div>
      )}
    </div>
  );
}
