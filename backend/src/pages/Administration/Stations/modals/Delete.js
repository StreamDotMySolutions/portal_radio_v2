import { useState } from 'react'
import { Button, Modal, Form, Toast, ToastContainer } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationsStore from '../store'

export default function DeleteModal({ id, title }) {
    const { url: apiBase } = useStore()
    const setRefresh = useStationsStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [acknowledged, setAcknowledged] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastVariant, setToastVariant] = useState('success')

    const handleShowClick = () => {
        setAcknowledged(false)
        setShow(true)
    }

    const handleClose = () => setShow(false)

    const handleDeleteClick = () => {
        setIsLoading(true)
        axios({ method: 'delete', url: `${apiBase}/stations/${id}` })
            .then(() => {
                setToastVariant('success')
                setToastMessage('Station deleted successfully')
                setShowToast(true)
                setRefresh()
                setTimeout(() => handleClose(), 1500)
            })
            .catch((error) => {
                setToastVariant('danger')
                setToastMessage('Failed to delete station')
                setShowToast(true)
                console.warn(error)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <ToastContainer position='top-end' className='p-3'>
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body className={toastVariant === 'danger' ? 'text-white' : ''}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <Button size='sm' variant='outline-danger' onClick={handleShowClick} title='Delete'>
                <FontAwesomeIcon icon={['fas', 'trash']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Station</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to delete the station <strong>{title}</strong>? This action cannot be undone.
                    </p>
                    <Form.Check
                        type='checkbox'
                        label='I understand the consequences of deleting this station'
                        checked={acknowledged}
                        disabled={isLoading}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant='danger'
                        disabled={!acknowledged || isLoading}
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
