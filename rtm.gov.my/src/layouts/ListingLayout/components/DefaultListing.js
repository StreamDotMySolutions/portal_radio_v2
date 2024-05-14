import React from 'react';
import { Link } from 'react-router-dom';

const DefaultListing = ({ items, page }) => {
    // Calculate the starting index of the current page
    const startIndex = page === 1 ? 1 : (page - 1) * 10 + 1;

    // Generate content items
    const contentItems = () => {
        const currentDate = new Date();
    
        return items.map((item, index) => {
            if (
                item.article_setting.published_start && 
                new Date(item.article_setting.published_start) <= currentDate &&
                (!item.article_setting.published_end || new Date(item.article_setting.published_end) >= currentDate)
            ) {
                return (
                    <li key={index}>
                        <Link to={`/contents/${item.id}`}>{item.title}</Link>
                    </li>
                );
            } else {
                // Return null if the item should not be published
                return null;
            }
        });
    };
    
    

    return (
        <ol start={startIndex}>
            {contentItems()}
        </ol>
    );
};

export default DefaultListing;
