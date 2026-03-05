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

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const contentItems = () => {
        if(items.length > 0)
            {
                return items.map((item, index) => {
                    if (item.contents === 'pdf') {
                        if (!item.article_pdf) return null;
                        const pdfUrl = `${serverUrl}/storage/article_pdf/${item.article_pdf.filename}`;
                        return (
                            <div className='mb-4' key={index}>
                                <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                            </div>
                        );
                    }
                    if (item.contents === 'gallery') {
                        return <PageGallery key={index} article_data_id={item.id} />;
                    }
                    return (
                        <div key={index} className='mb-2'>
                            <div dangerouslySetInnerHTML={{ __html: item.contents }} />
                        </div>
                    );
                });
            }
        return null;

    };

    return (

        <div className="mt-5">
            <h2>{title}</h2>
            <div className="mt-3">
                {contentItems()}
            </div>
            <hr />
            <p className='text-muted'>Tarikh akhir kemaskini: {updatedAt}</p>
        </div>

    );
};

export default SingleArticle;
