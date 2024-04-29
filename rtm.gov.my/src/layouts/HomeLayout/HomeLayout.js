import React from 'react';
import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import BannerCarousel from './components/BannerCarousel';
import BannerProgramme from './components/BannerProgramme';
import Youtube from './components/Youtube';
import Footer from '../components/Footer';

const HomeLayout = () => {

    return (
        <>
            <Menu1 />
            <Menu2 />
            <BannerCarousel />
            <BannerProgramme />
            <Youtube />
            <Footer />
        </>
    );
};
export default HomeLayout;