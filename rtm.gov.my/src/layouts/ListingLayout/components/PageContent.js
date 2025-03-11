import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import WithPosterListing from './WithPosterListing';
import WithoutPosterListing from './WithoutPosterListing';
import DefaultListing from './DefaultListing';
import SingleArticle from '../SingleArticle';
import './style.css'

const PageContent = () => {
    const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [settings, setSettings] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const [currentPage, setCurrentPage] = useState(1);
    const [links, setLinks] = useState([]);
    const [paginate, setPaginate] = useState('');


    //console.log(id)
    useEffect(() => {
        if (!id && !paginate) {
            return; // Exit early if neither id nor paginate is available
        }
    
        setLoading(true); // Set loading to true when fetching new data
    
        // Reset paginate when id changes
        let apiUrl;
        if (id) {
            if (paginate && !paginate.includes(`listings/${id}`)) {
                // Reset pagination if it doesn't match the new id
                setPaginate('');
                apiUrl = `${url}/listings/${id}?page=1`;
            } else {
                apiUrl = paginate ? paginate : `${url}/listings/${id}?page=1`;
            }
        } else {
            apiUrl = paginate;
        }
    
        console.log('Fetching data from:', apiUrl);
    
        axios.get(apiUrl)
            .then(response => {
                //console.log('got data')
                setTitle(response.data.title); // title
                setSettings(response.data.settings); // settings
                //console.log(response.data)
                setAncestors(response.data.ancestors.ancestors); // ancestors
                setItems(response.data.articles.data); // article data
                setLinks(response.data.articles.links); // paginator links
                setCurrentPage(response.data.articles.current_page); // current_page for pagination
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id, paginate, url]); // refresh data when id, paginate, or url changes
    

     
    
    const handlePaginationClick = (url) => {
        // Handle click event and set the page to the clicked item's url
        //console.log(url)
        setPaginate(url);
    };
    
    const breadcrumbItems = () => {
        if (ancestors.length > 0) {
            return ancestors
                .filter(ancestor => ancestor.title !== 'Homepage Data') // Exclude MENU-1
                .filter(ancestor => ancestor.title !== 'MENU-1') // Exclude MENU-1
                .filter(ancestor => ancestor.title !== 'MENU-2') // Exclude MENU-1
                .filter(ancestor => ancestor.title !== 'FOOTER') // Exclude MENU-1
                .map((ancestor, index) => (
                <li key={ancestor.id}>
                    <Link to={`/listings/${ancestor.id}`}>{ancestor.title}</Link>
                </li>
            ));
        }
        return null; // In case there are no ancestors, return null
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
            layout = <WithoutPosterListing title={title} items={items} />;
            break;

        case 'single_article':
            layout = <SingleArticle id={id} />;
        break;    

        case 'default':
        default:
            layout = <DefaultListing items={items} page={currentPage}/>;
            break;
    }

    if(settings?.active == 1 ){
        return (
            <div className="container-fluid">
                {/* {settings?.listing_type} */}
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
                                <>  
                                    {breadcrumbItems()}
                                </>
                              
                            )}
                               <li>{title.toUpperCase()}</li>
                        </ul>
    
                        <div className="" style={{ "minHeight": "300px" }}>
                            {loading ? (
                                <span>loading ...</span>
                            ) : (
                                <>
                                    {layout}
                                </>
                            )}
                        </div>
    
                        <div className="container-fluid" style={{ "marginTop": "2rem" }}>


                        </div>
                      
                        {/* listing_type :  null */}
                        { settings?.listing_type !== 'single_article' && settings?.listing_type !== null &&
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
    }

    return (
        <div className='container-fluid text-center text-danger'>
            
            <ul className="breadcrumb" style={{ "marginTop": "40px" }}>
                    <li><Link to="/">Utama</Link></li>
                    {loading ? (
                        <li>
                            <Spinner animation="grow" size="sm" />
                        </li>
                    ) : (
                        <li>{breadcrumbItems()}</li>
                    )}
                       
                </ul>
                <div  style={{minHeight: '200px', marginTop: '5REM'}}>
                    <h3>loading...</h3>
                </div>
        </div>
    )

 
};

export default PageContent;
