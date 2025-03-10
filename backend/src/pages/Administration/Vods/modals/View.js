import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Modal} from 'react-bootstrap'
import useStore from '../../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ViewModal() {
    const store = useStore()
    const { parentId } = useParams() // parentid
    const errors = store.getValue('errors')
   
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleShowClick = () =>{
      store.emptyData() // empty store data
      setShow(true)
    } 

    const handleCloseClick = () => {
      handleClose()
    }



  
    return (
      <>
        <Button size={'sm'} variant="outline-primary" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'video']} />{' '}View
        </Button>
  
        <Modal size={'md'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>HLS Player</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            HLS Player
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
