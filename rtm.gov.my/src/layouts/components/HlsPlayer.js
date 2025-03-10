import React, { useEffect, useRef } from "react";

const HlsPlayer = ({ id, width = "100%", height = "auto" }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const path = `${serverUrl}/storage/vods`;
  const src = `${path}/${id}/playlist.m3u8`;
  const videoRef = useRef(null);
  const hlsRef = useRef(null); // 🔥 Simpan rujukan HLS supaya boleh dispose nanti

  useEffect(() => {
    const loadHls = () => {
      const video = videoRef.current;
      if (!video) return;

      if (window.Hls.isSupported()) {
        hlsRef.current = new window.Hls();
        hlsRef.current.loadSource(src);
        hlsRef.current.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    };

    // Muatkan skrip hls.js hanya jika ia belum ada
    if (!window.Hls) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js";
      script.async = true;
      script.onload = loadHls;
      document.body.appendChild(script);
    } else {
      loadHls();
    }

    // ✅ Cleanup apabila komponen unmount atau modal ditutup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy(); // Hentikan stream HLS
        hlsRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause(); // Hentikan video
        videoRef.current.src = ""; // Kosongkan sumber video
      }
    };
  }, [src]);

  return (
    <video ref={videoRef} controls style={{ width, height }}>
      <p>Your browser does not support HLS streaming.</p>
    </video>
  );
};

export default HlsPlayer;
