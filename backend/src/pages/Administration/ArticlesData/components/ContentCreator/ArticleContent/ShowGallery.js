import React, { useState, useEffect } from 'react'
import { Table,Form } from 'react-bootstrap'
import { Row, Col, Figure, Modal, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom'
import useStore from '../../../../../store'
import axios from '../../../../../../libs/axios'
import PaginatorLink from '../../../../../../libs/PaginatorLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputFile,appendFormData } from '../../../../../../libs/FormInput'


const ShowGallery = ({article_data_id}) => {
    const store = useStore() // store management
   
    const url = store.url + '/article-galleries/' + article_data_id // set the index url to /api/article-galleries/{parentId}
    const [isLoading, setIsLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [items, setItems] = useState([]) // data placeholder

    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const path = `${serverUrl}/storage/article_galleries`

    const [dimensions, setDimensions] = useState({});
    const [modalInfo, setModalInfo] = useState({ show: false, src: '', width: 0, height: 0 });

    const handleImageLoad = (event, index) => {
      const { naturalWidth, naturalHeight } = event.target;
      setDimensions(prev => ({
        ...prev,
        [index]: { width: naturalWidth, height: naturalHeight }
      }));
    };

    const handleImageClick = (src, width, height) => {
        setModalInfo({ show: true, src, width, height });
      };
    
    const handleClose = () => {
        setModalInfo({ show: false, src: '', width: 0, height: 0 });
    };
    
    // to get items data
    useEffect( () => 
        {
            // modified axios to prepend Bearer Token on header
            axios( 
                {
                    method: 'get', // method is GET
                    url: store.getValue('url') ? store.getValue('url') : url
                } 
            )
            .then( response => { // response block
                //console.log(response.data.article_galleries)
                setRefresh(false)
                setItems(response.data.article_galleries)
                //setItems(response.data.articles) // get the data
                //store.setValue('refresh', false ) // reset the refresh state to false
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })
      },[refresh] ) // useEffect()

    return (
      <div>
          
        <Row>
          {items?.map((item, index) => (
            <Col key={index} md={3} className="mb-4">
              {item.filename && /\.(jpg|gif|png)$/.test(item.filename) ? (
                <Figure>
                  <Figure.Image
                    src={`${path}/${item.filename}`}
                    alt="Image"
                    className='rounded'
                    onLoad={(e) => handleImageLoad(e, index)}
                    onClick={() => handleImageClick(`${path}/${item.filename}`, dimensions[index]?.width, dimensions[index]?.height)} // Open modal on click
                    style={{ cursor: 'pointer' }}
                  />
                  <Figure.Caption>
                    {`Width: ${dimensions[index]?.width || '-'} px, Height: ${dimensions[index]?.height || '-'} px`}
                  </Figure.Caption>
                </Figure>
              ) : (
                <div>Not an image</div>
              )}
            </Col>
          ))}
        </Row>

        <Modal show={modalInfo.show} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Image Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={modalInfo.src}
              alt="Full Image"
              style={{ width: `${modalInfo.width}px`, height: `${modalInfo.height}px` }}
              className="img-fluid"
            />
            <p className="mt-3">{`Width: ${modalInfo.width}px, Height: ${modalInfo.height}px`}</p>
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
export default ShowGallery