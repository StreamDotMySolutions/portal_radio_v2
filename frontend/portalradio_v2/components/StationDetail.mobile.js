'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AudioPlayer from './AudioPlayer';
import { trackPageview } from '@/utils/analytics';

export default function StationDetailMobile({ station }) {
  // Track pageview on component mount
  useEffect(() => {
    trackPageview('station', station.slug, station.name);
  }, [station.slug, station.name]);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', paddingTop: '100px' }}>
      {/* Banner */}
      <div
        className="position-relative d-flex align-items-end justify-content-center"
        style={{
          height: '180px',
          backgroundImage: station.heroBanner
            ? `url(${station.heroBanner})`
            : `linear-gradient(to bottom, ${station.accent}, var(--color-bg))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: `linear-gradient(to bottom, transparent 0%, ${station.accent}55 50%, var(--color-bg) 100%)` }} />
        <div className="position-relative text-center pb-3" style={{ zIndex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {station.name}
          </h1>
          <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
            <span className="px-2 py-1" style={{ backgroundColor: `${station.accent}33`, color: station.accent, borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500' }}>
              {station.genre}
            </span>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>
              <i className="bi bi-broadcast me-1"></i>{station.frequency}
            </span>
          </div>
        </div>
      </div>

      <div className="container px-3 py-3">
        {/* Back */}
        <Link href="/#radio-stations" className="d-inline-flex align-items-center gap-2 mb-3" style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
          <i className="bi bi-arrow-left"></i> Kembali
        </Link>

        {/* Audio Player / Embed Player */}
        <div className="mb-3">
          {station.embedPlayerUrl ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <iframe
                src={station.embedPlayerUrl}
                width="100%"
                height="350"
                style={{ border: 'none', display: 'block', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}
                allow="autoplay"
                scrolling="no"
                title={`${station.name} Live Player`}
              />
            </div>
          ) : (
            <div className="d-flex gap-2 align-items-flex-end flex-wrap">
              <div style={{ flex: 1, minWidth: '200px' }}>
                <AudioPlayer streamUrl={station.streamUrl} accent={station.accent} />
              </div>
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
                    padding: '2px 16px 2px 6px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <i className="bi bi-play-circle-fill" style={{ fontSize: '20px' }}></i>
                  Dengarkan
                </a>
              )}
            </div>
          )}
        </div>

        {/* Frequency */}
        <div className="card-dark p-3 mb-3" style={{ borderRadius: '8px', background: `linear-gradient(135deg, ${station.accent}22, ${station.accent}11)` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Frekuensi Radio</div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '2rem' }}>{station.frequency}</div>
          </div>
        </div>

        {/* About */}
        <div className="card-dark p-3 mb-3" style={{ borderRadius: '8px' }}>
          <h5 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1rem' }}>Tentang Stesen</h5>
          <p style={{ color: 'var(--color-muted)', lineHeight: '1.7', fontSize: '0.85rem', margin: 0 }}>{station.description}</p>
        </div>

        {/* Social Media Links */}
        {station.social && (Object.values(station.social).some(link => link !== '#')) && (
          <div className="mb-3">
            <h5 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1rem' }}>Ikuti Kami</h5>
            <div className="d-flex gap-2">
              {station.social.facebook && station.social.facebook !== '#' && (
                <a href={station.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: station.accent, fontSize: '1.3rem' }}>
                  <i className="bi bi-facebook"></i>
                </a>
              )}
              {station.social.instagram && station.social.instagram !== '#' && (
                <a href={station.social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: station.accent, fontSize: '1.3rem' }}>
                  <i className="bi bi-instagram"></i>
                </a>
              )}
              {station.social.twitter && station.social.twitter !== '#' && (
                <a href={station.social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: station.accent, fontSize: '1.3rem' }}>
                  <i className="bi bi-twitter-x"></i>
                </a>
              )}
              {station.social.youtube && station.social.youtube !== '#' && (
                <a href={station.social.youtube} target="_blank" rel="noopener noreferrer" style={{ color: station.accent, fontSize: '1.3rem' }}>
                  <i className="bi bi-youtube"></i>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
