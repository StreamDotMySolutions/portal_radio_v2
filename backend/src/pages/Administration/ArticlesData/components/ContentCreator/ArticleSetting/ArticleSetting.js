import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Form,Badge, Button, Col, Modal, Row} from 'react-bootstrap'
import { InputDate, InputRadio, InputText, InputTextarea,appendFormData } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ArticleSetting() {
    const store = useStore()
    const { parentId } = useParams() // parentid
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleShowClick = () =>{
      store.emptyData() // empty store data
      // store.setValue('url', null)
      // store.setValue('errors', null)
      // store.setValue('published_start', null)
      // store.setValue('published_end', null)

      setShow(true)

      // fetch data from server using given id
      axios({ 
          method: 'get', 
          url: `${store.url}/article-settings/${parentId}`,
          })
      .then( response => { // success 200
          //console.log(response)
          if( response?.data?.article_setting.hasOwnProperty('active') ){
            store.setValue('active', response?.data?.article_setting?.active )
          }

          if( response?.data?.article_setting.hasOwnProperty('redirect_url') ){
            store.setValue('redirect_url', response?.data?.article_setting?.redirect_url )
          }

          if( response?.data?.article_setting.hasOwnProperty('published_start') ){
            store.setValue('published_start', response?.data?.article_setting?.published_start )
          }

          if( response?.data?.article_setting.hasOwnProperty('published_end') ){
            store.setValue('published_end', response?.data?.article_setting?.published_end )
          }

          if( response?.data?.article_setting.hasOwnProperty('listing_type') ){
            store.setValue('listing_type', response?.data?.article_setting?.listing_type )
          }

          setIsLoading(false) // animation
          })
      .catch( error => {
          console.warn(error)
          setIsLoading(false) // animation
      })
    } 

    const handleCloseClick = () => {
      store.emptyData()
      handleClose()
      
    }


    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
    
        const formData = new FormData();
        const dataArray = [
            { key: 'active', value: store.getValue('active') },
            { key: 'redirect_url', value: store.getValue('redirect_url') },
            { key: 'published_start', value: store.getValue('published_start') },
            { key: 'published_end', value: store.getValue('published_end') },
            { key: 'listing_type', value: store.getValue('listing_type') },
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'put'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/article-settings/${parentId}`,
            data: formData
          })
          .then( response => { // success 200
            //console.log(response)
            //store.setValue('refresh', true) // to force useEffect get new data for index
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
          <FontAwesomeIcon icon={['fas', 'fa-cog']} />{' '}SETTINGS
        </Button>


        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title><FontAwesomeIcon icon={['fas', 'fa-cog']} />{' '}Settings</Modal.Title>
          </Modal.Header>

          <Modal.Body>
        
            <Form.Group className='col-2'>
              <InputRadio 
                fieldName='active' 
                label='Active'
                options={[
                  { label: 'Yes', value: 1 },
                  { label: 'No', value: 0 }
                ]}
                />
            </Form.Group>
            <hr />
            <Form.Group>
              <Form.Label><h6>Redirect Link</h6></Form.Label>
             
                  <InputText 
                    placeholder={'http://somewebsite.com'}
                    icon='fa-globe' 
                    fieldName='redirect_url' 
                  />
             
            </Form.Group>
            <hr />
            <Form.Group>
              <Form.Label><h6>Publish Date</h6></Form.Label>
              <Row>
                <Col>
                  <InputDate icon='fa-calendar' fieldName='published_start' />
                </Col>
                <Col>
                  <InputDate  icon='fa-calendar' fieldName='published_end' />
                </Col>
              </Row>
            </Form.Group>
            <hr />
            <Form.Group className='col-7'>
              <InputRadio 
                fieldName='listing_type' 
                label='Listing Type'
                options={[
                  { label: 'Default', value: 'default' },
                  { label: 'With Poster', value: 'poster' },
                  { label: 'Without Poster', value: 'without_poster' }
                ]}
                />
            </Form.Group>
            {/* <hr />
            <Form.Group className='col-4'>
              <InputRadio 
                fieldName='type' 
                label='Content Type'
                options={[
                  { label: 'Redirect', value: 'redirect' },
                  { label: 'Contents', value: 'contents' },
                ]}
                />
            </Form.Group>

            { store.getValue('type') == 'redirect' &&
              <Col className='mt-2'>
                <InputText 
                  fieldName='url'
                  placeholder='http://somewebsite.com' 
                  icon='fa-globe'
                  />
              </Col>
            } */}
          

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
