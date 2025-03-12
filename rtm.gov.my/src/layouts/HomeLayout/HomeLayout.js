import React from 'react';
import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import Menu3 from '../components/Menu3';
import BannerCarousel from './components/BannerCarousel';
import BannerProgramme from './components/BannerProgramme';
import BannerProgramme2 from './components/BannerProgramme2';

import Footer from '../components/Footer';
import Footer2 from '../components/Footer2';

import DesktopVideo from './components/DesktopVideo';
import MobileVideo from './components/Youtube3';


const HomeLayout = () => {

    return (
        <>
            <div className="d-none d-md-block" id="menu-desktop">
                <Menu1 />
                <Menu2 />
            </div>
            
            <div className="d-md-none" id="menu-mobile">
                <Menu3 />
            </div>
       
            <BannerCarousel />
              

            <div className="d-none d-md-block" id="banner-desktop">
                <BannerProgramme />
            </div>
            
            <div className="d-md-none" id="banner-mobile">
                <BannerProgramme2 />
            </div>

            <div className="d-none d-md-block" id="video-desktop">
                <DesktopVideo />
            </div>

            <div className="d-md-none" id="video-mobile">
               <MobileVideo />
            </div>

            <div className="d-none d-md-block" id="footer-desktop">
                <Footer />
            </div>
            
            <div className="d-md-none" id="footer-mobile">
                <Footer2 />
            </div>
        </>
    );
};
export default HomeLayout;