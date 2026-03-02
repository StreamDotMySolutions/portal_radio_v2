import { useState } from 'react'
import { Button, Modal, Form} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'

export default function DeleteModal({id}) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [acknowledged, setAcknowledged] = useState(false)

    const handleCloseClick = () => {
        setAcknowledged(false)
        setShow(false)
    }

    const handleShowClick = () => {
        store.setValue('errors', null)
        setAcknowledged(false)
        setShow(true)
    }

    /**
     * When user click submit button
     */
    const handleSubmitClick = () => {

        const formData = new FormData()
        formData.append('_method', 'delete')
        formData.append('acknowledge', true)

        axios({
            method: 'post',
            url: `${store.url}/article-data/${id}`,
            data: formData
          })
          .then( response => {
            store.setValue('refresh', true)
            setIsLoading(false)
            handleCloseClick()
          })
          .catch( error => {
            if( error.response?.status == 422 ){
              store.setValue('errors', error.response.data.errors )
            }
            setIsLoading(false)
          })
    }

    return (
      <>
        <Button size="sm" variant="outline-danger" onClick={handleShowClick}>
          <FontAwesomeIcon icon={['fas', 'trash']} />
        </Button>

        <Modal show={show} onHide={handleCloseClick}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Content Block</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete this content block?
          </Modal.Body>

          <Modal.Footer>

            <Form.Check
              className='me-4'
              reverse
              disabled={isLoading}
              label="acknowledge"
              type="checkbox"
              checked={acknowledged}
              onChange={e => setAcknowledged(e.target.checked)}
            />

            <Button
              disabled={isLoading}
              variant="secondary"
              onClick={handleCloseClick}>
              Close
            </Button>

            <Button
              disabled={isLoading || !acknowledged}
              variant="danger"
              onClick={handleSubmitClick}>
              Delete
            </Button>

          </Modal.Footer>
        </Modal>
      </>
    );
  }
