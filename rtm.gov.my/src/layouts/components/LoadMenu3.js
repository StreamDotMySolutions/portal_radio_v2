import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { truncateTitleWithBreaks } from '../../libs/utils';

function LoadMenu3({id}) {

  const url = process.env.REACT_APP_API_URL
  const [title, setTitle] = useState('')
  const [articles, setArticles] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    axios(`${url}/articles/${id}`)
    .then(response => {
      //console.log(response.data)
      setTitle(response.data.title)
      setArticles(response.data.articles)
    })
    .catch(error => {
      console.warn(error)
    })
  },[])

  const items = () => {
    if (articles.length === 0) {
      return null;
    }

    return articles.map((article, idx) => (
      article.article_setting && article.article_setting.active === 1 && (
        <NavLink
          key={idx}
          to={
            article.article_setting.redirect_url
              ? article.article_setting.redirect_url
              : `/listings/${article.id}`
          }
          className="dropdown-item"
          style={{ color: '#ddd', padding: '0.4rem 1rem' }}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: article.article_setting.redirect_url
              ? `${truncateTitleWithBreaks(article.title, 3)} &nbsp;&nbsp;<i class="text-muted fa-solid fa-up-right-from-square"></i>`
              : truncateTitleWithBreaks(article.title, 3),
            }}
          />
        </NavLink>
      )
    ));
  };
  
  
  const halfWidth = { width: '50%' };
  const fullWidth = { width: '100%' };

  if (articles.length === 0) {
    return (
      <li className='nav-item' style={halfWidth}>
        <NavLink className="nav-link text-light" to={`/listings/${id}`}>{title}</NavLink>
      </li>
    )
  }

  if (articles.length > 0) {
    return (
      <li className="nav-item" style={open ? fullWidth : halfWidth}>
        <a
          className="nav-link text-light"
          role="button"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
        >
          {title} <span className="dropdown-toggle" style={{ marginLeft: '2px' }}></span>
        </a>

        {open && (
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '0.5rem 0', marginBottom: '0.5rem' }}>
            {items()}
          </div>
        )}
      </li>
    );
  }
}

export default LoadMenu3;
