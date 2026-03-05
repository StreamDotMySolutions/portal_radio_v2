'use client'

const channels = [
  { img: '/programme-1.jpg', alt: 'RTM Klik', href: 'https://rtmklik.rtm.gov.my/' },
  { img: '/programme-2.jpg', alt: 'TV1', href: 'https://rtmklik.rtm.gov.my/live/tv1' },
  { img: '/programme-3.jpg', alt: 'TV2', href: 'https://rtmklik.rtm.gov.my/live/tv2' },
  { img: '/programme-4.jpg', alt: 'TV Okey', href: 'https://rtmklik.rtm.gov.my/live/okey' },
  { img: '/programme-5.jpg', alt: 'Berita RTM', href: 'https://rtmklik.rtm.gov.my/live/beritartm' },
  { img: '/programme-6.jpg', alt: 'Portal Berita RTM', href: 'https://berita.rtm.gov.my/' },
  { img: '/programme-7.jpg', alt: 'Sukan RTM', href: 'https://rtmklik.rtm.gov.my/live/sukanrtm' },
  { img: '/programme-8.jpg', alt: 'TV6', href: 'https://rtmklik.rtm.gov.my/live/tv6' },
  { img: '/programme-9.jpg', alt: 'Dewan Rakyat', href: 'https://rtmklik.rtm.gov.my/live/dewanrakyat' },
]

export default function ProgrammeBanner() {
  return (
    <div style={{ backgroundColor: '#1a0a7a' }} className="py-4">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
          {channels.map((ch) => (
            <a key={ch.alt} href={ch.href} target="_blank" rel="noopener noreferrer">
              <img
                src={ch.img}
                alt={ch.alt}
                className="img-fluid"
                style={{ borderRadius: '15px', height: '60px' }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
