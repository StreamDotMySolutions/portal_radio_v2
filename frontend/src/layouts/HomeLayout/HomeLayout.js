import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Container } from 'react-bootstrap';

const HomeLayout = () => {
    return (
        <>
            <NavBar />
            <Container>  
                <Outlet />
            </Container>
        </>
    );
};

export default HomeLayout;