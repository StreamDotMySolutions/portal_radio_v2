import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityToggle() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const {
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    linkTracking,
    toggleLinkTracking,
    titleTracking,
    toggleTitleTracking,
    dyslexiaFont,
    toggleDyslexiaFont,
    reducedMotion,
    toggleReducedMotion,
    resetAll,
  } = useAccessibility()

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const panelStyle = {
    position: 'fixed',
    zIndex: 1001,
    backgroundColor: '#212529',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    maxHeight: '80vh',
    overflowY: 'auto',
    ...(isMobile
      ? {
          bottom: '70px',
          left: '10px',
          right: '10px',
          width: 'auto',
        }
      : {
          bottom: '70px',
          right: '20px',
          left: 'auto',
          width: '360px',
        }),
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="btn btn-outline-light position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
        }}
        onClick={() => setOpen(!open)}
        title="Accessibility Settings"
      >
        <FontAwesomeIcon icon={['fas', 'universal-access']} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="position-fixed"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Accessibility Panel */}
      {open && (
        <div style={panelStyle}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-light mb-0">Accessibility</h6>
            <button
              className="btn btn-sm btn-link text-light p-0"
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={['fas', 'xmark']} />
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-3">
            <label className="text-light small fw-semibold d-block mb-2">Font Size</label>
            <div className={`d-flex gap-1 ${isMobile ? 'flex-wrap' : ''}`}>
              <button
                className={`btn btn-sm ${fontSize === 'small' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFontSize('small')}
              >
                A−
              </button>
              <button
                className={`btn btn-sm ${fontSize === 'normal' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFontSize('normal')}
              >
                A
              </button>
              <button
                className={`btn btn-sm ${fontSize === 'large' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFontSize('large')}
              >
                A+
              </button>
              <button
                className={`btn btn-sm ${fontSize === 'xlarge' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFontSize('xlarge')}
              >
                A++
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="mb-2 form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="highContrast"
              checked={highContrast}
              onChange={toggleHighContrast}
            />
            <label className="form-check-label text-light small" htmlFor="highContrast">
              High Contrast Mode
            </label>
          </div>

          {/* Link Tracking */}
          <div className="mb-2 form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="linkTracking"
              checked={linkTracking}
              onChange={toggleLinkTracking}
            />
            <label className="form-check-label text-light small" htmlFor="linkTracking">
              Underline Links
            </label>
          </div>

          {/* Title Tracking */}
          <div className="mb-2 form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="titleTracking"
              checked={titleTracking}
              onChange={toggleTitleTracking}
            />
            <label className="form-check-label text-light small" htmlFor="titleTracking">
              Highlight Titles
            </label>
          </div>

          {/* Dyslexia Font */}
          <div className="mb-2 form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="dyslexiaFont"
              checked={dyslexiaFont}
              onChange={toggleDyslexiaFont}
            />
            <label className="form-check-label text-light small" htmlFor="dyslexiaFont">
              Dyslexia-Friendly Font
            </label>
          </div>

          {/* Reduced Motion */}
          <div className="mb-3 form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="reducedMotion"
              checked={reducedMotion}
              onChange={toggleReducedMotion}
            />
            <label className="form-check-label text-light small" htmlFor="reducedMotion">
              Reduce Motion
            </label>
          </div>

          {/* Reset Button */}
          <button
            className="btn btn-outline-secondary btn-sm w-100"
            onClick={resetAll}
          >
            Reset All Settings
          </button>
        </div>
      )}
    </>
  )
}
