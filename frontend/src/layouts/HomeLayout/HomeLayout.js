import React from 'react';
import { Outlet } from 'react-router-dom';
import { Col,Container,Row,Carausel,Image, Placeholder } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { Menu1, Menu2 } from './components/Menu';
import HomeBanner from './components/HomeBanner';
import HomeProgramme from './components/HomeProgramme';
import HomeVideo from './components/HomeVideo';

const HomeLayout = () => {

    
    return (
        <>
            <Menu1 />
            <Container > 
                <Col className="border border-1 rounded">
                    <Menu2 />
                </Col>

                <Col  style={{'minHeight': '10px'}}></Col>

                <HomeBanner />
                
                <Col style={{'minHeight': '20px'}}></Col>
                
                <HomeProgramme />

                <Col  style={{'minHeight': '10px'}}></Col>
                
                <Col className="border border-1" style={{'minHeight': '300px'}}>
               
                <HomeVideo />
                
                </Col>

                
                <Col  style={{'minHeight': '20px'}}></Col>

                <Col className="border border-1" style={{'minHeight': '300px'}}>
                    <Row>

                        <Col className='m-2 text-center'>
                            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
                            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
                            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
                            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
                        </Col>
                        <Col className='m-2'>
                        <ul style={{'list-style-type':'none'}}>
                            <li>List 1</li>
                            <li>List 2</li>
                            <li>List 3</li>
                            <li>List 4</li>
                            <li>List 5</li>
                        </ul>

                        </Col>
                        <Col className='m-2'>
                        <span>
                            Radio Televisyen Malaysia <br />
                            Angkasapuri Kota Media <br />
                            50614 Kuala Lumpur <br />
                            <br />
                            aduan [at] rtm.gov.my<br />
                            Tel: 03 - 2282 5333<br />
                            Faks: 03 - 2284 7591<br />
                        </span>
                        </Col>

                        <Col className='m-2 text-center'>
                            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
                            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
                            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
                            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
                
                        </Col>
                    </Row>
                    
                </Col>
            </Container>
        </>
    );
};

export default HomeLayout;