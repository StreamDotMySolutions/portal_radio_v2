import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SimpleCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <Slider {...settings}>
        <div>
          <img
            src="https://placehold.co/800x400?text=Slide+1"
            alt="Slide 1"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>
        <div>
          <img
            src="https://placehold.co/800x400?text=Slide+2"
            alt="Slide 2"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>
        <div>
          <img
            src="https://placehold.co/800x400?text=Slide+3"
            alt="Slide 3"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>
      </Slider>
    </div>
  );
};

export default SimpleCarousel;
