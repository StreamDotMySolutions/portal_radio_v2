import React from 'react';

const BannerCarousel = () => {
    return (
        <div id="demo" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="/asset/img/mflbanner2.jpg" alt="First slide" />
                </div>
                <div className="carousel-item">
                    <img src="/asset/img/raya2023.jpg" alt="Second slide" />
                </div>
            </div>

            <a className="carousel-control-prev" href="#demo" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#demo" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    );
};

export default BannerCarousel;
