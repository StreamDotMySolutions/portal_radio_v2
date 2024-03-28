import React from 'react';
import { Button,Nav,Row,Col,Badge } from 'react-bootstrap'
import { NavLink} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useAuthStore from '../../pages/Auth/stores/AuthStore';

const Account = () => {

    const store = useAuthStore()

    return (
        <>
        <Nav className='ms-auto'>
                {/* <Button variant="light border border-1 me-2">
                    Message <Badge bg="secondary">9</Badge>
                    <span className="visually-hidden">unread messages</span>
                </Button> */}
            
            <Nav.Link className='border border-1 ' as={NavLink} to="/account"> <FontAwesomeIcon icon="fa-solid fa-lock" />{' '}{store.user?.email}</Nav.Link>
        </Nav>
            
        <Nav>
            <Nav.Link as={NavLink} to="/sign-out"  className='active fs-4'> <FontAwesomeIcon icon="fa-solid fa-sign-out" /></Nav.Link>
        </Nav>
        </>
   
    );
};

export default Account;