import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink,Link } from 'react-router-dom';
import LoadMenu3 from './LoadMenu3';
import SocialLinks from './SocialLinks';
import useStore from '../../pages/store';

const Menu3 = () => {
    const url = process.env.REACT_APP_API_URL;
    const { searchOpen, toggleSearch } = useStore();
    const [items, setItems] = useState([]);
    const [menu1Items, setMenu1Items] = useState([]);
    const [menu2Items, setMenu2Items] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        axios(`${url}/home-menu-1`)
            .then((response) => {
                //console.log(response)
                setMenu1Items(response.data.items);
            }).catch( error => {
                console.warn(error)
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);

    const menuItems1 = () => {
        return menu1Items.map((item, index) => (
            <span key={index}>
                <LoadMenu3 id={item.id}/>
            </span>
        ));
    };

    useEffect(() => {
        axios(`${url}/home-menu-2`)
            .then((response) => {
                //console.log(response)
                setMenu2Items(response.data.items);
            }).catch( error => {
                console.warn(error)
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);


    // 1. check ArticleSetting.active
    // 2. check ArticleSetting.listing_type
    const menuItems2 = () => {
        return menu2Items.map((item, index) => {
            //console.log(item)
            if(item.article_setting  && item.article_setting.active === 1 ){

           

                if (item.descendants && item.descendants.length > 0) {

                    if(item.article_setting.listing_type != 'single_article'){

                        return (
                            <>
                                <NavLink to={`/listings/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                                
                            </>
                        )
                    }

                    return (
                        <li key={index} className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" role="button" id={`navbarDropdown${item.title}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {item.title}
                            </a>
                            <div className="dropdown-menu" aria-labelledby={`navbarDropdown${item.title}`} style={{ marginTop: "-10px" }}>
                                {item.descendants.map((descendant, idx) => (
                                    <>
                                    {descendant.article_setting && descendant.article_setting.redirect_url ? (
                                        <NavLink key={idx} to={descendant.article_setting.redirect_url} className="nav-link ml-3">
                                            {descendant.title}
                                        </NavLink>
                                        ) : (
                                        <>
                                        {descendant.article_setting && descendant.article_setting.listing_type === 'single_article' ?
                                            <NavLink key={idx}  to={`/listings/${descendant.id}`} className="nav-link">
                                                {descendant.title}
                                            </NavLink>
                                            :
                                            <NavLink key={idx}  to={`/listings/${descendant.id}`} className="nav-link">
                                                {descendant.title}
                                            </NavLink>
                                        }    
                                        </>
                                      
                                    )}
                                    </>
                                ))}
                            </div>
                        </li>
                    );
                } else {
                    return (
                        <li key={index} className="nav-item">
                      
                            {item.article_setting && item.article_setting.redirect_url ? (
                                <NavLink to={item.article_setting.redirect_url} className="nav-link">
                                    {item.title}
                                </NavLink>
                                ) : (
                                // <NavLink to={`/contents/${item.id}`} className="nav-link">
                                //     {item.title}
                                // </NavLink>
                                <>
                                {item.article_setting && item.article_setting.listing_type === 'single_article' ?
                                <NavLink to={`/listings/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                                :
                                <NavLink to={`/listings/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                                }
                                </>
                              
                            )}
    
                        </li>
                    );
                }

            } // active.check
            
        });
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#171717" }} id="navbardiatas">
            <Link to="/" className="navbar-brand ms-2">
                <img
                    src="/img/logortmbaharu2.png"
                    alt="Logo"
                />
            </Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbaratas" aria-controls="navbaratas" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbaratas">

                <ul className="navbar-nav mx-auto">
                    {menuItems1()}
                    {menuItems2()}
                </ul>

                <div className="d-flex align-items-center" style={{ gap: '5px' }}>
                    <SocialLinks />
                </div>

            </div>
        </nav>
    );
};

export default Menu3;
