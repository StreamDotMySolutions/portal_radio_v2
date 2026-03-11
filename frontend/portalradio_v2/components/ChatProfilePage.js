'use client';

import { useState, useEffect, useRef } from 'react';
import ChatWidget, { ChatAuthForm } from './ChatWidget';
import { getChatUser, setChatUser, chatGetProfile, chatUpdateProfile, chatRemoveAvatar, chatSendActivation, getAvatarUrl } from '../utils/chatApi';

export default function ChatProfilePage() {
  const [user, setUser] = useState(null);
  const [chatUser, setChatUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingActivation, setSendingActivation] = useState(false);
  const [activationMsg, setActivationMsg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const [chatOpen, setChatOpen] = useState(true);
  const [chatFullScreen, setChatFullScreen] = useState(false);
  const [authView, setAuthView] = useState(null);

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [hobby, setHobby] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setChatOpen(window.innerWidth > 768);
    const stored = getChatUser();
    if (stored) setChatUserState(stored);
    if (!stored) {
      setLoading(false);
      return;
    }

    chatGetProfile().then(profile => {
      setUser(profile);
      setFullName(profile.full_name || '');
      setGender(profile.gender || '');
      setLocation(profile.location || '');
      setHobby(profile.hobby || '');
      setAboutMe(profile.about_me || '');
      setFacebookUrl(profile.facebook_url || '');
      setInstagramUrl(profile.instagram_url || '');
      setTwitterUrl(profile.twitter_url || '');
      setTiktokUrl(profile.tiktok_url || '');
      setYoutubeUrl(profile.youtube_url || '');
      if (profile.avatar_filename) {
        setAvatarPreview(getAvatarUrl(profile.avatar_filename));
      }
    }).catch(() => {
      setChatUser(null);
    }).finally(() => setLoading(false));
  }, []);

  const isVerified = user?.email_verified_at != null;

  const handleSendActivation = async () => {
    setSendingActivation(true);
    setActivationMsg('');
    try {
      const data = await chatSendActivation();
      setActivationMsg(data.message);
    } catch (err) {
      setActivationMsg(err?.data?.message || 'Gagal menghantar pautan.');
    } finally {
      setSendingActivation(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Hanya fail PNG dan JPG dibenarkan.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Saiz fail maksimum ialah 5MB.');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleRemoveAvatar = async () => {
    try {
      await chatRemoveAvatar();
      setAvatarPreview(null);
      setAvatarFile(null);
      setUser(prev => ({ ...prev, avatar_filename: null }));
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err?.data?.message || 'Gagal memadam avatar.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('gender', gender);
    formData.append('location', location);
    formData.append('hobby', hobby);
    formData.append('about_me', aboutMe);
    formData.append('facebook_url', facebookUrl);
    formData.append('instagram_url', instagramUrl);
    formData.append('twitter_url', twitterUrl);
    formData.append('tiktok_url', tiktokUrl);
    formData.append('youtube_url', youtubeUrl);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const data = await chatUpdateProfile(formData);
      setSuccess('Profil berjaya dikemaskini.');
      setAvatarFile(null);
      if (data.user?.avatar_filename) {
        setAvatarPreview(getAvatarUrl(data.user.avatar_filename));
      }
      setUser(prev => ({ ...prev, ...data.user }));
      // Update chat user in localStorage too
      const stored = getChatUser();
      if (stored && data.user) {
        setChatUser({ ...stored, avatar_filename: data.user.avatar_filename });
        setChatUserState(prev => ({ ...prev, avatar_filename: data.user.avatar_filename }));
      }
    } catch (err) {
      const data = err?.data;
      if (data?.errors) {
        const first = Object.values(data.errors)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError(data?.message || 'Gagal mengemaskini profil.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAuthSuccess = (u) => {
    setChatUserState(u);
    setAuthView(null);
    // Reload profile
    chatGetProfile().then(profile => {
      setUser(profile);
      setFullName(profile.full_name || '');
      setGender(profile.gender || '');
      setLocation(profile.location || '');
      setHobby(profile.hobby || '');
      setAboutMe(profile.about_me || '');
      setFacebookUrl(profile.facebook_url || '');
      setInstagramUrl(profile.instagram_url || '');
      setTwitterUrl(profile.twitter_url || '');
      setTiktokUrl(profile.tiktok_url || '');
      setYoutubeUrl(profile.youtube_url || '');
      if (profile.avatar_filename) setAvatarPreview(getAvatarUrl(profile.avatar_filename));
    }).catch(() => {});
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--color-bg)',
    border: '1px solid rgba(63, 63, 143, 0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text)',
    fontSize: '0.95rem',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-muted)',
    marginBottom: '4px',
    display: 'block',
  };

  const tabs = [
    { label: 'Maklumat Peribadi', icon: 'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z' },
    { label: 'Media Sosial', icon: 'M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2' },
    { label: 'Foto Profil', icon: 'M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z' },
  ];

  if (loading) {
    return (
      <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '80px' }}>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>Memuatkan...</div>
      </main>
    );
  }

  // Tab content renderers
  const renderTab0 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={labelStyle}>Nama Penuh</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
          style={inputStyle} maxLength={100} disabled={!isVerified} placeholder="Nama penuh anda" />
      </div>
      <div>
        <label style={labelStyle}>Jantina</label>
        <select value={gender} onChange={e => setGender(e.target.value)}
          style={{ ...inputStyle, cursor: isVerified ? 'pointer' : 'default' }} disabled={!isVerified}>
          <option value="">-- Pilih --</option>
          <option value="lelaki">Lelaki</option>
          <option value="perempuan">Perempuan</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Lokasi</label>
        <input type="text" value={location} onChange={e => setLocation(e.target.value)}
          style={inputStyle} maxLength={100} disabled={!isVerified} placeholder="Bandar / Negeri" />
      </div>
      <div>
        <label style={labelStyle}>Hobi</label>
        <input type="text" value={hobby} onChange={e => setHobby(e.target.value)}
          style={inputStyle} maxLength={255} disabled={!isVerified} placeholder="Hobi anda" />
      </div>
      <div>
        <label style={labelStyle}>Tentang Saya</label>
        <textarea value={aboutMe} onChange={e => setAboutMe(e.target.value)}
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          maxLength={1000} disabled={!isVerified} placeholder="Ceritakan tentang diri anda..." />
        <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', textAlign: 'right', marginTop: '4px' }}>
          {aboutMe.length}/1000
        </div>
      </div>
    </div>
  );

  const renderTab1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {[
        { label: 'Facebook', value: facebookUrl, setter: setFacebookUrl, placeholder: 'https://facebook.com/username' },
        { label: 'Instagram', value: instagramUrl, setter: setInstagramUrl, placeholder: 'https://instagram.com/username' },
        { label: 'Twitter / X', value: twitterUrl, setter: setTwitterUrl, placeholder: 'https://x.com/username' },
        { label: 'TikTok', value: tiktokUrl, setter: setTiktokUrl, placeholder: 'https://tiktok.com/@username' },
        { label: 'YouTube', value: youtubeUrl, setter: setYoutubeUrl, placeholder: 'https://youtube.com/@channel' },
      ].map(({ label, value, setter, placeholder }) => (
        <div key={label}>
          <label style={labelStyle}>{label}</label>
          <input type="url" value={value} onChange={e => setter(e.target.value)}
            style={inputStyle} maxLength={255} disabled={!isVerified} placeholder={placeholder} />
        </div>
      ))}
    </div>
  );

  const renderTab2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '1rem 0' }}>
      <div
        onClick={() => isVerified && fileRef.current?.click()}
        style={{
          width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden',
          border: '3px solid rgba(63, 63, 143, 0.3)', cursor: isVerified ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: avatarPreview ? 'none' : (user?.color || '#3F3F8F'),
          opacity: isVerified ? 1 : 0.5,
        }}
        title={isVerified ? 'Klik untuk tukar avatar' : ''}
      >
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3.5rem', fontWeight: 700, color: '#fff' }}>
            {user?.username?.charAt(0).toUpperCase() || '?'}
          </span>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleAvatarChange}
        style={{ display: 'none' }}
        disabled={!isVerified}
      />
      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', textAlign: 'center', margin: 0 }}>
        Format: PNG atau JPG. Maksimum 5MB.
      </p>
      {isVerified && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-accent" style={{
            border: 'none', borderRadius: '8px', padding: '8px 20px',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
          }}>Pilih Foto</button>
          {(avatarPreview || user?.avatar_filename) && (
            <button type="button" onClick={handleRemoveAvatar} style={{
              background: 'none', border: '1px solid #EF4444', borderRadius: '8px',
              padding: '8px 20px', color: '#EF4444', cursor: 'pointer', fontSize: '0.9rem',
            }}>Padam</button>
          )}
        </div>
      )}
      {avatarFile && (
        <div style={{ fontSize: '0.85rem', color: '#10B981' }}>
          Foto dipilih: {avatarFile.name}
        </div>
      )}
    </div>
  );

  const renderProfileArea = () => {
    if (!user) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100%', padding: '2rem', color: 'var(--color-muted)',
        }}>
          <svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor" style={{ marginBottom: '1rem', opacity: 0.4 }}>
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
          </svg>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Log Masuk Diperlukan</h3>
          <p style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>
            Sila log masuk ke sembang untuk mengakses profil anda.
          </p>
          <a href="/chat" style={{ color: 'var(--accent-color, #6C63FF)', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Pergi ke Sembang
          </a>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Profile header with avatar + username */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(63, 63, 143, 0.3)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
            background: avatarPreview ? 'none' : user.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{user.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Profil Sembang</div>
            <div style={{ fontSize: '0.8rem', color: user.color }}>{user.username}</div>
          </div>
        </div>

        {/* Activation banner */}
        {!isVerified && (
          <div style={{
            background: 'rgba(217, 119, 6, 0.1)', borderBottom: '1px solid rgba(217, 119, 6, 0.3)',
            padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#D97706' }}>Akaun belum diaktifkan</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Aktifkan melalui emel untuk kemaskini profil.</div>
            </div>
            {activationMsg ? (
              <div style={{ fontSize: '0.8rem', color: '#10B981', whiteSpace: 'nowrap' }}>{activationMsg}</div>
            ) : (
              <button onClick={handleSendActivation} disabled={sendingActivation} style={{
                background: '#D97706', border: 'none', borderRadius: '6px', padding: '6px 14px',
                color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                opacity: sendingActivation ? 0.7 : 1,
              }}>
                {sendingActivation ? 'Menghantar...' : 'Hantar Pautan'}
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: '1px solid rgba(63, 63, 143, 0.3)',
        }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => { setActiveTab(i); setError(''); setSuccess(''); }} style={{
              flex: 1, padding: '12px 8px', background: 'none', border: 'none',
              borderBottom: activeTab === i ? '2px solid var(--accent-color, #6C63FF)' : '2px solid transparent',
              color: activeTab === i ? 'var(--accent-color, #6C63FF)' : 'var(--color-muted)',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d={tab.icon} /></svg>
              <span className="d-none d-sm-inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {activeTab === 0 && renderTab0()}
            {activeTab === 1 && renderTab1()}
            {activeTab === 2 && renderTab2()}
          </div>

          {/* Footer: messages + save button */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(63, 63, 143, 0.3)' }}>
            {error && <div style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '8px' }}>{error}</div>}
            {success && <div style={{ color: '#10B981', fontSize: '0.85rem', marginBottom: '8px' }}>{success}</div>}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="submit" className="btn-accent" disabled={!isVerified || saving} style={{
                flex: 1, border: 'none', borderRadius: '8px', padding: '10px 20px',
                cursor: isVerified ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '0.95rem',
                opacity: (!isVerified || saving) ? 0.5 : 1,
              }}>
                {saving ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
              <a href="/chat" style={{
                background: 'none', border: '1px solid rgba(63, 63, 143, 0.3)', borderRadius: '8px',
                padding: '10px 16px', color: 'var(--color-muted)', textDecoration: 'none', fontSize: '0.9rem',
                display: 'inline-block',
              }}>Kembali</a>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <main style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container-fluid px-4 py-5">
        <div className="d-flex livestream-wrapper" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Profile area — replaces video player */}
          <div className={`livestream-player ${chatOpen ? '' : 'chat-closed'}`} style={{
            flexGrow: chatFullScreen ? 0 : 1,
            minWidth: 0,
            display: chatFullScreen ? 'none' : 'flex',
            flexDirection: 'column',
          }}>
            <div className="card-dark" style={{
              flex: 1, borderRadius: '12px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              {authView ? (
                <ChatAuthForm
                  view={authView}
                  onSuccess={handleAuthSuccess}
                  onBack={() => setAuthView(null)}
                  onSwitchView={setAuthView}
                />
              ) : (
                renderProfileArea()
              )}
            </div>
          </div>

          {/* Chat sidebar */}
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
                    title={chatFullScreen ? 'Show profile' : 'Hide profile'}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      {chatFullScreen ? (
                        <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z"/>
                      ) : (
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
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
                    title={chatFullScreen ? 'Show profile' : 'Close chat'}
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
                onUserChange={setChatUserState}
              />
            </div>
          )}
        </div>

        {/* Chat toggle when closed */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="btn-accent"
            style={{
              position: 'fixed', bottom: '24px', right: '24px',
              border: 'none', borderRadius: '50%', width: '56px', height: '56px',
              cursor: 'pointer', fontSize: '1.2rem', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
            title="Open chat"
          >
            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 11.4a1 1 0 0 0-.8-.4H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a.5.5 0 0 1 .4.2l1.9 2.533a2 2 0 0 0 3.2.001l1.9-2.534a.5.5 0 0 1 .4-.2H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
              <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>
          </button>
        )}
      </div>
    </main>
  );
}
