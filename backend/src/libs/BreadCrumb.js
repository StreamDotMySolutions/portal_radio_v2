import React from 'react'
import { Link} from 'react-router-dom'
import useStore from '../pages/store';
import { useNavigate } from 'react-router-dom';

const BreadCrumb = ({ items }) => {

    const navigate = useNavigate();

    const store = useStore()
    const setUrl = (url) => {
        console.log(url)
        //store.setValue('url', url)
        navigate(url); // Navigate to the URL
    }

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {/* Mapping over items */}
                {items?.map((page, index) => (
                    <li key={index} className="breadcrumb-item">
                        {/* Check if the item is the last one */}
                        {index === items.length - 1 ? (
                            // Last item, render as plain text
                            page.label
                        ) : (
                            // Other items, render as a link
                            <Link 
                                onClick={() => {
                                    setUrl(page.url)
                                    //console.log(`Navigating to ${page.url}`);
                                    // Add additional logic here if needed
                                }}
                                to={page.url}>{page.label}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};


export default BreadCrumb;