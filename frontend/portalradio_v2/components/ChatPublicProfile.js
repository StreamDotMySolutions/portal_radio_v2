'use client';

import { useState, useEffect } from 'react';
import { chatGetPublicProfile, getAvatarUrl } from '../utils/chatApi';

export default function ChatPublicProfile({ userId, onClose, fullHeight = false, isModal = false }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profil');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await chatGetPublicProfile(userId);
        setProfile(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    const loadingContent = (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', backgroundColor: isModal ? 'transparent' : '#000', borderRadius: '12px',
      }}>
        <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Memuatkan profil...</div>
      </div>
    );
    return isModal ? <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>{loadingContent}</div> : loadingContent;
  }

  if (error || !profile) {
    const errorContent = (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', backgroundColor: isModal ? 'transparent' : '#000', borderRadius: '12px', padding: '2rem',
      }}>
        <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
          Profil tidak dijumpai
        </div>
      </div>
    );
    return isModal ? <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>{errorContent}</div> : errorContent;
  }

  // Determine if user has any social media URLs
  const hasSocial = profile.facebook_url || profile.instagram_url || profile.twitter_url || profile.tiktok_url || profile.youtube_url;
  const socialLinks = [
    profile.facebook_url && { label: 'Facebook', url: profile.facebook_url, icon: 'facebook' },
    profile.instagram_url && { label: 'Instagram', url: profile.instagram_url, icon: 'instagram' },
    profile.twitter_url && { label: 'Twitter/X', url: profile.twitter_url, icon: 'twitter' },
    profile.tiktok_url && { label: 'TikTok', url: profile.tiktok_url, icon: 'tiktok' },
    profile.youtube_url && { label: 'YouTube', url: profile.youtube_url, icon: 'youtube' },
  ].filter(Boolean);

  const profileContent = (
    <>
      {/* Header with back button */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
        borderBottom: '1px solid rgba(63, 63, 143, 0.3)',
      }}>
        <button
          onClick={onClose}
          title={isModal ? 'Tutup' : 'Kembali'}
          style={{
            background: 'none', border: 'none', color: isModal ? 'var(--color-muted)' : 'var(--color-text)', cursor: 'pointer',
            fontSize: isModal ? '1.5rem' : '1.2rem', padding: isModal ? '4px 8px' : '0', lineHeight: isModal ? 1 : 'inherit',
          }}
        >
          {isModal ? '×' : '←'}
        </button>

        {/* Avatar and username */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
            background: profile.avatar_filename ? 'none' : profile.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {profile.avatar_filename ? (
              <img src={getAvatarUrl(profile.avatar_filename)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{profile.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, color: profile.color, fontSize: '0.95rem', wordBreak: 'break-word' }}>
              {profile.username}
            </div>
            {profile.full_name && (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', wordBreak: 'break-word' }}>
                {profile.full_name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '0', borderBottom: '1px solid rgba(63, 63, 143, 0.3)',
      }}>
        <button
          onClick={() => setActiveTab('profil')}
          style={{
            flex: 1, background: 'none', border: 'none', padding: '12px 16px',
            color: activeTab === 'profil' ? 'var(--accent-color, #6C63FF)' : 'var(--color-muted)',
            fontSize: '0.9rem', fontWeight: activeTab === 'profil' ? 600 : 400,
            borderBottom: activeTab === 'profil' ? '2px solid var(--accent-color, #6C63FF)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Profil
        </button>
        {hasSocial && (
          <button
            onClick={() => setActiveTab('social')}
            style={{
              flex: 1, background: 'none', border: 'none', padding: '12px 16px',
              color: activeTab === 'social' ? 'var(--accent-color, #6C63FF)' : 'var(--color-muted)',
              fontSize: '0.9rem', fontWeight: activeTab === 'social' ? 600 : 400,
              borderBottom: activeTab === 'social' ? '2px solid var(--accent-color, #6C63FF)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Media Sosial
          </button>
        )}
        {profile.avatar_filename && (
          <button
            onClick={() => setActiveTab('foto')}
            style={{
              flex: 1, background: 'none', border: 'none', padding: '12px 16px',
              color: activeTab === 'foto' ? 'var(--accent-color, #6C63FF)' : 'var(--color-muted)',
              fontSize: '0.9rem', fontWeight: activeTab === 'foto' ? 600 : 400,
              borderBottom: activeTab === 'foto' ? '2px solid var(--accent-color, #6C63FF)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Foto
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px',
      }}>
        {activeTab === 'profil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {profile.about_me && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '4px', fontWeight: 600 }}>
                  Tentang
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {profile.about_me}
                </div>
              </div>
            )}

            {profile.location && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '4px', fontWeight: 600 }}>
                  Lokasi
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📍 {profile.location}
                </div>
              </div>
            )}

            {profile.hobby && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '4px', fontWeight: 600 }}>
                  Hobi
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎯 {profile.hobby}
                </div>
              </div>
            )}

            {profile.gender && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '4px', fontWeight: 600 }}>
                  Jantina
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  {profile.gender === 'M' ? 'Lelaki' : profile.gender === 'F' ? 'Perempuan' : profile.gender}
                </div>
              </div>
            )}

            {profile.created_at && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '4px', fontWeight: 600 }}>
                  Ahli sejak
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  {new Date(profile.created_at).toLocaleDateString('ms-MY')}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {socialLinks.map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                  backgroundColor: 'rgba(63, 63, 143, 0.1)', borderRadius: '8px',
                  textDecoration: 'none', color: 'var(--accent-color, #6C63FF)', transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(63, 63, 143, 0.2)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(63, 63, 143, 0.1)'}
              >
                <span style={{ fontSize: '1.2rem' }}>
                  {link.icon === 'facebook' && '👍'}
                  {link.icon === 'instagram' && '📷'}
                  {link.icon === 'twitter' && '𝕏'}
                  {link.icon === 'tiktok' && '🎵'}
                  {link.icon === 'youtube' && '▶️'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{link.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', wordBreak: 'break-all' }}>
                    {link.url}
                  </div>
                </div>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>
        )}

        {activeTab === 'foto' && profile.avatar_filename && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '1rem 0' }}>
            <img
              src={getAvatarUrl(profile.avatar_filename)}
              alt={profile.username}
              style={{
                width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover',
                border: '3px solid rgba(63, 63, 143, 0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
                {profile.username}
              </div>
              {profile.full_name && (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                  {profile.full_name}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Modal version
  if (isModal) {
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
          {profileContent}
        </div>
      </div>
    );
  }

  // Non-modal version (displays in video player area)
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: fullHeight ? '100%' : undefined, flex: fullHeight ? 1 : undefined, backgroundColor: '#000', borderRadius: '12px',
    }}>
      {profileContent}
    </div>
  );
}
