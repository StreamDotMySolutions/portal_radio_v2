import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Col, Modal, Tabs, Tab} from 'react-bootstrap'
import { appendFormData, TextEditorWithEdit, InputTextarea } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'
import DataTable from '../ArticleAsset/DataTable'


export default function Create() {
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
      store.setValue('article_asset', null) // asset tab
      setShow(true)
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
            { key: 'title', value: 'HTML' }, // title
            { key: 'parent_id', value: parentId }, // article_id
            { key: 'contents', value: store.getValue('contents') }, // article_id
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'post'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            //url: `${store.url}/article-contents`, // POST articleContent
            url: `${store.url}/article-data`, // POST articleData
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
        <Button variant="outline-primary" size="sm" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'fa-pen-to-square']} />{' '}EDITOR
        </Button>

        <Modal size={'xl'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Create HTML</Modal.Title>
          </Modal.Header>

          <Modal.Body>

          <Tabs
              defaultActiveKey="wysiwyg"
              className="mb-3"
            >

              <Tab eventKey="wysiwyg" title="EDITOR">
                  <TextEditorWithEdit fieldName={'contents'} />
              </Tab>

              <Tab eventKey="html" title="HTML">
                  <InputTextarea
                    fieldName={'contents'}
                    rows={'15'}
                    icon={'fa fa-code'}
                />
              </Tab>
              <Tab eventKey="assets" title="IMAGE">
                <DataTable />
              </Tab>

              <Tab eventKey="preview" title="PREVIEW">
                <div className='bg-light p-3 rounded' style={{ minHeight: '300px' }}>
                    <div className='bg-white shadow-sm rounded p-4 mx-auto' style={{ maxWidth: '800px' }}>
                        {store.getValue('contents') ? (
                            <div className='preview-content' dangerouslySetInnerHTML={{ __html: store.getValue('contents')}} />
                        ) : (
                            <p className='text-muted text-center my-5'>No content to preview</p>
                        )}
                    </div>
                </div>
                <style>{`
                    .preview-content img { max-width: 100%; height: auto; }
                    .preview-content h1, .preview-content h2, .preview-content h3 { margin-top: 0.5em; margin-bottom: 0.5em; }
                    .preview-content p { line-height: 1.7; }
                    .preview-content a { color: #0d6efd; }
                    .preview-content table { width: 100%; border-collapse: collapse; margin: 1em 0; }
                    .preview-content table td, .preview-content table th { border: 1px solid #dee2e6; padding: 0.5rem; }
                `}</style>
              </Tab>
          
            </Tabs>
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
