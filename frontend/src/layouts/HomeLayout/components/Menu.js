import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavBarFetch from './NavBarFetch';

export function Menu1() {

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

export function Menu2() {
  const url = process.env.REACT_APP_API_URL
  const [menu,setMenu] = useState([])

  useEffect( () => {
    
    axios(`${url}/articles/50`)
    .then( response => {
      //console.log(response)
      setMenu(response.data.articles)
    })

  },[])

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    } else {
      return str;
    }
  }


  function MenuItem({ title,data,children }) {
    const truncatedTitle = truncateString(title, 50);

    if (!children || children.length === 0) {
      //return <NavDropdown.Item>{truncatedTitle}</NavDropdown.Item>;
    
      const link = data?.article_setting?.redirect_url ?  data?.article_setting?.redirect_url : `show/${data?.id}`

      return (
        <Nav.Item>
          <Nav.Link href={link}>{truncatedTitle}</Nav.Link>
        </Nav.Item>
      )
    } else {
      return (
        <NavDropdown title={truncatedTitle} drop="down" className='mr-2'>
          {children.map(child => (
            <MenuItem key={child.id} title={child.title} data={child} children={child.descendants || []} />
          ))}
        </NavDropdown>
      );
    }
  }

  function Menu({ articles }) {
    return (
      <>
        {articles.map(article => (
          <MenuItem key={article.id} data={article} title={article.title} children={article.descendants} />
        ))}
      </>
    );
  }

  return (
    <Nav className="horizontal-menu">
      <Menu articles={menu} />
    </Nav>
  );
}