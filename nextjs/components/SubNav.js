'use client'

import Link from 'next/link'

export default function SubNav() {
  return (
    <div className="d-none d-lg-block" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <div className="container">
        <ul className="nav justify-content-center py-1">
          <li className="nav-item">
            <Link href="/" className="nav-link text-dark text-uppercase fw-semibold px-3">
              Utama
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/radio" className="nav-link text-dark text-uppercase fw-semibold px-3">
              Radio
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/ratecard" className="nav-link text-dark text-uppercase fw-semibold px-3">
              Ratecard RTM
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/galeri" className="nav-link text-dark text-uppercase fw-semibold px-3">
              Galeri
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/directory" className="nav-link text-dark text-uppercase fw-semibold px-3">
              Direktori
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
