import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import PlaceholderImage from './img/placeholder-282.png'

const WithPosterListing = ({items}) => {
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const path = `${serverUrl}/storage/article_poster`
  

    // const contentItems = () => {
    //     return items.map((item, index) => (

    //     <tr key={index}> 
    //         <td style={{ width: '300px', verticalAlign: 'middle' }}>
    //             {item.article_poster ?
    //                 <img className='img-fluid img-thumbnail' src={`${path}/${item.article_poster.filename}`} />
    //                 :
    //                 <img className='img-fluid img-thumbnail' src={PlaceholderImage} />
    //             }
    //         </td>
    //         <td className='p-3'>

    //             <h5 className='display-5'>{item.title}</h5>
    //             <p className='lead'>{item.description}</p>
                
    //             <Button style={{backgroundColor:'orange', color:'black', fontWeight: 'normal'}} className="float-right">
    //                 <Link to={`/contents/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    //                     {item.title} &raquo;
    //                 </Link>
    //             </Button>
    //         </td>
    //     </tr>

    //     ));
    // };
    const contentItems = () => {
        return (
            <div className="row">
                {items.map((item, index) => (
                    <div className="col-lg-6 col-md-12" key={index}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
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
                                    </div>
                                    <div className="col-md-8">
                                        <h5 className="card-title">{item.title}</h5>
                                        <p className="card-text">{item.description}</p>
                                        <Button
                                            style={{ backgroundColor: 'orange', color: 'black', fontWeight: 'normal' }}
                                            className="float-right"
                                        >
                                            <Link
                                                to={`/contents/${item.id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                {item.title} &raquo;
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    


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