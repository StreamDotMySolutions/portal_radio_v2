import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import { useEffect, useState } from 'react';

function NavBarFetch({id}) {

  const url = process.env.REACT_APP_API_URL
  const [articles,setArticles] = useState([])

  //console.log(url)

  useEffect( () => {
    axios(`${url}/articles/${id}`)
    .then( response => {
      //console.log(response)
      setArticles(response.data.articles)
    })
    .catch( error => {
      console.warn(error)
    })
  },[])
 
  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    } else {
      return str;
    }
  }

  function MenuItem({ title, children }) {
    const truncatedTitle = truncateString(title, 50);

    if (!children || children.length === 0) {
      return <NavDropdown.Item>{truncatedTitle}</NavDropdown.Item>;
    } else {
      return (
        <NavDropdown title={truncatedTitle} drop="end" className='mr-2'>
          {children.map(child => (
            <MenuItem key={child.id} title={child.title} children={child.descendants || []} />
          ))}
        </NavDropdown>
      );
    }
  }
  
  function Menu({ articles }) {
    return (
      <>
        {articles.map(article => (
          <MenuItem key={article.id} title={article.title} children={article.descendants} />
        ))}
      </>
    );
  }
  
  
  return (
    <Menu articles={articles} /> 
  );
}

export default NavBarFetch;