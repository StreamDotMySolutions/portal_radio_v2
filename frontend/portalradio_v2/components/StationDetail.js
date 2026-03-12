'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AudioPlayer from './AudioPlayer';
import { trackPageview } from '@/utils/analytics';

export default function StationDetail({ station }) {
  // Track pageview on component mount
  useEffect(() => {
    trackPageview('station', station.id, station.name);
  }, [station.id, station.name]);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', paddingTop: '120px' }}>
      {/* Banner hero */}
      <div
        className="station-banner-hero position-relative d-flex align-items-end justify-content-center"
        style={{
          height: '300px',
          backgroundImage: station.heroBanner
            ? `url(${station.heroBanner})`
            : `linear-gradient(to bottom, ${station.accent}, var(--color-bg))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: `linear-gradient(to bottom, transparent 0%, ${station.accent}55 50%, var(--color-bg) 100%)` }} />
        <div className="position-relative text-center pb-4" style={{ zIndex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {station.name}
          </h1>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <span className="px-3 py-1" style={{ backgroundColor: `${station.accent}33`, color: station.accent, borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
              {station.genre}
            </span>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              <i className="bi bi-broadcast me-1"></i>{station.frequency}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Back link */}
        <Link href="/#radio-stations" className="d-inline-flex align-items-center gap-2 mb-4" style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          <i className="bi bi-arrow-left"></i> Kembali ke Senarai Stesen
        </Link>

        {/* 2-Column Layout: Left (Player) + Right (About + Frequency) */}
        <div className="d-flex mb-4" style={{ gap: '1.5rem' }}>
          {/* Left Column: Player */}
          <div style={{ flex: '0 0 42%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {station.embedPlayerUrl ? (
              <div style={{ width: '100%', maxWidth: '100%' }}>
                <iframe
                  src={station.embedPlayerUrl}
                  width="100%"
                  height="500"
                  style={{ border: 'none', display: 'block', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-bg)', margin: '0 auto' }}
                  allow="autoplay"
                  scrolling="no"
                  title={`${station.name} Live Player`}
                />
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                <AudioPlayer streamUrl={station.streamUrl} accent={station.accent} />
                {station.rtmKlikUrl && (
                  <a
                    href={station.rtmKlikUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      backgroundColor: '#CCFF00',
                      color: '#000',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '2px 24px 2px 8px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <i className="bi bi-play-circle-fill" style={{ fontSize: '28px' }}></i>
                    Dengarkan di RTM Klik
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Frequency + About */}
          <div style={{ flex: '0 0 58%' }}>
            <div className="d-flex flex-column gap-4">
              {/* Frekuensi */}
              <div
                className="card-dark d-flex flex-column align-items-center justify-content-center text-center p-4"
                style={{
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${station.accent}22, ${station.accent}11)`,
                  borderColor: `${station.accent}44`,
                }}
              >
                <i className="bi bi-broadcast" style={{ fontSize: '2rem', color: station.accent, marginBottom: '0.5rem' }}></i>
                <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>
                  {station.frequency}
                </div>
                <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  Frekuensi Radio
                </div>
              </div>

              {/* Tentang Stesen */}
              <div className="card-dark p-4" style={{ borderRadius: '8px' }}>
                <h3 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '1rem' }}>Tentang Stesen</h3>
                <p style={{ color: 'var(--color-muted)', lineHeight: '1.8', margin: 0 }}>{station.description}</p>
              </div>

              {/* Social Media Links */}
              {station.social && (Object.values(station.social).some(link => link !== '#')) && (
                <div>
                  <h5 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '1rem' }}>Ikuti Kami</h5>
                  <div className="d-flex gap-3">
                    {station.social.facebook && station.social.facebook !== '#' && (
                      <a href={station.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: station.accent, fontSize: '1.5rem' }}>
                        <i className="bi bi-facebook"></i>
                      </a>
                    )}
                    {station.social.instagram && station.social.instagram !== '#' && (
                      <a href={station.social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: station.accent, fontSize: '1.5rem' }}>
                        <i className="bi bi-instagram"></i>
                      </a>
                    )}
                    {station.social.twitter && station.social.twitter !== '#' && (
                      <a href={station.social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: station.accent, fontSize: '1.5rem' }}>
                        <i className="bi bi-twitter-x"></i>
                      </a>
                    )}
                    {station.social.youtube && station.social.youtube !== '#' && (
                      <a href={station.social.youtube} target="_blank" rel="noopener noreferrer" style={{ color: station.accent, fontSize: '1.5rem' }}>
                        <i className="bi bi-youtube"></i>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
