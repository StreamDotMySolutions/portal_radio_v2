import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageGallery from './components/PageGallery';


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
        if(items.length > 0)
            {
                return items.map((item, index) => (
                    <>
                    {/* <div className='mb-2' key={index} dangerouslySetInnerHTML={{ __html: item.contents }} /> */}

                    {item.contents === 'gallery' ? (
                        <>
                            <PageGallery article_data_id={item.id} />
                        </>
                        ) : (
                            <div key={index} className='mb-2' >
                                {/* Render HTML content */}
                                <div dangerouslySetInnerHTML={{ __html: item.contents }} />
                            </div>
                        )}
                    </>
                ));
            }
        return null;
     
    };

    const today = new Date();
    const currentDay = today.getDay(); // Gets the current day (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

    // Define a function to check if content should be rendered based on the day


    return (

        <div className="container-fluid" style={{ "marginTop": "4rem" }}>
         
            {/* Render contentItems if shouldRenderContent returns true */}
            {contentItems()}
                
        </div>

    );
};

export default SingleArticle;
