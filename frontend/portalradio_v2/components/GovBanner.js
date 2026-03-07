'use client'

import { useState } from 'react'

export default function GovBanner() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', fontSize: '0.8rem' }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-1">
          <div className="d-flex align-items-center">
            <img
              src="/flag-my.svg"
              alt="Bendera Malaysia"
              width={20}
              height={14}
              className="me-2"
              style={{ objectFit: 'contain' }}
            />
            <span className="text-secondary me-2">
              Laman web rasmi Kerajaan Malaysia
            </span>
            <button
              className="btn btn-link text-info p-0 text-decoration-none"
              style={{ fontSize: '0.8rem' }}
              onClick={() => setExpanded(!expanded)}
            >
              Ini cara anda mengetahuinya
              <i className={`bi bi-chevron-${expanded ? 'up' : 'down'} ms-1`}></i>
            </button>
          </div>
        </div>

        {expanded && (
          <div className="row pb-3 pt-2">
            <div className="col-md-6 d-flex align-items-start mb-3 mb-md-0">
              <i className="bi bi-building text-secondary me-3 fs-4 mt-1"></i>
              <div>
                <p className="text-light mb-1 fw-semibold">Laman web rasmi menggunakan .gov.my</p>
                <p className="text-secondary mb-0" style={{ fontSize: '0.78rem' }}>
                  Laman web <strong>.gov.my</strong> adalah milik organisasi rasmi Kerajaan Malaysia.
                </p>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-start">
              <i className="bi bi-lock text-secondary me-3 fs-4 mt-1"></i>
              <div>
                <p className="text-light mb-1 fw-semibold">Laman web .gov.my yang selamat menggunakan HTTPS</p>
                <p className="text-secondary mb-0" style={{ fontSize: '0.78rem' }}>
                  Kunci (<i className="bi bi-lock"></i>) atau <strong>https://</strong> bermaksud anda telah
                  bersambung dengan selamat ke laman web .gov.my. Hanya kongsi maklumat sensitif di laman web
                  rasmi dan selamat.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
