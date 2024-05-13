import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadMenu2 from './LoadMenu2';
import { NavLink,Link } from 'react-router-dom';

const Menu2 = () => {
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        axios(`${url}/home-menu-2`)
            .then((response) => {
                console.log(response)
                setItems(response.data.items);
            }).catch( error => {
                console.warn(error)
            }).finally(() => {
                setIsLoading(false);
            });
    }, []);


    const menuItems = () => {
        return items.map((item, index) => {

            if(item.article_setting && item.article_setting?.show_children == 1) {
                if (item.descendants && item.descendants.length > 0) {
                    return (
                        <li key={index} className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id={`navbarDropdown${item.title}`} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {item.title}
                            </a>
                            <div className="dropdown-menu" aria-labelledby={`navbarDropdown${item.title}`} style={{ marginTop: "-10px" }}>
                                {item.descendants.map((descendant, idx) => (
                                    <>
                                    {descendant.article_setting && descendant.article_setting.redirect_url ? (
                                        <NavLink key={idx} to={descendant.article_setting.redirect_url} className="nav-link">
                                            {descendant.title}
                                        </NavLink>
                                        ) : (
                                        <NavLink key={idx}  to={`/contents/${descendant.id}`} className="nav-link">
                                            {descendant.title}
                                        </NavLink>
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
                                <NavLink to={`/contents/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                            )}
    
                        </li>
                    );
                }
            } else {
                return (
                    <li key={index} className="nav-item">
                  
                        {item.article_setting && item.article_setting.redirect_url ? (
                            <NavLink to={item.article_setting.redirect_url} className="nav-link">
                                {item.title}
                            </NavLink>
                            ) : (
                            <NavLink to={`/listings/${item.id}`} className="nav-link">
                                {item.title}
                            </NavLink>
                        )}

                    </li>
                );
            }
    
        });
    };
    


    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ backgroundColor: "white" , color: "black"}} id="navbardibawah">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarbawah" aria-controls="navbarbawah" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarbawah">
                <ul className="navbar-nav mx-auto">
                   {menuItems()}
                </ul>
            </div>
        </nav>
    );
};

export default Menu2;
