'use client';

import { useState, useRef, useEffect } from 'react';
import { trackPlayerPlay } from '@/utils/analytics';

export default function FullPlayerCard({ station, pageviews = 0 }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const playTrackedRef = useRef(false);
  const disabled = !station.streamUrl || station.streamUrl === '#';

  // Load HLS stream
  useEffect(() => {
    if (disabled) return;
    const audio = audioRef.current;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    setPlaying(false);
    setError(false);

    if (station.streamUrl.includes('.m3u8')) {
      (async () => {
        try {
          const HLS = (await import('hls.js')).default;
          if (HLS.isSupported()) {
            const hls = new HLS();
            hlsRef.current = hls;
            hls.loadSource(station.streamUrl);
            hls.attachMedia(audio);
            hls.on(HLS.Events.ERROR, (_, data) => { if (data.fatal) setError(true); });
          } else if (audio?.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = station.streamUrl;
          } else {
            setError(true);
          }
        } catch {
          if (audio?.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = station.streamUrl;
          } else {
            setError(true);
          }
        }
      })();
    } else {
      audio.src = station.streamUrl;
    }

    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [station.streamUrl, disabled]);

  // Update time display
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  const toggle = () => {
    if (disabled || error) return;
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
      // Track first play
      if (!playTrackedRef.current) {
        playTrackedRef.current = true;
        trackPlayerPlay(station.id, station.name);
      }
    }
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const vol = parseInt(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol / 100;
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '1 / 1.03',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
        border: `1px solid ${station.accent}22`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {!disabled && <audio ref={audioRef} />}

      {/* Artwork/Banner Section */}
      <div
        style={{
          height: '55%',
          backgroundImage: station.banner ? `url(${station.banner})` : `linear-gradient(135deg, ${station.accent}44, ${station.accent}22)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent, ${station.accent}44)` }} />

        {/* Animated Equalizer Bars when playing */}
        {playing && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            padding: '12px',
            paddingBottom: '62px',
            zIndex: 2,
            gap: '3px',
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${30 + (i % 4) * 15}%`,
                  backgroundColor: station.accent,
                  borderRadius: '2px',
                  opacity: 0.8,
                  animation: `audioBar 0.${4 + (i % 5)}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
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

        {/* Volume Control Overlay with Play Button */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 5,
        }}>
          <button
            onClick={toggle}
            disabled={disabled || error}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: disabled || error ? '#555' : station.accent,
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              cursor: disabled || error ? 'not-allowed' : 'pointer',
              opacity: disabled || error ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => !disabled && !error && (e.target.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            <i className={`bi ${playing ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
          </button>
          <i className="bi bi-volume-down" style={{ fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}></i>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            disabled={disabled}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#555',
              accentColor: station.accent,
              cursor: disabled ? 'not-allowed' : 'pointer',
              appearance: 'slider-horizontal',
              opacity: disabled ? 0.5 : 1,
            }}
          />
          <i className="bi bi-volume-up" style={{ fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}></i>
        </div>

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
    </div>
  );
}
