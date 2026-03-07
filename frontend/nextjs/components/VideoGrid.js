'use client'

import { useState } from 'react'

const videos = [
  { id: 'dQw4w9WgXcQ', title: 'Berita Utama RTM' },
  { id: '9bZkp7q19f0', title: 'Program Pilihan Minggu Ini' },
  { id: 'JGwWNGJdvx8', title: 'Dokumentari Khas RTM' },
  { id: 'kJQP7kiw5Fk', title: 'Sorotan Hari Kebangsaan' },
]

export default function VideoGrid() {
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <>
      <div className="row g-4">
        {videos.map((video) => (
          <div key={video.id} className="col-lg-3 col-md-6">
            <div
              className="position-relative rounded overflow-hidden"
              style={{ cursor: 'pointer', aspectRatio: '16/9' }}
              onClick={() => setActiveVideo(video)}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
              >
                <i className="bi bi-play-circle-fill text-white" style={{ fontSize: '3rem' }}></i>
              </div>
            </div>
            <p className="text-light mt-2 mb-0 fw-semibold small">{video.title}</p>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999 }}
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-100 position-relative"
            style={{ maxWidth: '900px', aspectRatio: '16/9' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-link text-white position-absolute d-flex align-items-center justify-content-center"
              style={{ top: '-18px', right: '-18px', fontSize: '1.4rem', zIndex: 10000, width: '36px', height: '36px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '50%' }}
              onClick={() => setActiveVideo(null)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            ></iframe>
          </div>
        </div>
      )}

    </>
  )
}
