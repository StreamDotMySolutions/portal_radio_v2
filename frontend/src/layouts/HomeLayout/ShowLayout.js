import React from 'react';
import { Outlet } from 'react-router-dom';
import { Col,Container } from 'react-bootstrap';
import { Menu1, Menu2 } from './components/Menu';

const HomeLayout = () => {
    return (
        <>
            <Menu1 />
            <Container className=''> 
                <Col className="border border-1">
                    <Menu2 />
                </Col>
                
                <Outlet />

                <Col className="border border-1">
                    Footer
                </Col>
                
            </Container>
        </>
    );
};

export default HomeLayout;