import React from 'react';
import { Link } from 'react-router-dom';

const DefaultListing = ({ items, page }) => {
    // Calculate the starting index of the current page
    const startIndex = page === 1 ? 1 : (page - 1) * 10 + 1;


    // Generate content items
    const contentItems = () => {
        return items.map((item, index) => (
            <li key={index}>
                <Link to={`/contents/${item.id}`}>{item.title}</Link>
            </li>
        ));
    };

    return (
        <ol start={startIndex}>
            {contentItems()}
        </ol>
    );
};

export default DefaultListing;
