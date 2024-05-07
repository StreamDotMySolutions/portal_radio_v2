import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component

function LoadMenu1({id}) {

  const url = process.env.REACT_APP_API_URL
  const [title, setTitle] = useState('')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    axios(`${url}/articles/${id}`)
    .then(response => {
      //console.log(response.data)
      setTitle(response.data.title)
      setArticles(response.data.articles)
      setLoading(false); // Set loading to false when data is fetched
    })
    .catch(error => {
      console.warn(error)
    })
  },[])

  const items = () => {
    return articles.map(article => (
      <li key={article.id} className="nav-item ml-2">

      {article.article_setting && article.article_setting.redirect_url ? (
        <NavLink to={article.article_setting.redirect_url} className="nav-link">
          {article.title}
        </NavLink>
      ) : (
        <NavLink to={`/contents/${article.id}`} className="nav-link">
          {article.title}
        </NavLink>
      )}

      </li>
    ));
  };
  
  return (
    <>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" data-toggle="dropdown">
          {loading ? ( // Render spinner if loading is true
            <Spinner animation="grow"  size="sm"  />
          ) : (
            title // Render title if not loading
          )}
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown" style={{ minWidth: "280px" }}>
          <ul className="nav flex-column">
            {items()}
          </ul>
        </div>
      </li>
    </>
  );
}

export default LoadMenu1;
