export default function News() {
  const newsItems = [
    {
      id: 1,
      title: 'Peluncuran Platform Digital RTM Terbaru',
      category: 'Berita Utama',
      image: 'https://placehold.co/400x250?text=News+1',
      excerpt: 'RTM meluncurkan platform digital terbaru yang menggabungkan televisi, radio, dan berita dalam satu ekosistem yang terintegrasi.',
      date: '07 Mar 2025',
    },
    {
      id: 2,
      title: 'Program Dokumenter Terbaru Mendapat Sambutan Positif',
      category: 'Hiburan',
      image: 'https://placehold.co/400x250?text=News+2',
      excerpt: 'Penonton memberikan respons luar biasa terhadap seri dokumenter baru yang menghadirkan cerita-cerita inspiratif dari berbagai negara.',
      date: '06 Mar 2025',
    },
    {
      id: 3,
      title: 'Investasi Besar Untuk Konten Berkualitas Tinggi',
      category: 'Teknologi',
      image: 'https://placehold.co/400x250?text=News+3',
      excerpt: 'RTM mengkomitkan dana besar untuk produksi konten berkualitas tinggi yang dapat bersaing dengan platform internasional.',
      date: '05 Mar 2025',
    },
  ];

  return (
    <section id="news" className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-fluid px-4">
        <h2 className="section-heading">
          <i className="bi bi-newspaper me-2"></i>Berita Terkini
        </h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {newsItems.map((news) => (
            <div key={news.id} className="col">
              <div className="card-dark rounded overflow-hidden hover-lift h-100" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingBottom: '62.5%', overflow: 'hidden' }}>
                  <img
                    src={news.image}
                    alt={news.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-accent mb-2">{news.category}</span>
                    <h5 className="mb-2">{news.title}</h5>
                    <p className="text-muted small mb-3">{news.excerpt}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      <i className="bi bi-calendar me-1"></i>{news.date}
                    </span>
                    <a href="#" className="text-accent small">
                      Baca Selanjutnya <i className="bi bi-arrow-right ms-1"></i>
                    </a>
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
