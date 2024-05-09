import React, { useEffect, useState } from 'react';
import { Col, Row, Modal } from 'react-bootstrap';
import VideoBox from './VideoBox';
import axios from 'axios';

const Youtube3 = () => {
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [items, setItems] = useState([]);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const handleClose = () => setShowModal(false);
    const handleShow = (url) => {
        setVideoUrl(url);
        setShowModal(true);
    };

    useEffect(() => {
        axios(`${url}/home-videos`)
            .then((response) => {
                setItems(response.data.items);
            });
    }, []);

    const videoItems = () => {
        return items.map((item, index) => (
            <Col key={index} className='col-6 mb-4'>
                <img
                    className="img-fluid"
                    src={`${serverUrl}/storage/videos/${item.filename}`}
                    style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                    onClick={() => handleShow(`https://www.youtube.com/embed/${item.redirect_url}?autoplay=1&mute=1&playsinline=1&loop=1&controls=0&disablekb=1&showinfo=0`)}
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

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Body>
                   
                   <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                          className="embed-responsive-item"
                          src={videoUrl}
                          title="YouTube Video"
                          allowFullScreen
                        ></iframe>
                      </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Youtube3;
