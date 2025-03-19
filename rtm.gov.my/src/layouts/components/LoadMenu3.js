// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

//import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component

function LoadMenu3({id}) {

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

  function truncateTitle(title, wordLimit) {
    const words = title.split(' ');
    
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    } else {
      return title;
    }
  }

  function truncateTitleWithBreaks(title, wordLimit) {
    const words = title.split(' ');
  
    if (words.length > wordLimit) {
      let truncatedTitle = '';
      for (let i = 0; i < words.length; i++) {
        truncatedTitle += words[i];
        if ((i + 1) % wordLimit === 0 && i !== words.length - 1) {
          truncatedTitle += ' <br /> ';
        } else {
          truncatedTitle += ' ';
        }
      }
      return truncatedTitle.trim(); // Remove trailing whitespace
    } else {
      return title;
    }
  }
  

  // const items = () => {
  //   if (articles.length === 0) {
  //     return null; // or any default content you want to render when there are no articles
  //   }
  
  //   const groupedArticles = [];
  //   for (let i = 0; i < articles.length; i += 8) {
  //     groupedArticles.push(articles.slice(i, i + 8));
  //   }


  
  //   return groupedArticles.map((group, index) => (
     

  //       <ul key={index} className="nav flex-column">
  //         {group.map((article, idx) => (
  //           <li key={article.id} className="nav-item">
  //             <NavLink
  //               to={article.article_setting && article.article_setting.redirect_url ? article.article_setting.redirect_url : `/contents/${article.id}`}
  //               className="dropdown-item text-justify"
  //             >

  //                 <span dangerouslySetInnerHTML={{ __html: truncateTitleWithBreaks(article.title, 3) }} />

  //             </NavLink>
  //           </li>
  //         ))}
  //       </ul>
      
  //   ));
  // };

  const items = () => {
    if (articles.length === 0) {
      return null; // or any default content you want to render when there are no articles
    }
  
    const groupedArticles = [];
    for (let i = 0; i < articles.length; i += 100) {
      groupedArticles.push(articles.slice(i, i + 100));
    }

    return groupedArticles.map((group, index) => (
      <div key={index} className={`col-md-3 ${index === 1 ? 'ml-5' : 'mr-5'}`}>

        <ul className="nav flex-column">
          {articles.map((article, idx) => (
            <li key={idx} className="nav-item">
              {article.article_setting && article.article_setting.active === 1 && ( // Check if active is 1
                <NavLink
                  to={
                    article.article_setting.redirect_url
                      ? article.article_setting.redirect_url
                      : `/listings/${article.id}`
                  }
                  className="dropdown-item text-justify"
                >
                  {/* <span dangerouslySetInnerHTML={{ __html: truncateTitleWithBreaks(article.title, 3) }} /> */}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: article.article_setting.redirect_url
                      ? `${truncateTitleWithBreaks(article.title, 3)} &nbsp;&nbsp;<i class="text-muted fa-solid fa-up-right-from-square"></i>`
                      : truncateTitleWithBreaks(article.title, 3),
                    }}
                  />
                </NavLink>
              )}
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
        <NavLink className="nav-link" to={`/listings/${id}`}>{title}</NavLink>
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
              // <Spinner animation="grow"  size="sm"  />
              <></>
            ) : (
              title // Render title if not loading
            )}
          </a>

          <div className="dropdown-menu">
        
            <div className='container'>
              <div className='row'>  
                {items()}
              </div>
            </div>
          
          </div>
          
        </li>
      </>
    );
  }
}

export default LoadMenu3;
