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

            <NavDropdown title={<span><FontAwesomeIcon icon={['fas', 'newspaper']} />{' '}Content</span>} id="nav-content">
              <NavDropdown.Item as={NavLink} to="/administration/articles/0">
                <FontAwesomeIcon icon={['fas', 'newspaper']} />{' '}Articles
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={<span><FontAwesomeIcon icon={['fas', 'folder-open']} />{' '}Media</span>} id="nav-media">
              <NavDropdown.Item as={NavLink} to="/administration/assets/0">
                <FontAwesomeIcon icon={['fas', 'folder-open']} />{' '}Assets
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/vods/0">
                <FontAwesomeIcon icon={['fas', 'film']} />{' '}VODs
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={<span><FontAwesomeIcon icon={['fas', 'tv']} />{' '}Homepage</span>} id="nav-homepage">
              <NavDropdown.Item as={NavLink} to="/administration/banners">
                <FontAwesomeIcon icon={['fas', 'image']} />{' '}Banners
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/programmes">
                <FontAwesomeIcon icon={['fas', 'list']} />{' '}Programmes
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/videos">
                <FontAwesomeIcon icon={['fas', 'video']} />{' '}Videos
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={NavLink} to="/administration/analytics">
              <FontAwesomeIcon icon={['fas', 'chart-bar']} />{' '}Analytics
            </Nav.Link>

            <NavDropdown title={<span><FontAwesomeIcon icon={['fas', 'cog']} />{' '}System</span>} id="nav-system">
              <NavDropdown.Item as={NavLink} to="/administration/users">
                <FontAwesomeIcon icon={['fas', 'users']} />{' '}Users
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/administration/activity">
                <FontAwesomeIcon icon={['fas', 'clock-rotate-left']} />{' '}Activity Log
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
