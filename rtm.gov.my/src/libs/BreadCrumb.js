import React from 'react';
import { Link } from 'react-router-dom';

const BreadCrumb = ({ items, className = 'breadcrumb' }) => {
    return (
        <ul className={className} style={{ marginTop: '40px' }}>
            {items?.map((page, index) => (
                <li key={index}>
                    {page.url ? <Link to={page.url}>{page.label}</Link> : page.label}
                </li>
            ))}
        </ul>
    );
};

export default BreadCrumb;
