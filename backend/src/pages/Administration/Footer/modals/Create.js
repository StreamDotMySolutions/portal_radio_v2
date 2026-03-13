import { useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useFooterStore from '../store'
import HtmlForm from '../components/HtmlForm'

const CreateModal = () => {
    const { url: apiBase } = useStore()
    const setRefresh = useFooterStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [formData, setFormData] = useState({
        section: '',
        title: '',
        url: '',
        is_external: false,
        active: true,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleOpen = () => {
        setFormData({
            section: '',
            title: '',
            url: '',
            is_external: false,
            active: true,
        })
        setError(null)
        setShow(true)
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
                method: 'post',
                url: `${apiBase}/footer-links`,
                data: formData,
            })

            setRefresh()
            handleClose()
        } catch (err) {
            console.error('Error creating footer link:', err)
            setError(
                err.response?.data?.message ||
                    'Failed to create footer link'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button variant='primary' onClick={handleOpen} size='sm'>
                <FontAwesomeIcon icon={['fas', 'plus']} className='me-2' />
                Add Link
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Footer Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <div className='alert alert-danger mb-3'>{error}</div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <HtmlForm
                            formData={formData}
                            setFormData={setFormData}
                            isSubmitting={isSubmitting}
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant='primary'
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    animation='border'
                                    size='sm'
                                    className='me-2'
                                />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon
                                    icon={['fas', 'check']}
                                    className='me-2'
                                />
                                Create
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CreateModal
