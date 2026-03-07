import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom'
import axios from 'axios';
import Search from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import StaffListing from './StaffListing';
import BreadCrumb from '../../../libs/BreadCrumb';
import { trackEvent } from '../../../libs/analytics';

const SearchResult = () => {

    const [data, setData] = useState([]);
    const { query } = useParams();
    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (!query) return;

        trackEvent('search', 'directory', null, query);

        axios.post(`${url}/directories/search`, { query: query })
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.warn(error);
            });
    }, [query]);

    //console.log(query)

    const breadcrumbItems = [
        { url: '/', label: 'Utama' },
        { url: '/directories', label: 'Direktori' },
        { url: null, label: 'Hasil Carian' },
    ];

    return (
            <div className='container-fluid col-md-10'>
                <BreadCrumb items={breadcrumbItems} className="breadcrumb2" />
                <h1><FontAwesomeIcon icon={faSearch} /> Hasil Carian</h1>
                <Search />
                {data?.length > 0 ?  <StaffListing items={data} /> : <p className='text-muted'>Tiada data dalam rekod kami.</p>}
            </div>
        );

};

export default SearchResult;