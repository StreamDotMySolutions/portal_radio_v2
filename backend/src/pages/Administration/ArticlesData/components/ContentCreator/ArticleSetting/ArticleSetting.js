import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Form, InputGroup, Button, Col, Modal, Row} from 'react-bootstrap'
import { InputCheckbox, InputDate, InputRadio, InputTextarea,appendFormData } from '../../../../../../libs/FormInput'
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

          if( response?.data?.article_setting.hasOwnProperty('show_children') ){
            store.setValue('show_children', response?.data?.article_setting?.show_children )
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
            { key: 'show_children', value: store.getValue('show_children') },
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
          <FontAwesomeIcon icon={['fas', 'gear']} />{' '}SETTINGS
        </Button>


        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title><FontAwesomeIcon icon={['fas', 'gear']} />{' '}Settings</Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <Card className='mb-3'>
              <Card.Header className='text-muted small fw-semibold text-uppercase py-2'>Visibility</Card.Header>
              <Card.Body>
                <InputRadio
                  fieldName='active'
                  label=''
                  options={[
                    { label: 'Active', value: 1 },
                    { label: 'Inactive', value: 0 }
                  ]}
                />
              </Card.Body>
            </Card>

            <Card className='mb-3'>
              <Card.Header className='text-muted small fw-semibold text-uppercase py-2'>Redirect URL</Card.Header>
              <Card.Body>
                <InputGroup>
                  <InputGroup.Text><FontAwesomeIcon icon={['fas', 'globe']} /></InputGroup.Text>
                  <Form.Control
                    placeholder='http://somewebsite.com'
                    type='text'
                    value={store.getValue('redirect_url') || ''}
                    onChange={e => store.setValue('redirect_url', e.target.value)}
                  />
                </InputGroup>
                <div className='text-muted small mt-2'>If set, this article will redirect to the URL instead of displaying its content.</div>
              </Card.Body>
            </Card>

            {!store.getValue('redirect_url') && (
              <>
                <Card className='mb-3'>
                  <Card.Header className='text-muted small fw-semibold text-uppercase py-2'>Publish Date</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col>
                        <Form.Label className='small text-muted mb-1'>Start</Form.Label>
                        <InputDate icon='fa-calendar' fieldName='published_start' />
                      </Col>
                      <Col>
                        <Form.Label className='small text-muted mb-1'>End</Form.Label>
                        <InputDate icon='fa-calendar' fieldName='published_end' />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className='mb-3'>
                  <Card.Header className='text-muted small fw-semibold text-uppercase py-2'>Listing Type</Card.Header>
                  <Card.Body>
                    <InputRadio
                      fieldName='listing_type'
                      label=''
                      options={[
                        { label: 'Default', value: 'default' },
                        { label: 'With Poster', value: 'poster' },
                        { label: 'Without Poster', value: 'without_poster' },
                        { label: 'Single Article', value: 'single_article' }
                      ]}
                    />
                  </Card.Body>
                </Card>

                {store.getValue('listing_type') != 'single_article' && (
                  <Card>
                    <Card.Header className='text-muted small fw-semibold text-uppercase py-2'>Visible in Dropdown Menu</Card.Header>
                    <Card.Body>
                      <InputRadio
                        fieldName='show_children'
                        label=''
                        options={[
                          { label: 'Yes', value: 1 },
                          { label: 'No', value: 0 },
                        ]}
                      />
                    </Card.Body>
                  </Card>
                )}
              </>
            )}

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
