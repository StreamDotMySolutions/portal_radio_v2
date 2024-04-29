import React from 'react';

const VideoBox = ({modal,id,filename}) => {
  //const videoSrc = "https://www.youtube.com/embed/9JviWN280sQ?autoplay=1&mute=1&playsinline=1&playlist=9JviWN280sQ&loop=1&controls=0&disablekb=1&showinfo=0";
const videoSrc = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&controls=0&disablekb=1&showinfo=0`
  return (
          <section className="wrap">
            <div className="video-bg">
              <img src={filename} style={{'height':'400px'}} />
              {/* <iframe
                src={videoSrc}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe> */}
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
                        data-src={videoSrc}
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
                      <div className="modal-dialog" role="document">
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
                            <div className="embed-responsive embed-responsive-16by9">
                              <iframe
                                className="embed-responsive-item"
                                //src="https://www.youtube.com/embed/9JviWN280sQ?autoplay=1&mute=1&playsinline=1&playlist=9JviWN280sQ&loop=1&controls=0&disablekb=1&showinfo=0"
                                src={videoSrc}
                                id="video"
                                allowscriptaccess="always"
                                allow="autoplay"
                              ></iframe>
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
