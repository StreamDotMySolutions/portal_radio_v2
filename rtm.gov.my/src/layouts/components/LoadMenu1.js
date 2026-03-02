import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
//import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component

function LoadMenu1({id}) {

  // 1. check ArticleSetting
  // 2. check active | true or false
  // 3. check redirect_url
  // 4. check listing_type
  // 5. check show_children

  const url = process.env.REACT_APP_API_URL
  const [title, setTitle] = useState('')
  const [articles, setArticles] = useState([])
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    axios(`${url}/articles/${id}`)
    .then(response => {
      //console.log(response.data)
      setTitle(response.data.title)
      setArticles(response.data.articles)
      setSettings(response.data.settings)
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
  
  const items = () => {
    if (articles.length === 0) {
      return null; // or any default content you want to render when there are no articles
    }
  
    const groupedArticles = [];
    for (let i = 0; i < articles.length; i += 8) {
      groupedArticles.push(articles.slice(i, i + 8));
    }

    return groupedArticles.map((group, index) => (
      <div key={index} className={`col-md-3 ${index === 1 ? 'ml-5' : 'mr-5'}`}>

        <ul className="nav flex-column">
          {group.map((article, idx) => (
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
    // 1. check redirect_url

    return (
      <>
        
        <li className='nav-item'>
          {settings.redirect_url ?
            <NavLink className="nav-link" to={`${settings.redirect_url}`}>{title} {' '}<i className="fa-solid fa-up-right-from-square"></i></NavLink>
          :
            <NavLink className="nav-link" to={`/listings/${id}`}>{title}</NavLink>
          }
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

          <div className="dropdown-menu" style={articles.length < 8 ? { minWidth: '220px' } : {  minWidth: '500px' }}>
        
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

export default LoadMenu1;
