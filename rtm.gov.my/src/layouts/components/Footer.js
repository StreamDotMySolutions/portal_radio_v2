import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadFooter from './LoadFooter';

const Footer = ({ variant = 'desktop' }) => {
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

    const copyright = (
        <div className="container">
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                    <p className="mt-2">Hak Cipta Terpelihara @ {new Date().getFullYear()} RADIO TELEVISYEN MALAYSIA</p>
                </div>
            </div>
        </div>
    );

    if (variant === 'mobile') {
        return (
            <footer className="footer">
                <div className="container bottom_border mt-3">
                    <div className="row justify-content-center ">
                        <div className="col-6">
                            {footerID && <LoadFooter id={footerID} />}
                        </div>
                        <div className="col-6">
                            <ul className="footer-contact mb10">
                                <li><span><i className="fa-solid fa-building"></i></span><span>Radio Televisyen Malaysia · Angkasapuri Kota Media · 50614 Kuala Lumpur</span></li>
                                <li><span><i className="fa-solid fa-envelope"></i></span><span>aduan [at] rtm.gov.my</span></li>
                                <li><span><i className="fa-solid fa-phone"></i></span><span>Tel: 03 - 2282 5333</span></li>
                                <li><span><i className="fa-solid fa-fax"></i></span><span>Faks: 03 - 2284 7591</span></li>
                            </ul>
                        </div>
                    </div>
                    <hr />
                    <div className="row justify-content-center ">
                        <div className="col-6">
                            <ul className="footer_ul_amrc">
                                <li><a href="https://www.jdn.gov.my"><img className="img-fluid" src="/asset/footer/jdn.jpg" alt="JDN Logo" /></a></li>
                                <li><a href="https://www.malaysia.gov.my/portal/index"><img className="img-fluid" src="/asset/footer/mygov2.png" alt="MyGov Logo" /></a></li>
                                <li><a href="https://www.ksn.gov.my"><img className="img-fluid" src="/asset/footer/ksn2.png" alt="KSN Logo" /></a></li>
                                <li><a href="https://mdec.my/malaysiadigital"><img className="img-fluid" src="/asset/footer/msc-white.png" alt="MSC Logo" /></a></li>
                            </ul>
                        </div>
                        <div className="col-6">
                            <ul className="footer_ul_amrc">
                                <li><a href="https://apps.apple.com/my/app/rtmklik/id777391399"><img className="img-fluid" src="/asset/footer/apps.png" alt="Apple App Store Logo" /></a></li>
                                <li><a href="https://play.google.com/store/apps/details?id=my.gov.rtm.mobile"><img className="img-fluid" src="/asset/footer/googleplay-bm.png" alt="Google Play Store Logo" /></a></li>
                                <li><a href="https://appgallery.huawei.com/app/C101841473"><img className="img-fluid" src="/asset/footer/huawei_appsgaleryedit1.png" alt="Huawei AppGallery Logo" /></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {copyright}
            </footer>
        );
    }

    return (
        <footer className="footer">
            <div className="container bottom_border mt-3">
                <div className="row justify-content-center align-items-start text-md-start">
                    <div className="col-sm-6 col-md-3 d-md-block d-none text-md-start ">
                        <ul className="footer_ul_amrc">
                            <li><a href="https://www.jdn.gov.my"><img className="img-fluid" src="/asset/footer/jdn.jpg" alt="JDN Logo" /></a></li>
                            <li><a href="https://www.mygovuc.gov.my"><img className="img-fluid" src="/asset/footer/mygov2.png" alt="MyGov Logo" /></a></li>
                            <li><a href="https://www.ksn.gov.my"><img className="img-fluid" src="/asset/footer/ksn2.png" alt="KSN Logo" /></a></li>
                            <li><a href="https://mdec.my/malaysiadigital"><img className="img-fluid" src="/asset/footer/msc-white.png" alt="MSC Logo" /></a></li>
                        </ul>
                    </div>

                    <div className="col-sm-6 col-md-3 text-md-start ">
                        {footerID && <LoadFooter id={footerID} />}
                    </div>

                    <div className="col-sm-6 col-md-3 text-md-start ">
                        <ul className="footer-contact mb10">
                            <li><span><i className="fa-solid fa-building"></i></span><span>Radio Televisyen Malaysia · Angkasapuri Kota Media · 50614 Kuala Lumpur</span></li>
                            <li><span><i className="fa-solid fa-envelope"></i></span><span>aduan [at] rtm.gov.my</span></li>
                            <li><span><i className="fa-solid fa-phone"></i></span><span>Tel: 03 - 2282 5333</span></li>
                            <li><span><i className="fa-solid fa-fax"></i></span><span>Faks: 03 - 2284 7591</span></li>
                        </ul>
                    </div>

                    <div className="col-sm-6 col-md-3 ">
                        <ul className="footer_ul_amrc">
                            <li><a href="https://apps.apple.com/my/app/rtmklik/id777391399"><img className="img-fluid" src="/asset/footer/apps.png" alt="Apple App Store Logo" /></a></li>
                            <li><a href="https://play.google.com/store/apps/details?id=my.gov.rtm.mobile"><img className="img-fluid" src="/asset/footer/googleplay-bm.png" alt="Google Play Store Logo" /></a></li>
                            <li><a href="https://appgallery.huawei.com/app/C101841473"><img className="img-fluid" src="/asset/footer/huawei_appsgaleryedit1.png" alt="Huawei AppGallery Logo" /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            {copyright}
        </footer>
    );
};

export default Footer;
