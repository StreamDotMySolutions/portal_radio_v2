'use client';

import Link from 'next/link';
import { nasionalStations, negeriStations } from '@/data/stations';

export default function RadioStationsMobile() {
  const renderStationCards = (stations) => (
    <div className="row row-cols-2 g-2">
      {stations.map((station) => (
        <div key={station.slug} className="col">
          <Link href={`/station/${station.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card-dark h-100 d-flex flex-column" style={{ borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ height: '3px', backgroundColor: station.accent }}></div>
              <div className="p-2 d-flex flex-column flex-grow-1">
                <div style={{
                  width: '100%',
                  height: '50px',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                }}>
                  <img
                    src={station.banner}
                    alt={station.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h6 className="mb-1" style={{ color: 'var(--color-text)', fontSize: '0.75rem', fontWeight: '600' }}>
                  {station.name}
                </h6>
                <span
                  style={{ color: station.accent, fontWeight: '500', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <i className="bi bi-headphones"></i>
                  Dengar
                </span>
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
