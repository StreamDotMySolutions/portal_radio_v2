import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Account from '../Account';

function TopNavbar() {

  return (
    <Navbar fixed="top" bg="light" data-bs-theme="light">
      <Container className="justify-content-center">
        <Navbar.Brand as={NavLink} to="/">CMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>

            <Nav.Link as={NavLink} to="/">
              <FontAwesomeIcon icon={['fas', 'gauge']} />{' '}Dashboard
            </Nav.Link>

<NavDropdown title={<span><FontAwesomeIcon icon={['fas', 'tv']} />{' '}Homepage</span>} id="nav-homepage">
              <NavDropdown.Item as={NavLink} to="/administration/banners">
                <FontAwesomeIcon icon={['fas', 'image']} />{' '}Banners
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/livestream">
                <FontAwesomeIcon icon={['fas', 'tower-broadcast']} />{' '}Livestream
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/chat-messages">
                <FontAwesomeIcon icon={['fas', 'message']} />{' '}Chat Messages
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/stations">
                <FontAwesomeIcon icon={['fas', 'radio']} />{' '}Stations
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={<span><FontAwesomeIcon icon={['fas', 'cog']} />{' '}System</span>} id="nav-system">
              <NavDropdown.Item as={NavLink} to="/administration/analytics">
                <FontAwesomeIcon icon={['fas', 'chart-bar']} />{' '}Analytics
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/users">
                <FontAwesomeIcon icon={['fas', 'users']} />{' '}Users
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/chat-users">
                <FontAwesomeIcon icon={['fas', 'comments']} />{' '}Chat Users
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/activity">
                <FontAwesomeIcon icon={['fas', 'clock-rotate-left']} />{' '}Activity Log
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/settings">
                <FontAwesomeIcon icon={['fas', 'sliders']} />{' '}Settings
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>
          <Account />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
