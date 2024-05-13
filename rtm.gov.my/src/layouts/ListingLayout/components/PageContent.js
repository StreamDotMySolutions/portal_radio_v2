import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import WithPosterListing from './WithPosterListing';
import WithoutPosterListing from './WithoutPosterListing';
import DefaultListing from './DefaultListing';
import './style.css'
import SingleArticle from '../SingleArticle';

const PageContent = () => {
    const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [settings, setSettings] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const [currentPage, setCurrentPage] = useState(1);
    const [links, setLinks] = useState([]);
    const [paginate, setPaginate] = useState('');


    useEffect(() => {
        setLoading(true); // Set loading to true when fetching new data
        let apiUrl = paginate ? paginate : `${url}/listings/${id}?page=1`;
        axios.get(apiUrl)
            .then(response => {
                setTitle(response.data.title); // title
                setSettings(response.data.settings); // settings
                setItems(response.data.articles.data); // article data
                setLinks(response.data.articles.links); // paginator links
                setCurrentPage(response.data.articles.current_page); // current_page for pagination
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id, paginate]); // refresh data when id or page changes
    
    const handlePaginationClick = (url) => {
        // Handle click event and set the page to the clicked item's url
        setPaginate(url);
    };
    

    const paginatorItems = () => {
        return links.map((item, index) => (
        
            <li key={index} className={currentPage == item.label ? "active" : ""} onClick={() => handlePaginationClick(item.url)}>
                <span style={index === 0 || index === links.length - 1 ? { backgroundColor: '#202938', color: 'white' } : null}>
                    {index === 0 ? '<' : index === links.length - 1 ? '>' : item.label}
                    
                </span>
            </li>
        ));
    };

    let layout;
    switch (settings?.listing_type) {
        case 'poster':
            layout = <WithPosterListing items={items} />;
            break;

        case 'without_poster':
            layout = <WithoutPosterListing items={items} />;
            break;

        case 'single_article':
            layout = <SingleArticle id={id} />;
        break;    

        case 'default':
        default:
            layout = <DefaultListing items={items} page={currentPage}/>;
            break;
    }

    return (
        <div className="container-fluid">
     
            <div className="row">
                <div className="col-md-1"></div>
                <div className="col-md-10">
                    <ul className="breadcrumb" style={{ "marginTop": "40px" }}>
                        <li><Link to="/">Utama</Link></li>
                        {loading ? (
                            <li>
                                <Spinner animation="grow" size="sm" />
                            </li>
                        ) : (
                            <li>{title}</li>
                        )}
                    </ul>

                    <div className="" style={{ "minHeight": "300px" }}>
                        {loading ? (
                            <span>loading ...</span>
                        ) : (
                            <>
                                <h1>{title}</h1>
                                {layout}
                            </>
                        )}
                    </div>

                    <div className="container-fluid" style={{ "marginTop": "2rem" }}></div>

                    { settings?.listing_type !== 'single_article' &&
                    <div className="pagination-container float-right" style={{ marginBottom: '6rem' }}>
                        <nav>
                            <ul className="pagination">
                                {paginatorItems()}
                            </ul>
                        </nav>
                    </div>
                    }

                </div>
                <div className="col-md-1"></div>
            </div>
        </div>
    );
};

export default PageContent;
