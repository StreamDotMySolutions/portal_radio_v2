import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavBarFetch from './NavBarFetch';
import { Link, NavLink } from 'react-router-dom';

export function Menu1() {

  return (
    <Nav className="horizontal-menu justify-content-center align-items-center" style={{'minHeight':'50px'}}>
      <Navbar expand="lg" className="bg-body-tertiary" >
        
       
          <Navbar.Brand as={Link} to="/">RTM Korporat</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <NavDropdown title="Mengenai Kami">   
              <NavBarFetch id={51} />
            </NavDropdown>

            <NavDropdown title="Pengumuman">   
              <NavBarFetch id={52} />
            </NavDropdown>

            <NavDropdown title="WARGA RTM">   
              <NavBarFetch id={53} />
            </NavDropdown>

            <NavDropdown title="SWASTA/AWAM">   
              <NavBarFetch id={54} />
            </NavDropdown>

            <NavDropdown title="MAKLUMBALAS">   
              <NavBarFetch id={55} />
            </NavDropdown>

          </Navbar.Collapse>
       
      </Navbar>
    </Nav>

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
    
      const link = data?.article_setting?.redirect_url ? data?.article_setting?.redirect_url : `/contents/${data?.id}`

      return (
        // <Nav.Item>
        //   <Nav.Link href={link}>{truncatedTitle}</Nav.Link>
        // </Nav.Item>

        <Nav.Item>
          <NavLink activeClassName="active" to={link} className="nav-link">{truncatedTitle}</NavLink>
        </Nav.Item>
      // <NavDropdown.Item as={NavLink} to={link} activeClassName="active">
      // {truncatedTitle}
      // </NavDropdown.Item>
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
        <Nav.Item>
          <NavLink activeClassName="active" to="/" className="nav-link">UTAMA</NavLink>
        </Nav.Item> 
        {articles.map(article => (
          <MenuItem key={article.id} data={article} title={article.title} children={article.descendants} />
        ))}
      </>
    );
  }

  return (
      <Nav className="horizontal-menu justify-content-center align-items-center" style={{'minHeight':'100px'}}>
        <Menu articles={menu} />
      </Nav>
  );
}