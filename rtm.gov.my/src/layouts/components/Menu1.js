import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadMenu from './LoadMenu1';
import { Link, NavLink } from 'react-router-dom';

const Menu1 = () => {
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        axios(`${url}/home-menu-1`)
            .then((response) => {
                //console.log(response)
                setItems(response.data.items);
            }).catch( error => {
                console.warn(error)
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);

    const menuItems = () => {

        // 1. check ArticleSetting
        // 2. check active | true or false
        // 3. check show_children | yes or no
        // 4. check listing_type | single_article or listing
    
        return items.map((item, index) => (
            <span key={index}>
               
                {item.article_setting && item.article_setting.active == 1 && // check active

                    <>
                    {item.article_setting.show_children && item.article_setting.show_children == 1 ?
                        <LoadMenu key={index} id={item.id}/>
                        :
                        <>
                            <li key={index} className="nav-item">
                     
                                <NavLink to={`/listings/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                            
                            </li>
                        </>
                    }
                    </>
                } 

                
            </span>
        ));
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#171717" }} id="navbardiatas">
            <Link to="/" className="navbar-brand">
                <img 
                    className="img-responsive" 
                    style={{ marginLeft: "20px" }} 
                    src="/img/logortmbaharu2.png" 
                    alt="Logo RTM"
                />
            </Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbaratas" aria-controls="navbaratas" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbaratas">

                <ul className="navbar-nav ml-auto">
                    {isLoading === false } {menuItems()}
                </ul>
                
                <ul className="navbar-nav ml-auto">
                    <li><a style={{ color: "white" }} href="https://www.tiktok.com/@radiotelevisyenmalaysia?" className="nav-link font-weight-bold text-uppercase"><img src="/img/tiktok-xxl.png" className="img-fluid" alt="TikTok Logo" /></a></li>
                    <li><a style={{ color: "white" }} href="https://x.com/rtm_malaysia?lang=en" className="nav-link font-weight-bold text-uppercase"><img src="/img/x.png" className="img-fluid" alt="X Logo" /></a></li>
                    <li><a style={{ color: "white" }} href="https://www.facebook.com/RadioTelevisyenMalaysia/?locale=ms_MY" className="nav-link font-weight-bold text-uppercase"><img src="/img/facebook.svg" className="img-fluid" alt="Facebook Logo" /></a></li>
                    <li><a style={{ color: "white" }} href="https://www.instagram.com/rtm_malaysia/" className="nav-link font-weight-bold text-uppercase"><img src="/img/instagram.svg" className="img-fluid" alt="Instagram Logo" /></a></li>
                    <li><a style={{ color: "white" }} href="https://www.youtube.com/channel/UCF4KdUqyxJ5Cb0NTGhZXt9g" className="nav-link font-weight-bold text-uppercase"><img src="/img/youtube.png" className="img-fluid" alt="YouTube Logo" /></a></li>
                </ul>
                
            </div>
        </nav>
    );

    // return (
    //     <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#171717" }} id="navbardiatas">
    //         <div className="container text-center">
    //             <Link to="/" className="navbar-brand mx-auto">
    //                 <img 
    //                     className="img-responsive" 
    //                     style={{ marginLeft: "20px" }} 
    //                     src="/img/logortmbaharu2.png" 
    //                     alt="Logo RTM"
    //                 />
    //             </Link>
    
    //             <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbaratas" aria-controls="navbaratas" aria-expanded="false" aria-label="Toggle navigation">
    //                 <span className="navbar-toggler-icon"></span>
    //             </button>
    
    //             <div className="collapse navbar-collapse justify-content-center" id="navbaratas">
    //                 <ul className="navbar-nav">
    //                     {isLoading === false && menuItems()}
    //                 </ul>
    //             </div>
    
    //             <div className="d-flex justify-content-center mt-2">
    //                 <ul className="navbar-nav">
    //                     <li><a style={{ color: "white" }} href="https://www.tiktok.com/@radiotelevisyenmalaysia?" className="nav-link font-weight-bold text-uppercase"><img src="/img/tiktok-xxl.png" className="img-fluid" alt="TikTok Logo" /></a></li>
    //                     <li><a style={{ color: "white" }} href="https://x.com/rtm_malaysia?lang=en" className="nav-link font-weight-bold text-uppercase"><img src="/img/x.png" className="img-fluid" alt="X Logo" /></a></li>
    //                     <li><a style={{ color: "white" }} href="https://www.facebook.com/RadioTelevisyenMalaysia/?locale=ms_MY" className="nav-link font-weight-bold text-uppercase"><img src="/img/facebook.svg" className="img-fluid" alt="Facebook Logo" /></a></li>
    //                     <li><a style={{ color: "white" }} href="https://www.instagram.com/rtm_malaysia/" className="nav-link font-weight-bold text-uppercase"><img src="/img/instagram.svg" className="img-fluid" alt="Instagram Logo" /></a></li>
    //                     <li><a style={{ color: "white" }} href="https://www.youtube.com/channel/UCF4KdUqyxJ5Cb0NTGhZXt9g" className="nav-link font-weight-bold text-uppercase"><img src="/img/youtube.png" className="img-fluid" alt="YouTube Logo" /></a></li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </nav>
    // );
    
};

export default Menu1;
