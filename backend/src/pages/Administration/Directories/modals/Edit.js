import { useEffect, useState } from 'react'
import { Button, Modal} from 'react-bootstrap'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../store'
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
            if( response?.data?.staff.hasOwnProperty('occupation') ){
              store.setValue('occupation', response?.data?.staff?.occupation )
            }
            if( response?.data?.staff.hasOwnProperty('email') ){
              store.setValue('email', response?.data?.staff?.email )
            }
            if( response?.data?.staff.hasOwnProperty('phone') ){
              store.setValue('phone', response?.data?.staff?.phone )
            }
            if( response?.data?.staff.hasOwnProperty('twitter') ){
              store.setValue('twitter', response?.data?.staff?.twitter )
            }
            if( response?.data?.staff.hasOwnProperty('facebook') ){
              store.setValue('facebook', response?.data?.staff?.facebook )
            }
            if( response?.data?.staff.hasOwnProperty('instagram') ){
              store.setValue('instagram', response?.data?.staff?.instagram )
            }
            if( response?.data?.staff.hasOwnProperty('address') ){
              store.setValue('address', response?.data?.staff?.address )
            }
            store.setValue('refresh_videos', true) // to force useEffect get new data for index
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
            <Modal.Title>Edit Staff</Modal.Title>
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
