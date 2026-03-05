import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadMenu3 from './LoadMenu3';
import SocialLinks from './SocialLinks';
import SiteSearch from './SiteSearch';
import useStore from '../../pages/store';

const Menu3 = () => {
    const url = process.env.REACT_APP_API_URL;
    const { searchOpen, toggleSearch } = useStore();
    const [menu1Items, setMenu1Items] = useState([]);

    useEffect(() => {
        axios(`${url}/home-menu-1`)
            .then((response) => {
                setMenu1Items(response.data.items);
            }).catch( error => {
                console.warn(error)
            });
    }, []);

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#171717" }} id="navbardiatas">
            <Link to="/" className="navbar-brand ms-2">
                <img
                    src="/img/logortmbaharu2.png"
                    alt="Logo"
                />
            </Link>

            <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                <button
                    className="btn btn-link text-light p-0"
                    onClick={toggleSearch}
                    aria-label="Search"
                    style={{ fontSize: '1.3rem' }}
                >
                    <i className={`bi ${searchOpen ? 'bi-x-lg' : 'bi-search'}`}></i>
                </button>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbaratas" aria-controls="navbaratas" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>

            <div className="collapse navbar-collapse" id="navbaratas">
                <ul className="navbar-nav flex-row flex-wrap px-2 pt-3">
                    {menu1Items.map((item, index) => (
                        <LoadMenu3 key={item.id ?? index} id={item.id} />
                    ))}
                </ul>
                <div className="d-flex justify-content-center py-4" style={{ gap: '12px' }}>
                    <SocialLinks />
                </div>
            </div>
        </nav>
        <SiteSearch />
        </>
    );
};

export default Menu3;
