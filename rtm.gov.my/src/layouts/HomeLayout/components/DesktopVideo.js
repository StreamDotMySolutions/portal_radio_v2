import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import VideoModal from './VideoModal';

const DesktopVideo = () => {
    const [items, setItems] = useState([]);
    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios(`${url}/home-videos`)
            .then((response) => {
                //console.log(response)
                setItems(response.data.items);
            });
    }, []);

    const videoItems = () => {
        return items.map((item, index) => (
            <Col key={index} className='col-12 col-md-3 mb-4'>
           
                <VideoModal 
                    filename={item.filename}
                    embed_code={item.embed_code}
                />
            </Col>
        ));
    };

    return (
        <>
        <div className="container-fluid" style={{ padding: '50px', background: 'linear-gradient(180deg, #103875 0%, #2f57ce 100%)' }}>
            <Row>
                {videoItems()}
            </Row>
        </div>
        </>
    );
};

export default DesktopVideo;