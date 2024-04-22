import { Link, useParams } from 'react-router-dom'
import { Col,Container, Breadcrumb} from 'react-bootstrap';
import { Menu1, Menu2 } from '../HomeLayout/components/Menu';
import HomeFooter from '../HomeLayout/components/HomeFooter';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContentLayout = () => {

    const { id } = useParams() // parentid

    
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState('');
    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect( () => {

        axios(`${url}/show/${id}`)
        .then( response => {
          console.log(response)
          setTitle(response.data.title)
          setItems(response.data.items)
        })
        .catch( error => {
          console.warn(error)
        })
      },[id])

      
      const contentItems = () => {
        return items.map((item, index) => (
            <div className='mb-2' key={index} dangerouslySetInnerHTML={{ __html: item.contents }} />
        ));
    };
      

    return (
        <>
            <Menu1 />
            <Container className='mb-3'> 
                <Col className="border border-1 rounded">
                    <Menu2 />
                </Col>

                <Col  style={{'minHeight': '10px'}}></Col>

                <Breadcrumb  className="border border-1 p-2 mb-2">
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                </Breadcrumb>
            
                <Col className="border border-1 p-2" style={{'minHeight': '500px'}}>
                    {contentItems()}
                </Col>
               
                <Col  style={{'minHeight': '20px'}}></Col>

                <Col className="border border-1" style={{'minHeight': '300px'}}>
                   <HomeFooter />
                </Col>
            </Container>
        </>
    );
};
export default ContentLayout;