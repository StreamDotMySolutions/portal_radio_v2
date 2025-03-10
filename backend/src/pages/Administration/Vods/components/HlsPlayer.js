import React, { useEffect } from "react";

const HlsPlayer = ({ src, width = "100%", height = "auto" }) => {
  useEffect(() => {
    const loadHls = () => {
      if (window.Hls) {
        const video = document.getElementById("hls-video-player");
        if (!video) return;

        if (window.Hls.isSupported()) {
          const hls = new window.Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
        }
      }
    };

    // Muatkan skrip hls.js dari CDN jika belum ada
    if (!window.Hls) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js";
      script.async = true;
      script.onload = loadHls;
      document.body.appendChild(script);
    } else {
      loadHls();
    }
  }, [src]);

  return (
    <video
      id="hls-video-player"
      controls
      style={{ width, height }}
    >
      <p>Your browser does not support HLS streaming.</p>
    </video>
  );
};

export default HlsPlayer;
