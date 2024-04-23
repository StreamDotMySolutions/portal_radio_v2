import React from 'react';
import { Col, Row } from 'react-bootstrap';
import VideoBox from './VideoBox';

const Youtube = () => {
    return (
        <>
        <div className="container-fluid" style={{ padding: '50px', background: 'linear-gradient(180deg, #103875 0%, #2f57ce 100%)' }}>
        <Row>
            <Col className='col-12 col-md-3 mb-4'><VideoBox modal="1" videoSrc="https://www.youtube.com/embed/9JviWN280sQ?autoplay=1&mute=1&playsinline=1&playlist=9JviWN280sQ&loop=1&controls=0&disablekb=1&showinfo=0" /></Col>
            <Col className='col-12 col-md-3 mb-4'><VideoBox modal="2" videoSrc="https://www.youtube.com/embed/xr4P6mvpCQc?autoplay=1&mute=1&playsinline=1&playlist=xr4P6mvpCQc&loop=1&controls=0&disablekb=1&showinfo=0" /></Col>
            <Col className='col-12 col-md-3 mb-4'><VideoBox modal="3" videoSrc="https://www.youtube.com/embed/Pm5Aoppsq9E?autoplay=1&mute=1&playsinline=1&playlist=Pm5Aoppsq9E&loop=1&controls=0&disablekb=1&showinfo=0" /></Col>
            <Col className='col-12 col-md-3 mb-4'><VideoBox modal="4" videoSrc="https://www.youtube.com/embed/x-JLzHEimFc?autoplay=1&mute=1&playsinline=1&playlist=x-JLzHEimFc&loop=1&controls=0&disablekb=1&showinfo=0" /></Col>
        </Row>
        </div>
        </>
    );
};

export default Youtube;