export default function Programs() {
  const programs = [
    {
      id: 1,
      title: 'Seni dan Budaya',
      category: 'Drama',
      image: 'https://placehold.co/400x250?text=Program+1',
      synopsis: 'Tonton pelbagai rancangan drama yang menghibur dan mendidik seluruh keluarga.',
      duration: '60 min',
      rating: 4.5,
    },
    {
      id: 2,
      title: 'Eksplorasi Dunia',
      category: 'Dokumentari',
      image: 'https://placehold.co/400x250?text=Program+2',
      synopsis: 'Dokumentari seni dan kebudayaan dari seluruh penjuru dunia yang menakjubkan.',
      duration: '45 min',
      rating: 4.8,
    },
    {
      id: 3,
      title: 'Hiburan Malam',
      category: 'Hiburan',
      image: 'https://placehold.co/400x250?text=Program+3',
      synopsis: 'Hiburan berkualitas dengan musik dan humor yang segar setiap hari.',
      duration: '90 min',
      rating: 4.3,
    },
    {
      id: 4,
      title: 'Dokumenter Alam',
      category: 'Dokumentari',
      image: 'https://placehold.co/400x250?text=Program+4',
      synopsis: 'Jelajahi keindahan dan misteri alam semesta bersama para ahli.',
      duration: '50 min',
      rating: 4.9,
    },
    {
      id: 5,
      title: 'Pengetahuan Umum',
      category: 'Pendidikan',
      image: 'https://placehold.co/400x250?text=Program+5',
      synopsis: 'Pelajari berbagai topik menarik dari para pakar terkemuka.',
      duration: '30 min',
      rating: 4.6,
    },
    {
      id: 6,
      title: 'Cerita Inspirasi',
      category: 'Drama',
      image: 'https://placehold.co/400x250?text=Program+6',
      synopsis: 'Kisah nyata yang menginspirasi dan menggerakkan hati jutaan penonton.',
      duration: '55 min',
      rating: 4.7,
    },
  ];

  return (
    <section id="programs" className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-fluid px-4">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {programs.map((program) => (
            <div key={program.id} className="col">
              <div className="card-dark rounded overflow-hidden hover-lift h-100" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingBottom: '62.5%', overflow: 'hidden' }}>
                  <img
                    src={program.image}
                    alt={program.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <span className="badge bg-accent position-absolute" style={{ top: '12px', right: '12px' }}>
                    {program.category}
                  </span>
                </div>
                <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="mb-2">{program.title}</h5>
                    <p className="text-muted small">{program.synopsis}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-muted small">
                      <i className="bi bi-clock me-1"></i>{program.duration}
                    </span>
                    <div className="text-warning small">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star${i < Math.floor(program.rating) ? '-fill' : i < program.rating ? '-half' : ''}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
