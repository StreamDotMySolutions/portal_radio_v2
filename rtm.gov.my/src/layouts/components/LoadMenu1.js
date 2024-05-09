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

  // const items = () => {
  //   if (articles.length === 0) {
  //     return null; // or any default content you want to render when there are no articles
  //   }
  
  //   return articles.map(article => (
  //     <li key={article.id} className="nav-item ml-2">
  //       {article.article_setting && article.article_setting.redirect_url ? (
  //         <NavLink to={article.article_setting.redirect_url} className="nav-link">
  //           {article.title}
  //         </NavLink>
  //       ) : (
  //         <NavLink to={`/contents/${article.id}`} className="nav-link">
  //           {article.title}
  //         </NavLink>
  //       )}
  //     </li>
  //   ));
  // };

  // const items = () => {
  //   if (articles.length === 0) {
  //     return null; // or any default content you want to render when there are no articles
  //   }
  
  //   const groupedArticles = [];
  //   for (let i = 0; i < articles.length; i += 2) {
  //     groupedArticles.push(articles.slice(i, i + 2));
  //   }
  
  //   return groupedArticles.map((group, index) => (

      
  //     <div className="col-md-4" >
  //       <span style={{"color":"#ffa525"}}>{title}</span>
  //         <ul className='nav flex-column'>
  //           <li key={group.id} className="nav-item border-right">
  //             {group.map(article => (
  //               <NavLink
  //                 key={article.id}
  //                 to={article.article_setting && article.article_setting.redirect_url ? article.article_setting.redirect_url : `/contents/${article.id}`}
  //                 className="dropdown-item"
  //               >
  //                 {article.title}
  //               </NavLink>
  //             ))}
  //           </li>
  //         </ul>
  //      </div> 
  //   ));
  // };
  

  const items = () => {
    if (articles.length === 0) {
      return null; // or any default content you want to render when there are no articles
    }
  
    const groupedArticles = [];
    for (let i = 0; i < articles.length; i += 8) {
      groupedArticles.push(articles.slice(i, i + 8));
    }
  
    return groupedArticles.map((group, index) => (
      <div key={index} className="col-md-6">
        {/* <span style={{ color: "#ffa525", minWidth: "320px" }}>{title}</span> */}
        <ul className="nav flex-column">
          {group.map((article, idx) => (
            <li key={article.id} className={`nav-item ${idx !== group.length - 1 && idx > 8 ? 'border-right' : ''}`}>
              <NavLink
                to={article.article_setting && article.article_setting.redirect_url ? article.article_setting.redirect_url : `/contents/${article.id}`}
                className="dropdown-item"
              >{article.title}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    ));
  };
  
  
  if (articles.length === 0) {
    return (
      <>
      <li className='nav-item'>
        <NavLink className="nav-link" to={`/contents/${id}`}>{title}</NavLink>
      </li>
      </>
    )
  }

  
  if (articles.length > 0) {
  
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

          <div className={articles.length < 8 ? "dropdown-menu" : "dropdown-menu"} style={articles.length < 8 ? { minWidth: '320px' } : {}}>
        
  
            <div className='row ml-2'>  
              {items()}
            </div>
          
          </div>
          
        </li>
      </>
    );
  }
}

export default LoadMenu1;
