import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function DeleteModal({ id, name, type }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [acknowledged, setAcknowledged] = useState(false)

    const handleShowClick = () => {
        setAcknowledged(false)
        setShow(true)
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('_method', 'delete')
        formData.append('acknowledge', true)

        axios({ method: 'post', url: `${store.url}/vods/${id}`, data: formData })
            .then(() => {
                store.setValue('refresh', true)
                handleClose()
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button size='sm' variant='outline-danger' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'trash']} />
            </Button>

            <Modal size='md' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete VOD</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to delete {type} <strong>{name}</strong>?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Form.Check
                        className='me-4'
                        reverse
                        disabled={isLoading}
                        label='Acknowledge'
                        type='checkbox'
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                    />
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant='danger'
                        disabled={isLoading || !acknowledged}
                        onClick={handleSubmitClick}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
