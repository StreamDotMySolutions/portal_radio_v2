import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Hls from "hls.js";

const VideoBox = ({ modal, embedCode, filename }) => {

  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    } else {
      alert("Pelayar anda tidak menyokong HLS.");
    }

    const handleModalClose = () => {
      video.pause();
      video.currentTime = 0;
    };

    const modalElement = modalRef.current;
    modalElement.addEventListener("hidden.bs.modal", handleModalClose);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
    };
  }, []);

  return (
    <section className="wrap">
      <div className="video-bg">
        <img
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
          src={filename}
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
                  data-toggle="modal"
                  data-src={embedCode}
                  data-target={`#modal_${modal}`}
                >
                  <img className="img-fluid" src="/img/play.png" alt="Play Button" />
                </button>
              </h3>
              <div
                className="modal fade"
                id={`modal_${modal}`}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <div className="text-dark embed-responsive embed-responsive-16by9">
                        {/* <HlsPlayer id={embedCode} /> */}
                        <video ref={videoRef} width="100%" controls></video>
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

export default VideoBox;
