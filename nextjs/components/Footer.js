'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #333' }} className="py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-light mb-3">RTM Portal</h5>
            <p className="text-secondary">Radio Televisyen Malaysia - Your premier source for news, entertainment, and information.</p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-light mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link href="/" className="text-decoration-none text-secondary">Home</Link></li>
              <li><Link href="/news" className="text-decoration-none text-secondary">News</Link></li>
              <li><Link href="/programs" className="text-decoration-none text-secondary">Programs</Link></li>
              <li><Link href="/directory" className="text-decoration-none text-secondary">Directory</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="text-light mb-3">Follow Us</h5>
            <div className="d-flex gap-3">
              <Link href="#" className="text-primary text-decoration-none">
                <i className="bi bi-facebook"></i>
              </Link>
              <Link href="#" className="text-info text-decoration-none">
                <i className="bi bi-twitter"></i>
              </Link>
              <Link href="#" className="text-danger text-decoration-none">
                <i className="bi bi-instagram"></i>
              </Link>
              <Link href="#" className="text-light text-decoration-none">
                <i className="bi bi-youtube"></i>
              </Link>
            </div>
          </div>
        </div>
        <hr className="bg-secondary" />
        <div className="row">
          <div className="col-md-6">
            <p className="text-secondary mb-0">&copy; 2026 RTM. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link href="#" className="text-decoration-none text-secondary me-3">Privacy Policy</Link>
            <Link href="#" className="text-decoration-none text-secondary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
