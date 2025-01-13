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

    // upload
    useEffect( () => {
        if(store.getValue('article_gallery') !== null && store.getValue('article_gallery') !== ''){
            //console.log('upload')

            const formData = new FormData();
            const dataArray = [
                { key: 'article_gallery', value: store.getValue('article_gallery') }, // the image file
                { key: 'article_data_id', value: store.getValue('article_data_id') }, // which parent_id that gallery belongs to
            ];
            
            appendFormData(formData, dataArray);

            // Laravel special
            formData.append('_method', 'post'); // get|post|put|patch|delete

            // send to Laravel
            axios({ 
                method: 'post', 
                url: `${store.url}/article-galleries`,
                data: formData
            })
            .then( response => { // success 200
                console.log(response)
                store.setValue('article_gallery', null )
                setRefresh(true)
            })
            .catch( error => {
                //console.warn(error)
                
                if( error.response?.status == 422 ){ // detect 422 errors by Laravel
                    console.warn(error.response.data.errors)
                    store.setValue('errors', error.response.data.errors ) // set the errors to store
                }

            })
        }

    },[store.getValue('article_gallery')])

    
    const handleCopyClick = (value) => {
        navigator.clipboard.writeText(value)
            .then(() => {
               // console.log('Text copied to clipboard:', value);
                // Optionally, you can show a message to the user indicating the successful copy.
            })
            .catch((error) => {
                console.error('Failed to copy text to clipboard:', error);
            });
    };

    const handleDeleteClick = (id) => {
        const formData = new FormData() // data container  
        
        // Laravel special
        formData.append('_method', 'delete'); // get|post|put|patch|delete

         // send to Laravel
         axios({ 
                method: 'post', 
                url: `${store.url}/article-galleries/${id}`,
                data: formData
           })
           .then( response => { // success 200
                setRefresh(true)
           })
           .catch( error => {
                console.warn(error)
           })
    }


    return (
        <div>
            
            {/* <Table>

                <tbody>
                    
                    {items?.map((item,index) => (
          
                        <tr key={index}>
                            <td>
                                {item.filename && /\.(jpg|gif|png)$/.test(item.filename) ? (
                                    <img
                                        className='img-fluid rounded'
                                        src={`${path}/${item.filename}`}
                                        alt="Image"
                                    />
                                ) : (
                                    // Render something else if the filename extension is not jpg, gif, or png
                                    <div>Not an image</div>
                                )}
                            </td>
                        </tr>
                    ))}


                </tbody>
            </Table> */}

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