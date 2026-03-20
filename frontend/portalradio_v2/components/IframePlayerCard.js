'use client';

export default function IframePlayerCard({ station, pageviews = 0 }) {
  const noEmbed = !station.embedPlayerUrl;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '1 / 1.03',
        position: 'relative',
      }}
    >
      {noEmbed ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: `${station.accent}11`,
            borderRadius: '8px',
            border: `1px solid ${station.accent}22`,
          }}
        >
          <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
            <i className="bi bi-exclamation-circle" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Player URL not configured</p>
          </div>
        </div>
      ) : (
        <iframe
          src={station.embedPlayerUrl}
          style={{
            border: 'none',
            display: 'block',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg)',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
          }}
          allow="autoplay"
          scrolling="no"
          title={`${station.name} player`}
        />
      )}

      {/* Share Button Overlay */}
      <button
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: `1px solid ${station.accent}66`,
          borderRadius: '6px',
          color: station.accent,
          fontSize: '0.8rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          transition: 'all 0.2s',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = `${station.accent}11`;
          e.target.style.borderColor = station.accent;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.borderColor = `${station.accent}66`;
        }}
        onClick={() => {
          const text = `Dengarkan ${station.name} - ${station.frequency}`;
          navigator.share?.({ title: 'RTM Radio', text, url: window.location.href })
            .catch(() => navigator.clipboard.writeText(window.location.href));
        }}
      >
        <i className="bi bi-share" style={{ fontSize: '0.85rem' }}></i>
        Kongsi
      </button>

      {/* Pageview Count Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: `${station.accent}CC`,
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <i className="bi bi-eye" style={{ fontSize: '0.8rem' }}></i>
        {pageviews.toLocaleString()}
      </div>
    </div>
  );
}
