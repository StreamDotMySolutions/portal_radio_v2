'use client';

export default function RadioStationsMobile() {
  const nasionalStations = [
    { name: 'NASIONALfm', genre: 'Muzik & Berita', frequency: '88.9 FM', accent: '#3F3F8F', initial: 'N', banner: '/nasional-fm.png' },
    { name: 'KLfm', genre: 'English / Pop', frequency: '101.1 FM', accent: '#0284C7', initial: 'K', banner: '/kl-fm.png' },
    { name: 'AsyikFM', genre: 'Irama Malaysia', frequency: '103.4 FM', accent: '#BE185D', initial: 'A', banner: '/asyik-fm.png' },
    { name: 'WaiFM', genre: 'Iban / Kadazan', frequency: '91.3 FM', accent: '#0891B2', initial: 'W', banner: '/wai-fm.png' },
  ];

  const negeriStations = [
    { name: 'Kelantan FM', accent: '#FF5A1F', banner: '/1738044337-kelantan.png' },
    { name: 'Johor FM', accent: '#059669', banner: '/1738044344-johor.png' },
    { name: 'Kedah FM', accent: '#0891B2', banner: '/1738044351-kedah.png' },
    { name: 'Selangor FM', accent: '#D97706', banner: '/1738044358-selangor.png' },
    { name: 'Perak FM', accent: '#7C3AED', banner: '/1738044365-perak.png' },
    { name: 'Melaka FM', accent: '#DC2626', banner: '/1738044374-melaka.png' },
    { name: 'Terengganu FM', accent: '#EA580C', banner: '/1738044381-terengganu.png' },
    { name: 'Negeri Sembilan FM', accent: '#BE185D', banner: '/1738044388-negeri-sembilan.png' },
    { name: 'Pahang FM', accent: '#059669', banner: '/1738044394-pahang-fm.png' },
    { name: 'Perlis FM', accent: '#0284C7', banner: '/1738044400-perlis.png' },
    { name: 'Labuan FM', accent: '#3F3F8F', banner: '/1738044413-labuan.png' },
    { name: 'Sarawak FM', accent: '#D97706', banner: '/1738044420-sarawak.png' },
    { name: 'Sabah FM', accent: '#7C3AED', banner: '/1738044425-sabah.png' },
    { name: 'Sandakan FM', accent: '#DC2626', banner: '/1735528014-sandakan.png' },
    { name: 'Limbang FM', accent: '#EA580C', banner: '/1735725011-limbang-fm.png' },
    { name: 'Bintulu FM', accent: '#BE185D', banner: '/1735725042-bintulu-fm.png' },
    { name: 'Keningau FM', accent: '#059669', banner: '/1735725069-keningau-fm.png' },
    { name: 'Miri FM', accent: '#0284C7', banner: '/1735725096-miri-fm.png' },
    { name: 'Red FM', accent: '#3F3F8F', banner: '/1735725117-red-fm.png' },
    { name: 'Sabah V FM', accent: '#D97706', banner: '/1735725144-sabah-v-fm.png' },
    { name: 'Sibu FM', accent: '#7C3AED', banner: '/1735725167-sibu-fm.png' },
    { name: 'Sri Aman FM', accent: '#DC2626', banner: '/1735725190-sri-aman-fm.png' },
    { name: 'Tawau FM', accent: '#EA580C', banner: '/1735725212-tawau-fm.png' },
    { name: 'WAI Segulai Sejalai', accent: '#BE185D', banner: '/wai-fm.png' },
    { name: 'WAI Gerak Bisamah', accent: '#059669', banner: '/wai-fm.png' },
    { name: 'RTM Portal', accent: '#FF5A1F', banner: '/1764670068-picture3.png' },
  ];

  const renderStationCards = (stations) => (
    <div className="row row-cols-2 g-2">
      {stations.map((station, idx) => (
        <div key={idx} className="col">
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
              <a
                href="#"
                style={{ color: station.accent, fontWeight: '500', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <i className="bi bi-headphones"></i>
                Dengar
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section style={{ backgroundColor: 'var(--color-bg)' }} className="py-4">
      <div className="container px-3">
        <h2 className="section-heading" style={{ fontSize: '1.5rem' }}>Saluran Nasional</h2>
        {renderStationCards(nasionalStations)}

        <h2 className="section-heading" style={{ marginTop: '2rem', fontSize: '1.5rem' }}>Saluran Negeri</h2>
        {renderStationCards(negeriStations)}
      </div>
    </section>
  );
}
