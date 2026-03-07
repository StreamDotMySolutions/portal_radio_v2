export default function Footer() {
  return (
    <footer className="py-5" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid rgba(63, 63, 143, 0.3)' }}>
      <div className="container-fluid px-4">
        <div className="row mb-5 g-3 g-md-4 justify-content-center">
          <div className="col-12 col-md-3">
            <h5 className="mb-3">
              <i className="bi bi-broadcast me-2"></i>Tentang RTM
            </h5>
            <p className="text-muted small">
              Radio Televisyen Malaysia (RTM) adalah penyiar nasional yang menghadirkan konten berkualitas, mendidik, dan menghibur masyarakat Malaysia sejak 1963.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h5 className="mb-3">Pautan Pantas</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="text-accent">
                  Beranda
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-accent">
                  Tentang Kami
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-accent">
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-accent">
                  Syarat dan Ketentuan
                </a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h5 className="mb-3">Radio</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="text-accent">
                  RTM FM1
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-accent">
                  RTM FM2
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-accent">
                  RTM FM3
                </a>
              </li>
              <li>
                <a href="#" className="text-accent">
                  RTM World Service
                </a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-3">
            <h5 className="mb-3">Hubungi Kami</h5>
            <p className="text-muted small">
              <i className="bi bi-telephone me-2"></i>
              +603 2282 3456
            </p>
            <p className="text-muted small">
              <i className="bi bi-envelope me-2"></i>
              info@rtm.gov.my
            </p>
            <p className="text-muted small">
              <i className="bi bi-geo-alt me-2"></i>
              Jalan Semarak, 50564 Kuala Lumpur
            </p>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(63, 63, 143, 0.3)' }} />

        <div className="text-center py-4">
          <p className="text-muted small mb-3">
            © 2025 RTM — Radio Televisyen Malaysia. Hak Cipta Terpelihara.
          </p>
          <div>
            <a href="#" className="social-icon me-3">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="social-icon me-3">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="social-icon me-3">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="bi bi-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
