import React, { useEffect, useState } from 'react';
import { Col, Row, Modal } from 'react-bootstrap';
import VideoBox from './VideoBox';
import axios from 'axios';
import HlsPlayer from '../../components/HlsPlayer';

const Youtube3 = () => {
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [items, setItems] = useState([]);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const handleClose = () => setShowModal(false);
    const handleShow = (videoId) => {
        setVideoUrl(videoId);
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
                    onClick={() => handleShow(`${item.embed_code}`)}
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
                   <HlsPlayer id={videoUrl} />
                   {/* <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                          className="embed-responsive-item"
                          src={videoUrl}
                          title="YouTube Video"
                          allowFullScreen
                        ></iframe>
                      </div> */}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Youtube3;
