import React from 'react';
import { Link } from 'react-router-dom';

const WithoutPosterListing = ({items}) => {

    const contentItems = () => {
        const currentDate = new Date();
    
        return items.map((item, index) => {
            // Check if the item is within the valid date range
            if (
                item.article_setting.published_start && 
                new Date(item.article_setting.published_start) <= currentDate &&
                (!item.article_setting.published_end || new Date(item.article_setting.published_end) >= currentDate)
            ) {
                return (
                    <tr key={index}>
                        <td>
                            <Link style={{textDecoration: "none", color:"#333333"}} to={`/contents/${item.id}`}>{item.title}</Link>
                        </td>
                    </tr>
                );
            } else {
                // Return null if the item should not be published
                return null;
            }
        });
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