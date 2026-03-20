'use client';

export default function IframePlayerCardMobile({ station, pageviews = 0 }) {
  const noEmbed = !station.embedPlayerUrl;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
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
            <i className="bi bi-exclamation-circle" style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.5rem' }}></i>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Player URL not configured</p>
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
          top: '8px',
          left: '8px',
          padding: '6px 10px',
          backgroundColor: 'transparent',
          border: `1px solid ${station.accent}66`,
          borderRadius: '6px',
          color: station.accent,
          fontSize: '0.75rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          transition: 'all 0.2s',
          zIndex: 10,
        }}
        onTouchStart={(e) => {
          e.target.style.backgroundColor = `${station.accent}11`;
          e.target.style.borderColor = station.accent;
        }}
        onTouchEnd={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.borderColor = `${station.accent}66`;
        }}
        onClick={() => {
          const text = `Dengarkan ${station.name} - ${station.frequency}`;
          navigator.share?.({ title: 'RTM Radio', text, url: window.location.href })
            .catch(() => navigator.clipboard.writeText(window.location.href));
        }}
      >
        <i className="bi bi-share" style={{ fontSize: '0.8rem' }}></i>
        Kongsi
      </button>

      {/* Pageview Count Badge */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: `${station.accent}CC`,
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: '600',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <i className="bi bi-eye" style={{ fontSize: '0.75rem' }}></i>
        {pageviews.toLocaleString()}
      </div>
    </div>
  );
}
