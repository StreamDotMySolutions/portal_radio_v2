import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge, Button, Col, Modal} from 'react-bootstrap'
import { InputFile,appendFormData } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'

export default function ArticlePosterModal() {
    const store = useStore()
    const { parentId } = useParams() // parentid
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleShowClick = () =>{
      store.setValue('article_poster', null)
      store.setValue('errors', null)
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
      //store.emptyData() 
      handleClose()
    }


    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
    
        const formData = new FormData();
        const dataArray = [
            { key: 'article_poster', value: store.getValue('article_poster') },
            { key: 'article_id', value: parentId },
        ];
        
        appendFormData(formData, dataArray);

        // Laravel special
        formData.append('_method', 'post'); // get|post|put|patch|delete

        // send to Laravel
        axios({ 
            method: 'post', 
            url: `${store.url}/articlePosters`,
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

        {store.getValue('article_poster_image') ?

        <Col onClick={handleShowClick} className="d-flex justify-content-center border border-3 border-dotted bg-light hover-effect" style={{ height: '250px' }}>
          <p className="text-left m-auto p-3">
            <img style={{'height':'220px'}} className='img-thumbnail img-fluid' src={`${store.server}/storage/article_poster/${store.getValue('article_poster_image')?.filename}`} alt="Image" />
          </p>
        </Col>
        :
        <Col onClick={handleShowClick} className="d-flex justify-content-center border border-3 border-dotted bg-light hover-effect" style={{ height: '250px' }}>
          <p className="text-left m-auto ">
              <Badge>Poster</Badge>
          </p>
        </Col>
        }
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Poster</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <InputFile
                fieldName='article_poster' 
                placeholder='Choose poster'  
                icon='fa-solid fa-image'
                isLoading={isLoading}
            />
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
