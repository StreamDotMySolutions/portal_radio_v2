import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { trackEvent } from '../../../libs/analytics';
import './style.css'


const PageContent = ({id}) => {
    //const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [settings, setSettings] = useState([]);
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
                setSettings(response.data.settings);
                setAncestors(response.data.ancestors);
                setLoading(false);
                trackEvent('pageview', 'article', id, response.data.title);
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id]);

    // const breadcrumbs = () => {
    //     return ancestors.map((item, index) => (
    //         <li>
    //             <Link to={`/listings/${item.id}`}>{item.title}</Link>
    //         </li>
    //     ));
    // }

    const breadcrumbs = () => {
        if (!Array.isArray(ancestors)) {
            return null; // Return null if ancestors is not an array
        }
    
        return (
            <ul>
                {ancestors.map((item, index) => (
                    <li key={item.id || index}>
                        <Link to={`/listings/${item.id}`}>{item.title}</Link>
                    </li>
                ))}
            </ul>
        );
    };
    

    const contentItems = () => {
        return items.map((item, index) => {
            if (item.contents === 'pdf' && item.article_pdf) {
                const pdfUrl = `${serverUrl}/storage/article_pdf/${item.article_pdf.filename}`;
                return (
                    <div className='mb-4' key={index}>
                        <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                    </div>
                );
            }
            return (
                <div className='mb-2' key={index} dangerouslySetInnerHTML={{ __html: item.contents }} />
            );
        });
    };

    const today = new Date();
    const currentDay = today.getDay(); // Gets the current day (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

    // Define a function to check if content should be rendered based on the day
    const shouldRenderContent = () => {
        if (settings.published_start) {
            // Get the current date
            const currentDate = new Date();
            // Get the published start date from settings.published_start
            const publishedStartDate = new Date(settings.published_start);
            // Compare the current date to the published start date
            if (currentDate < publishedStartDate) {
                // If current date is before published start date, return false
                return false;
            }
        }
        if (settings.published_end) {
            // Get the current date
            const currentDate = new Date();
            // Get the published end date from settings.published_end
            const publishedEndDate = new Date(settings.published_end);
            // Compare the current date to the published end date
            if (currentDate > publishedEndDate) {
                // If current date is after published end date, return false
                return false;
            }
        }
        // If published start date is null or current date is after published start date, return true
        return true;
    };
    
    

    return (
        <>
            <Helmet>
                <title>Direktori RTM : {title}</title>
            </Helmet>
            <div className="container-fluid bg-white">

                <div className="row">
                    <div className="col-md-1"></div>

                    <div className="col-md-10">

                        <ul className="breadcrumb" style={{ "marginTop": "40px" }}>
                            <li><Link to="/">Utama</Link></li>
                            {breadcrumbs()}
                            {loading ? (
                                <li>...</li>
                            ) : (
                                <li>{title}</li>
                            )}
                        </ul>

            

                        <div style={{ marginTop: '4rem' }}>
                            {shouldRenderContent() ? contentItems() : null}
                        </div>

                        <div style={{ marginTop: '2rem' }}></div>
                    </div>

                    <div className="col-md-1"></div>

                </div>
            </div>
        </>
    );
};

export default PageContent;
