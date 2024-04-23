import  { useEffect, useState } from 'react'
import { Carousel, Image } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom';

const HomeBanner = () => {

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

        return banners.map( (banner, index) => (

            <Carousel.Item key={index}>
                <Link to={banner.redirect_url}>
                    <Image
                        className="d-block w-100"
                        src={`${serverUrl}/storage/banners/${banner.filename}`}
                        alt={banner.description}
                    />
                </Link>
            </Carousel.Item>

        ))
    }

    return (
        
        <Carousel>
            {carouselItems()}
        </Carousel>
        
    );
};

export default HomeBanner;