import React from 'react';
import { Link } from 'react-router-dom';


const DefaultListing = ({items}) => {

    const contentItems = () => {
        return items.map((item, index) => (
            <li key={index}>
                <Link to={`/contents/${item.id}`}>{item.title}</Link>
            </li>
        ));
    };

    return (
   
        <ol>
            {contentItems()}
        </ol>
   
    );
};

export default DefaultListing;