'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { chatResetPassword } from '@/utils/chatApi';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const eyeBtn = (show, toggle) => (
    <button type="button" onClick={toggle} style={{
      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '2px',
    }}>
      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        {show ? (
          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829M3.35 5.47q-.27.238-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zM13.646 14.354l-12-12 .708-.708 12 12z"/>
        ) : (
          <><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></>
        )}
      </svg>
    </button>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Pengesahan kata laluan tidak sepadan.');
      return;
    }

    setLoading(true);
    try {
      await chatResetPassword(token, email, password, passwordConfirmation);
      setSuccess(true);
    } catch (err) {
      const data = err?.data;
      if (data?.errors) {
        const first = Object.values(data.errors)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError(data?.message || 'Gagal menukar kata laluan.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '80px' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)', padding: '2rem',
        }}>
          <div className="card-dark" style={{ padding: '2rem', borderRadius: '12px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Pautan Tidak Sah</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Pautan set semula kata laluan ini tidak sah atau telah tamat tempoh.
            </p>
            <a href="/chat" style={{ color: 'var(--accent-color, #6C63FF)', textDecoration: 'underline' }}>
              Kembali ke Sembang
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '80px' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)', padding: '2rem',
      }}>
        <div className="card-dark" style={{ padding: '2rem', borderRadius: '12px', maxWidth: '420px', width: '100%' }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Kata Laluan Berjaya Ditukar</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Sila log masuk semula dengan kata laluan baru anda.
              </p>
              <a href="/chat" className="btn-accent" style={{
                display: 'inline-block', border: 'none', borderRadius: '8px', padding: '10px 24px',
                textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
              }}>
                Pergi ke Sembang
              </a>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
                Set Semula Kata Laluan
              </h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                Masukkan kata laluan baru anda.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Kata laluan baru (min. 6 aksara)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '42px' }}
                    autoFocus
                    required
                    minLength={6}
                  />
                  {eyeBtn(showPw, () => setShowPw(!showPw))}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder="Sahkan kata laluan baru"
                    value={passwordConfirmation}
                    onChange={e => setPasswordConfirmation(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '42px' }}
                    required
                    minLength={6}
                  />
                  {eyeBtn(showConfirmPw, () => setShowConfirmPw(!showConfirmPw))}
                </div>
                {error && <div style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</div>}
                <button type="submit" className="btn-accent" disabled={loading} style={{
                  border: 'none', borderRadius: '8px', padding: '10px 20px', width: '100%',
                  cursor: 'pointer', fontWeight: 600, fontSize: '1rem', opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? 'Menukar...' : 'Tukar Kata Laluan'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
