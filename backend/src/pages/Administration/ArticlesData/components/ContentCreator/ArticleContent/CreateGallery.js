import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Col, Modal, Tabs, Tab} from 'react-bootstrap'
import { appendFormData, TextEditor,InputTextarea } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'
import DataTable from '../ArticleGallery/DataTable'


export default function Create({article_data_id}) {
    const store = useStore()
    const { parentId } = useParams() // parentid
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleShowClick = () =>{
      //store.emptyData() // empty store data
      store.setValue('errors', null)
      store.setValue('contents', null)
      store.setValue('show_article_gallery', false) // show gallery ?
      store.setValue('article_data_id', null) // clear article_data_id
      setShow(true)
    } 

    const handleCloseClick = () => {
      store.setValue('refresh', true)
      handleClose()
    }


    /**
     * User agree to create Article Gallery
     * Create article_data first
     * get the article_data_id
     * use that for parent_id reference in article_gallery
     */
    const handleSubmitClick = () => {
    
        const formData = new FormData();
        const dataArray = [
            { key: 'title', value: 'HTML' }, // title
            { key: 'parent_id', value: parentId }, // article_id
            { key: 'contents', value: 'gallery' }, // gallery
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'post'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            //url: `${store.url}/article-contents`, // POST articleContent
            url: `${store.url}/article-data`, // Route::post('/article-data', [ArticleDataController::class, 'store']);
            data: formData
          })
          .then( response => { // success 200
            //console.log(response)
            store.setValue('refresh', true) // to force useEffect get new data for index
            store.setValue('show_article_gallery', true)

            // get article_data_id from API
            store.setValue('article_data_id', response.data.article_data_id)

            setIsLoading(false) // animation
            //handleClose() // close the modal
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
        <Button variant="outline-primary" size="sm" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'image']} />{' '}GALLERY
        </Button>

        <Modal size={'xl'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>GALLERY</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* <DataTable /> */}

            {store.getValue('show_article_gallery') ? (
              <DataTable article_data_id={store.getValue('article_data_id')} />
            ) : (
              <div className='text-center py-4'>
                <h5 className='mb-3'>Create gallery?</h5>
                <Button onClick={handleSubmitClick} variant='success'>Yes</Button>
                {' '}
                <Button onClick={handleCloseClick} variant='danger'>No</Button>
              </div>
            )}

          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              disabled={isLoading}
              variant="secondary" 
              onClick={handleCloseClick}>
              Close
            </Button>

            {/* <Button 
              disabled={isLoading}
              variant="primary" 
              onClick={handleSubmitClick}>
              Submit
            </Button> */}

          </Modal.Footer>
        </Modal>
      </>
    );
  }
