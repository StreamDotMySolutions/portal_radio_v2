import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import './style.css'


const PageContent = ({id}) => {
    //const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios(`${url}/show/${id}`)
            .then(response => {
                //console.log(response)
                setTitle(response.data.title);
                setItems(response.data.items);
                setAncestors(response.data.ancestors);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id]);

    const breadcrumbs = () => {
        return ancestors.map((item, index) => (
            <li>
                <Link to={`/listings/${item.id}`}>{item.title}</Link>
            </li>
        ));
    }

    const contentItems = () => {
        return items.map((item, index) => (
            <div className='mb-2' key={index} dangerouslySetInnerHTML={{ __html: item.contents }} />
        ));
    };

    return (
        
        <div className="container-fluid">
            
            <div className="row">
                <div className="col-md-1"></div>

                <div className="col-md-10">

                    <ul className="breadcrumb" style={{ "marginTop": "40px" }}>
                        <li><Link to="/">Utama</Link></li>
                        {breadcrumbs()}
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

                    <div className="container-fluid" style={{ "marginTop": "4rem" }}>
                        {loading ? (
                            <></>
                        ) : (
                            <>{contentItems()}</>
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
