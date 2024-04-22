import React from 'react';
import { Col,Container} from 'react-bootstrap';
import { Menu1, Menu2 } from './components/Menu';
import HomeBanner from './components/HomeBanner';
import HomeProgramme from './components/HomeProgramme';
import HomeVideo from './components/HomeVideo';
import HomeFooter from './components/HomeFooter';

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
                   <HomeFooter />
                </Col>
            </Container>
        </>
    );
};
export default HomeLayout;