import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BannerProgramme = ({ variant = 'desktop' }) => {
    const [items, setItems] = useState([]);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios(`${url}/home-programmes`)
            .then((response) => {
                setItems(response.data.items);
            });
    }, []);

    const programmeImage = (item, index) => (
        <Link className="nav-link" to={item.redirect_url} key={index}>
            <img
                className="rounded-3"
                className="img-fluid"
                src={`${serverUrl}/storage/programmes/${item.filename}`}
                alt={item.title}
            />
        </Link>
    );

    if (variant === 'mobile') {
        const groupedItems = [];
        for (let i = 0; i < items.length; i += 3) {
            groupedItems.push(items.slice(i, i + 3));
        }

        return (
            <div style={{ backgroundColor: '#2a197f', padding: '30px' }}>
                {groupedItems.map((group, groupIndex) => (
                    <div className="row" key={groupIndex}>
                        {group.map((item, index) => (
                            <div className='col mt-3' key={index}>
                                {programmeImage(item, index)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <nav className="navbar navbar-expand-sm shadow-sm" style={{ backgroundColor: '#2a197f', padding: '30px' }}>
            <ul className="navbar-nav mx-auto">
                {items.map((item, index) => (
                    <li className="nav-item" key={index}>
                        {programmeImage(item, index)}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BannerProgramme;
