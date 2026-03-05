'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#2d2d2d' }}>
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold">
          RTM
        </Link>
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
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link text-uppercase fw-semibold px-3">
                Utama
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-uppercase fw-semibold px-3"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Mengenai Kami
              </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link href="/about" className="dropdown-item">Latar Belakang</Link></li>
                <li><Link href="/about/vision" className="dropdown-item">Visi & Misi</Link></li>
                <li><Link href="/about/organisation" className="dropdown-item">Carta Organisasi</Link></li>
                <li><Link href="/about/management" className="dropdown-item">Pengurusan Tertinggi</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-uppercase fw-semibold px-3"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Pengumuman
              </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link href="/announcements/tender" className="dropdown-item">Tender / Sebutharga</Link></li>
                <li><Link href="/announcements/procurement" className="dropdown-item">Perolehan Pembekalan Program</Link></li>
                <li><Link href="/announcements/careers" className="dropdown-item">Kerjaya</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-uppercase fw-semibold px-3"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Warga RTM
              </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link href="/staff/portal" className="dropdown-item">Portal Warga</Link></li>
                <li><Link href="/staff/directory" className="dropdown-item">Direktori Kakitangan</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-uppercase fw-semibold px-3"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Swasta / Awam
              </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link href="/public/services" className="dropdown-item">Perkhidmatan</Link></li>
                <li><Link href="/public/downloads" className="dropdown-item">Muat Turun</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="/feedback" className="nav-link text-uppercase fw-semibold px-3">
                Maklumbalas
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/directory" className="nav-link text-uppercase fw-semibold px-3">
                Direktori
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
