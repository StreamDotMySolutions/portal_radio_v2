import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PosterHolder from './ContentCreator/PosterHolder';
import DescriptionHolder from './ContentCreator/DescriptionHolder';
import ContentHolder from './ContentCreator/ContentHolder';
import SettingHolder from './ContentCreator/SettingHolder';
import './App.css'

const ContentCreator = () => {
    return (
        <Container>

            <Row>
                <Col>
                    <SettingHolder />
                </Col>
            </Row>
                
            <Row className='mt-2'>
          
                <Col xs={4} >
                    <PosterHolder />
                </Col>
                <Col xs={8}>
                    <DescriptionHolder />
                </Col>
            </Row>

            <Row className='mt-2'>
                <Col xs={12}>
                    <ContentHolder />
                </Col>
            </Row>
        </Container>
    );
};

export default ContentCreator;