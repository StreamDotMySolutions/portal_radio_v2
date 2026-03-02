import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import PlaceholderImage from './img/placeholder-282.png'

const WithPosterListing = ({title,items}) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const path = `${serverUrl}/storage/article_poster`
  

    
    
    const contentItems = () => {
        return (
            <>
            <h2>{title}</h2>
            <div className="row">
                
                
                {items.map((item, index) => {
                    const redirectUrl = item.article_setting?.redirect_url;
                    const linkTo = redirectUrl ? redirectUrl : `/listings/${item.id}`;
    
                    return (
                        <div className="col-lg-6 col-md-12" key={index}>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <Link to={linkTo}>
                                                {item.article_poster ? (
                                                    <img
                                                        className="img-fluid img-thumbnail"
                                                        src={`${path}/${item.article_poster.filename}`}
                                                        alt={item.title}
                                                    />
                                                ) : (
                                                    <img
                                                        className="img-fluid img-thumbnail"
                                                        src={PlaceholderImage}
                                                        alt="Placeholder"
                                                    />
                                                )}
                                            </Link>
                                        </div>
                                        <div className="col-md-8">
                                            <h5 className="card-title">
                                                <Link to={linkTo}>
                                                    {item.title}
                                                </Link>
                                            </h5>
                                            <p className="card-text">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            </>
        );
    };
    
    


    return (
        <div>
            {contentItems()}
        </div>
    );
};

export default WithPosterListing;