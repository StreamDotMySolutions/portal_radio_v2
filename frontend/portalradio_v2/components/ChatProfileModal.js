'use client';

import { useState, useEffect, useRef } from 'react';
import { chatGetProfile, chatUpdateProfile, chatRemoveAvatar, chatSendActivation, getAvatarUrl } from '../utils/chatApi';

export default function ChatProfileModal({ user, onClose, onUserChange }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [sendingActivation, setSendingActivation] = useState(false);
  const [activationMsg, setActivationMsg] = useState('');

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
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const p = await chatGetProfile();
      setProfile(p);
      setFullName(p.full_name || '');
      setGender(p.gender || '');
      setLocation(p.location || '');
      setHobby(p.hobby || '');
      setAboutMe(p.about_me || '');
      setFacebookUrl(p.facebook_url || '');
      setInstagramUrl(p.instagram_url || '');
      setTwitterUrl(p.twitter_url || '');
      setTiktokUrl(p.tiktok_url || '');
      setYoutubeUrl(p.youtube_url || '');
      if (p.avatar_filename) {
        setAvatarPreview(getAvatarUrl(p.avatar_filename));
      }
    } catch {
      setError('Gagal memuatkan profil');
    } finally {
      setLoading(false);
    }
  };

  const isVerified = profile?.email_verified_at != null;

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
      setProfile(prev => ({ ...prev, avatar_filename: null }));
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
      setProfile(prev => ({ ...prev, ...data.user }));
      if (onUserChange && data.user) {
        onUserChange(prev => ({ ...prev, avatar_filename: data.user.avatar_filename }));
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
          background: avatarPreview ? 'none' : (profile?.color || '#3F3F8F'),
          opacity: isVerified ? 1 : 0.5,
        }}
        title={isVerified ? 'Klik untuk tukar avatar' : ''}
      >
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3.5rem', fontWeight: 700, color: '#fff' }}>
            {profile?.username?.charAt(0).toUpperCase() || '?'}
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
          {(avatarPreview || profile?.avatar_filename) && (
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

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}>
        <div style={{
          background: 'var(--color-surface)', borderRadius: '12px', padding: '2rem',
          width: '100%', maxWidth: '500px', textAlign: 'center', color: 'var(--color-muted)',
        }}>
          Memuatkan profil...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: 'var(--color-surface)', borderRadius: '12px', overflow: 'hidden',
        width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header with avatar + username + close button */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(63, 63, 143, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              background: avatarPreview ? 'none' : profile?.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{profile?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Profil Sembang</div>
              <div style={{ fontSize: '0.8rem', color: profile?.color }}>{profile?.username}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--color-muted)',
            cursor: 'pointer', padding: '4px 8px', lineHeight: 1,
          }}>×</button>
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
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(63, 63, 143, 0.3)' }}>
          {[
            { label: 'Maklumat', icon: 'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z' },
            { label: 'Sosial', icon: 'M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2' },
            { label: 'Foto', icon: 'M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z' },
          ].map((tab, i) => (
            <button key={i} onClick={() => { setActiveTab(i); setError(''); setSuccess(''); }} style={{
              flex: 1, padding: '12px 8px', background: 'none', border: 'none',
              borderBottom: activeTab === i ? '2px solid var(--accent-color, #6C63FF)' : '2px solid transparent',
              color: activeTab === i ? 'var(--accent-color, #6C63FF)' : 'var(--color-muted)',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d={tab.icon} /></svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {activeTab === 0 && renderTab0()}
            {activeTab === 1 && renderTab1()}
            {activeTab === 2 && renderTab2()}
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(63, 63, 143, 0.3)', backgroundColor: 'rgba(63, 63, 143, 0.05)' }}>
            {error && <div style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '8px' }}>{error}</div>}
            {success && <div style={{ color: '#10B981', fontSize: '0.85rem', marginBottom: '8px' }}>{success}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-accent" disabled={!isVerified || saving} style={{
                flex: 1, border: 'none', borderRadius: '8px', padding: '10px 20px',
                cursor: isVerified ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '0.95rem',
                opacity: (!isVerified || saving) ? 0.5 : 1,
              }}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button type="button" onClick={onClose} style={{
                background: 'none', border: '1px solid rgba(63, 63, 143, 0.3)', borderRadius: '8px',
                padding: '10px 20px', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.9rem',
              }}>Tutup</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
