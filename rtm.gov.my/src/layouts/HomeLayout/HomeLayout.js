import React, { useEffect } from 'react';
import { trackEvent } from '../../libs/analytics';
import SiteSearch from '../components/SiteSearch';

import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import MenuMobile from '../components/Menu3';

import BannerCarousel from './components/BannerCarousel';

import BannerProgrammeDesktop from './components/BannerProgramme';
import BannerProgrammeMobile from './components/BannerProgramme2';

import FooterDesktop from '../components/Footer';
import FooterMobile from '../components/Footer2';

import DesktopVideo from './components/DesktopVideo';
import MobileVideo from './components/MobileVideo';
import SimpleCarousel from './components/SimpleCarausel';
import MenuBar from '../components/MenuBar';


const HomeLayout = () => {

    useEffect(() => {
        trackEvent('pageview', 'home');
    }, []);

    return (
        <>
            <div className="d-none d-md-block" id="menu-desktop">
                <Menu1 />
                <Menu2 />
                {/* <MenuBar /> */}
            </div>

            <div className="d-md-none" id="menu-mobile">
                <MenuMobile />
            </div>

            <SiteSearch />

            <BannerCarousel />

            {/* <SimpleCarousel /> */}
              

            <div className="d-none d-md-block" id="banner-desktop">
                <BannerProgrammeDesktop />
            </div>
            
            <div className="d-md-none" id="banner-mobile">
                <BannerProgrammeMobile />
            </div>

            <div className="d-none d-md-block" id="video-desktop">
                <DesktopVideo />
            </div>

            <div className="d-md-none" id="video-mobile">
               <MobileVideo />
            </div>

            <div className="d-none d-md-block" id="footer-desktop">
                <FooterDesktop />
            </div>
            
            <div className="d-md-none" id="footer-mobile">
                <FooterMobile />
            </div>
        </>
    );
};
export default HomeLayout;