import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import { useEffect, useState } from 'react';

function NavBar() {

  const url = process.env.REACT_APP_API_URL
  const [articles,setArticles] = useState([])

  //console.log(url)

  useEffect( () => {
    axios(`${url}/articles/0`)
    .then( response => {
      //console.log(response)
      setArticles(response.data.articles)
    })
    .catch( error => {
      console.warn(error)
    })
  },[])
 

  function MenuItem({ title, children }) {
  
    if (children.length == 0) {
      return ( 
              <>
              <NavDropdown.Item>{title}</NavDropdown.Item>
              </>
              )
    } else {
      return (
        <>
        <NavDropdown title={title} drop="end" className='mr-2'>
          {children.map(child => (
            <>
            <MenuItem key={child.id} title={child.title} children={child.children} />
            </>
          ))}
        </NavDropdown>
        </>
      );
    }
  }

  
function Menu({ articles }) {
  return (
    <Nav>
      {articles.map(article => (
        <>
        <MenuItem key={article.id} title={article.title} children={article.children} />
        
        </>
      ))}
    </Nav>
  );
}
  
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavDropdown  title="Link" id="navbarScrollingDropdown">   
            <Menu articles={articles} /> 
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default NavBar;