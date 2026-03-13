'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchStations } from '@/utils/stationsApi';
import { trackSearch } from '@/utils/analytics';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';

export default function SearchResultPage() {
  return (
    <Suspense>
      <SearchResultContent />
    </Suspense>
  );
}

function SearchResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const sentinelRef = useRef(null);
  const [hasTracked, setHasTracked] = useState(false);
  const [query, setQuery] = useState(q);

  // Fetch results on mount or when q changes
  useEffect(() => {
    if (!q) return;

    setLoading(true);
    setHasTracked(false);
    searchStations(q)
      .then((stations) => {
        setResults(stations);
        setVisibleCount(6);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [q]);

  // Track search event once after search completes
  useEffect(() => {
    if (q && !loading && !hasTracked) {
      trackSearch('station_search', q);
      setHasTracked(true);
    }
  }, [q, loading, hasTracked]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 6);
      }
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search-result?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleStationClick = (stationSlug) => {
    // Track station click from search results
    fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionStorage.getItem('analytics_session_id') || '',
        event_type: 'station_click',
        page_type: 'search_result',
        reference_id: stationSlug,
      }),
    }).catch(() => {});
  };

  const visibleStations = results.slice(0, visibleCount);

  return (
    <main style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1a1a2e', padding: '2rem 1rem', marginTop: '120px' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1.5rem' }}>Carian Stesen Radio</h1>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px' }}>
            <input
              type="search"
              className="form-control bg-dark text-light"
              placeholder="Masukkan nama stesen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ border: '2px solid #ff6600' }}
            />
            <button className="btn" type="submit" style={{ backgroundColor: '#ff6600', color: '#fff', border: '2px solid #ff6600', whiteSpace: 'nowrap' }}>
              <i className="bi bi-search"></i> Cari
            </button>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section style={{ padding: '3rem 1rem' }}>
        <div className="container">
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && q && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#fff' }}>
                Hasil carian untuk "{q}"
              </h2>
              <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem' }}>
                {results.length} stesen dijumpai
              </p>
            </div>
          )}

          {!loading && results.length === 0 && q && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-muted)' }}>
              <i className="bi bi-search" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
              <h3>Tiada hasil ditemui</h3>
              <p>Sila cuba carian yang lain</p>
            </div>
          )}

          {!loading && visibleStations.length > 0 && (
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
              {visibleStations.map((station) => (
                <div key={station.slug} className="col">
                  <Link href={`/station/${station.slug}`} onClick={() => handleStationClick(station.slug)} style={{ textDecoration: 'none' }}>
                    <div className="card-dark hover-lift h-100 d-flex flex-column" style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                      {/* Coloured top stripe */}
                      <div style={{ height: '4px', backgroundColor: station.accent }}></div>

                      <div className="p-3 d-flex flex-column flex-grow-1 align-items-center justify-content-center" style={{ position: 'relative' }}>
                        {/* Banner image */}
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#000',
                            minHeight: '120px',
                          }}
                        >
                          {station.banner ? (
                            <img
                              src={station.banner}
                              alt={station.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div style={{ width: '100%', minHeight: '120px', backgroundColor: station.accent, opacity: 0.3 }} />
                          )}
                        </div>

                        {/* Hover overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '4px',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#000',
                            display: 'none',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '1rem',
                            borderRadius: '6px',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          }}
                          className="hover-overlay"
                        >
                          <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            {station.name}
                          </h5>
                        </div>
                      </div>

                      {/* Station info strip */}
                      <div
                        style={{
                          borderTop: `1px solid rgba(255,255,255,0.08)`,
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.75rem',
                          color: 'var(--color-muted)',
                        }}
                      >
                        <i className="bi bi-pin-map" style={{ fontSize: '0.8rem' }}></i>
                        <span>
                          {station.category === 'nasional' ? 'Nasional' : station.category === 'negeri' ? 'Negeri' : 'Radio Tempatan'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {visibleCount < results.length && <div ref={sentinelRef} style={{ padding: '2rem', textAlign: 'center' }} />}
        </div>
      </section>
    </main>
  );
}
