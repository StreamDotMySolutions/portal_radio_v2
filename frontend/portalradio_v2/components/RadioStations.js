'use client';

import Link from 'next/link';
import { nasionalStations, negeriStations } from '@/data/stations';

export default function RadioStations() {
  const renderStationCards = (stations) => (
    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
      {stations.map((station) => (
        <div key={station.slug} className="col">
          <Link href={`/station/${station.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card-dark hover-lift h-100 d-flex flex-column" style={{ borderRadius: '8px', overflow: 'hidden' }}>
              {/* Coloured top stripe */}
              <div style={{ height: '4px', backgroundColor: station.accent }}></div>

              <div className="p-4 d-flex flex-column flex-grow-1">
                {/* Banner image */}
                <div style={{
                  width: '100%',
                  height: '80px',
                  marginBottom: '1rem',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000',
                }}>
                  <img
                    src={station.banner}
                    alt={station.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                {/* Station name */}
                <h5 className="mb-2" style={{ color: 'var(--color-text)', fontSize: '0.95rem', fontWeight: '600' }}>
                  {station.name}
                </h5>

                {/* Genre label */}
                <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                  {station.genre}
                </p>

                {/* Frequency */}
                <p className="text-muted mb-3" style={{ fontSize: '0.8rem', marginTop: 'auto' }}>
                  {station.frequency}
                </p>

                {/* Listen indicator */}
                <span
                  style={{ color: station.accent, fontWeight: '500', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="bi bi-headphones"></i>
                  Dengar Sekarang
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <section id="radio-stations" style={{ backgroundColor: 'var(--color-bg)' }} className="py-5">
      <div className="container">
        {/* Saluran Nasional */}
        <h2 className="section-heading">Saluran Nasional</h2>
        {renderStationCards(nasionalStations)}

        {/* Saluran Negeri */}
        <h2 className="section-heading" style={{ marginTop: '4rem' }}>Saluran Negeri</h2>
        {renderStationCards(negeriStations)}
      </div>
    </section>
  );
}
