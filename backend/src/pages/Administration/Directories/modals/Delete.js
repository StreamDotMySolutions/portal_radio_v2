import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function DeleteModal({ id, name }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [acknowledged, setAcknowledged] = useState(false)

    const handleClose = () => {
        setShow(false)
        setAcknowledged(false)
    }

    const handleShowClick = () => {
        setAcknowledged(false)
        setShow(true)
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('_method', 'delete')

        axios({ method: 'post', url: `${store.url}/directories/${id}`, data: formData })
            .then(() => {
                store.setValue('refresh', true)
                handleClose()
            })
            .catch(error => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button size='sm' variant='outline-danger' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'trash']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Directory</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to delete <strong>{name}</strong>?</p>
                    <p className='text-muted small'>This action cannot be undone.</p>
                    <Form.Check
                        type='checkbox'
                        label='I understand, proceed with deletion'
                        checked={acknowledged}
                        onChange={e => setAcknowledged(e.target.checked)}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>Close</Button>
                    <Button variant='danger' disabled={isLoading || !acknowledged} onClick={handleSubmitClick}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
