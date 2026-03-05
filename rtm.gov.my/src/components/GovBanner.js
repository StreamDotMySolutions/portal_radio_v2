import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const url = process.env.REACT_APP_API_URL

export default function GovBanner() {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debounceRef = useRef(null)
  const searchRef = useRef(null)

  // Close results on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setResults([]); setShowResults(false); return }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      setShowResults(true)
      try {
        const res = await fetch(`${url}/sitemap/search?q=${encodeURIComponent(query)}`)
        const json = await res.json()
        setResults(json.results || [])
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
  }, [query])

  const resolveLink = (result) => {
    const setting = result.article_setting
    return setting?.listing_type === 'single_article'
      ? `/contents/${result.id}`
      : `/listings/${result.id}`
  }

  const handleResultClick = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

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
          <div className="d-none d-lg-block position-relative" ref={searchRef}>
            <div className="input-group input-group-sm">
              <input
                type="search"
                className="form-control bg-dark border-secondary text-light"
                placeholder="Carian..."
                style={{ width: '180px' }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (results.length > 0) setShowResults(true) }}
              />
              {query && (
                <button
                  className="btn btn-outline-secondary d-flex align-items-center"
                  type="button"
                  onClick={() => { setQuery(''); setResults([]); setShowResults(false) }}
                >
                  <FontAwesomeIcon icon={['fas', 'xmark']} />
                </button>
              )}
              <button className="btn btn-outline-secondary d-flex align-items-center" type="button">
                <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div
                className="position-absolute bg-dark border border-secondary rounded-bottom"
                style={{
                  top: '100%',
                  right: 0,
                  width: '350px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 1050,
                  fontSize: '0.85rem',
                }}
              >
                {searching && (
                  <div className="p-3 text-secondary small">Mencari...</div>
                )}
                {!searching && results.length === 0 && query.trim().length >= 2 && (
                  <div className="p-3 text-secondary small">
                    Tiada hasil ditemui untuk "<strong>{query}</strong>"
                  </div>
                )}
                {!searching && results.length > 0 && (
                  <>
                    <div className="px-3 pt-2 pb-1 text-secondary small">{results.length} hasil ditemui</div>
                    {results.map((r) => (
                      <NavLink
                        key={r.id}
                        to={resolveLink(r)}
                        className="d-block px-3 py-2 text-decoration-none text-light"
                        style={{ borderBottom: '1px solid #333' }}
                        onClick={handleResultClick}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {r.title}
                      </NavLink>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
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
