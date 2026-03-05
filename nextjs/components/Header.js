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
              <div className="dropdown-menu dropdown-menu-dark p-3" style={{ minWidth: '500px' }}>
                <div className="row">
                  <div className="col-6">
                    <Link href="/about" className="dropdown-item rounded">Latar Belakang</Link>
                    <Link href="/about/vision" className="dropdown-item rounded">Visi & Misi</Link>
                    <Link href="/about/organisation" className="dropdown-item rounded">Carta Organisasi</Link>
                    <Link href="/about/management" className="dropdown-item rounded">Pengurusan Tertinggi</Link>
                    <Link href="/about/history" className="dropdown-item rounded">Sejarah RTM</Link>
                    <Link href="/about/piagam" className="dropdown-item rounded">Piagam Pelanggan</Link>
                    <Link href="/about/dasar" className="dropdown-item rounded">Dasar Penyiaran</Link>
                    <Link href="/about/akta" className="dropdown-item rounded">Akta & Perundangan</Link>
                    <Link href="/about/anugerah" className="dropdown-item rounded">Anugerah & Pencapaian</Link>
                    <Link href="/about/galeri" className="dropdown-item rounded">Galeri</Link>
                  </div>
                  <div className="col-6">
                    <Link href="/about/logo" className="dropdown-item rounded">Logo & Identiti</Link>
                    <Link href="/about/rangkaian" className="dropdown-item rounded">Rangkaian RTM</Link>
                    <Link href="/about/tv1" className="dropdown-item rounded">TV1</Link>
                    <Link href="/about/tv2" className="dropdown-item rounded">TV2</Link>
                    <Link href="/about/tvokidz" className="dropdown-item rounded">TV Okey</Link>
                    <Link href="/about/sukan" className="dropdown-item rounded">Sukan RTM</Link>
                    <Link href="/about/nasional" className="dropdown-item rounded">Nasional FM</Link>
                    <Link href="/about/traxx" className="dropdown-item rounded">TraXX FM</Link>
                    <Link href="/about/minnal" className="dropdown-item rounded">Minnal FM</Link>
                    <Link href="/about/aifm" className="dropdown-item rounded">Ai FM</Link>
                  </div>
                </div>
              </div>
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
