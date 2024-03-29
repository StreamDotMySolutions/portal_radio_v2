import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Col, Modal, Tabs, Tab} from 'react-bootstrap'
import { appendFormData, InputTextarea } from '../../../../../../libs/FormInput'
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
          <FontAwesomeIcon icon={['fas', 'fa-pen-to-square']} />{' '}HTML
        </Button>

        <Modal size={'xl'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Create HTML</Modal.Title>
          </Modal.Header>

          <Modal.Body>

          <Tabs
              defaultActiveKey="html"
              className="mb-3"
            >
              <Tab eventKey="html" title="HTML">
                  <InputTextarea
                    fieldName={'contents'}
                    rows={'15'}
                    icon={'fa fa-code'}
                />
              </Tab>
              <Tab eventKey="assets" title="ASSETS">
                <DataTable />
              </Tab>

              <Tab eventKey="preview" title="PREVIEW">
                <Col className='p-3 border border-2 border-dashed' style={{'backgroundColor': 'lightcyan'}}>
                    {/* {item.article_content?.contents} */}
                    {/* Render HTML content */}
                    <div dangerouslySetInnerHTML={{ __html: store.getValue('contents')}} />
                </Col>
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
