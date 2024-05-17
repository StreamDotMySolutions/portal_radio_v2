import React from 'react';
import { Link } from 'react-router-dom';

const DefaultListing = ({ items, page }) => {
    // Calculate the starting index of the current page
    const startIndex = page === 1 ? 1 : (page - 1) * 10 + 1;

    const contentItems = () => {
        return items.map((item, index) => {
            const redirectUrl = item.article_setting?.redirect_url;
            const linkTo = redirectUrl ? redirectUrl : `/listings/${item.id}`;

            return (
                <li key={index}>
                    <Link to={linkTo}>{item.title}</Link>
                </li>
            );
        });
    };
    

    return (
        <ol start={startIndex}>
            {contentItems()}
        </ol>
    );
};

export default DefaultListing;
