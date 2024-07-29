import { useEffect, useState } from 'react'
import { Button, Image, Modal, Table} from 'react-bootstrap'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ShowModal({id}) {
 
    const store = useStore()
    const errors = store.getValue('errors')
    const [staff, setStaff] = useState([])
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleCloseClick = () => {
        store.emptyData() // empty store data
        handleClose()
    }

    /**
     * When user click show button, load the data
     */
    const handleShowClick = () =>{
      store.emptyData() // empty store data
      setShow(true)

        // fetch data from backend server using given id
        axios({ 
            method: 'get', 
            url: `${store.url}/directories/${id}/show`,
            })
        .then( response => { // success 200
            //console.log(response)
            setStaff(response.data.staff)
            //store.setValue('refresh_videos', true) // to force useEffect get new data for index
            })
        .catch( error => {
            console.warn(error)
           
        })
        .finally(
          setIsLoading(false) // animation
        )
    } 

   
  
    return (
      <>
        <Button size="sm" variant="outline-primary" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'eye']} />{' '}Show
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>{staff.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Table>
              <tr>
              <td colSpan="2" className='text-center'>
                <Image 
                  className="img-fluid rounded border border-dark mb-3"
                  src={`https://www.rtm.gov.my/${staff.photo}`} 
                  alt="Staff Image" 
                />
               </td>

              </tr>
              <tr>
                  <th>Nama</th>
                  <td>{staff.name}</td>
              </tr>
              <tr>
                  <th>Jawatan</th>
                  <td>{staff.occupation}</td>
              </tr>
              <tr>
                  <th>Emel</th>
                  <td>{staff.email}</td>
              </tr>
              <tr>
                  <th>No Telefon</th>
                  <td>{staff.phone}</td>
              </tr>
              <tr>
                  <th>Alamat</th>
                  <td>{staff.address}</td>
              </tr>
              <tr>
                  <th>Twitter</th>
                  <td>{staff.twitter}</td>
              </tr>
              <tr>
                  <th>Facebook</th>
                  <td>{staff.facebook}</td>
              </tr>
              <tr>
                  <th>Instagram</th>
                  <td>{staff.instagram}</td>
              </tr>
            </Table>
          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              disabled={isLoading}
              variant="secondary" 
              onClick={handleCloseClick}>
               <FontAwesomeIcon icon={['fas', 'times-circle']} />{' '}Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
