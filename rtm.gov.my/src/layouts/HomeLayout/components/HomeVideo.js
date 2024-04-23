import React, { useEffect, useState } from 'react';
import { Image, Col, Row, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

const HomeVideo = () => {
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
            <Col key={index} xs={12} sm={6} md={3} className='d-flex justify-content-center' style={{ minHeight: '300px' }}>
                <Image
                    style={{ width: '300px', cursor: 'pointer' }}
                    className="d-block rounded"
                    src={`${serverUrl}/storage/videos/${item.filename}`}
                    alt={item.description}
                    onClick={() => handleShow(item.redirect_url)}
                />
            </Col>
        ));
    };

    return (
        <div>
            <Row>
                {videoItems()}
            </Row>
            <Modal size={'lg'} show={showModal} onHide={handleClose} className='bg-dark'>
                <Modal.Header closeButton>
                    <Modal.Title>YouTube Video</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <div className="embed-responsive embed-responsive-16by9">
                
                        <YouTube videoId={videoUrl} className="embed-responsive-item" opts={{ playerVars: { autoplay: 1 } }} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HomeVideo;
