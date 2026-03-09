'use client';

import Link from 'next/link';
import { nasionalStations, negeriStations } from '@/data/stations';

export default function RadioStationsMobile() {
  const renderStationCards = (stations) => (
    <div className="row row-cols-2 g-2">
      {stations.map((station) => (
        <div key={station.slug} className="col">
          <Link href={`/station/${station.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card-dark h-100 d-flex flex-column" style={{ borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '3px', backgroundColor: station.accent }}></div>
              <div className="p-2 d-flex flex-column flex-grow-1 align-items-center justify-content-center" style={{ position: 'relative' }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={station.banner}
                    alt={station.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Hover overlay */}
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'none',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }} className="hover-overlay">
                  <h6 style={{ color: '#fff', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {station.name}
                  </h6>
                  <span style={{ color: '#fff', fontSize: '0.65rem' }}>
                    {station.frequency}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <section id="radio-stations" style={{ backgroundColor: 'var(--color-bg)' }} className="py-4">
      <div className="container px-3">
        <h2 className="section-heading" style={{ fontSize: '1.5rem' }}>Saluran Nasional</h2>
        {renderStationCards(nasionalStations)}

        <h2 className="section-heading" style={{ marginTop: '2rem', fontSize: '1.5rem' }}>Saluran Negeri</h2>
        {renderStationCards(negeriStations)}
      </div>
    </section>
  );
}
