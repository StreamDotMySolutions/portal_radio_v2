'use client';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-portal sticky-top">
      <div className="container-fluid px-4 py-1">
        <a className="navbar-brand" href="/">
          <img src="/logo-rtm-transparent.png" alt="RTM" height="65" style={{ objectFit: 'contain' }} />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto" style={{ fontSize: '1.5em', textTransform: 'uppercase' }}>
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#radio">
                Radio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#schedule">
                Jadual
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                Tentang Kami
              </a>
            </li>
          </ul>
          <div className="d-flex">
            <div className="input-group" style={{ minWidth: '300px' }}>
              <input type="search" className="form-control bg-dark text-light" placeholder="Carian..." style={{ borderColor: '#ff6600' }} />
              <button className="btn btn-outline-secondary" type="button" style={{ color: '#ff6600', borderColor: '#ff6600' }}>
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
