import { useState } from 'react'
import { Button, Modal, Form} from 'react-bootstrap'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'

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

        // load roles
        axios({ 
            method: 'get', 
            url: `${store.url}/users/roles`,
            })
        .then( response => { // success 200
            console.log(response)
            store.setValue('roles', response.data.roles)
            })
        .catch( error => {
            console.warn(error)
        })

        // fetch data from server using given id
        axios({ 
            method: 'get', 
            url: `${store.url}/users/${id}`,
            })
        .then( response => { // success 200
            //console.log(response)
            if( response?.data?.user.hasOwnProperty('name') ){
              store.setValue('name', response?.data?.user?.name )
            }

            if( response?.data?.user.hasOwnProperty('role_id') ){
              store.setValue('role_id', response?.data?.user?.role_id )
            }

            if( response?.data?.user.hasOwnProperty('email') ){
              store.setValue('email', response?.data?.user?.email )
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
            { key: 'acknowledge', value: store.getValue('acknowledge') },
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'delete'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/users/${id}`,
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
          Delete
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <HtmlForm isLoading={true} />
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
