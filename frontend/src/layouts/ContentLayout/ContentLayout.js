import { Outlet} from 'react-router-dom'
import React from 'react';
import { Col,Container} from 'react-bootstrap';
import { Menu1, Menu2 } from '../HomeLayout/components/Menu';
import HomeFooter from '../HomeLayout/components/HomeFooter';

const ContentLayout = () => {

    return (
        <>
            <Menu1 />
            <Container > 
                <Col className="border border-1 rounded">
                    <Menu2 />
                </Col>
                <Col  style={{'minHeight': '10px'}}></Col>

                <Col className="border border-1 p-2" style={{'minHeight': '500px'}}>
                    <Outlet />
                </Col>
               
                <Col  style={{'minHeight': '20px'}}></Col>

                <Col className="border border-1" style={{'minHeight': '300px'}}>
                   <HomeFooter />
                </Col>
            </Container>
        </>
    );
};
export default ContentLayout;