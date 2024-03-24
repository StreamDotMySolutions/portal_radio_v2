import { useState } from 'react'
import { Button, Modal} from 'react-bootstrap'
import { InputText, InputTextarea } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import FormData from '../components/FormData'

export default function CreateModal() {
    const store = useStore()
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleShowClick = () =>{
      store.emptyData() // empty store data
      setShow(true)
    } 

    const handleCloseClick = () => {
      handleClose()
    }


    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
        
        const formData = new FormData() // data container
       
        if (store.getValue('name') != null ) {  // get role name entered by user
            formData.append('name', store.getValue('name')); // append to formData
        }
        // Laravel special
        formData.append('_method', 'post'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/roles`,
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
        <Button variant="primary" onClick={handleShowClick}>
          Create
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Create Role</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormData isLoading={isLoading} />
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
