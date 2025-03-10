import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Modal} from 'react-bootstrap'
import useStore from '../../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import HlsPlayer from '../components/HlsPlayer'

export default function ViewModal({id}) {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const path = `${serverUrl}/storage/vods`

    const store = useStore()
    const { parentId } = useParams() // parentid
    const errors = store.getValue('errors')
    const [vod, setVod] = useState('')
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleShowClick = () =>{
      store.emptyData() // empty store data
      setShow(true)

       // fetch data from server using given id
       axios({ 
        method: 'get', 
        url: `${store.url}/vods/${id}`,
        })
        .then( response => { // success 200
        //console.log(response)
       
          setVod(response?.data?.vod)
        
        setIsLoading(false) // animation
        })
        .catch( error => {
        console.warn(error)
        setIsLoading(false) // animation
      })
    } 

    const handleCloseClick = () => {
      handleClose()
    }



  
    return (
      <>
        <Button size={'sm'} variant="outline-primary" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'video']} />{' '}View
        </Button>
  
        <Modal size={'xl'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>HLS Player</Modal.Title>
          </Modal.Header>

          <Modal.Body>

          <div className="w-100" style={{ maxWidth: '100%', height: 'auto', aspectRatio: '16 / 9' }}>
            
            <HlsPlayer id={vod.id} width="100%" height="auto" />

          </div>
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
