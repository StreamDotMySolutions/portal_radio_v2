import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadMenu from './LoadMenu1';
import { Link, NavLink } from 'react-router-dom';
import SocialLinks from './SocialLinks';

const Menu1 = () => {
    const url = process.env.REACT_APP_API_URL;
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

        // 1. check ArticleSetting
        // 2. check active | true or false
        // 3. check show_children | yes or no
        // 4. check listing_type | single_article or listing
    
        return items.map((item, index) => (
            <span key={index}>
               
                {item.article_setting && item.article_setting.active == 1 && // check active

                    <>
                    {item.article_setting.show_children && item.article_setting.show_children == 1 ?
                        <LoadMenu key={index} id={item.id}/>
                        :
                        <>
                            <li key={index} className="nav-item">
                     
                                <NavLink to={`/listings/${item.id}`} className="nav-link">
                                    {item.title}
                                </NavLink>
                            
                            </li>
                        </>
                    }
                    </>
                } 

                
            </span>
        ));
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#171717" }} id="navbardiatas">
            <Link to="/" className="navbar-brand">
                <img 
                    className="img-responsive" 
                    className="ms-3"
                    src="/img/logortmbaharu2.png" 
                    alt="Logo RTM"
                />
            </Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbaratas" aria-controls="navbaratas" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbaratas">

                <ul className="navbar-nav ml-auto">
                    {isLoading === false } {menuItems()}
                </ul>
                
                <div className="d-flex">
                    <SocialLinks />
                </div>
                
            </div>
        </nav>
    );
};

export default Menu1;
