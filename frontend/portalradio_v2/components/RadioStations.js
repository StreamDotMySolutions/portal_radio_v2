'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { fetchStations, fetchStationHits } from '@/utils/stationsApi';

function getOrCreateSessionId() {
  let id = sessionStorage.getItem('rtm_sid');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('rtm_sid', id);
  }
  return id;
}

export default function RadioStations() {
  const [playingSlug, setPlayingSlug] = useState(null);
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const [nasionalStations, setNasionalStations] = useState([]);
  const [negeriStations, setNegeriStations] = useState([]);
  const [radioTempatanStations, setRadioTempatanStations] = useState([]);
  const [radioOnlineStations, setRadioOnlineStations] = useState([]);
  const [stationHits, setStationHits] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchStations().then(stations => {
      setNasionalStations(stations.filter(s => s.category === 'nasional'));
      setNegeriStations(stations.filter(s => s.category === 'negeri'));
      setRadioTempatanStations(stations.filter(s => s.category === 'radio_tempatan'));
      setRadioOnlineStations(stations.filter(s => s.category === 'radio_online'));
    });
    fetchStationHits().then(setStationHits);
  }, []);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  const toggleStation = async (station, e) => {
    e.preventDefault();
    e.stopPropagation();

    const disabled = !station.streamUrl || station.streamUrl === '#';
    if (disabled) return;

    const audio = audioRef.current;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';

    // Same station — pause and stop
    if (playingSlug === station.slug) {
      audio.pause();
      setPlayingSlug(null);
      return;
    }

    // Stop previous
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    audio.pause();
    setPlayingSlug(station.slug);

    // Track play
    fetch(`${API_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id:  getOrCreateSessionId(),
        event_type:  'livestream_play',
        page_type:   'station_grid',
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      }),
    }).catch(() => {});

    // Load new stream
    try {
      const HLS = (await import('hls.js')).default;
      if (HLS.isSupported()) {
        const hls = new HLS();
        hlsRef.current = hls;
        hls.loadSource(station.streamUrl);
        hls.attachMedia(audio);
        hls.on(HLS.Events.MANIFEST_PARSED, () => audio.play());
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = station.streamUrl;
        audio.play();
      }
    } catch {
      if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = station.streamUrl;
        audio.play();
      }
    }
  };

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
                  aspectRatio: '16 / 9',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000',
                }}>
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
                    <div style={{ width: '100%', height: '100%', backgroundColor: station.accent, opacity: 0.3 }} />
                  )}
                </div>

                {/* Hover overlay */}
                <div style={{
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
                }} className="hover-overlay">
                  <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {station.name}
                  </h5>
                </div>
              </div>

              {/* Mini player strip */}
              {(() => {
                const isPlaying = playingSlug === station.slug;
                const isDisabled = !station.streamUrl || station.streamUrl === '#';
                const listenerCount = stationHits[station.slug] || 0;
                return (
                  <div style={{
                    borderTop: `1px solid rgba(255,255,255,0.08)`,
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <button
                      onClick={(e) => toggleStation(station, e)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: isDisabled ? '#555' : station.accent,
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.7rem',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.4 : 1,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                    </button>
                    {isPlaying && (
                      <div className="d-flex align-items-end gap-1" style={{ height: '14px' }}>
                        {[1, 2, 3].map(i => (
                          <div key={i} style={{
                            width: '2px',
                            backgroundColor: station.accent,
                            borderRadius: '1px',
                            animation: `audioBar 0.${3 + i}s ease-in-out infinite alternate`,
                          }} />
                        ))}
                      </div>
                    )}
                    <div style={{ flex: 1 }} />
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--color-muted)',
                    }}>
                      <i className="bi bi-headphones" style={{ fontSize: '0.8rem' }}></i>
                      <span>{listenerCount.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <audio ref={audioRef} />
      <section id="radio-stations" style={{ backgroundColor: 'var(--color-bg)' }} className="py-5">
        <div className="container">
          {/* Category Filter */}
          <div className="mb-4">
            <select
              className="form-select"
              style={{ maxWidth: '250px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              <option value="radio_online">Radio Digital</option>
              <option value="nasional">Nasional</option>
              <option value="negeri">Negeri</option>
              <option value="radio_tempatan">Radio Tempatan</option>
            </select>
          </div>

          {/* Radio Digital */}
          {radioOnlineStations.length > 0 && (categoryFilter === 'all' || categoryFilter === 'radio_online') && (
            <>
              <h2 className="section-heading">Radio Digital</h2>
              {renderStationCards(radioOnlineStations)}
            </>
          )}

          {/* Saluran Nasional */}
          {(categoryFilter === 'all' || categoryFilter === 'nasional') && (
            <>
              <h2 className="section-heading" style={{ marginTop: categoryFilter === 'all' ? '4rem' : '0' }}>Saluran Nasional</h2>
              {renderStationCards(nasionalStations)}
            </>
          )}

          {/* Saluran Negeri */}
          {(categoryFilter === 'all' || categoryFilter === 'negeri') && (
            <>
              <h2 className="section-heading" style={{ marginTop: categoryFilter === 'all' ? '4rem' : '0' }}>Saluran Negeri</h2>
              {renderStationCards(negeriStations)}
            </>
          )}

          {/* Radio Tempatan */}
          {radioTempatanStations.length > 0 && (categoryFilter === 'all' || categoryFilter === 'radio_tempatan') && (
            <>
              <h2 className="section-heading" style={{ marginTop: categoryFilter === 'all' ? '4rem' : '0' }}>Radio Tempatan</h2>
              {renderStationCards(radioTempatanStations)}
            </>
          )}
        </div>
      </section>
    </>
  );
}
