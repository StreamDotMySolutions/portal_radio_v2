import { useEffect, useState } from 'react'
import { Form,Button, Modal} from 'react-bootstrap'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
            url: `${store.url}/vods/${id}`,
            })
        .then( response => { // success 200
            //console.log(response)
            if( response?.data?.vod.hasOwnProperty('name') ){
              store.setValue('name', response?.data?.vod?.name )
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
        
      const formData = new FormData();
      const dataArray = [
          { key: 'name', value: store.getValue('name') },
      ];

             
      if (store.getValue('acknowledge') != null ) {  // get role acknowledge entered by user
        formData.append('acknowledge', store.getValue('acknowledge')); // append to formData
      }

  
      // Laravel special
      formData.append('_method', 'delete'); // get|post|put|patch|delete

      appendFormData(formData, dataArray);

      // send to Laravel
      axios({ 
            method: 'post', 
            url: `${store.url}/vods/${id}`,
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
            <Modal.Title>Delete vod</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <center><h1>Delete ?</h1></center>
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
              variant="primary" 
              onClick={handleSubmitClick}>
              Submit
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
