import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavBarFetch from './NavBarFetch';

function NavBar() {

  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">RTM Korporat</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavDropdown  title="Mengenai Kami">   
            <NavBarFetch id={51} />
          </NavDropdown>

          <NavDropdown  title="Pengumuman">   
            <NavBarFetch id={52} />
          </NavDropdown>

          <NavDropdown  title="WARGA RTM">   
            <NavBarFetch id={53} />
          </NavDropdown>

          <NavDropdown  title="SWASTA/AWAM">   
            <NavBarFetch id={54} />
          </NavDropdown>

          <NavDropdown  title="MAKLUMBALAS">   
            <NavBarFetch id={55} />
          </NavDropdown>

        
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default NavBar;