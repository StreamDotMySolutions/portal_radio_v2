import React, { useEffect, useState } from 'react';
import { Image, Col, Row, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomeFooter = () => {

    const [items, setItems] = useState([]);
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect( () => {
        const id = 65
        axios(`${url}/articles/${id}`)
        .then( response => {
          console.log(response)
          setItems(response.data.articles)
        })
        .catch( error => {
          console.warn(error)
        })
      },[])

      const footerItems = () => {
        return items.map((item, index) => (
            <li key={index}>
                <strong>
                    <Link to={`/contents/${item.id}`}>{item.title}</Link>
                </strong>
            </li>
        
        ));
    };


    return (
        <Row>

        <Col className='m-2 text-center'>
            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
        </Col>
        <Col className='m-2'>
        <ul style={{'listStyleType':'none'}}>
            {footerItems()}
        </ul>

        </Col>
        <Col className='m-2'>
        <span>
            Radio Televisyen Malaysia <br />
            Angkasapuri Kota Media <br />
            50614 Kuala Lumpur <br />
            <br />
            aduan [at] rtm.gov.my<br />
            Tel: 03 - 2282 5333<br />
            Faks: 03 - 2284 7591<br />
        </span>
        </Col>

        <Col className='m-2 text-center'>
            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />
            <img className='mb-2' src="https://via.placeholder.com/180x50" alt="Placeholder Image" width="180" height="50" />

        </Col>
    </Row>
    );
};

export default HomeFooter;