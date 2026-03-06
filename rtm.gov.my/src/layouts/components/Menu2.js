import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Menu2 = () => {
    const url = process.env.REACT_APP_API_URL;
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        axios(`${url}/home-menu-2`)
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
            if(item.article_setting && item.article_setting?.active === 1) {
                if( item.article_setting?.show_children === 1) {
                    if (item.children && item.children.length > 0) {
                        return (
                            <li key={index} className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" role="button" id={`navbarDropdown${item.title}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {item.title}
                                </a>
                                <div className="dropdown-menu" aria-labelledby={`navbarDropdown${item.title}`} style={{ marginTop: "-10px" }}>
                                    {item.children.map((child, idx) => (
                                        <>
                                        {child.article_setting && child.article_setting.redirect_url ? (
                                            <NavLink key={idx} to={child.article_setting.redirect_url} className="nav-link">
                                                {child.title} 
                                            </NavLink>
                                            ) : (
                                            <NavLink key={idx}  to={`/listings/${child.id}`} className="nav-link">
                                                {child.title} 
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
                                    <NavLink to={`/listings/${item.id}`} className="nav-link">
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
            }
        });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ backgroundColor: "white" }} id="navbardibawah">
            <style>{`#navbardibawah .nav-link { color: #303381 !important; } #navbardibawah .nav-link:hover { color: #F8A131 !important; } #navbardibawah .nav-link.active { color: white !important; }`}</style>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarbawah" aria-controls="navbarbawah" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarbawah">
                <ul className="navbar-nav mx-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">UTAMA</NavLink>
                    </li>
                   {menuItems()}
                </ul>
            </div>
        </nav>
    );
};

export default Menu2;
