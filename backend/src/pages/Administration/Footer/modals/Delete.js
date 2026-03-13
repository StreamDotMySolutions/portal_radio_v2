import { useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useFooterStore from '../store'

const DeleteModal = ({ footerLink }) => {
    const { url: apiBase } = useStore()
    const setRefresh = useFooterStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleOpen = () => {
        setError(null)
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
        setError(null)
    }

    const handleDelete = async () => {
        setIsSubmitting(true)
        try {
            await axios({
                method: 'delete',
                url: `${apiBase}/footer-links/${footerLink.id}`,
            })

            setRefresh()
            handleClose()
        } catch (err) {
            console.error('Error deleting footer link:', err)
            setError(
                err.response?.data?.message ||
                    'Failed to delete footer link'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button
                size='sm'
                variant='outline-danger'
                onClick={handleOpen}
                className='py-1 px-2'
                style={{ fontSize: '0.75rem' }}
            >
                <FontAwesomeIcon icon={['fas', 'trash']} />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <div className='alert alert-danger mb-3'>{error}</div>
                    )}
                    <p>
                        Are you sure you want to delete{' '}
                        <strong>{footerLink.title}</strong>?
                    </p>
                    <p className='text-muted small'>
                        This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='danger'
                        onClick={handleDelete}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    animation='border'
                                    size='sm'
                                    className='me-2'
                                />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon
                                    icon={['fas', 'trash']}
                                    className='me-2'
                                />
                                Delete
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteModal
