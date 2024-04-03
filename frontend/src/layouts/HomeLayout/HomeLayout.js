import React from 'react';
import { Outlet } from 'react-router-dom';
import { Col,Container,Row,Carausel,Image } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { Menu1, Menu2 } from './components/Menu';

const HomeLayout = () => {

    const images = [];
    for (let i = 0; i < 8; i++) {
        images.push(
            <li key={i} style={{ display: 'inline-block', marginRight: '10px' }}>
                <Image
                    className="d-block rounded"
                    src="https://via.placeholder.com/150x100"
                    alt={`Slide ${i + 1}`}
                />
            </li>
        );
    }
    
    return (
        <>
            <Menu1 />
            <Container > 
                <Col className="border border-1 rounded">
                    <Menu2 />
                </Col>

                <Col  style={{'minHeight': '10px'}}></Col>

                <Carousel>
                    <Carousel.Item>
                        <Image
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x400" // Placeholder image URL
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x400" // Placeholder image URL
                            alt="Second slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x400" // Placeholder image URL
                            alt="Third slide"
                        />
                    </Carousel.Item>
                </Carousel>
                <Col style={{'minHeight': '20px'}}></Col>
                
                <Col>
                    <ul className='text-center' style={{ listStyleType: 'none', padding: 0 }}>
                        {images}
                    </ul>
                </Col>

                <Col  style={{'minHeight': '10px'}}></Col>
                
                <Col className="border border-1" style={{'minHeight': '300px'}}>
                    {/* <Outlet /> */}
                    <Row>
                        <Col className='bg-secondary m-4 rounded ' style={{'minHeight': '300px'}}></Col>
                        <Col className='bg-secondary m-4 rounded'  style={{'minHeight': '300px'}}></Col>
                        <Col className='bg-secondary m-4 rounded'  style={{'minHeight': '300px'}}></Col>
                        <Col className='bg-secondary m-4 rounded'  style={{'minHeight': '300px'}}></Col>
                    </Row>
                
                </Col>
                <Col  style={{'minHeight': '20px'}}></Col>

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