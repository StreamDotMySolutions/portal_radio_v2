'use client';

export default function DeeJayModal({ deejay, accent, show, onClose }) {
  if (!show || !deejay) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="position-fixed top-50 start-50 translate-middle modal-dark p-4"
        style={{ zIndex: 1051, maxWidth: '400px', width: '90%', borderRadius: '12px' }}
      >
        <button
          onClick={onClose}
          className="btn-close position-absolute top-0 end-0 m-3"
          style={{ filter: 'invert(1)' }}
        />

        <div className="text-center">
          {/* Photo placeholder */}
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: accent,
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#fff',
            }}
          >
            {deejay.name.charAt(0)}
          </div>

          <h4 style={{ color: 'var(--color-text)', fontWeight: '700' }}>{deejay.name}</h4>
          <span
            className="d-inline-block mb-3 px-3 py-1"
            style={{
              backgroundColor: `${accent}33`,
              color: accent,
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500',
            }}
          >
            {deejay.role}
          </span>

          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {deejay.bio}
          </p>

          {deejay.social && (
            <div className="d-flex justify-content-center gap-3 mt-3">
              {deejay.social.instagram && deejay.social.instagram !== '#' && (
                <a href={deejay.social.instagram} style={{ color: accent, fontSize: '1.3rem' }}>
                  <i className="bi bi-instagram"></i>
                </a>
              )}
              {deejay.social.twitter && deejay.social.twitter !== '#' && (
                <a href={deejay.social.twitter} style={{ color: accent, fontSize: '1.3rem' }}>
                  <i className="bi bi-twitter-x"></i>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
