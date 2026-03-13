import { useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

const ShowModal = ({ footerLink }) => {
    const { url: apiBase } = useStore()

    const [show, setShow] = useState(false)
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleOpen = async () => {
        setIsLoading(true)

        try {
            const response = await axios({
                method: 'get',
                url: `${apiBase}/footer-links/${footerLink.id}`,
            })

            setData(response.data.footer_link)
            setShow(true)
        } catch (err) {
            console.error('Error fetching footer link:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setShow(false)
        setData(null)
    }

    return (
        <>
            <Button
                size='sm'
                variant='outline-info'
                onClick={handleOpen}
                className='py-1 px-2'
                style={{ fontSize: '0.75rem' }}
            >
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Footer Link Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-3'>
                            <Spinner animation='border' size='sm' />
                        </div>
                    ) : data ? (
                        <div>
                            <div className='mb-3'>
                                <strong>Title:</strong>
                                <p>{data.title}</p>
                            </div>
                            <div className='mb-3'>
                                <strong>URL:</strong>
                                <p style={{ wordBreak: 'break-all' }}>
                                    <code>{data.url}</code>
                                </p>
                            </div>
                            <div className='mb-3'>
                                <strong>Section:</strong>
                                <p>
                                    {data.section === 'quick'
                                        ? 'Quick Links'
                                        : 'Network'}
                                </p>
                            </div>
                            <div className='mb-3'>
                                <strong>Type:</strong>
                                <p>
                                    {data.is_external
                                        ? 'External Link'
                                        : 'Internal Link'}
                                </p>
                            </div>
                            <div className='mb-3'>
                                <strong>Status:</strong>
                                <p>
                                    {data.active ? (
                                        <span className='badge bg-success'>
                                            Active
                                        </span>
                                    ) : (
                                        <span className='badge bg-secondary'>
                                            Inactive
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ShowModal
