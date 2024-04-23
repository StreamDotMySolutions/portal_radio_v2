import React from 'react';

const Menu1 = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#171717" }} id="navbardiatas">
            <a className="navbar-brand" href="#"><img className="img-responsive" style={{ marginLeft: "20px" }} src="/img/logortmbaharu2.png" alt="Logo"/></a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbaratas" aria-controls="navbaratas" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbaratas">

                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" data-toggle="dropdown">
                            MENGENAI KAMI
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown" style={{ minWidth: "280px" }}>
                            <ul className="nav flex-column">
                                <li className="nav-item border-bottom">
                                    <a className="nav-link" href="#">Latar Belakang</a>
                                </li>
                                <li className="nav-item border-bottom">
                                    <a className="nav-link" href="#">Visi dan Misi</a>
                                </li>
                                <li className="nav-item border-bottom">
                                    <a className="nav-link" href="#">Logo RTM</a>
                                </li>
                                <li className="nav-item border-bottom">
                                    <a className="nav-link" href="#">Bahagian</a>
                                </li>
                                <li className="nav-item border-bottom">
                                    <a className="nav-link" href="#">Piagam Pelanggan</a>
                                </li>
                                <li className="nav-item border-bottom">
                                    <a className="nav-link" href="#">Prestasi Piagam Pelanggan</a>
                                </li>
                                <li className="nav-item border-bottom">
                                    <a className="nav-link" href="#">Mantan Ketua Pengarah</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Jabatan / Agensi</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">MAKLUMBALAS</a>
                    </li>
                </ul>


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
