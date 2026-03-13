'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/home-banners`);
        if (response.ok) {
          const data = await response.json();
          setBanners(data.banners || []);
        }
      } catch (error) {
        console.warn('Failed to fetch banners:', error);
        setBanners([]);
      }
    };

    fetchBanners();
  }, []);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section style={{ paddingTop: '130px', paddingBottom: 0 }}>
      <div
        id="heroCarousel"
        className="carousel slide h-100"
        data-bs-ride="carousel"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {banners.map((banner, idx) => (
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
          {banners.map((banner, idx) => (
            <div
              key={idx}
              className={`carousel-item ${idx === 0 ? 'active' : ''}`}
            >
              {banner?.filename && (
                <Link href={banner.redirect_url || '#'}>
                  <img
                    src={`${serverUrl}/storage/banners/${banner.filename}`}
                    alt={`Banner ${idx}`}
                    style={{
                      width: '100%',
                      height: '55vh',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </Link>
              )}
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
