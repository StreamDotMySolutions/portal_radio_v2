import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink,Link } from 'react-router-dom';
import LoadMenu3 from './LoadMenu3';

const Menu3 = () => {
    const url = process.env.REACT_APP_API_URL;
    const [items, setItems] = useState([]);
    const [menu1Items, setMenu1Items] = useState([]);
    const [menu2Items, setMenu2Items] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        axios(`${url}/home-menu-1`)
            .then((response) => {
                //console.log(response)
                setMenu1Items(response.data.items);
            }).catch( error => {
                console.warn(error)
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);

    const menuItems1 = () => {
        return menu1Items.map((item, index) => (
            <span key={index}>
                <LoadMenu3 id={item.id}/>
            </span>
        ));
    };

    useEffect(() => {
        axios(`${url}/home-menu-2`)
            .then((response) => {
                //console.log(response)
                setMenu2Items(response.data.items);
            }).catch( error => {
                console.warn(error)
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);


    // 1. check ArticleSetting.active
    // 2. check ArticleSetting.listing_type
    const menuItems2 = () => {
        return menu2Items.map((item, index) => {
            //console.log(item)
            if(item.article_setting  && item.article_setting.active == 1 ){

           

                if (item.descendants && item.descendants.length > 0) {

                    if(item.article_setting.listing_type != 'single_article'){

                        return (
                            <>
                                <NavLink to={`/listings/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                                
                            </>
                        )
                    }

                    return (
                        <li key={index} className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id={`navbarDropdown${item.title}`} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {item.title}
                            </a>
                            <div className="dropdown-menu" aria-labelledby={`navbarDropdown${item.title}`} style={{ marginTop: "-10px" }}>
                                {item.descendants.map((descendant, idx) => (
                                    <>
                                    {descendant.article_setting && descendant.article_setting.redirect_url ? (
                                        <NavLink key={idx} to={descendant.article_setting.redirect_url} className="nav-link ml-3">
                                            {descendant.title}
                                        </NavLink>
                                        ) : (
                                        <>
                                        {descendant.article_setting && descendant.article_setting.listing_type == 'single_article' ?
                                            <NavLink key={idx}  to={`/listings/${descendant.id}`} className="nav-link">
                                                {descendant.title}
                                            </NavLink>
                                            :
                                            <NavLink key={idx}  to={`/listings/${descendant.id}`} className="nav-link">
                                                {descendant.title}
                                            </NavLink>
                                        }    
                                        </>
                                      
                                    )}
                                    </>
                                ))}
                            </div>
                        </li>
                    );
                } else {
                    return (
                        <li key={index} className="nav-item">
                      
                            {item.article_setting && item.article_setting.redirect_url ? (
                                <NavLink to={item.article_setting.redirect_url} className="nav-link">
                                    {item.title}
                                </NavLink>
                                ) : (
                                // <NavLink to={`/contents/${item.id}`} className="nav-link">
                                //     {item.title}
                                // </NavLink>
                                <>
                                {item.article_setting && item.article_setting.listing_type == 'single_article' ?
                                <NavLink to={`/listings/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                                :
                                <NavLink to={`/listings/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                                }
                                </>
                              
                            )}
    
                        </li>
                    );
                }

            } // active.check
            
        });
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#171717" }} id="navbardiatas">
            <Link to="/" className="navbar-brand">
                <img 
                    className="img-responsive" 
                    style={{ marginLeft: "20px" }} 
                    src="/img/logortmbaharu2.png" 
                    alt="Logo"
                />
            </Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbaratas" aria-controls="navbaratas" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbaratas">

                <div className='row'>
                    <div className='col'>
                        <ul className="navbar-nav ml-auto">
                            {isLoading === false } {menuItems1()}
                        </ul>
                    </div>
                    <div className='col'>
                        <ul className="navbar-nav mx-auto">
                            {isLoading === false } {menuItems2()}
                        </ul>
                    </div>
                </div>
                <hr />
             

                {/* <div className='row ml-auto'> */}
                <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
                        <a style={{ color: "white" }} href="https://www.tiktok.com/@radiotelevisyenmalaysia?" className="nav-link font-weight-bold text-uppercase"><img src="/img/tiktok-xxl.png" className="img-fluid" alt="TikTok Logo" /></a>
                        <a style={{ color: "white" }} href="https://x.com/rtm_malaysia?lang=en" className="nav-link font-weight-bold text-uppercase"><img src="/img/x.png" className="img-fluid" alt="Twitter Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.facebook.com/RadioTelevisyenMalaysia/?locale=ms_MY" className="nav-link font-weight-bold text-uppercase"><img src="/img/facebook.svg" className="img-fluid" alt="Facebook Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.instagram.com/rtm_malaysia/" className="nav-link font-weight-bold text-uppercase"><img src="/img/instagram.svg" className="img-fluid" alt="Instagram Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.youtube.com/channel/UCF4KdUqyxJ5Cb0NTGhZXt9g" className="nav-link font-weight-bold text-uppercase"><img src="/img/youtube.png" className="img-fluid" alt="YouTube Logo" /></a>  
                </div>
                
   
            </div>
        </nav>
    );
};

export default Menu3;
