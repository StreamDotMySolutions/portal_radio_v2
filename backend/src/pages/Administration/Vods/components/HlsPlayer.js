const HlsPlayer = ({ src, width = "100%", height = "auto" }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
  
    useEffect(() => {
      if (!playerRef.current) {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: "auto",
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
    }, [src]);
  
    return (
      <video
        ref={videoRef}
        className="video-js"
        style={{ width, height }}
      />
    );
  };
  
  export default HlsPlayer;
  