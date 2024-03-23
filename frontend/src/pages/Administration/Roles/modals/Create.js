import { useState } from 'react'
import { Button, Modal} from 'react-bootstrap'
import { InputText, InputTextarea } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

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

    const handleSubmitClick = () => {
        
        const formData = new FormData()
        // get role name entered by user
        if (store.getValue('name') != null ) {
            formData.append('name', store.getValue('name'));
        }
        // send to Laravel
        axios({ 
            method: 'post',
            url: `${store.url}/roles`,
            data: formData
          })
          .then( response => {
            console.log(response)
          })
          .catch( error => {
            console.warn(error)
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
            <InputText 
              fieldName='name' 
              placeholder='Role name'  
              icon='fa-solid fa-pencil'
              isLoading={isLoading}
            />
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
