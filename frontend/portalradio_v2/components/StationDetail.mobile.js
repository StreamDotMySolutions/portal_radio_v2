'use client';

import { useState } from 'react';
import Link from 'next/link';
import AudioPlayer from './AudioPlayer';
import DeeJayModal from './DeeJayModal';

export default function StationDetailMobile({ station }) {
  const [selectedDJ, setSelectedDJ] = useState(null);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', paddingTop: '100px' }}>
      {/* Banner */}
      <div
        className="position-relative d-flex align-items-end justify-content-center"
        style={{
          height: '180px',
          backgroundImage: `url(${station.banner})`,
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

        {/* Audio Player */}
        <div className="mb-3">
          <AudioPlayer streamUrl={station.streamUrl} accent={station.accent} />
        </div>

        {/* Penyampai — full width, below Siaran Langsung */}
        {station.deejays && station.deejays.length > 0 && (
          <div className="mb-3">
            <h5 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1rem' }}>Penyampai</h5>
            <div className="d-flex flex-wrap gap-2">
              {station.deejays.map(dj => (
                <div
                  key={dj.id}
                  className="deejay-card card-dark text-center"
                  style={{ width: 'calc(33.333% - 8px)', minWidth: '100px', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => setSelectedDJ(dj)}
                >
                  <div
                    className="position-relative"
                    style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#1a1a3e' }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center w-100 h-100"
                      style={{
                        background: `linear-gradient(135deg, ${station.accent}44, ${station.accent}22)`,
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#fff',
                      }}
                    >
                      {dj.name.charAt(0)}
                    </div>
                    <div
                      className="position-absolute bottom-0 start-0 w-100"
                      style={{ height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
                    />
                  </div>
                  <div className="p-1">
                    <h6 style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: '0.7rem', marginBottom: '0.1rem' }}>{dj.name}</h6>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.6rem', marginBottom: '0.25rem' }}>{dj.role}</p>
                    <div className="d-flex justify-content-center gap-1">
                      {dj.social?.instagram && <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}><i className="bi bi-instagram"></i></span>}
                      {dj.social?.twitter && <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}><i className="bi bi-twitter-x"></i></span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        <div className="card-dark p-3 mb-3" style={{ borderRadius: '8px' }}>
          <h5 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1rem' }}>Tentang Stesen</h5>
          <p style={{ color: 'var(--color-muted)', lineHeight: '1.7', fontSize: '0.85rem', margin: 0 }}>{station.description}</p>
        </div>

        {/* Info */}
        <div className="card-dark p-3 mb-3" style={{ borderRadius: '8px' }}>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>Frekuensi</div>
              <div style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: '0.9rem' }}>{station.frequency}</div>
            </div>
            <div className="text-end">
              <div style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>Genre</div>
              <div style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: '0.9rem' }}>{station.genre}</div>
            </div>
          </div>
          {station.social && (
            <div className="d-flex gap-3 mt-2">
              {station.social.facebook && (
                <a href={station.social.facebook} style={{ color: station.accent, fontSize: '1.2rem' }}><i className="bi bi-facebook"></i></a>
              )}
              {station.social.instagram && (
                <a href={station.social.instagram} style={{ color: station.accent, fontSize: '1.2rem' }}><i className="bi bi-instagram"></i></a>
              )}
              {station.social.twitter && (
                <a href={station.social.twitter} style={{ color: station.accent, fontSize: '1.2rem' }}><i className="bi bi-twitter-x"></i></a>
              )}
              {station.social.youtube && (
                <a href={station.social.youtube} style={{ color: station.accent, fontSize: '1.2rem' }}><i className="bi bi-youtube"></i></a>
              )}
            </div>
          )}
        </div>
      </div>

      <DeeJayModal deejay={selectedDJ} accent={station.accent} show={!!selectedDJ} onClose={() => setSelectedDJ(null)} />
    </div>
  );
}
