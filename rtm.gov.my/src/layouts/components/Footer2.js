import React from 'react';
import LoadFooter from './LoadFooter';

const Footer2 = () => {
    return (
        <footer className="footer">
            <div className="container bottom_border" style={{ marginTop: "20px" }}>
                <div className='row'>
                    <div className='col'>
                        <LoadFooter id={65} />
                    </div>
                    <div className='col'>
                        <p className="mb10">Radio Televisyen Malaysia<br />
                            Angkasapuri Kota Media<br />
                            50614 Kuala Lumpur</p>
                        <p>aduan [at] rtm.gov.my </p>
                        <p> Tel: 03 - 2282 5333 </p>
                        <p> Faks: 03 - 2284 7591 </p>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col ml-3'>
                        <ul className="footer_ul_amrc">
                            <li><a href="http://www.mampu.gov.my/ms/"><img className="img-fluid" src="/asset/footer/mampu.png" alt="Mampu Logo" /></a></li>
                            <li><a href="https://www.malaysia.gov.my/portal/index"><img className="img-fluid" src="/asset/footer/mygov2.png" alt="MyGov Logo" /></a></li>
                            <li><a href="#"><img className="img-fluid" src="/asset/footer/ksn2.png" alt="KSN Logo" /></a></li>
                            <li><a href="#"><img className="img-fluid" src="/asset/footer/msc-white.png" alt="MSC Logo" /></a></li>
                        </ul>
                    </div>
                    <div className='col'>

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

export default Footer2;
