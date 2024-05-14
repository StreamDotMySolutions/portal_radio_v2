import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import PlaceholderImage from './img/placeholder-282.png'

const WithPosterListing = ({items}) => {
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const path = `${serverUrl}/storage/article_poster`
  

    const contentItems = () => {
        const currentDate = new Date();
    
        return (
            <div className="row">
                {items.map((item, index) => {
                    // Check if the item is within the valid date range
                    if (
                        item.article_setting.published_start && 
                        new Date(item.article_setting.published_start) <= currentDate &&
                        (!item.article_setting.published_end || new Date(item.article_setting.published_end) >= currentDate)
                    ) {
                        return (
                            <div className="col-lg-6 col-md-12" key={index}>
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <Link to={`/contents/${item.id}`}>
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
                                                    <Link to={`/contents/${item.id}`}>
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
                    } else {
                        // Return null if the item should not be published
                        return null;
                    }
                })}
            </div>
        );
    };
    
    // const contentItems = () => {
    //     return (
    //         <div className="row">
    //             {items.map((item, index) => (
    //                 <div className="col-lg-6 col-md-12" key={index}>
    //                     <div className="card mb-4">
    //                         <div className="card-body">
    //                             <div className="row">
    //                                 <div className="col-md-4">
    //                                     <Link to={`/contents/${item.id}`}>
    //                                         {item.article_poster ? (
    //                                             <img
    //                                                 className="img-fluid img-thumbnail"
    //                                                 src={`${path}/${item.article_poster.filename}`}
    //                                                 alt={item.title}
    //                                             />
    //                                         ) : (
    //                                             <img
    //                                                 className="img-fluid img-thumbnail"
    //                                                 src={PlaceholderImage}
    //                                                 alt="Placeholder"
    //                                             />
    //                                         )}
    //                                     </Link>
    //                                 </div>
    //                                 <div className="col-md-8">
    //                                     <h5 className="card-title">
    //                                         <Link
    //                                             to={`/contents/${item.id}`}
                                            
    //                                         >
    //                                             {item.title}
    //                                         </Link>
    //                                     </h5>
    //                                     <p className="card-text">{item.description}</p>
                       
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // };
    


    return (
        <div>
            {contentItems()}
           {/* <table class="table border-0" id="table-id">
           
                <tbody>
                    {contentItems()}
                </tbody>
            </table> */}
        </div>
    );
};

export default WithPosterListing;