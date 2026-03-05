import { useEffect, useState } from 'react'
import { Badge, Button, Col, Modal, Tabs, Tab} from 'react-bootstrap'
import { appendFormData, InputTextarea, TextEditorWithEdit } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'
import DataTable from '../ArticleAsset/DataTable'

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
      //store.emptyData() // empty store data
      store.setValue('errors', null)
      store.setValue('contents', null)
      store.setValue('article_asset', null) // asset tab

      setShow(true)

        // fetch data from server using given id
        axios({ 
            method: 'get', 
            url: `${store.url}/article-data/${id}`,
            })
        .then( response => { // success 200
            //console.log(response)
            if( response?.data?.article_data.hasOwnProperty('contents') ){
              store.setValue('contents', response?.data?.article_data?.contents )
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
          { key: 'contents', value: store.getValue('contents') },
      ];
      
      appendFormData(formData, dataArray);
        // Laravel special
        formData.append('_method', 'put'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/article-data/${id}`,
            data: formData
          })
          .then( response => { // success 200
            //console.log(response)
            store.setValue('refresh', true) // to force useEffect get new data for index
            setIsLoading(false) // animation
            handleClose() // close the modal
          })
          .catch( error => {
            console.warn(error)
            
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
          Edit
        </Button>
  
        <Modal size={'xl'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Content</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* <InputTextarea
              fieldName={'contents'}
              rows={'15'}
              icon={'fa fa-code'}
            /> */}
             <Tabs
              defaultActiveKey="wysiwyg"
              className="mb-3"
            >

              <Tab eventKey="wysiwyg" title="EDITOR">
                
                  <TextEditorWithEdit fieldName={'contents'} />
                  {/* <InputTextarea
                    fieldName={'contents'}
                    rows={'15'}
                    icon={'fa fa-code'}
                  /> */}
                  
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
