import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadFooter from './LoadFooter';

const Footer = () => {
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [footerID, setFooterID] = useState();
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        axios(`${url}/home-footer`)
            .then((response) => {
                setFooterID(response.data.id);
            })
            .catch(error => {
                console.warn(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <footer className="footer">
            <div className="container bottom_border" style={{ marginTop: "20px" }}>
                <div className="row">

                    <div className="col-sm-6 col-md-3 d-md-block d-none">
                        <ul className="footer_ul_amrc">
                            <li><a href="https://www.jdn.gov.my"><img className="img-fluid" src="/asset/footer/jdn.jpg" alt="Mampu Logo" /></a></li>
                            <li><a href="https://www.malaysia.gov.my/portal/index"><img className="img-fluid" src="/asset/footer/mygov2.png" alt="MyGov Logo" /></a></li>
                            <li><a href="#"><img className="img-fluid" src="/asset/footer/ksn2.png" alt="KSN Logo" /></a></li>
                            <li><a href="#"><img className="img-fluid" src="/asset/footer/msc-white.png" alt="MSC Logo" /></a></li>
                        </ul>
                    </div>


                    {/* Conditionally render LoadFooter if footerID is available */}
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        footerID && <LoadFooter id={footerID} />
                    )}

                    <div className="col-sm-6 col-md-3 col-12 col">
                        <p className="mb10">Radio Televisyen Malaysia<br />
                            Angkasapuri Kota Media<br />
                            50614 Kuala Lumpur</p>
                        <p>aduan [at] rtm.gov.my </p>
                        <p> Tel: 03 - 2282 5333 </p>
                        <p> Faks: 03 - 2284 7591 </p>
                    </div>

                    <div className="col-sm-6 col-md-3 col-12 col">
                        <ul className="footer_ul_amrc">
                            <li><a href="https://apps.apple.com/my/app/rtmklik/id777391399"><img className="img-fluid" src="/asset/footer/apps.png" alt="Apple App Store Logo" /></a></li>
                            <li><a href="https://play.google.com/store/apps/details?id=my.gov.rtm.mobile"><img className="img-fluid" src="/asset/footer/googleplay-bm.png" alt="Google Play Store Logo" /></a></li>
                            <li><a href="https://appgallery.huawei.com/app/C101841473"><img className="img-fluid" src="/asset/footer/huawei_appsgaleryedit1.png" alt="Huawei AppGallery Logo" /></a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                        <p style={{ marginTop: "0.5rem" }}>Hak Cipta Terpelihara @ {new Date().getFullYear()} RADIO TELEVISYEN MALAYSIA</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
