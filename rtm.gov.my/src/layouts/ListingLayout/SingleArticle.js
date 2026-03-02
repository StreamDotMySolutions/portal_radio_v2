import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageGallery from './components/PageGallery';


const SingleArticle = ({id}) => {
    //const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [title, setTitle] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState([]);
    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios(`${url}/show/${id}`)
            .then(response => {
                setTitle(response.data.title);
                setUpdatedAt(response.data.settings.updated_at);
                setItems(response.data.items); // article data
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

    return (

        <div className="mt-5">
         
            {/* Render contentItems if shouldRenderContent returns true */}
            <h2>{title}</h2>
            <br />
            {contentItems()}
            <hr />
            <p className='text-muted'>Tarikh akhir kemaskini: {updatedAt}</p>
        </div>

    );
};

export default SingleArticle;
