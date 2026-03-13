'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  return (
    <footer className="py-4" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid rgba(63, 63, 143, 0.3)' }}>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-center gap-5 mb-4">
          <div style={{ maxWidth: '240px' }}>
            <h6 className="mb-2">
              <i className="bi bi-broadcast me-2"></i>Tentang Portal Radio RTM
            </h6>
            <p className="text-muted small mb-0">
              Radio Televisyen Malaysia (RTM) adalah penyiar nasional yang menghadirkan konten berkualitas, mendidik, dan menghibur masyarakat Malaysia sejak 1963.
            </p>
          </div>
          <div>
            <h6 className="mb-2">Pautan Pantas</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1"><a href="/" style={{ color: isActive('/') ? '#17a2b8' : 'var(--color-accent)', transition: 'color 0.3s ease' }}>Utama</a></li>
              <li className="mb-1"><a href="/senarai-radio" style={{ color: isActive('/senarai-radio') ? '#17a2b8' : 'var(--color-accent)', transition: 'color 0.3s ease' }}>Senarai Radio</a></li>
              <li><a href="/chat" style={{ color: isActive('/chat') ? '#17a2b8' : 'var(--color-accent)', transition: 'color 0.3s ease' }}>Chat</a></li>
            </ul>
          </div>
          <div>
            <h6 className="mb-2">Rangkaian RTM</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1"><a href="https://www.rtm.gov.my" className="text-accent" target="_blank" rel="noopener noreferrer">Portal Rasmi RTM</a></li>
              <li className="mb-1"><a href="https://berita.rtm.gov.my" className="text-accent" target="_blank" rel="noopener noreferrer">Berita RTM</a></li>
              <li><a href="https://rtmklik.rtm.gov.my" className="text-accent" target="_blank" rel="noopener noreferrer">RTM Klik</a></li>
            </ul>
          </div>
          <div>
            <h6 className="mb-2">Hubungi Kami</h6>
            <p className="text-muted small mb-1"><i className="bi bi-telephone me-2"></i>+603 2282 3456</p>
            <p className="text-muted small mb-1"><i className="bi bi-envelope me-2"></i>info@rtm.gov.my</p>
            <p className="text-muted small mb-0"><i className="bi bi-geo-alt me-2"></i>Jalan Semarak, 50564 KL</p>
          </div>
        </div>

        <hr className="my-3" style={{ borderColor: 'rgba(63, 63, 143, 0.3)' }} />

        <div className="text-center py-2">
          <p className="text-muted small mb-0">
            © 2025 RTM — Radio Televisyen Malaysia. Hak Cipta Terpelihara.
          </p>
        </div>
      </div>
    </footer>
  );
}
