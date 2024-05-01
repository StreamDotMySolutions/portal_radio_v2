import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadMenu from './LoadMenu';
import { Link } from 'react-router-dom';

const Menu3 = () => {
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        axios(`${url}/home-menu`)
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
        return items.map((item, index) => (
            <span key={index}>
                <LoadMenu id={item.id}/>
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
                            {isLoading === false } {menuItems()}
                        </ul>
                    </div>
                    <div className='col'>
                        <ul className="navbar-nav mx-auto">

                            <li className="nav-item d-none d-md-block">
                                <a className="nav-link" href="#">UTAMA</a>
                            </li>

                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownTV" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    TV
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownTV" style={{ marginTop: "-10px" }}>
                                    <a className="dropdown-item" href="#">TV1</a>
                                    <a className="dropdown-item" href="#">TV2</a>
                                    <a className="dropdown-item" href="#">TV OKEY</a>
                                </div>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">RADIO</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">PENCAPAIAN</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">AKTIVITI</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">RATE CARD RTM</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">GALERI</a>
                            </li>

                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownDir" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    DIREKTORI
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownDir" style={{ marginTop: "-10px" }}>
                                    <a className="dropdown-item" href="#">DIREKTORI ANGKASAPURI</a>
                                    <a className="dropdown-item" href="#">DIREKTORI NEGERI</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr />
             

                <div className='row ml-auto'>
                        <a style={{ color: "white" }} href="https://www.tiktok.com/@radiotelevisyenmalaysia?" className="nav-link font-weight-bold text-uppercase"><img src="/img/tiktok-xxl.png" className="img-fluid" alt="TikTok Logo" /></a>
                        <a style={{ color: "white" }} href="https://twitter.com/rtm_malaysia?lang=en" className="nav-link font-weight-bold text-uppercase"><img src="/img/twitter.svg" className="img-fluid" alt="Twitter Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.facebook.com/RadioTelevisyenMalaysia/?locale=ms_MY" className="nav-link font-weight-bold text-uppercase"><img src="/img/facebook.svg" className="img-fluid" alt="Facebook Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.instagram.com/rtm_malaysia/" className="nav-link font-weight-bold text-uppercase"><img src="/img/instagram.svg" className="img-fluid" alt="Instagram Logo" /></a>
                        <a style={{ color: "white" }} href="https://www.youtube.com/channel/UCF4KdUqyxJ5Cb0NTGhZXt9g" className="nav-link font-weight-bold text-uppercase"><img src="/img/youtube.png" className="img-fluid" alt="YouTube Logo" /></a>  
                </div>
                
   
            </div>
        </nav>
    );
};

export default Menu3;
