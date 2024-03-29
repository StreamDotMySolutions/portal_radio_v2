import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Form,Badge, Button, Col, Modal, Row} from 'react-bootstrap'
import { InputDate, InputRadio, InputTextarea,appendFormData } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ArticleSetting() {
    const store = useStore()
    const { parentId } = useParams() // parentid
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleShowClick = () =>{
      //store.emptyData() // empty store data
      setShow(true)

        // // fetch data from server using given id
        // axios({ 
        //     method: 'get', 
        //     url: `${store.url}/articles/${parentId}`,
        //     })
        // .then( response => { // success 200
        //     //console.log(response)
        //     if( response?.data?.article.hasOwnProperty('description') ){
        //       store.setValue('description', response?.data?.article?.description )
        //     }
        //     setIsLoading(false) // animation
        //     })
        // .catch( error => {
        //     console.warn(error)
        //     setIsLoading(false) // animation
        // })
    } 

    const handleCloseClick = () => {
      handleClose()
    }


    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
    
        const formData = new FormData();
        const dataArray = [
            { key: 'description', value: store.getValue('description') },
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'put'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/articles/${parentId}`,
            data: formData
          })
          .then( response => { // success 200
            //console.log(response)
            store.setValue('refresh', true) // to force useEffect get new data for index
            setIsLoading(false) // animation
            handleClose() // close the modal
          })
          .catch( error => {
            //console.warn(error)
            
            if( error.response?.status == 422 ){ // detect 422 errors by Laravel
              console.log(error.response.data.errors)
              store.setValue('errors', error.response.data.errors ) // set the errors to store
            }
            setIsLoading(false) // animation
          })
    }
  
    return (
      <>
    

        <Button variant="outline-primary" size="sm" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'fa-cog']} />{' '}SETTINGS
        </Button>


        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
          </Modal.Header>

          <Modal.Body>
        
            <Form.Group className='col-2'>
              <InputRadio fieldName='Active' yesLabel='Yes' noLabel='No' />
            </Form.Group>
            <hr />
            <Form.Group>
              <Form.Label><h6>Publish Date</h6></Form.Label>
              <Row>
                <Col>
                  <InputDate fieldName='published_start' />
                </Col>
                <Col>
                  <InputDate fieldName='published_end' />
                </Col>
              </Row>
            </Form.Group>
          

          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              disabled={isLoading}
              variant="secondary" 
              onClick={handleCloseClick}>
              Close
            </Button>

            <Button 
              disabled={isLoading}
              variant="primary" 
              onClick={handleSubmitClick}>
              Submit
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
