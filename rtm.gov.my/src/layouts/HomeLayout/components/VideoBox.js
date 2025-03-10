import React, { useEffect } from "react";
import HlsPlayer from "../../components/HlsPlayer";
import $ from "jquery"; // Pastikan jQuery dimasukkan kerana Bootstrap modal bergantung pada jQuery

const VideoBox = ({ modal, embedCode, filename }) => {
  useEffect(() => {
    // Event listener untuk hentikan video bila modal ditutup
    $(`#modal_${modal}`).on("hidden.bs.modal", () => {
      const video = document.getElementById("hls-video-player");
      if (video) {
        video.pause(); // Hentikan video
        video.src = ""; // Kosongkan sumber video
      }
    });

    // Cleanup listener bila komponen unmount
    return () => {
      $(`#modal_${modal}`).off("hidden.bs.modal");
    };
  }, [modal]);

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
                        <HlsPlayer id={embedCode} />
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
