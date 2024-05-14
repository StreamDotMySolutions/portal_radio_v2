import React, { useEffect, useState } from 'react';
import axios from 'axios';


const SingleArticle = ({id}) => {
    //const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState([]);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios(`${url}/show/${id}`)
            .then(response => {
                //console.log(response)
                setTitle(response.data.title);
                setItems(response.data.items);
                setAncestors(response.data.ancestors);
                setSettings(response.data.settings);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id]);

    const contentItems = () => {
        return items.map((item, index) => (
            <div className='mb-2' key={index} dangerouslySetInnerHTML={{ __html: item.contents }} />
        ));
    };

    const today = new Date();
    const currentDay = today.getDay(); // Gets the current day (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

    // Define a function to check if content should be rendered based on the day
    const shouldRenderContent = () => {
        if (settings.published_start) {
            // Get the current date
            const currentDate = new Date();
            // Get the published start date from settings.published_start
            const publishedStartDate = new Date(settings.published_start);
            // Compare the current date to the published start date
            if (currentDate < publishedStartDate) {
                // If current date is before published start date, return false
                return false;
            }
        }
        if (settings.published_end) {
            // Get the current date
            const currentDate = new Date();
            // Get the published end date from settings.published_end
            const publishedEndDate = new Date(settings.published_end);
            // Compare the current date to the published end date
            if (currentDate > publishedEndDate) {
                // If current date is after published end date, return false
                return false;
            }
        }
        // If published start date is null or current date is after published start date, return true
        return true;
    };

    return (

        <div className="container-fluid" style={{ "marginTop": "4rem" }}>
            {shouldRenderContent() ? (
                <>
                    {/* Render contentItems if shouldRenderContent returns true */}
                    {contentItems()}
                </>
            ) : (
                // Render nothing if shouldRenderContent returns false
                <></>
            )}
        </div>

    );
};

export default SingleArticle;
