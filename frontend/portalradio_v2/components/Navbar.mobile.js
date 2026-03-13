'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchStations, fetchStationCategories } from '@/utils/stationsApi';

export default function NavbarMobile() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [stationsByCategory, setStationsByCategory] = useState({});
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    Promise.all([fetchStationCategories(), fetchStations()])
      .then(([cats, stations]) => {
        const categoriesArray = Array.isArray(cats) ? cats : [];
        const stationsArray = Array.isArray(stations) ? stations : [];

        setCategories(categoriesArray);

        const grouped = {};
        categoriesArray.forEach(cat => {
          grouped[cat.slug] = stationsArray.filter(s => s.category === cat.slug);
        });
        setStationsByCategory(grouped);
      })
      .catch(error => {
        console.error('Error fetching categories/stations:', error);
        setCategories([]);
        setStationsByCategory({});
      });
  }, []);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search-result?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark navbar-portal${scrolled ? ' scrolled' : ''}`} style={{ background: '#141438' }}>
      <div className="container-fluid px-3 py-0">
        <a className="navbar-brand d-flex align-items-center gap-2" href="/">
          <img src="/logo-rtm-transparent.png" alt="RTM" height={scrolled ? 30 : 40} style={{ objectFit: 'contain', transition: 'height 0.3s ease' }} />
          <img src="/jabatan-penyiaran.svg" alt="Jabatan Penyiaran Malaysia" height={scrolled ? 18 : 24} style={{ transition: 'height 0.3s ease' }} />
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
            <li className="nav-item dropdown" style={{ position: 'static' }}>
              <a className={`nav-link dropdown-toggle py-2${dropdownOpen || pathname.startsWith('/station/') ? ' nav-active' : ''}`} href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Senarai Radio</a>
              <ul className="dropdown-menu dropdown-menu-dark p-0" style={{ width: '100vw', left: 0, right: 0, marginTop: 0, borderRadius: 0 }}>
                <li>
                  <div className="py-1">
                    {categories.map(category => {
                      const stations = stationsByCategory[category.slug] || [];
                      if (stations.length === 0) return null;
                      const isOpen = openCategory === category.slug;

                      return (
                        <div key={category.slug}>
                          <button
                            className="dropdown-item d-flex justify-content-between align-items-center px-3 py-2"
                            style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}
                            onClick={(e) => { e.stopPropagation(); setOpenCategory(isOpen ? null : category.slug); }}
                          >
                            {category.display_name}
                            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }} />
                          </button>
                          {isOpen && (
                            <div className="px-2 pb-1">
                              {stations.map(station => (
                                <a key={station.slug} className={`dropdown-item px-3 py-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`} style={{ fontSize: '0.8rem', whiteSpace: 'normal' }}>{station.name}</a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className={`nav-link py-2${isActive('/chat') ? ' nav-active' : ''}`} href="/chat">Chat</a>
            </li>
          </ul>
          {!pathname.startsWith('/search-result') && (
            <form className="py-2" onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control form-control-sm bg-dark text-light"
                  placeholder="Carian..."
                  style={{ border: '2px solid #ff6600' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-sm" type="submit" style={{ backgroundColor: '#ff6600', color: '#fff', border: '2px solid #ff6600' }}>
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
