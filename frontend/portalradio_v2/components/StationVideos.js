'use client';

import { useEffect, useRef, useState } from 'react';
import HlsVideo from './HlsVideo';
import { fetchStationVideos } from '@/utils/stationsApi';

// Tells the radio players on the page to stop, so a video and the stream never play over each other
export const VIDEO_PLAY_EVENT = 'portal:video-play';

const fmtDuration = (seconds) => {
  const s = Math.round(seconds || 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function PlayBadge({ duration, size = 76 }) {
  return (
    <>
      <span
        className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center rounded-circle"
        style={{ width: size, height: size, background: 'rgba(0,0,0,.55)', border: '3px solid #fff' }}
        aria-hidden="true"
      >
        <span style={{
          width: 0, height: 0, marginLeft: size / 12,
          borderTop: `${size / 5.4}px solid transparent`, borderBottom: `${size / 5.4}px solid transparent`,
          borderLeft: `${size / 3.5}px solid #fff`,
        }} />
      </span>
      {duration > 0 && (
        <span className="position-absolute bottom-0 end-0 m-2 badge" style={{ background: 'rgba(0,0,0,.75)' }}>
          {fmtDuration(duration)}
        </span>
      )}
    </>
  );
}

// One video in a 16:9 frame: the poster and a play button until somebody presses it, then the HLS player.
// Nothing streams before the press; the poster is one small JPEG.
function VideoFrame({ video, playing, onStart, videoRef }) {
  return (
    <div className="position-relative w-100 overflow-hidden" style={{ aspectRatio: '16 / 9', background: '#000', borderRadius: '8px' }}>
      {playing ? (
        <div ref={videoRef} className="position-absolute top-0 start-0 w-100 h-100">
          <HlsVideo
            src={video.hls}
            poster={video.poster}
            autoPlay
            onPlay={() => window.dispatchEvent(new Event(VIDEO_PLAY_EVENT))}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={onStart}
          className="position-absolute top-0 start-0 w-100 h-100 border-0 p-0"
          style={{ background: '#000', cursor: 'pointer' }}
          aria-label={`Main video: ${video.title}`}
        >
          {video.poster && (
            <img src={video.poster} alt="" loading="lazy" decoding="async"
                 style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          )}
          <PlayBadge duration={video.duration} />
        </button>
      )}
    </div>
  );
}

// The station's videos: one large, the rest as cards beneath it. Renders nothing when the station has none.
export default function StationVideos({ slug, accent = '#444', compact = false }) {
  const [videos, setVideos] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const sectionRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setVideos(null);
    setPlaying(false);
    fetchStationVideos(slug).then((list) => {
      if (cancelled) return;
      setVideos(list);
      setCurrentId(list[0]?.id ?? null);
    });
    return () => { cancelled = true; };
  }, [slug]);

  // The radio stream starting pauses the video (media events do not bubble, so listen in the capture phase)
  useEffect(() => {
    const onMediaPlay = (e) => {
      if (e.target?.tagName === 'AUDIO') frameRef.current?.querySelector('video')?.pause();
    };
    document.addEventListener('play', onMediaPlay, true);
    return () => document.removeEventListener('play', onMediaPlay, true);
  }, []);

  if (!videos?.length) return null;

  const current = videos.find((v) => v.id === currentId) ?? videos[0];

  // A press on a card is already the gesture a browser needs before it plays sound, so start straight away
  const choose = (id) => {
    setCurrentId(id);
    setPlaying(true);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section ref={sectionRef} className={`station-videos ${compact ? 'mb-3' : 'mb-4'}`} style={{ scrollMarginTop: compact ? '70px' : '130px' }}>
      <h3 style={{ color: 'var(--color-text)', fontWeight: '600', marginBottom: '1rem', fontSize: compact ? '1rem' : undefined }}>
        <i className="bi bi-play-btn me-2" style={{ color: accent }}></i>Video
      </h3>

      <div className="card-dark" style={{ borderRadius: '8px', padding: compact ? '0.75rem' : '1rem' }}>
        <VideoFrame key={current.id} video={current} playing={playing} onStart={() => setPlaying(true)} videoRef={frameRef} />
        <h4 style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: compact ? '0.95rem' : '1.1rem', margin: '0.75rem 0 0' }}>
          {current.title}
        </h4>
        {current.description && (
          <p style={{ color: 'var(--color-muted)', fontSize: compact ? '0.85rem' : '0.95rem', lineHeight: 1.7, margin: '0.4rem 0 0', whiteSpace: 'pre-line' }}>
            {current.description}
          </p>
        )}
      </div>

      {videos.length > 1 && (
        <div className="row g-3 mt-1">
          {videos.map((v) => {
            const active = v.id === current.id;
            return (
              <div key={v.id} className={compact ? 'col-6' : 'col-12 col-sm-6 col-lg-4'}>
                <button
                  type="button"
                  onClick={() => choose(v.id)}
                  className="card-dark w-100 text-start p-0 overflow-hidden"
                  style={{
                    borderRadius: '8px', cursor: 'pointer',
                    border: active ? `2px solid ${accent}` : '2px solid transparent',
                  }}
                  aria-current={active ? 'true' : undefined}
                >
                  <div className="position-relative" style={{ aspectRatio: '16 / 9', background: '#000' }}>
                    {v.poster && (
                      <img src={v.poster} alt="" loading="lazy" decoding="async"
                           style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    )}
                    <PlayBadge duration={v.duration} size={compact ? 36 : 44} />
                  </div>
                  <div style={{ padding: compact ? '0.5rem 0.6rem' : '0.6rem 0.75rem', color: 'var(--color-text)', fontWeight: 600, fontSize: compact ? '0.8rem' : '0.9rem' }}>
                    {v.title}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
