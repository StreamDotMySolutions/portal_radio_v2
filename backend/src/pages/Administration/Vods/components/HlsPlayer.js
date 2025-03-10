import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const HlsPlayer = ({ src, width = "100%", height = "auto" }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.dispose(); // Dispose the previous instance
      playerRef.current = null;
    }

    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        fluid: true, // Makes video responsive
      });

      playerRef.current.src({
        src: src,
        type: "application/x-mpegURL",
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]); // Reinitialize when `src` changes

  return (
    <video
      ref={videoRef}
      className="video-js vjs-default-skin"
      style={{ width, height }}
    />
  );
};

export default HlsPlayer;
