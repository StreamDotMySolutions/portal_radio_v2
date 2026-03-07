'use client';

export default function Hero() {
  const slides = [
    { id: 0, image: '/hero-banner.png', alt: 'Hero Banner 1' },
    { id: 1, image: '/carausel-banner.png', alt: 'Carousel Banner' },
    { id: 2, image: '/nasional-fm.png', alt: 'NASIONALfm' },
    { id: 3, image: '/asyik-fm.png', alt: 'AsyikFM' },
  ];

  return (
    <section style={{ minHeight: '90vh' }}>
      <div
        id="heroCarousel"
        className="carousel slide h-100"
        data-bs-ride="carousel"
        style={{ minHeight: '90vh' }}
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={idx}
              className={idx === 0 ? 'active' : ''}
              aria-current={idx === 0 ? 'true' : 'false'}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Carousel items */}
        <div className="carousel-inner h-100">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel-item ${idx === 0 ? 'active' : ''}`}
              style={{
                minHeight: '90vh',
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
}
