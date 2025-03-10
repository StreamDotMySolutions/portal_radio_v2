import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Hls from "hls.js";

const VideoModal = ({ embed_code, filename }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const videoSrc = `${serverUrl}/storage/vods/${embed_code}/playlist.m3u8`;

  

  return (
    <div className="container mt-5">
      {/* Button to Open Modal */}
      <p>Embed code: {embed_code}</p>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#videoModal"
      >
        {filename}
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="videoModal"
        tabIndex="-1"
        aria-labelledby="videoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>{videoSrc} embed code is {embed_code}</p>
              <video id="videoPlayer" width="100%" controls></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
