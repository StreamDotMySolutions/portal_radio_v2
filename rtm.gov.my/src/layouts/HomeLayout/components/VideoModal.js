import { useEffect, useRef } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Hls from "hls.js";

const VideoModal = ({ embed_code, filename }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const videoSrc = `${serverUrl}/storage/vods/${embed_code}/playlist.m3u8`;

  const videoRef = useRef(null);
  const modalRef = useRef(null);
  const hlsRef = useRef(null);

  const modalId = `videoModal-${embed_code}`;
  const videoPlayerId = `videoPlayer-${embed_code}`;

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(videoSrc);
      hlsRef.current.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    }
  };

  const handleModalClose = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      }
    };
  }, []);

  return (
    <section className="wrap">
      <div className="video-bg">
        <img
          style={{ width: "100%", height: "100%", cursor: "pointer", borderRadius: '4px' }}
          src={`${serverUrl}/storage/videos/${filename}`}
          alt="Video Background"
        />
      </div>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-10">
              <h3 className="title">
                <button
                  type="button"
                  className="video-btn border-0"
                  style={{ backgroundColor: "transparent" }}
                  data-bs-toggle="modal"
                  data-bs-target={`#${modalId}`}
                  onClick={handlePlay}
                >
                  <img className="img-fluid" src="/img/play.png" alt="Play Button" />
                </button>
              </h3>
              <div
                className="modal fade"
                id={modalId}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                ref={modalRef}
              >
                <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <div className="text-dark embed-responsive embed-responsive-16by9">
                        <video id={videoPlayerId} ref={videoRef} width="100%" controls></video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoModal;
