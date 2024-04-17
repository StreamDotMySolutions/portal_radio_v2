import  { useEffect, useState } from 'react'
import { Image, Col, Row, Placeholder } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom';

const HomeVideo = () => {

    const url = process.env.REACT_APP_API_URL
    const serverUrl = process.env.REACT_APP_SERVER_URL
    const [items,setItems] = useState([])

    useEffect( () => {
    
        axios(`${url}/home-videos`)
        .then( response => {
          //console.log(response)
          setItems(response.data.items)
        })
    
      },[])

    const videoItems = () => {

        return items.map( (item, index) => (
            <Col className='bg-secondary m-4 rounded ' style={{'minHeight': '300px'}}></Col>
        ))
    }


    return (
        <Row>
            {videoItems()}
        </Row>
    );
};

export default HomeVideo;