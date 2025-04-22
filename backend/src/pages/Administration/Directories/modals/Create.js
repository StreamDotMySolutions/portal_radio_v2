import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Modal} from 'react-bootstrap'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../store'
import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CreateModal({parentId}) {
    const store = useStore()
    //const { parentId } = useParams() // parentid
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
      store.emptyData() // empty store data
      handleClose()
    }


    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {

        // clear previous error
        store.setValue('error', '') // empty errors data
    
        const formData = new FormData();
        const dataArray = [
          { key: 'type', value: 'spreadsheet' },
          { key: 'photo', value: store.getValue('photo') },
          { key: 'name', value: store.getValue('name') },
          { key: 'occupation', value: store.getValue('occupation') },
          { key: 'email', value: store.getValue('email') }, 
          { key: 'phone', value: store.getValue('phone') },
          { key: 'facebook', value: store.getValue('facebook') },
          { key: 'twitter', value: store.getValue('twitter') },
          { key: 'instagram', value: store.getValue('instagram') },
          { key: 'address', value: store.getValue('address') },
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'post'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/directories/${parentId}/create`,
            data: formData
          })
          .then( response => { // success 200
            //console.log(response)
        
            setIsLoading(false) // animation
            store.setValue('refresh', true) // to force useEffect get new data for index
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
          <FontAwesomeIcon icon={['fas', 'user-circle']} />{' '}Add
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Create Staff</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <HtmlForm isLoading={isLoading} />
          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              disabled={isLoading}
              variant="secondary" 
              onClick={handleCloseClick}>
              <FontAwesomeIcon icon={['fas', 'times-circle']} />{' '}Close
            </Button>

            <Button 
              disabled={isLoading}
              variant="primary" 
              onClick={handleSubmitClick}>
              <FontAwesomeIcon icon={['fas', 'upload']} />{' '}Submit
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
