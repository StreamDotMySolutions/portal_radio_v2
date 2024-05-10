import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import './style.css'


const PageContent = () => {
    const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios(`${url}/articles/${id}`)
            .then(response => {
                console.log(response)
                setTitle(response.data.title);
                setItems(response.data.articles);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id]);

    const contentItems = () => {
        return items.map((item, index) => (
            <li>
                <Link to={`/contents/${item.id}`}>{item.title}</Link>
            </li>
        ));
    };

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
                            </li> // Show spinner while loading
                        ) : (
                            <li>{title}</li> // Show title when loaded
                        )}
                    </ul>

                    {loading ? (
                           <span>loading ...</span>// Show spinner while loading
                        ) : (
                            <h1>{title}</h1> // Show title when loaded
                        )}

                    <div className="container-fluid" style={{ "marginTop": "1rem" }}>
                        {loading ? (
                            <></>
                        ) : (
                            <ol>
                                {contentItems()}
                            </ol>
                        )}

                       
                    </div>

                    <div className="container-fluid" style={{ "marginTop": "2rem" }}>
                    </div>
                </div>

                <div className="col-md-1"></div>

            </div>
        </div>
    );
};

export default PageContent;
