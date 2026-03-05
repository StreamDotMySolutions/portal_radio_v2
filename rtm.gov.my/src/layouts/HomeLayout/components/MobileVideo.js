import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import HlsPlayer from '../../components/HlsPlayer';

const MobileVideo = () => {
    const [activeVideo, setActiveVideo] = useState(null);
    const [items, setItems] = useState([]);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios(`${url}/home-videos`)
            .then((response) => {
                setItems(response.data.items);
            });
    }, []);

    return (
        <div className="container-fluid" style={{ padding: '30px', background: 'linear-gradient(180deg, #103875 0%, #2f57ce 100%)' }}>
            {activeVideo ? (
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setActiveVideo(null)}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            zIndex: 10,
                            background: 'rgba(0,0,0,0.6)',
                            border: 'none',
                            color: '#fff',
                            fontSize: '1.4rem',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            lineHeight: '1',
                        }}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <HlsPlayer id={activeVideo} />
                </div>
            ) : (
                <Row>
                    {items.map((item, index) => (
                        <Col key={index} xs={6} className="mb-3">
                            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveVideo(item.embed_code)}>
                                <img
                                    className="img-fluid"
                                    src={`${serverUrl}/storage/videos/${item.filename}`}
                                    alt={item.description || 'Video thumbnail'}
                                    style={{ width: '100%', borderRadius: '4px' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}>
                                    <img src="/img/play.png" alt="Play" style={{ width: '40px', opacity: 0.9 }} />
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default MobileVideo;
