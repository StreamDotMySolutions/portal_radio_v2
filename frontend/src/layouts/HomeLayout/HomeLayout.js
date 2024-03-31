import React from 'react';
import { Outlet } from 'react-router-dom';
import { Col,Container, Row } from 'react-bootstrap';
import { Menu1, Menu2 } from './components/Menu';

const HomeLayout = () => {
    return (
        <>
            <Menu1 />
            <Container > 
                <Col className="border border-1">
                    <Menu2 />
                </Col>

                <Col  style={{'minHeight': '10px'}}>
                </Col>
                
                <Col className="border border-1" style={{'minHeight': '600px'}}>
                    <Outlet />
                </Col>
                <Col  style={{'minHeight': '20px'}}>
                </Col>

                <Col className="border border-1" style={{'minHeight': '200px'}}>
                    <Row>

                        <Col className='m-2'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Col>
                        <Col className='m-2'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Col>
                        <Col className='m-2'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Col>

                    </Row>
             
                </Col>
                
            </Container>
        </>
    );
};

export default HomeLayout;