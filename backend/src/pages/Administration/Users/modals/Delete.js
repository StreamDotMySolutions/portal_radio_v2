import { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useUsersStore from '../store'

export default function DeleteModal({ id, name, email, disabled = false }) {
    const { url: apiBase } = useStore()
    const setRefresh = useUsersStore((s) => s.setRefresh)

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

        axios({ method: 'post', url: `${apiBase}/users/${id}`, data: formData })
            .then(() => {
                setRefresh()
                handleClose()
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button size='sm' variant='outline-danger' onClick={handleShowClick} disabled={disabled}>
                <FontAwesomeIcon icon={['fas', 'trash']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to delete user <strong>{name}</strong>{' '}
                        <span className='text-muted'>({email})</span>?
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
