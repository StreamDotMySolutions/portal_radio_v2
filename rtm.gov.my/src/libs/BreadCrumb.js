import React from 'react'
import { Link} from 'react-router-dom'

const BreadCrumb = ({items}) => {
    return (
        
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {/* Mapping over items.links */}
                {items?.map((page, index) => (
                        // Each iteration renders a list item with a link
                    <li key={index} className="breadcrumb-item">
                        <Link to={page.url}>{page.label}</Link>
                    </li>
                ))}
            </ol>
        </nav>
        
    );
};

export default BreadCrumb;