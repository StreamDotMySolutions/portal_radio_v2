import { useState, useEffect } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useFooterStore from '../store'
import HtmlForm from '../components/HtmlForm'

const EditModal = ({ footerLink }) => {
    const { url: apiBase } = useStore()
    const setRefresh = useFooterStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [formData, setFormData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleOpen = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios({
                method: 'get',
                url: `${apiBase}/footer-links/${footerLink.id}`,
            })

            setFormData(response.data.footer_link)
            setShow(true)
        } catch (err) {
            console.error('Error fetching footer link:', err)
            setError('Failed to load footer link')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setShow(false)
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.section || !formData.title || !formData.url) {
            setError('All fields are required')
            return
        }

        setIsSubmitting(true)
        try {
            await axios({
                method: 'put',
                url: `${apiBase}/footer-links/${footerLink.id}`,
                data: formData,
            })

            setRefresh()
            handleClose()
        } catch (err) {
            console.error('Error updating footer link:', err)
            setError(
                err.response?.data?.message ||
                    'Failed to update footer link'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button
                size='sm'
                variant='outline-primary'
                onClick={handleOpen}
                className='py-1 px-2'
                style={{ fontSize: '0.75rem' }}
            >
                <FontAwesomeIcon icon={['fas', 'pen']} />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Footer Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-3'>
                            <Spinner animation='border' size='sm' />
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className='alert alert-danger mb-3'>
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <HtmlForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    isSubmitting={isSubmitting}
                                />
                            </form>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant='primary'
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    animation='border'
                                    size='sm'
                                    className='me-2'
                                />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon
                                    icon={['fas', 'check']}
                                    className='me-2'
                                />
                                Save
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditModal
