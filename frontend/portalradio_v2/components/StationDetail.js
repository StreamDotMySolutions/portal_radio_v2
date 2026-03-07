'use client';

import { useState } from 'react';
import Link from 'next/link';
import AudioPlayer from './AudioPlayer';
import DeeJayModal from './DeeJayModal';

export default function StationDetail({ station }) {
  const [selectedDJ, setSelectedDJ] = useState(null);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', paddingTop: '120px' }}>
      {/* Banner hero */}
      <div
        className="station-banner-hero position-relative d-flex align-items-end justify-content-center"
        style={{
          height: '300px',
          backgroundImage: `url(${station.banner})`,
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

        {/* Tentang Stesen (8) + Frekuensi (4) sebaris */}
        <div className="d-flex gap-4 mb-4" style={{ flexWrap: 'nowrap' }}>
          <div style={{ flex: '0 0 66.666%' }}>
            <div className="card-dark p-4 h-100" style={{ borderRadius: '8px' }}>
              <h3 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '1rem' }}>Tentang Stesen</h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: '1.8', margin: 0 }}>{station.description}</p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div
              className="card-dark d-flex flex-column align-items-center justify-content-center text-center p-4 h-100"
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
          </div>
        </div>

        {/* Audio Player */}
        <div className="mb-4">
          <AudioPlayer streamUrl={station.streamUrl} accent={station.accent} />
        </div>

        {/* Penyampai — full width, 2 rows, right below Siaran Langsung */}
        {station.deejays && station.deejays.length > 0 && (
          <div className="mb-4">
            <h5 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '1rem' }}>Penyampai</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {station.deejays.map(dj => (
                <div
                  key={dj.id}
                  className="deejay-card card-dark text-center"
                  style={{ borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => setSelectedDJ(dj)}
                >
                  {/* Photo placeholder */}
                  <div
                    className="position-relative"
                    style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#1a1a3e' }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center w-100 h-100"
                      style={{
                        background: `linear-gradient(135deg, ${station.accent}44, ${station.accent}22)`,
                        fontSize: '2.5rem',
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
                  <div className="p-2">
                    <h6 style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.15rem' }}>
                      {dj.name}
                    </h6>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                      {dj.role}
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      {dj.social?.instagram && (
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}><i className="bi bi-instagram"></i></span>
                      )}
                      {dj.social?.twitter && (
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}><i className="bi bi-twitter-x"></i></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <DeeJayModal deejay={selectedDJ} accent={station.accent} show={!!selectedDJ} onClose={() => setSelectedDJ(null)} />
    </div>
  );
}
