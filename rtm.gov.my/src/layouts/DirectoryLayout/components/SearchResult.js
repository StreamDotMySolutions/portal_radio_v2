import React, { useState, useEffect } from 'react';

import { useParams,Link } from 'react-router-dom'
import axios from 'axios';
//import { Table } from 'react-bootstrap';
import Search from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import StaffListing from './StaffListing';

const SearchResult = () => {

    const [data, setData] = useState([]);
    const { query } = useParams();
    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (!query) {
            // Query is empty, handle it appropriately
            return;
        }

        axios.post(`${url}/directories/search`, { query: query })
            .then(response => {
                console.log(response);
                setData(response.data);
            })
            .catch(error => {
                console.warn(error);
            });
    }, [query]);

    //console.log(query)

    const breadcrumbs = () => {

    
        return (

            <ul className="breadcrumb2" style={{ "marginTop": "40px" }}>
                <li><Link to="/">Utama</Link></li>
                <li><Link to="/directories">Direktori</Link></li>
                <li>Hasil Carian</li>
            </ul>
        );

    };
    
    


    return (
            <div className='container-fluid col-md-10'>
                { breadcrumbs() }
                <h1><FontAwesomeIcon icon={faSearch} /> Hasil Carian</h1>
                <Search />
                {data?.length > 0 ?  <StaffListing items={data} /> : <p className='text-muted'>Tiada data dalam rekod kami.</p>}
            </div>
        );

};

export default SearchResult;