import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Modal} from 'react-bootstrap'
import { TextEditorWithEdit, appendFormData } from '../../../../../libs/FormInput'
import axios from '../../../../../libs/axios'
import useStore from '../../../../store'

export default function DescriptionModal() {
    const store = useStore()
    const { parentId } = useParams() // parentid
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleShowClick = () =>{
      //store.emptyData() // empty store data
      setShow(true)

        // // fetch data from server using given id
        // axios({ 
        //     method: 'get', 
        //     url: `${store.url}/articles/${parentId}`,
        //     })
        // .then( response => { // success 200
        //     //console.log(response)
        //     if( response?.data?.article.hasOwnProperty('description') ){
        //       store.setValue('description', response?.data?.article?.description )
        //     }
        //     setIsLoading(false) // animation
        //     })
        // .catch( error => {
        //     console.warn(error)
        //     setIsLoading(false) // animation
        // })
    } 

    const handleCloseClick = () => {
      handleClose()
    }


    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
    
        const formData = new FormData();
        const dataArray = [
            { key: 'description', value: store.getValue('description') },
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'put'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/articles/${parentId}`,
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
        {/* <Button variant="primary" onClick={handleShowClick}>
          Add Content
        </Button> */}

        <div onClick={handleShowClick} className="border rounded bg-white shadow-sm p-3" style={{ height: '220px', cursor: 'pointer', overflow: 'auto' }}>
          {store.getValue('description') ? (
            <div className="text-muted small mb-0 preview-content" style={{ lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: store.getValue('description') }} />
          ) : (
            <div className='text-muted text-center d-flex flex-column align-items-center justify-content-center h-100'>
              <FontAwesomeIcon icon={['fas', 'pen-to-square']} size='2x' className='mb-2' />
              <small>Click to add description</small>
            </div>
          )}
        </div>
  
        <Modal size={'xl'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Description</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <TextEditorWithEdit fieldName='description' />
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
