import React from 'react';
import Menu1 from './components/Menu1';
import Menu2 from './components/Menu2';
import PageContainer from './components/PageContainer';
import Footer from './components/footer';
import BannerCarousel from './components/BannerCarousel';
import BannerProgramme from './components/BannerProgramme';
import Youtube from './components/Youtube';

const HomeLayout = () => {

    return (
        <>
            <Menu1 />
            <Menu2 />
            <BannerCarousel />
            <BannerProgramme />
            {/* <PageContainer /> */}
            <Youtube />
            <Footer />
        </>
    );
};
export default HomeLayout;