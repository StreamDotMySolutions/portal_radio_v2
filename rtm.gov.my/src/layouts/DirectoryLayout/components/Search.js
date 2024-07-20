import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom'

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    const handleSearch = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Navigate to the search results page with the query parameter
          navigate(`/directories/search/${encodeURIComponent(searchTerm)}`);
        }
      };

    return (
        <div className="main">
            <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback"></span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Carian Nama Pegawai"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
        </div>
    );
};

export default Search;