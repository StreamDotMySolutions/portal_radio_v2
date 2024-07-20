import React, { useState, useEffect } from 'react';

import { useParams,Link } from 'react-router-dom'
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Search from './Search';

const SearchResult = () => {

    const [data,setData] = useState([])
    const { query } = useParams()

    useEffect( () => {
        if (!query) {
            // Query is empty, handle it appropriately
            return;
        }

        axios(`${process.env.REACT_APP_BACKEND_URL}/directories/search/${query}`)
        .then(
            response => {
                //console.log(response)
                setData(response.data)
            }
        )
        .catch( error => {
            console.warn(error)
        })
    },[query])

    console.log(query)
    


        return (
           <>ssss</>
        );

};

export default SearchResult;