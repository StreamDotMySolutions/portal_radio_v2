import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../../../store'
import DataTable from '../ArticleGallery/DataTable'

export default function EditGallery({id}) {
    const store = useStore()
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleCloseClick = () => {
        store.setValue('refresh', true)
        handleClose()
    }

    /**
     * When user click edit, load the data
     */
    const handleShowClick = () =>{
      handleShow() 
    } 

    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {
      handleClose() // close the modal
    }
  
    return (
      <>
        <Button size="sm" variant="outline-primary" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
        </Button>
  
        <Modal size={'xl'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Edit GALLERY</Modal.Title>
          </Modal.Header>

          <Modal.Body>
      
            <DataTable article_data_id={id} />
          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              disabled={isLoading}
              variant="secondary" 
              onClick={handleCloseClick}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
