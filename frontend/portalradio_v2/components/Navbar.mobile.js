'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function NavbarMobile() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => pathname === href;

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark navbar-portal${scrolled ? ' scrolled' : ''}`} style={{ background: '#141438' }}>
      <div className="container-fluid px-3 py-0">
        <a className="navbar-brand" href="/">
          <img src="/logo-rtm-transparent.png" alt="RTM" height={scrolled ? 30 : 40} style={{ objectFit: 'contain', transition: 'height 0.3s ease' }} />
        </a>
        <button
          className="navbar-toggler border-0 p-1"
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
          <ul className="navbar-nav" style={{ fontSize: '1rem', textTransform: 'uppercase' }}>
            <li className="nav-item">
              <a className="nav-link py-2" href="/" style={{ borderBottom: isActive('/') ? '3px solid var(--color-accent)' : 'none', paddingBottom: '0.5rem', transition: 'border-color 0.3s ease', display: 'inline-block' }}>Utama</a>
            </li>
            <li className="nav-item">
              <a className="nav-link py-2" href="/senarai-radio" style={{ borderBottom: isActive('/senarai-radio') ? '3px solid var(--color-accent)' : 'none', paddingBottom: '0.5rem', transition: 'border-color 0.3s ease', display: 'inline-block' }}>Senarai Radio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link py-2" href="/chat" style={{ borderBottom: isActive('/chat') ? '3px solid var(--color-accent)' : 'none', paddingBottom: '0.5rem', transition: 'border-color 0.3s ease', display: 'inline-block' }}>Chat</a>
            </li>
            <li className="nav-item">
              <a className="nav-link py-2" href="/mengenai-kami" style={{ borderBottom: isActive('/mengenai-kami') ? '3px solid var(--color-accent)' : 'none', paddingBottom: '0.5rem', transition: 'border-color 0.3s ease', display: 'inline-block' }}>Mengenai Kami</a>
            </li>
            <li className="nav-item">
              <a className="nav-link py-2" href="/hubungi" style={{ borderBottom: isActive('/hubungi') ? '3px solid var(--color-accent)' : 'none', paddingBottom: '0.5rem', transition: 'border-color 0.3s ease', display: 'inline-block' }}>Hubungi</a>
            </li>
          </ul>
          <div className="py-2">
            <div className="input-group">
              <input type="search" className="form-control form-control-sm bg-dark text-light" placeholder="Carian..." style={{ border: '2px solid #ff6600' }} />
              <button className="btn btn-sm" type="button" style={{ backgroundColor: '#ff6600', color: '#fff', border: '2px solid #ff6600' }}>
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
