'use client';

import { useState, useEffect, useRef } from 'react';
import { chatGoogleLogin, chatGoogleComplete } from '../utils/chatApi';

// "Teruskan dengan Google" for the chat login/register forms (Google Identity Services).
// Wraps the existing form: shows the Google button and an "atau" divider above it, and
// replaces it with a "Pilih username" step when a new Google user signs in for the first time.
// Renders only the children when NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set.

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GSI_SRC = 'https://accounts.google.com/gsi/client';

let gsiPromise = null;

function loadGsi() {
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) return resolve(window.google);
      const script = document.createElement('script');
      script.src = GSI_SRC;
      script.async = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => { gsiPromise = null; reject(new Error('GSI load failed')); };
      document.head.appendChild(script);
    });
  }
  return gsiPromise;
}

function firstError(data, fallback) {
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    return Array.isArray(first) ? first[0] : first;
  }
  return data?.message || fallback;
}

export default function GoogleSignIn({ onSuccess, compact = false, children }) {
  const buttonRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [signup, setSignup] = useState(null);   // { token, username } while choosing a username
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (!CLIENT_ID || signup) return;
    let cancelled = false;

    const handleCredential = async ({ credential }) => {
      setError('');
      setBusy(true);
      try {
        const data = await chatGoogleLogin(credential);
        if (data.needs_username) {
          setSignup({ token: data.signup_token, username: data.suggested_username || '' });
        } else {
          onSuccessRef.current(data.user);
        }
      } catch (err) {
        setError(firstError(err?.data, 'Log masuk Google gagal. Sila cuba lagi.'));
      } finally {
        setBusy(false);
      }
    };

    loadGsi().then((google) => {
      const el = buttonRef.current;
      if (cancelled || !el) return;
      google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
      el.innerHTML = '';
      google.accounts.id.renderButton(el, {
        theme: 'filled_black',
        size: compact ? 'medium' : 'large',
        text: 'continue_with',
        shape: 'pill',
        locale: 'ms',
        width: Math.max(200, Math.min(400, el.offsetWidth || 300)),
      });
    }).catch(() => {
      if (!cancelled) setError('Butang Google tidak dapat dimuatkan.');
    });

    return () => { cancelled = true; };
  }, [signup, compact]);

  if (!CLIENT_ID) return children;

  const inputStyle = {
    width: '100%',
    background: 'var(--color-bg)',
    border: '1px solid rgba(63, 63, 143, 0.3)',
    borderRadius: '8px',
    padding: compact ? '8px 12px' : '10px 14px',
    color: 'var(--color-text)',
    fontSize: compact ? '0.9rem' : '1rem',
    outline: 'none',
  };
  const errorStyle = { color: '#EF4444', fontSize: compact ? '0.85rem' : '0.9rem' };

  if (signup) {
    const handleComplete = async (e) => {
      e.preventDefault();
      setError('');
      setBusy(true);
      try {
        const user = await chatGoogleComplete(signup.token, signup.username.trim());
        onSuccessRef.current(user);
      } catch (err) {
        setError(firstError(err?.data, 'Pendaftaran gagal.'));
      } finally {
        setBusy(false);
      }
    };

    return (
      <form onSubmit={handleComplete} style={{ display: 'flex', flexDirection: 'column', gap: compact ? '12px' : '14px' }}>
        <p style={{ color: 'var(--color-muted)', fontSize: compact ? '0.85rem' : '0.9rem', margin: 0 }}>
          Akaun Google anda disahkan. Pilih username untuk sembang (tidak boleh ditukar kemudian).
        </p>
        <input
          type="text"
          placeholder="Username (huruf, nombor, _ sahaja)"
          value={signup.username}
          onChange={e => setSignup({ ...signup, username: e.target.value })}
          style={inputStyle}
          autoFocus
          required
          minLength={2}
          maxLength={30}
          pattern="[A-Za-z0-9_]+"
          title="Huruf, nombor dan underscore sahaja"
        />
        {error && <div style={errorStyle}>{error}</div>}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn-accent" disabled={busy} style={{
            border: 'none', borderRadius: '8px', padding: compact ? '8px 20px' : '10px 20px', flex: 1,
            cursor: 'pointer', fontWeight: 600, fontSize: compact ? '0.9rem' : '1rem', opacity: busy ? 0.7 : 1,
          }}>{busy ? 'Mendaftar...' : 'Teruskan'}</button>
          <button type="button" onClick={() => { setSignup(null); setError(''); }} style={{
            background: 'none', border: '1px solid rgba(63, 63, 143, 0.3)', borderRadius: '8px',
            padding: compact ? '8px 20px' : '10px 20px', color: 'var(--color-text)', cursor: 'pointer',
            fontSize: compact ? '0.9rem' : '1rem',
          }}>Batal</button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div ref={buttonRef} style={{ display: 'flex', justifyContent: 'center', minHeight: compact ? '32px' : '40px', opacity: busy ? 0.6 : 1 }} />
      {error && <div style={{ ...errorStyle, marginTop: '8px', textAlign: 'center' }}>{error}</div>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px', margin: compact ? '12px 0' : '16px 0',
        color: 'var(--color-muted)', fontSize: '0.8rem',
      }}>
        <span style={{ flex: 1, height: '1px', background: 'rgba(63, 63, 143, 0.4)' }} />
        atau
        <span style={{ flex: 1, height: '1px', background: 'rgba(63, 63, 143, 0.4)' }} />
      </div>
      {children}
    </>
  );
}
