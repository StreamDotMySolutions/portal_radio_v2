import { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useRolesStore from '../store'

export default function DeleteModal({ id, name }) {
    const { url: apiBase } = useStore()
    const setRefresh = useRolesStore((s) => s.setRefresh)

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

        axios({ method: 'post', url: `${apiBase}/roles/${id}`, data: formData })
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
                Delete
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Role</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to delete role <strong>{name}</strong>?
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
