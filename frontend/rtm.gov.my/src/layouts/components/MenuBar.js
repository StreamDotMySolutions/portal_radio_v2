import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuGenerator from './MenuGenerator';
import { NavLink,Link } from 'react-router-dom';


const MenuBar = () => {
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


    


    return (
        <>
              <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ backgroundColor: "white" , color: "black"}} id="navbardibawah">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarbawah" aria-controls="navbarbawah" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
        
                    <div className="collapse navbar-collapse" id="navbarbawah">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">UTAMA</NavLink>
                            </li>
                            <MenuGenerator items={items} />
                            
                            <li className="nav-item dropdown">
        
                                <a className="nav-link dropdown-toggle" href="#"  role="button" data-toggle="dropdown">
                                    TV
                                </a>
                                <div className="dropdown-menu">

                                    <a className="dropdown-item text-dark" href="#">TV1</a>
                                    <a className="dropdown-item text-dark" href="#">TV2</a>
                                    <a className="dropdown-item text-dark" href="#">TV OKEY</a>

                                    <a className="dropdown-item text-dark" href="#">TV SUKAN
                                        
                                        <li className="nav-item dropdown">
                                            <div className="dropdown-menu">
                                                <a className="dropdown-item text-dark" href="#">Badminton</a>
                                            </div>    
                                        </li>

                                    </a>

                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
      
        </>
    );
};

export default MenuBar;
