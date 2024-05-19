import  { useEffect, useState } from 'react'
import { Carousel, Image } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom';

const BannerCarousel = () => {
    const url = process.env.REACT_APP_API_URL
    const serverUrl = process.env.REACT_APP_SERVER_URL
    const [banners,setBanners] = useState([])

    useEffect( () => {
        axios(`${url}/home-banners`)
        .then( response => {
          //console.log(response)
          setBanners(response.data.banners)
        })
    
      },[])

    const carouselItems = () => {

        if (!banners || banners.length === 0) {
            // Return some default content or a message indicating no banners available
            return <div></div>;
        } 


        if (banners.length > 0) {
            return banners.map((banner, index) => {
    
            
                return (
                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                        {banner.filename && 
                            <Link to={banner.redirect_url}>
                                <img src={`${serverUrl}/storage/banners/${banner.filename}`} alt={`Banner ${index}`} />
                            </Link>
                        }
                    </div>
                );
            });
            
        }
    

      
    }

    if (banners.length > 0){
        
        return (
            <div id="demo" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    {carouselItems()}
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
    }
};

export default BannerCarousel;
