import { useEffect, useState } from 'react'
import { Button, Modal} from 'react-bootstrap'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function EditModal({id}) {
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
            url: `${store.url}/banners/${id}`,
            })
        .then( response => { // success 200
            //console.log(response)
            if( response?.data?.banner.hasOwnProperty('title') ){
              store.setValue('title', response?.data?.banner?.title )
            }
            if( response?.data?.banner.hasOwnProperty('description') ){
              store.setValue('description', response?.data?.banner?.description )
            }
            if( response?.data?.banner.hasOwnProperty('filename') ){
              store.setValue('filename', response?.data?.banner?.filename )
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
        { key: 'title', value: store.getValue('title') },
        { key: 'description', value: store.getValue('description') }, ,
      ];
      
      appendFormData(formData, dataArray);
        // Laravel special
        formData.append('_method', 'put'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/banners/${id}`,
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
            <Modal.Title>Edit Banner</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <HtmlForm isLoading={isLoading} />
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
