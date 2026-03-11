import { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useChatUsersStore from '../store'

export default function DeleteModal({ id, username, email }) {
    const { url: apiBase } = useStore()
    const setRefresh = useChatUsersStore((s) => s.setRefresh)

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

        axios({ method: 'post', url: `${apiBase}/chat-users/${id}`, data: formData })
            .then(() => {
                setRefresh()
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

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Chat User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to delete chat user <strong>{username}</strong>{' '}
                        <span className='text-muted'>({email})</span>?
                    </p>
                    <p className='text-muted small'>
                        This will permanently delete the user and all their messages.
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
