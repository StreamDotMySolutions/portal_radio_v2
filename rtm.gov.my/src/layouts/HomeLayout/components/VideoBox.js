import React from 'react';

const VideoBox = ({ modal, embedCode, filename }) => {
  //const videoSrc = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&controls=0&disablekb=1&showinfo=0`;

  return (
    <section className="wrap">
      <div className="video-bg">
        <img 
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          src={filename} 
          alt="Video Background" />
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
                  style={{ backgroundColor: 'transparent' }}
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
            
                          <iframe 
                            width="750px"
                            height={(750 * 9) / 16} // Calculate height for 16:9 aspect ratio
                            className="embed-responsive embed-responsive-16by9" 
                            src={`https://www.youtube.com/embed/${embedCode}`} 
                            //title="Old World - Announcement Trailer | 4X Turn-Based Strategy Game" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerpolicy="strict-origin-when-cross-origin" 
                            allowfullscreen>

                        </iframe>
               
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
