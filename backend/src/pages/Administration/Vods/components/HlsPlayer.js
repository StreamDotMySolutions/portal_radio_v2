import React, { useEffect } from "react";

const HlsPlayer = ({ src, width = "100%", height = "auto" }) => {
  useEffect(() => {
    // Muatkan skrip dan CSS dari CDN hanya sekali
    if (!window.videojs) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/video.js/8.3.0/video.min.js";
      script.async = true;
      script.onload = initializePlayer;
      document.body.appendChild(script);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/video.js/8.3.0/video-js.min.css";
      document.head.appendChild(link);
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      const videoElement = document.getElementById("hls-video-player");
      if (!videoElement || !window.videojs) return;

      // Inisialisasi Video.js
      const player = window.videojs(videoElement, {
        controls: true,
        autoplay: true,
        preload: "auto",
        fluid: true,
        responsive: true,
      });

      // Tetapkan src
      player.src({
        src: src,
        type: "application/x-mpegURL",
      });

      // Cleanup player apabila unmount
      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [src]);

  return (
    <div>
      <video
        id="hls-video-player"
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
