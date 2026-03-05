import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadFooter from './LoadFooter';
import SocialLinks from './SocialLinks';

const Footer = () => {
    const url = process.env.REACT_APP_API_URL;
    const [footerID, setFooterID] = useState();

    useEffect(() => {
        axios(`${url}/home-footer`)
            .then((response) => {
                setFooterID(response.data.id);
            })
            .catch(error => {
                console.warn(error);
            });
    }, []);

    return (
        <footer className="footer">
            <div className="container mt-3" style={{ paddingBottom: '20px' }}>
                {/* Main 3-column content */}
                <div className="row align-items-start">
                    <div className="col-md-4">
                        {footerID && <LoadFooter id={footerID} />}
                    </div>

                    <div className="col-md-4">
                        <ul className="footer-contact mb10">
                            <li><span><i className="fa-solid fa-building"></i></span><span>Radio Televisyen Malaysia · Angkasapuri Kota Media · 50614 Kuala Lumpur</span></li>
                            <li><span><i className="fa-solid fa-envelope"></i></span><span>aduan [at] rtm.gov.my</span></li>
                            <li><span><i className="fa-solid fa-phone"></i></span><span>Tel: 03 - 2282 5333</span></li>
                            <li><span><i className="fa-solid fa-fax"></i></span><span>Faks: 03 - 2284 7591</span></li>
                        </ul>
                    </div>

                    <div className="col-md-4">
                        <div className="d-flex flex-wrap mb-3" style={{ gap: '10px' }}>
                            <a href="https://apps.apple.com/my/app/rtmklik/id777391399"><img src="/asset/footer/apps.png" alt="App Store" style={{ height: '34px' }} /></a>
                            <a href="https://play.google.com/store/apps/details?id=my.gov.rtm.mobile"><img src="/asset/footer/googleplay-bm.png" alt="Google Play" style={{ height: '34px' }} /></a>
                            <a href="https://appgallery.huawei.com/app/C101841473"><img src="/asset/footer/huawei_appsgaleryedit1.png" alt="AppGallery" style={{ height: '34px' }} /></a>
                        </div>
                    </div>
                </div>

                <hr style={{ borderColor: '#323f45' }} />

                {/* Bottom bar: partner logos, social links, copyright */}
                <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ gap: '16px' }}>
                    {/* Partner logos */}
                    <div className="d-flex align-items-center" style={{ gap: '16px' }}>
                        <a href="https://www.jdn.gov.my"><img src="/asset/footer/jdn.jpg" alt="JDN" style={{ height: '28px' }} /></a>
                        <a href="https://www.malaysia.gov.my/portal/index"><img src="/asset/footer/mygov2.png" alt="MyGov" style={{ height: '28px' }} /></a>
                        <a href="https://www.ksn.gov.my"><img src="/asset/footer/ksn2.png" alt="KSN" style={{ height: '28px' }} /></a>
                        <a href="https://mdec.my/malaysiadigital"><img src="/asset/footer/msc-white.png" alt="MSC" style={{ height: '28px' }} /></a>
                    </div>

                    {/* Social links */}
                    <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                        <SocialLinks />
                    </div>

                    {/* Copyright */}
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                        Hak Cipta Terpelihara @ {new Date().getFullYear()} RADIO TELEVISYEN MALAYSIA
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
