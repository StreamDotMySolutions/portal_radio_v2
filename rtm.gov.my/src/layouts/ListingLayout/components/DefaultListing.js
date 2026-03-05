import React from 'react';
import { Link } from 'react-router-dom';

const DefaultListing = ({ title, items, page }) => {
    const startIndex = page === 1 ? 1 : (page - 1) * 10 + 1;

    return (
        <>
            <h2>{title}</h2>
            <div className="list-group list-group-flush mt-3">
                {items.map((item, index) => {
                    const redirectUrl = item.article_setting?.redirect_url;
                    const linkTo = redirectUrl ? redirectUrl : `/listings/${item.id}`;

                    return (
                        <Link
                            key={index}
                            to={linkTo}
                            className="list-group-item list-group-item-action border-0 px-0 py-3"
                            style={{ borderBottom: '1px solid #eee' }}
                        >
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-3" style={{ fontSize: '0.85rem', minWidth: '24px' }}>
                                    {startIndex + index}.
                                </span>
                                <span>{item.title}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default DefaultListing;
