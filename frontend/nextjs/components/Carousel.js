'use client'

import Link from 'next/link'

const slides = [
  { img: '/carousel-1.jpg', alt: 'Ramadan 2026', href: '/' },
  { img: '/carousel-2.jpg', alt: 'MotoGP 2026', href: '/' },
  { img: '/carousel-3.jpg', alt: 'Liga Super 2025/26', href: '/' },
  { img: '/carousel-4.jpg', alt: 'Portal RTM 2025', href: '/' },
  { img: '/carousel-5.jpg', alt: 'Latar Belakang RTM', href: '/listings/27' },
]

export default function Carousel() {
  return (
    <div id="carouselBanner" className="carousel slide">
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#carouselBanner"
            data-bs-slide-to={i}
            className={i === 0 ? 'active' : ''}
            aria-current={i === 0 ? 'true' : 'false'}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, i) => (
          <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
            <Link href={slide.href}>
              <img src={slide.img} alt={slide.alt} className="d-block w-100" />
            </Link>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselBanner" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselBanner" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}
