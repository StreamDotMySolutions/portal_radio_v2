import React from 'react';
import { Link } from 'react-router-dom';

const WithoutPosterListing = ({items}) => {

    const contentItems = () => {
        return items.map((item, index) => (

            <tr>
                <td>
       
                    <Link style={{textDecoration: "none", color:"#333333"}} to={`/contents/${item.id}`}>{item.title}</Link>
                </td>
            </tr>

        ));
    };


    return (
        <div>
           <table class="table table-bordered " id="table-id">
                <thead>
                <tr>
                    <th>Tajuk</th>
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