import React from 'react';
import { Link } from 'react-router-dom';
import PlaceholderImage from './img/placeholder-282.png'

const WithPosterListing = ({title, items}) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const path = `${serverUrl}/storage/article_poster`;

    return (
        <div>
            <h2>{title}</h2>
            <div className="row">
                {items.map((item, index) => {
                    const redirectUrl = item.article_setting?.redirect_url;
                    const linkTo = redirectUrl ? redirectUrl : `/listings/${item.id}`;

                    return (
                        <div className="col-lg-6 col-md-12" key={index}>
                            <Link to={linkTo} className="text-decoration-none text-dark">
                                <div
                                    className="card mb-4 border-0"
                                    style={{
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                        transition: 'box-shadow 0.2s, transform 0.2s',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-md-4">
                                                <img
                                                    className="img-fluid"
                                                    src={item.article_poster ? `${path}/${item.article_poster.filename}` : PlaceholderImage}
                                                    alt={item.title}
                                                    style={{ borderRadius: '4px', width: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="col-md-8 mt-2 mt-md-0">
                                                <h5 className="card-title mb-1">{item.title}</h5>
                                                {item.description && (
                                                    <p className="card-text text-muted mb-0" style={{ fontSize: '0.9rem' }}>{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WithPosterListing;