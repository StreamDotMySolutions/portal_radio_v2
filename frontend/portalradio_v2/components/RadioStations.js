'use client';

import Link from 'next/link';
import { nasionalStations, negeriStations } from '@/data/stations';

export default function RadioStations() {
  const renderStationCards = (stations) => (
    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
      {stations.map((station) => (
        <div key={station.slug} className="col">
          <Link href={`/station/${station.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card-dark hover-lift h-100 d-flex flex-column" style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              {/* Coloured top stripe */}
              <div style={{ height: '4px', backgroundColor: station.accent }}></div>

              <div className="p-3 d-flex flex-column flex-grow-1 align-items-center justify-content-center" style={{ position: 'relative' }}>
                {/* Banner image */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000',
                  minHeight: '120px',
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

                {/* Hover overlay */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'none',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '6px',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }} className="hover-overlay">
                  <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {station.name}
                  </h5>
                  <p style={{ color: '#fff', fontSize: '0.8rem', margin: 0 }}>
                    {station.frequency}
                  </p>
                </div>
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
