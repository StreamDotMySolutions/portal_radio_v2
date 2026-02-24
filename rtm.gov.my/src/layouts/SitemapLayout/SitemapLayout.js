import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';


const SitemapLayout = () => {

    const url = process.env.REACT_APP_API_URL; // This is the base URL for your API, defined in your .env file
    const serverUrl = process.env.REACT_APP_SERVER_URL; // This is the base URL for your server, defined in your .env file
    const [items, setItems] = useState([]); // This state will hold the menu items fetched from the API
    const [isLoading, setIsLoading] = useState(true); // This state will indicate whether the data is still loading

    useEffect(() => {
        // Fetch the menu items from the API when the component mounts
        axios(`${url}/sitemap`)
            .then((response) => {
                setItems(response.data.items); // Set the fetched items to the state
            }).catch( error => {
                console.warn(error); // Log any errors that occur during the fetch
            }).finally(() => {
                setIsLoading(false); // Set loading to false once the fetch is complete
            });
    }, []);

    // This is a simple sitemap layout. You can customize it as needed.
    return (
        <div className="bg-white min-vh-100 w-100 p-2">
            <h1 className="pt-4">Sitemap</h1>
            <ul className="list-unstyled">
                <li><a href="/">Home</a></li>
                <li><a href="/contents">Contents</a></li>
                <li><a href="/listings">Listings</a></li>
                <li><a href="/directories">Directories</a></li>
                <li><a href="/sitemap">Sitemap</a></li>
            </ul>
        </div>
    );
}
export default SitemapLayout;