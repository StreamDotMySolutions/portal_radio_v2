import { useState } from 'react'
import { Button, Modal, Form} from 'react-bootstrap'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DeleteModal({id}) {
    const store = useStore()
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleCloseClick = () => {
        handleClose()
    }

    /**
     * When user click edit, load the data
     */
    const handleShowClick = () =>{
      store.emptyData() // empty store data
      setShow(true)

        // fetch data from server using given id
        axios({ 
            method: 'get', 
            url: `${store.url}/programmes/${id}`,
            })
        .then( response => { // success 200
            //console.log(response)
            if( response?.data?.programme.hasOwnProperty('title') ){
              store.setValue('title', response?.data?.programme?.title )
            }
            if( response?.data?.programme.hasOwnProperty('redirect_url') ){
              store.setValue('redirect_url', response?.data?.programme?.redirect_url )
            }
            if( response?.data?.programme.hasOwnProperty('filename') ){
              store.setValue('filename', response?.data?.programme?.filename )
            }
            setIsLoading(false) // animation
            })
        .catch( error => {
            console.warn(error)
            setIsLoading(false) // animation
        })
    } 

    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
        
        const formData = new FormData() // data container
       
        if (store.getValue('acknowledge') != null ) {  // get role acknowledge entered by user
            formData.append('acknowledge', store.getValue('acknowledge')); // append to formData
        }

        // Laravel special
        formData.append('_method', 'delete'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/programmes/${id}`,
            data: formData
          })
          .then( response => { // success 200
            //console.log(response)
            store.setValue('refresh_programmes', true) // to force useEffect get new data for index
            setIsLoading(false) // animation
            handleClose() // close the modal
          })
          .catch( error => {
            //console.warn(error)
            
            if( error.response?.status == 422 ){ // detect 422 errors by Laravel
              //console.log(error.response.data.errors)
              store.setValue('errors', error.response.data.errors ) // set the errors to store
            }
            setIsLoading(false) // animation
          })
    }
  
    return (
      <>
        <Button size="sm" variant="outline-danger" onClick={handleShowClick}>
        <FontAwesomeIcon icon={['fas', 'trash']} />{' '}Delete
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Programme</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <HtmlForm isLoading={isLoading} />        
          </Modal.Body>
          
          <Modal.Footer>

            <Form.Check
              className='me-4'
              isInvalid={errors?.hasOwnProperty('acknowledge')}
              reverse
              disabled={isLoading}
              label="acknowledge"
              type="checkbox"
              onClick={ () => store.setValue('errors', null) }
              onChange={ (e) => store.setValue('acknowledge', true) }
            />

            <Button 
              disabled={isLoading}
              variant="secondary" 
              onClick={handleCloseClick}>
              Close
            </Button>

            <Button 
              disabled={isLoading}
              variant="danger" 
              onClick={handleSubmitClick}>
              Delete
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
