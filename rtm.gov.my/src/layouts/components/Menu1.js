import React from 'react';
import LoadMenu from './LoadMenu';
import { Link } from 'react-router-dom';

const Menu1 = () => {
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

                <ul className="navbar-nav ml-auto">
                    <LoadMenu id={51}/>
                    <LoadMenu id={52}/>
                    <LoadMenu id={53}/>
                    <LoadMenu id={54}/>
                    <LoadMenu id={55}/>
                </ul>

                {/* <div className='row ml-auto'>
                        <a style={{ color: "white" }} href="https://www.tiktok.com/@radiotelevisyenmalaysia?" className="nav-link font-weight-bold text-uppercase"><img src="/img/tiktok-xxl.png" className="img-fluid" alt="TikTok Logo" /></a>
                        <a style={{ color: "white" }} href="https://twitter.com/rtm_malaysia?lang=en" className="nav-link font-weight-bold text-uppercase"><img src="/img/twitter.svg" className="img-fluid" alt="Twitter Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.facebook.com/RadioTelevisyenMalaysia/?locale=ms_MY" className="nav-link font-weight-bold text-uppercase"><img src="/img/facebook.svg" className="img-fluid" alt="Facebook Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.instagram.com/rtm_malaysia/" className="nav-link font-weight-bold text-uppercase"><img src="/img/instagram.svg" className="img-fluid" alt="Instagram Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.youtube.com/channel/UCF4KdUqyxJ5Cb0NTGhZXt9g" className="nav-link font-weight-bold text-uppercase"><img src="/img/youtube.png" className="img-fluid" alt="YouTube Logo" /></a>  
                </div> */}
                
                <ul className="navbar-nav ml-auto">
                    <li><a style={{ color: "white" }} href="https://www.tiktok.com/@radiotelevisyenmalaysia?" className="nav-link font-weight-bold text-uppercase"><img src="/img/tiktok-xxl.png" className="img-fluid" alt="TikTok Logo" /></a></li>
                    <li><a style={{ color: "white" }} href="https://twitter.com/rtm_malaysia?lang=en" className="nav-link font-weight-bold text-uppercase"><img src="/img/twitter.svg" className="img-fluid" alt="Twitter Logo" /></a></li>
                    <li><a style={{ color: "white" }} href="https://www.facebook.com/RadioTelevisyenMalaysia/?locale=ms_MY" className="nav-link font-weight-bold text-uppercase"><img src="/img/facebook.svg" className="img-fluid" alt="Facebook Logo" /></a></li>
                    <li><a style={{ color: "white" }} href="https://www.instagram.com/rtm_malaysia/" className="nav-link font-weight-bold text-uppercase"><img src="/img/instagram.svg" className="img-fluid" alt="Instagram Logo" /></a></li>
                    <li><a style={{ color: "white" }} href="https://www.youtube.com/channel/UCF4KdUqyxJ5Cb0NTGhZXt9g" className="nav-link font-weight-bold text-uppercase"><img src="/img/youtube.png" className="img-fluid" alt="YouTube Logo" /></a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Menu1;
