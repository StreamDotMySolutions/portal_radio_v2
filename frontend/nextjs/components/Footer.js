'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #333' }} className="py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-light mb-3">Radio Televisyen Malaysia</h5>
            <p className="text-secondary">Jabatan Penyiaran Malaysia, Angkasapuri, 50614 Kuala Lumpur.</p>
            <div className="d-flex gap-3 fs-5">
              <Link href="#" className="text-secondary text-decoration-none"><i className="bi bi-facebook"></i></Link>
              <Link href="#" className="text-secondary text-decoration-none"><i className="bi bi-twitter-x"></i></Link>
              <Link href="#" className="text-secondary text-decoration-none"><i className="bi bi-instagram"></i></Link>
              <Link href="#" className="text-secondary text-decoration-none"><i className="bi bi-youtube"></i></Link>
              <Link href="#" className="text-secondary text-decoration-none"><i className="bi bi-tiktok"></i></Link>
            </div>
          </div>
          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="text-light mb-3">Pautan</h6>
            <ul className="list-unstyled">
              <li className="mb-1"><Link href="/" className="text-decoration-none text-secondary small">Utama</Link></li>
              <li className="mb-1"><Link href="/about" className="text-decoration-none text-secondary small">Mengenai Kami</Link></li>
              <li className="mb-1"><Link href="/directory" className="text-decoration-none text-secondary small">Direktori</Link></li>
              <li className="mb-1"><Link href="/feedback" className="text-decoration-none text-secondary small">Maklumbalas</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4 mb-md-0">
            <h6 className="text-light mb-3">Pengumuman</h6>
            <ul className="list-unstyled">
              <li className="mb-1"><Link href="/announcements/tender" className="text-decoration-none text-secondary small">Tender / Sebutharga</Link></li>
              <li className="mb-1"><Link href="/announcements/procurement" className="text-decoration-none text-secondary small">Perolehan Pembekalan</Link></li>
              <li className="mb-1"><Link href="/announcements/careers" className="text-decoration-none text-secondary small">Kerjaya</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-light mb-3">Hubungi Kami</h6>
            <ul className="list-unstyled text-secondary small">
              <li className="mb-1"><i className="bi bi-telephone me-2"></i>03-2288 8888</li>
              <li className="mb-1"><i className="bi bi-envelope me-2"></i>aduan@rtm.gov.my</li>
              <li className="mb-1"><i className="bi bi-globe me-2"></i>www.rtm.gov.my</li>
            </ul>
          </div>
        </div>
        <hr style={{ borderColor: '#444' }} />
        <div className="row">
          <div className="col-md-6">
            <p className="text-secondary small mb-0">&copy; 2026 Radio Televisyen Malaysia. Hak Cipta Terpelihara.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link href="#" className="text-decoration-none text-secondary small me-3">Dasar Privasi</Link>
            <Link href="#" className="text-decoration-none text-secondary small">Penafian</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
