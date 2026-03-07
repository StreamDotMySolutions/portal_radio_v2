import React from 'react';
import { Link } from 'react-router-dom';

const WithoutPosterListing = ({title, items}) => {
    return (
        <div>
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
                                <i className="bi bi-chevron-right text-muted me-2" style={{ fontSize: '0.75rem' }}></i>
                                <span>{item.title}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default WithoutPosterListing;