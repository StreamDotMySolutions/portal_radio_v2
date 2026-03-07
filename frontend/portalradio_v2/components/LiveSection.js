export default function LiveSection() {
  const channels = [
    { id: 1, name: 'TV1', image: 'https://placehold.co/400x225?text=TV1' },
    { id: 2, name: 'TV2', image: 'https://placehold.co/400x225?text=TV2' },
    { id: 3, name: 'TV Okey', image: 'https://placehold.co/400x225?text=TV+Okey' },
    { id: 4, name: 'RTM World', image: 'https://placehold.co/400x225?text=RTM+World' },
  ];

  return (
    <section id="live" className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-fluid px-4">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {channels.map((channel) => (
            <div key={channel.id} className="col">
              <div className="card-dark rounded overflow-hidden hover-lift h-100" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', backgroundColor: '#000', overflow: 'hidden' }}>
                  <img
                    src={channel.image}
                    alt={channel.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <span className="badge-live position-absolute" style={{ top: '12px', right: '12px', zIndex: 10 }}>
                    LIVE
                  </span>
                </div>
                <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                  <h5 className="mb-3">{channel.name}</h5>
                  <a href="#" className="text-accent">
                    Tonton Sekarang <i className="bi bi-arrow-right ms-2"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
