export default function RadioStations() {
  const nasionalStations = [
    { name: 'NASIONALfm', genre: 'Muzik & Berita', frequency: '88.9 FM', accent: '#3F3F8F', initial: 'N', banner: '/nasional-fm.png' },
    { name: 'KLfm', genre: 'English / Pop', frequency: '101.1 FM', accent: '#0284C7', initial: 'K', banner: '/kl-fm.png' },
    { name: 'AsyikFM', genre: 'Irama Malaysia', frequency: '103.4 FM', accent: '#BE185D', initial: 'A', banner: '/asyik-fm.png' },
    { name: 'WaiFM', genre: 'Iban / Kadazan', frequency: '91.3 FM', accent: '#0891B2', initial: 'W', banner: '/wai-fm.png' },
  ];

  const negeriStations = [
    { name: 'Kelantan FM', genre: 'Regional', frequency: 'FM', accent: '#FF5A1F', initial: 'K', banner: '/1738044337-kelantan.png' },
    { name: 'Johor FM', genre: 'Regional', frequency: 'FM', accent: '#059669', initial: 'J', banner: '/1738044344-johor.png' },
    { name: 'Kedah FM', genre: 'Regional', frequency: 'FM', accent: '#0891B2', initial: 'K', banner: '/1738044351-kedah.png' },
    { name: 'Selangor FM', genre: 'Regional', frequency: 'FM', accent: '#D97706', initial: 'S', banner: '/1738044358-selangor.png' },
    { name: 'Perak FM', genre: 'Regional', frequency: 'FM', accent: '#7C3AED', initial: 'P', banner: '/1738044365-perak.png' },
    { name: 'Melaka FM', genre: 'Regional', frequency: 'FM', accent: '#DC2626', initial: 'M', banner: '/1738044374-melaka.png' },
    { name: 'Terengganu FM', genre: 'Regional', frequency: 'FM', accent: '#EA580C', initial: 'T', banner: '/1738044381-terengganu.png' },
    { name: 'Negeri Sembilan FM', genre: 'Regional', frequency: 'FM', accent: '#BE185D', initial: 'N', banner: '/1738044388-negeri-sembilan.png' },
    { name: 'Pahang FM', genre: 'Regional', frequency: 'FM', accent: '#059669', initial: 'P', banner: '/1738044394-pahang-fm.png' },
    { name: 'Perlis FM', genre: 'Regional', frequency: 'FM', accent: '#0284C7', initial: 'P', banner: '/1738044400-perlis.png' },
    { name: 'Labuan FM', genre: 'Regional', frequency: 'FM', accent: '#3F3F8F', initial: 'L', banner: '/1738044413-labuan.png' },
    { name: 'Sarawak FM', genre: 'Regional', frequency: 'FM', accent: '#D97706', initial: 'S', banner: '/1738044420-sarawak.png' },
    { name: 'Sabah FM', genre: 'Regional', frequency: 'FM', accent: '#7C3AED', initial: 'S', banner: '/1738044425-sabah.png' },
    { name: 'Sandakan FM', genre: 'Regional', frequency: 'FM', accent: '#DC2626', initial: 'S', banner: '/1735528014-sandakan.png' },
    { name: 'Limbang FM', genre: 'Regional', frequency: 'FM', accent: '#EA580C', initial: 'L', banner: '/1735725011-limbang-fm.png' },
    { name: 'Bintulu FM', genre: 'Regional', frequency: 'FM', accent: '#BE185D', initial: 'B', banner: '/1735725042-bintulu-fm.png' },
    { name: 'Keningau FM', genre: 'Regional', frequency: 'FM', accent: '#059669', initial: 'K', banner: '/1735725069-keningau-fm.png' },
    { name: 'Miri FM', genre: 'Regional', frequency: 'FM', accent: '#0284C7', initial: 'M', banner: '/1735725096-miri-fm.png' },
    { name: 'Red FM', genre: 'Regional', frequency: 'FM', accent: '#3F3F8F', initial: 'R', banner: '/1735725117-red-fm.png' },
    { name: 'Sabah V FM', genre: 'Regional', frequency: 'FM', accent: '#D97706', initial: 'S', banner: '/1735725144-sabah-v-fm.png' },
    { name: 'Sibu FM', genre: 'Regional', frequency: 'FM', accent: '#7C3AED', initial: 'S', banner: '/1735725167-sibu-fm.png' },
    { name: 'Sri Aman FM', genre: 'Regional', frequency: 'FM', accent: '#DC2626', initial: 'S', banner: '/1735725190-sri-aman-fm.png' },
    { name: 'Tawau FM', genre: 'Regional', frequency: 'FM', accent: '#EA580C', initial: 'T', banner: '/1735725212-tawau-fm.png' },
    { name: 'WAI Segulai Sejalai', genre: 'Regional', frequency: 'FM', accent: '#BE185D', initial: 'W', banner: '/wai-fm.png' },
    { name: 'WAI Gerak Bisamah', genre: 'Regional', frequency: 'FM', accent: '#059669', initial: 'W', banner: '/wai-fm.png' },
    { name: 'RTM Portal', genre: 'Portal', frequency: 'FM', accent: '#FF5A1F', initial: 'R', banner: '/1764670068-picture3.png' },
  ];

  const renderStationCards = (stations) => (
    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
      {stations.map((station, idx) => (
        <div key={idx} className="col">
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

              {/* Listen link */}
              <a
                href="#"
                style={{ color: station.accent, fontWeight: '500', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="bi bi-headphones"></i>
                Dengar Sekarang
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section style={{ backgroundColor: 'var(--color-bg)' }} className="py-5">
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
