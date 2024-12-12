import React from 'react'
import { Link} from 'react-router-dom'

const BreadCrumb = ({ items }) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {/* Mapping over items */}
                {items?.map((page, index) => (
                    <li key={index} className="breadcrumb-item">
                        {/* Check if the item is the last one */}
                        {index === items.length - 1 ? (
                            // Last item, render as plain text
                            page.label
                        ) : (
                            // Other items, render as a link
                            <Link to={page.url}>{page.label}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};


export default BreadCrumb;