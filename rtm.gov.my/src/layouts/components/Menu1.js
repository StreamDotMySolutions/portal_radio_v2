import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadMenu from './LoadMenu1';
import { Link, NavLink } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import useStore from '../../pages/store';

const Menu1 = () => {
    const url = process.env.REACT_APP_API_URL;
    const { searchOpen, toggleSearch } = useStore();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        axios(`${url}/home-menu-1`)
            .then((response) => {
                //console.log(response)
                setItems(response.data.items);
            }).catch( error => {
                console.warn(error)
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);

    const menuItems = () => {
        return items.map((item, index) => {
            const setting = item.article_setting;
            if (!setting || setting.active !== 1) {
                return null;
            }

            if (setting.show_children === 1) {
                return <LoadMenu key={item.id ?? index} id={item.id} />;
            }

            const linkTo = setting.redirect_url ? setting.redirect_url : `/listings/${item.id}`;

            return (
                <li key={item.id ?? index} className="nav-item">
                    <NavLink to={linkTo} className="nav-link">
                        {item.title}
                    </NavLink>
                </li>
            );
        });
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#171717" }} id="navbardiatas">
            <div className="container-fluid d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <Link to="/" className="navbar-brand">
                        <img src="/img/logortmbaharu2.png" alt="Logo RTM" />
                    </Link>
                    <div className="d-none d-lg-block ms-2" style={{ lineHeight: '1.2' }}>
                        <div className="text-secondary" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>LAMAN WEB RASMI</div>
                        <div className="text-light fw-bold" style={{ fontSize: '0.8rem' }}>JABATAN PENYIARAN</div>
                        <div className="text-light fw-bold" style={{ fontSize: '0.8rem' }}>MALAYSIA</div>
                    </div>
                    <button
                        className="navbar-toggler ms-2"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbaratas"
                        aria-controls="navbaratas"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="collapse navbar-collapse justify-content-center flex-grow-1" id="navbaratas">
                    <ul className="navbar-nav mx-auto">
                        {menuItems()}
                    </ul>
                </div>

                <div className="d-none d-lg-flex align-items-center" style={{ gap: '10px' }}>
                    <SocialLinks />
                </div>
            </div>
        </nav>
    );
};

export default Menu1;
