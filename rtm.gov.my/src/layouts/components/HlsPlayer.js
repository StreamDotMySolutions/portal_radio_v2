import React, { useEffect, useRef } from "react";

const HlsPlayer = ({ id, width = "100%", height = "auto" }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const path = `${serverUrl}/storage/vods`;
  const src = `${path}/${id}/playlist.m3u8`;
  const videoRef = useRef(null); // ✅ Gunakan useRef untuk kawal video

  useEffect(() => {
    let hls; // ✅ Simpan rujukan hls supaya boleh dispose nanti

    const loadHls = () => {
      const video = videoRef.current;
      if (!video) return;

      if (window.Hls.isSupported()) {
        hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
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

    // ✅ Cleanup function apabila modal ditutup (komponen unmount)
    return () => {
      if (hls) {
        hls.destroy(); // Hentikan stream HLS
      }
      if (videoRef.current) {
        videoRef.current.pause(); // Hentikan video
        videoRef.current.src = ""; // Kosongkan sumber video
      }
    };
  }, [src]);

  return (
    <>
      <video ref={videoRef} controls style={{ width, height }}>
        <p>Your browser does not support HLS streaming.</p>
      </video>
    </>
  );
};

export default HlsPlayer;
