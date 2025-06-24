import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Modal, Col, Row} from 'react-bootstrap'
//import { appendFormData,InputRadio,InputText } from '../../../../libs/FormInput'
import { appendFormData,InputRadio,InputText } from '../components/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../store'
import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NewModal({parentId}) {
    const store = useStore()
    
    const options = [
        { label: 'Department', value: 'folder' },
        { label: 'Staff', value: 'spreadsheet' },
    ];

    //const { parentId } = useParams() // parentid
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)


    // clear error when user change type
    useEffect(() => {
      store.setValue('errors', '') // empty errors data
      //console.log(store.getValue('content_type'))
    }, [store.getValue('content_type')] ); // listen to type

    const handleShowClick = () =>{
      store.emptyData() // empty store data
      setShow(true)
    } 

    const handleCloseClick = () => {
      store.emptyData() // empty store data
      handleClose()
    }


    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {

        // clear previous error
        store.setValue('error', '') // empty errors data
    
        const formData = new FormData();
        const dataArray = [];
        
        // if user choose to create department
        if(store.getValue('content_type') == "folder"){
            console.log('folder')
          // const dataArray = [
          //   { key: 'type', value: 'folder' }, 
          //   { key: 'name', value: store.getValue('name') },
          // ];
          dataArray.push(
            { key: 'type', value: 'folder' },
            { key: 'name', value: store.getValue('name') }
        );
        }

        // if user choose to create staff
        if(store.getValue('content_type') == "spreadsheet"){
          console.log('spreadsheet')
          // const dataArray = [
          //   { key: 'type', value: 'spreadsheet' },
          //   { key: 'photo', value: store.getValue('photo') },
          //   { key: 'name', value: store.getValue('name') },
          //   { key: 'occupation', value: store.getValue('occupation') },
          //   { key: 'email', value: store.getValue('email') }, 
          //   { key: 'phone', value: store.getValue('phone') },
          //   { key: 'facebook', value: store.getValue('facebook') },
          //   { key: 'twitter', value: store.getValue('twitter') },
          //   { key: 'instagram', value: store.getValue('instagram') },
          //   { key: 'address', value: store.getValue('address') },
          // ];
          dataArray.push(
            { key: 'type', value: 'spreadsheet' },
            { key: 'photo', value: store.getValue('photo') },
            { key: 'name', value: store.getValue('name') },
            { key: 'occupation', value: store.getValue('occupation') },
            { key: 'email', value: store.getValue('email') },
            { key: 'phone', value: store.getValue('phone') },
            { key: 'facebook', value: store.getValue('facebook') },
            { key: 'twitter', value: store.getValue('twitter') },
            { key: 'instagram', value: store.getValue('instagram') },
            { key: 'address', value: store.getValue('address') }
        );
        }
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'post'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/directories/${parentId}/create`, // Controller will filter based on type
            data: formData
          })
          .then( response => { // success 200
            //console.log(response)
        
            setIsLoading(false) // animation
            store.setValue('refresh', true) // to force useEffect get new data for index
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
        <Button variant="primary" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'plus']} />{' '}New
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Create Content</Modal.Title>
          </Modal.Header>

          <Modal.Body>
           <div>
              <Col xs={12} className='border border-1 p-4 rounded'>
                  <InputRadio 
                      fieldName='content_type'
                      label='Type'
                      options={options}
                  />
              </Col>

           
              {store.getValue('content_type') === 'folder' && (
                <Col xs={12} className='border border-1 p-4 rounded mt-2' style={{'backgroundColor': '#EAEAEA'}}>
                
                    <InputText 
                        fieldName='name' 
                        placeholder='Name'  
                        icon='fa-solid fa-pencil'
                        isLoading={isLoading}
                    />
                </Col>
              )}   

              {store.getValue('content_type') === 'spreadsheet' && (
                <Col xs={12} className='border border-1 p-4 rounded mt-2' style={{'backgroundColor': '#EAEAEA'}}>
                  <HtmlForm isLoading={isLoading} />
                </Col>
              )}

            
            </div>
          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              disabled={isLoading}
              variant="secondary" 
              onClick={handleCloseClick}>
              <FontAwesomeIcon icon={['fas', 'times-circle']} />{' '}Close
            </Button>

            <Button 
              disabled={isLoading || store.getValue('content_type') == null }
              variant="primary" 
              onClick={handleSubmitClick}>
              <FontAwesomeIcon icon={['fas', 'upload']} />{' '}Submit
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
