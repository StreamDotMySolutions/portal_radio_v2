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
              <div className="p-2 d-flex flex-column flex-grow-1 align-items-center justify-content-center">
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
