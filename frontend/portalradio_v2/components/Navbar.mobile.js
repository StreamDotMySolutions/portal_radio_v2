'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { nasionalStations, negeriStations } from '../data/stations';

export default function NavbarMobile() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const dropdown = document.querySelector('[data-bs-toggle="dropdown"]');
    if (!dropdown) return;

    const handleShow = () => setDropdownOpen(true);
    const handleHide = () => setDropdownOpen(false);

    dropdown.addEventListener('show.bs.dropdown', handleShow);
    dropdown.addEventListener('hide.bs.dropdown', handleHide);

    return () => {
      dropdown.removeEventListener('show.bs.dropdown', handleShow);
      dropdown.removeEventListener('hide.bs.dropdown', handleHide);
    };
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
              <a className={`nav-link py-2${isActive('/') ? ' nav-active' : ''}`} href="/">Utama</a>
            </li>
            <li className="nav-item dropdown">
              <a className={`nav-link dropdown-toggle py-2${dropdownOpen || pathname.startsWith('/station/') ? ' nav-active' : ''}`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Senarai Radio</a>
              <ul className="dropdown-menu dropdown-menu-dark p-0" style={{ minWidth: '320px' }}>
                <li>
                  <div className="px-2 py-2 row g-0">
                    <div className="col-4">
                      <h6 className="dropdown-header px-1" style={{ fontSize: '0.7rem' }}>Nasional</h6>
                      {nasionalStations.map(station => (
                        <a key={station.slug} className={`dropdown-item px-1 py-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`} style={{ fontSize: '0.75rem', whiteSpace: 'normal' }}>{station.name}</a>
                      ))}
                    </div>
                    <div className="col-4">
                      <h6 className="dropdown-header px-1" style={{ fontSize: '0.7rem' }}>Negeri</h6>
                      {negeriStations.slice(0, Math.ceil(negeriStations.length / 2)).map(station => (
                        <a key={station.slug} className={`dropdown-item px-1 py-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`} style={{ fontSize: '0.75rem', whiteSpace: 'normal' }}>{station.name}</a>
                      ))}
                    </div>
                    <div className="col-4">
                      <h6 className="dropdown-header px-1" style={{ fontSize: '0.7rem' }}>&nbsp;</h6>
                      {negeriStations.slice(Math.ceil(negeriStations.length / 2)).map(station => (
                        <a key={station.slug} className={`dropdown-item px-1 py-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`} style={{ fontSize: '0.75rem', whiteSpace: 'normal' }}>{station.name}</a>
                      ))}
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className={`nav-link py-2${isActive('/chat') ? ' nav-active' : ''}`} href="/chat">Chat</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link py-2${isActive('/mengenai-kami') ? ' nav-active' : ''}`} href="/mengenai-kami">Mengenai Kami</a>
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
