'use client'

export default function Carousel() {
  const slides = [
    {
      id: 1,
      title: 'Latest News',
      description: 'Stay updated with breaking news from RTM',
      color: 'primary'
    },
    {
      id: 2,
      title: 'Featured Programs',
      description: 'Watch our most popular programs',
      color: 'success'
    },
    {
      id: 3,
      title: 'Live Events',
      description: 'Join us for exclusive live coverage',
      color: 'danger'
    },
  ]

  return (
    <div id="carouselExampled" className="carousel slide mb-5" data-bs-ride="carousel" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampled"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : 'false'}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div
              style={{
                background: `linear-gradient(135deg, #${slide.color === 'primary' ? '0d6efd' : slide.color === 'success' ? '198754' : 'dc3545'} 0%, #${slide.color === 'primary' ? '0b5ed7' : slide.color === 'success' ? '15653e' : 'bb2d3b'} 100%)`,
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="d-block w-100"
            >
              <div className="text-center text-white">
                <h2 className="display-4 fw-bold mb-4">{slide.title}</h2>
                <p className="lead">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampled" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampled" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
