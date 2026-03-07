export default function Footer() {
  return (
    <footer className="py-4" style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid rgba(63, 63, 143, 0.3)' }}>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-center gap-5 mb-4">
          <div style={{ maxWidth: '240px' }}>
            <h6 className="mb-2">
              <i className="bi bi-broadcast me-2"></i>Tentang RTM
            </h6>
            <p className="text-muted small mb-0">
              Radio Televisyen Malaysia (RTM) adalah penyiar nasional yang menghadirkan konten berkualitas, mendidik, dan menghibur masyarakat Malaysia sejak 1963.
            </p>
          </div>
          <div>
            <h6 className="mb-2">Pautan Pantas</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1"><a href="#" className="text-accent">Beranda</a></li>
              <li className="mb-1"><a href="#" className="text-accent">Tentang Kami</a></li>
              <li className="mb-1"><a href="#" className="text-accent">Hubungi Kami</a></li>
              <li><a href="#" className="text-accent">Syarat dan Ketentuan</a></li>
            </ul>
          </div>
          <div>
            <h6 className="mb-2">Radio</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1"><a href="#" className="text-accent">RTM FM1</a></li>
              <li className="mb-1"><a href="#" className="text-accent">RTM FM2</a></li>
              <li className="mb-1"><a href="#" className="text-accent">RTM FM3</a></li>
              <li><a href="#" className="text-accent">RTM World Service</a></li>
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
          <p className="text-muted small mb-2">
            © 2025 RTM — Radio Televisyen Malaysia. Hak Cipta Terpelihara.
          </p>
          <div>
            <a href="#" className="social-icon me-3"><i className="bi bi-facebook"></i></a>
            <a href="#" className="social-icon me-3"><i className="bi bi-instagram"></i></a>
            <a href="#" className="social-icon me-3"><i className="bi bi-twitter-x"></i></a>
            <a href="#" className="social-icon"><i className="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
