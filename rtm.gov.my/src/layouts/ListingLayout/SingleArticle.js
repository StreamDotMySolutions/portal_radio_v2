import React, { useEffect, useState } from 'react';
import axios from 'axios';


const SingleArticle = ({id}) => {
    //const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios(`${url}/show/${id}`)
            .then(response => {
                //console.log(response)
                setTitle(response.data.title);
                setItems(response.data.items);
                setAncestors(response.data.ancestors);
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

    return (

        <div className="container-fluid" style={{ "marginTop": "4rem" }}>
            {loading ? (
                <></>
            ) : (
                <>{contentItems()}</>
            )}
        </div>

    );
};

export default SingleArticle;
