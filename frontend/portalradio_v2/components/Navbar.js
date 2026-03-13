'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchStations, fetchStationCategories } from '@/utils/stationsApi';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    const onScroll = () => setScrolled(window.scrollY > 100);
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
    <nav className={`navbar navbar-expand-lg navbar-dark navbar-portal${scrolled ? ' scrolled' : ''}`}>
      <div className={`container-fluid px-4 ${scrolled ? 'py-0' : 'py-1'}`}>
        <a className="navbar-brand d-flex align-items-center gap-2" href="/">
          <img src="/logo-rtm-transparent.png" alt="RTM" height={scrolled ? 40 : 65} style={{ objectFit: 'contain', transition: 'height 0.3s ease' }} />
          <img src="/jabatan-penyiaran.svg" alt="Jabatan Penyiaran Malaysia" height={scrolled ? 25 : 35} className="d-none d-md-block" style={{ transition: 'height 0.3s ease' }} />
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
          <ul className="navbar-nav mx-auto" style={{ fontSize: scrolled ? '1.1em' : '1.5em', textTransform: 'uppercase', transition: 'font-size 0.3s ease' }}>
            <li className="nav-item">
              <a className={`nav-link${isActive('/') ? ' nav-active' : ''}`} href="/">
                Utama
              </a>
            </li>
            <li className="nav-item dropdown">
              <a className={`nav-link dropdown-toggle${dropdownOpen || pathname.startsWith('/station/') ? ' nav-active' : ''}`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Senarai Radio
              </a>
              <ul className="dropdown-menu dropdown-menu-dark p-0" style={{ minWidth: '1100px', left: '50%', transform: 'translateX(-50%)' }}>
                <li>
                  <div className="px-3 py-2 row g-0">
                    {categories.map(category => {
                      const stations = stationsByCategory[category.slug] || [];
                      if (stations.length === 0) return null;

                      // Negeri: split into 2 sub-columns
                      if (category.slug === 'negeri') {
                        const mid = Math.ceil(stations.length / 2);
                        return (
                          <div key={category.slug} className="col-5 d-flex gap-0">
                            <div className="flex-fill">
                              <h6 className="dropdown-header px-1">{category.display_name}</h6>
                              {stations.slice(0, mid).map(station => (
                                <a key={station.slug} className={`dropdown-item px-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`}>{station.name}</a>
                              ))}
                            </div>
                            <div className="flex-fill">
                              <h6 className="dropdown-header px-1">&nbsp;</h6>
                              {stations.slice(mid).map(station => (
                                <a key={station.slug} className={`dropdown-item px-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`}>{station.name}</a>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      // Radio Tempatan: split into 2 sub-columns
                      if (category.slug === 'radio-tempatan') {
                        const mid = Math.ceil(stations.length / 2);
                        return (
                          <React.Fragment key={category.slug}>
                            <div className="col-2">
                              <h6 className="dropdown-header px-1">{category.display_name}</h6>
                              {stations.slice(0, mid).map(station => (
                                <a key={station.slug} className={`dropdown-item px-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`}>{station.name}</a>
                              ))}
                            </div>
                            <div className="col-2">
                              <h6 className="dropdown-header px-1">&nbsp;</h6>
                              {stations.slice(mid).map(station => (
                                <a key={station.slug} className={`dropdown-item px-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`}>{station.name}</a>
                              ))}
                            </div>
                          </React.Fragment>
                        );
                      }

                      // Nasional and others: narrow column
                      return (
                        <div key={category.slug} className="col-2">
                          <h6 className="dropdown-header px-1">{category.display_name}</h6>
                          {stations.map(station => (
                            <a key={station.slug} className={`dropdown-item px-1${pathname === `/station/${station.slug}` ? ' active-station' : ''}`} href={`/station/${station.slug}`}>{station.name}</a>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className={`nav-link${isActive('/chat') ? ' nav-active' : ''}`} href="/chat">
                Chat
              </a>
            </li>
          </ul>
          {!pathname.startsWith('/search-result') && (
            <form className="d-flex" onSubmit={handleSearchSubmit}>
              <div className="input-group" style={{ minWidth: '300px' }}>
                <input
                  type="search"
                  className="form-control bg-dark text-light"
                  placeholder="Carian..."
                  style={{ border: '2px solid #ff6600' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn" type="submit" style={{ backgroundColor: '#ff6600', color: '#fff', border: '2px solid #ff6600' }}>
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
