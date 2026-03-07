'use client';

export default function HeroMobile() {
  const slides = [
    { id: 0, image: '/hero-banner.png', alt: 'Hero Banner' },
    { id: 1, image: '/carausel-banner.png', alt: 'Carousel Banner' },
    { id: 2, image: '/ramadan.jpg', alt: 'Ramadan' },
    { id: 3, image: '/carousel-1.jpg', alt: 'Carousel 1' },
    { id: 4, image: '/carousel-2.jpg', alt: 'Carousel 2' },
    { id: 5, image: '/carousel-3.jpg', alt: 'Carousel 3' },
    { id: 6, image: '/carousel-4.jpg', alt: 'Carousel 4' },
    { id: 7, image: '/carousel-5.jpg', alt: 'Carousel 5' },
  ];

  return (
    <section style={{ minHeight: '40vh', paddingTop: 0 }}>
      <div
        id="heroCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ minHeight: '40vh' }}
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
        <div className="carousel-inner">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel-item ${idx === 0 ? 'active' : ''}`}
              style={{
                minHeight: '40vh',
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
