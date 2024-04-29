import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component

function LoadFooter({id}) {

  const url = process.env.REACT_APP_API_URL
  const [title, setTitle] = useState('')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    axios(`${url}/articles/${id}`)
    .then(response => {
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
      <li key={article.id} >
        <a href="#">{article.title}</a>
      </li>
    ));
  };
  
  return (
    <>
      <div className="col-sm-6 col-md-3 col-12 col">
        <ul className="footer_ul_amrc">
          {items()}
        </ul>
      </div>
    </>
  );
}

export default LoadFooter;
