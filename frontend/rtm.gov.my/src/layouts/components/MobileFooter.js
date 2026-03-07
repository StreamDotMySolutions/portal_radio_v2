import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadFooter from './LoadFooter';
import SocialLinks from './SocialLinks';

const MobileFooter = () => {
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
        <footer className="footer" style={{ padding: '30px 20px 20px' }}>

            {/* Footer links */}
            {footerID && (
                <div className="text-center mb-4">
                    <LoadFooter id={footerID} />
                </div>
            )}

            <hr style={{ borderColor: '#323f45' }} />

            {/* Contact info */}
            <div className="text-center mb-4">
                <ul className="footer-contact" style={{ display: 'inline-block', textAlign: 'left' }}>
                    <li>
                        <span><i className="fa-solid fa-building"></i></span>
                        <span>Radio Televisyen Malaysia<br />Angkasapuri Kota Media<br />50614 Kuala Lumpur</span>
                    </li>
                    <li>
                        <span><i className="fa-solid fa-envelope"></i></span>
                        <span>aduan [at] rtm.gov.my</span>
                    </li>
                    <li>
                        <span><i className="fa-solid fa-phone"></i></span>
                        <span>03 - 2282 5333</span>
                    </li>
                    <li>
                        <span><i className="fa-solid fa-fax"></i></span>
                        <span>03 - 2284 7591</span>
                    </li>
                </ul>
            </div>

            <hr style={{ borderColor: '#323f45' }} />

            {/* Partner logos */}
            <div className="d-flex justify-content-center align-items-center flex-wrap mb-4" style={{ gap: '16px' }}>
                <a href="https://www.jdn.gov.my"><img src="/asset/footer/jdn.jpg" alt="JDN" style={{ height: '32px' }} /></a>
                <a href="https://www.malaysia.gov.my/portal/index"><img src="/asset/footer/mygov2.png" alt="MyGov" style={{ height: '32px' }} /></a>
                <a href="https://www.ksn.gov.my"><img src="/asset/footer/ksn2.png" alt="KSN" style={{ height: '32px' }} /></a>
                <a href="https://mdec.my/malaysiadigital"><img src="/asset/footer/msc-white.png" alt="MSC" style={{ height: '32px' }} /></a>
            </div>

            {/* App store badges */}
            <div className="d-flex justify-content-center align-items-center flex-wrap mb-4" style={{ gap: '10px' }}>
                <a href="https://apps.apple.com/my/app/rtmklik/id777391399"><img src="/asset/footer/apps.png" alt="App Store" style={{ height: '36px' }} /></a>
                <a href="https://play.google.com/store/apps/details?id=my.gov.rtm.mobile"><img src="/asset/footer/googleplay-bm.png" alt="Google Play" style={{ height: '36px' }} /></a>
                <a href="https://appgallery.huawei.com/app/C101841473"><img src="/asset/footer/huawei_appsgaleryedit1.png" alt="AppGallery" style={{ height: '36px' }} /></a>
            </div>

            {/* Social links */}
            <div className="d-flex justify-content-center mb-4" style={{ gap: '12px' }}>
                <SocialLinks />
            </div>

            <hr style={{ borderColor: '#323f45' }} />

            {/* Copyright */}
            <p className="text-center text-muted mb-0" style={{ fontSize: '12px' }}>
                Hak Cipta Terpelihara @ {new Date().getFullYear()} RADIO TELEVISYEN MALAYSIA
            </p>
        </footer>
    );
};

export default MobileFooter;
