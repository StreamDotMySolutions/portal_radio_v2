import { useEffect, useState } from 'react'
import { Button, Modal, Col} from 'react-bootstrap'
import { appendFormData, InputText } from '../components/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../store'
// import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function EditFolderModal({id}) {
    const store = useStore()
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleCloseClick = () => {
      store.emptyData() // empty store data
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
            url: `${store.url}/directories/${id}/show`,
            })
        .then( response => { // success 200
            console.log(response)
    
            if( response?.data?.staff.hasOwnProperty('name') ){
              store.setValue('name', response?.data?.staff?.name )
            }
           
            store.setValue('refresh', true) // to force useEffect get new data for index

            })
        .catch( error => {
            console.warn(error)

        })
        .finally(
          setIsLoading(false) // animation
        )
    } 

    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
        
      const formData = new FormData();
      const dataArray = [
 
        { key: 'name', value: store.getValue('name') },
       
      ];
      
      appendFormData(formData, dataArray);
        // Laravel special
        formData.append('_method', 'put'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/directories/${id}/update`,
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
        <Button size="sm" variant="outline-primary" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'pen-to-square']} />{' '}Edit
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Directory</Modal.Title>
          </Modal.Header>

          <Modal.Body>
                {store.getValue('name') != '' && (
                  <Col xs={12} className='border border-1 p-4 rounded mt-2' style={{'backgroundColor': '#EAEAEA'}}>
                  
                      <InputText 
                          fieldName='name' 
                          placeholder='Name'  
                          icon='fa-solid fa-pencil'
                          isLoading={isLoading}
                      />
                  </Col>
                )}   
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
               <FontAwesomeIcon icon={['fas', 'sync']} />{' '}Update
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
