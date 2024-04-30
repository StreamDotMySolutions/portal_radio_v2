import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { NavLink, useLocation} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from './img/imohon.png'
import Account from '../Account';

function TopNavbar() {

  return (
    <Navbar fixed="top"  bg="light" data-bs-theme="light">
      <Container className="justify-content-center">
        <Navbar.Brand as={NavLink} to="/"><img style={{ 'height':'50px' }}  src="/backend/img/logo.png" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Nav.Link as={NavLink} to="/"> <FontAwesomeIcon icon="fa-solid fa-home" />{' '}Home</Nav.Link>

                <NavDropdown title={ <span><FontAwesomeIcon icon="fa-solid fa-cog" />{' '}System</span> } id="basic-nav-dropdown">
                  <NavDropdown.Item as={NavLink} to="/administration/roles"><FontAwesomeIcon icon="fa-solid fa-person" />{' '}Roles</NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/administration/users"><FontAwesomeIcon icon="fa-solid fa-user" />{' '}Users</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title={ <span><FontAwesomeIcon icon="fa-solid fa-cog" />{' '}Frontpage</span> } id="basic-nav-dropdown">
                  <NavDropdown.Item as={NavLink} to="/administration/banners"><FontAwesomeIcon icon="fa-solid fa-image" />{' '}Carausel</NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/administration/programmes"><FontAwesomeIcon icon="fa-solid fa-list" />{' '}Programme</NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/administration/videos"><FontAwesomeIcon icon="fa-solid fa-video" />{' '}Video</NavDropdown.Item>
                </NavDropdown>


                <Nav.Link as={NavLink} to="/administration/articles/0"> <FontAwesomeIcon icon="fa-solid fa-file" />{' '}Article</Nav.Link>
         
              </Nav>
           <Account />
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
  );
}

export default TopNavbar;