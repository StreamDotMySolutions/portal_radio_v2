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
        <Navbar.Brand as={NavLink} to="/">CMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Nav.Link as={NavLink} to="/"> <FontAwesomeIcon icon={['fas', 'gauge']} />{' '}Dashboard</Nav.Link>

                <NavDropdown title={ <span><FontAwesomeIcon icon="fa-solid fa-cog" />{' '}System</span> } id="basic-nav-dropdown">
                  <NavDropdown.Item as={NavLink} to="/administration/users"><FontAwesomeIcon icon="fa-solid fa-user" />{' '}Users</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title={ <span><FontAwesomeIcon icon="fa-solid fa-tv" />{' '}Frontpage</span> } id="basic-nav-dropdown">
                  <NavDropdown.Item as={NavLink} to="/administration/banners"><FontAwesomeIcon icon="fa-solid fa-image" />{' '}Carousel</NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/administration/programmes"><FontAwesomeIcon icon="fa-solid fa-list" />{' '}Programme</NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/administration/videos"><FontAwesomeIcon icon="fa-solid fa-video" />{' '}Video</NavDropdown.Item>
                </NavDropdown>

                <Nav.Link as={NavLink} to="/administration/articles/0"> <FontAwesomeIcon icon="fa-solid fa-newspaper" />{' '}Article</Nav.Link>
                <Nav.Link as={NavLink} to="/administration/directories/0"> <FontAwesomeIcon icon="fa-solid fa-address-book" />{' '}Directory</Nav.Link>
                <Nav.Link as={NavLink} to="/administration/assets/0"> <FontAwesomeIcon icon="fa-solid fa-folder-open" />{' '}Asset</Nav.Link>
                <Nav.Link as={NavLink} to="/administration/vods/0"> <FontAwesomeIcon icon="fa-solid fa-film" />{' '}Vod</Nav.Link>
                <Nav.Link as={NavLink} to="/administration/analytics"> <FontAwesomeIcon icon="fa-solid fa-chart-bar" />{' '}Analytics</Nav.Link>
              </Nav>
           <Account />
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
  );
}

export default TopNavbar;