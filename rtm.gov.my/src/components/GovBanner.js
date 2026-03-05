import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function GovBanner() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', fontSize: '0.8rem' }}>
      <div className="container">
        <div className="d-flex align-items-center py-1">
          <img
            src="/flag-my.svg"
            alt="Bendera Malaysia"
            width={20}
            height={14}
            style={{ objectFit: 'contain' }}
            className="me-2"
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
            <FontAwesomeIcon icon={['fas', expanded ? 'chevron-up' : 'chevron-down']} className="ms-1" />
          </button>
        </div>

        {expanded && (
          <div className="row pb-3 pt-2">
            <div className="col-md-6 d-flex align-items-start mb-3 mb-md-0">
              <FontAwesomeIcon icon={['fas', 'building']} className="text-secondary me-3 fs-4 mt-1" />
              <div>
                <p className="text-light mb-1 fw-semibold">Laman web rasmi menggunakan .gov.my</p>
                <p className="text-secondary mb-0" style={{ fontSize: '0.78rem' }}>
                  Laman web <strong>.gov.my</strong> adalah milik organisasi rasmi Kerajaan Malaysia.
                </p>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-start">
              <FontAwesomeIcon icon={['fas', 'lock']} className="text-secondary me-3 fs-4 mt-1" />
              <div>
                <p className="text-light mb-1 fw-semibold">Laman web .gov.my yang selamat menggunakan HTTPS</p>
                <p className="text-secondary mb-0" style={{ fontSize: '0.78rem' }}>
                  Kunci (<FontAwesomeIcon icon={['fas', 'lock']} />) atau <strong>https://</strong> bermaksud anda telah
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
