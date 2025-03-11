import React from 'react';
import { Link } from 'react-router-dom';

const WithoutPosterListing = ({title,items}) => {

    const contentItems = () => {
        return items.map((item, index) => {
            const redirectUrl = item.article_setting.redirect_url;
            const linkTo = redirectUrl ? redirectUrl : `/listings/${item.id}`;
    
            return (
                <tr key={index}>
                    <td>
                        <Link 
                            style={{ textDecoration: "none", color: "#333333" }} 
                            to={linkTo}
                        >
                            {item.title}
                        </Link>
                    </td>
                </tr>
            );
        });
    };
    


    return (
        <div>
          <h2>{title}</h2>
           <table class="table table-bordered " id="table-id">
                <thead>
                <tr>
                    <th style={{backgroundColor: "#EAEAEA"}}>Tajuk</th>
                </tr>
                </thead>
                <tbody>
                    {contentItems()}
                </tbody>
            </table>
        </div>
    );
};

export default WithoutPosterListing;