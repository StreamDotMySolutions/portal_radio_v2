import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const HlsPlayer = ({ src, width = "100%", height = "auto" }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        fluid: true,
        responsive: true,
      });
    }

    // Jika `src` berubah, hanya update `src` tanpa dispose
    playerRef.current.src({
      src: src,
      type: "application/x-mpegURL",
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]); // `useEffect` hanya dijalankan apabila `src` berubah

  return (
    <div>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        style={{ width, height }}
      >
        <p className="vjs-no-js">
          Your browser does not support HTML5 video. Please update your browser.
        </p>
      </video>
    </div>
  );
};

export default HlsPlayer;
