import React from 'react';
import Menu1 from './components/Menu1';
import Menu2 from './components/Menu2';
import PageContainer from './components/PageContainer';
import Footer from './components/footer';

const HomeLayout = () => {

    return (
        <>
            <Menu1 />
            <Menu2 />
            <PageContainer />
            <Footer />
        </>
    );
};
export default HomeLayout;