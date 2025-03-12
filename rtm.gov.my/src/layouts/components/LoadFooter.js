import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component

function LoadFooter({ id }) {
  const url = process.env.REACT_APP_API_URL;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    axios(`${url}/articles/${id}`)
      .then(response => {
        setArticles(response.data.articles);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch(error => {
        console.warn(error);
      });
  }, []);

  const items = () => {
    return articles.map(article => (
      <li key={article.id}>
        <NavLink to={`/listings/${article.id}`} 
          //activeClassName="active"
        >
          {article.title}
        </NavLink>
      </li>
    ));
  };

  return (
    <>
      {loading ? (
        // Render Spinner while loading
        <div className="text-center">
          {/* <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> */}
        </div>
      ) : (
        // Render the footer once data is loaded
        <div className="col-sm-6 col-md-3 col-12 col">
          <ul className="footer_ul_amrc">{items()}</ul>
        </div>
      )}
    </>
  );
}

export default LoadFooter;