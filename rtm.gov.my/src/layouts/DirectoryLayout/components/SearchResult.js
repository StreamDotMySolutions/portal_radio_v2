import React, { useState, useEffect } from 'react';

import { useParams,Link } from 'react-router-dom'
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Search from './Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
                <h1>  <FontAwesomeIcon icon={faSearch} /> Hasil Carian</h1>
                <Search />
                <div className="table-responsive">
                    <table id="table-id" className="table responsive-table table-striped table">
                        <thead>
                            <tr style={{ backgroundColor: 'rgb(6, 57, 112)' }}>
                                <th style={{ color: 'white' }}>NO.</th>
                                <th style={{ color: 'white' }}>GAMBAR</th>
                                <th style={{ color: 'white' }}>NAMA PEGAWAI</th>
                                <th style={{ color: 'white' }}>JAWATAN</th>
                                <th style={{ color: 'white' }}>EMEL</th>
                                <th style={{ color: 'white' }}>NO. TELEFON</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {/* Add more table rows here */}
                        </tbody>
                    </table>
                </div>
            </div>
        );

};

export default SearchResult;