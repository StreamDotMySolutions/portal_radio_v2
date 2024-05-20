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
            url: `${store.url}/videos/${id}`,
            })
        .then( response => { // success 200
            //console.log(response)
            if( response?.data?.video.hasOwnProperty('title') ){
              store.setValue('title', response?.data?.video?.title )
            }
            if( response?.data?.video.hasOwnProperty('embed_code') ){
              store.setValue('embed_code', response?.data?.video?.embed_code )
            }

            if( response?.data?.video.hasOwnProperty('filename') ){
              store.setValue('filename', response?.data?.video?.filename )
            }

            setIsLoading(false) // animation
            store.setValue('refresh_videos', true) // to force useEffect get new data for index
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
        { key: 'embed_code', value: store.getValue('embed_code') }, 
        { key: 'poster', value: store.getValue('poster') }, 
      ];
      
      appendFormData(formData, dataArray);
        // Laravel special
        formData.append('_method', 'put'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/videos/${id}`,
            data: formData
          })
          .then( response => { // success 200
            //console.log(response)
            store.setValue('refresh_videos', true) // to force useEffect get new data for index
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
            <Modal.Title>Edit Video</Modal.Title>
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
