'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            RTM
          </div>
          <span style={{ fontSize: '20px', fontWeight: '600' }}>RTM Portal</span>
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/news" className="nav-link">
                News
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/programs" className="nav-link">
                Programs
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/directory" className="nav-link">
                Directory
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
