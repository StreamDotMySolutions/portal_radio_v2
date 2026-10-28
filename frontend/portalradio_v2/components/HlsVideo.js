'use client';

import { useEffect, useRef } from 'react';

// Plays an HLS (.m3u8) video: native HLS where the browser has it (Safari, recent Chrome), hls.js elsewhere.
// capLevelToPlayerSize keeps a phone-width player from pulling the 1080p rung just because the line could carry it.
// play() is called after the source is attached; the autoPlay attribute would race hls.js.
export default function HlsVideo({ src, poster, autoPlay = false, onPlay, style }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;
    let cancelled = false;

    (async () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else {
        const HLS = (await import('hls.js')).default;
        if (cancelled) return;
        if (HLS.isSupported()) {
          hls = new HLS({ capLevelToPlayerSize: true });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
      }
      // A refused play() (no user gesture) is left alone: the controls are on screen
      if (autoPlay) video.play?.().catch(() => {});
    })();

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      poster={poster}
      onPlay={onPlay}
      style={style ?? { width: '100%', height: '100%', display: 'block', background: '#000' }}
    />
  );
}
