import { useState } from 'react'
import { Button, Figure, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [complaint, setComplaint] = useState(null)

    const handleShowClick = () => {
        setShow(true)
        setIsLoading(true)

        axios({ method: 'get', url: `${apiBase}/complaints/${id}` })
            .then((response) => setComplaint(response.data.complaint))
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => {
        setShow(false)
        setComplaint(null)
    }

    const isImageFile = (filename) => {
        if (!filename) return false
        const ext = filename.split('.').pop().toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
    }

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Complaint Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-4'>
                            <Spinner animation='border' variant='secondary' />
                        </div>
                    ) : complaint && (
                        <>
                            {complaint.attachment && isImageFile(complaint.attachment) && (
                                <Figure className='w-100'>
                                    <Figure.Image
                                        className='w-100 rounded'
                                        src={`${serverUrl}/storage/complaints/${complaint.attachment}`}
                                        alt='Attachment'
                                    />
                                </Figure>
                            )}

                            <table className='table table-borderless mb-0'>
                                <tbody>
                                    <tr>
                                        <th style={{ width: '130px' }} className='text-muted'>Reference No</th>
                                        <td>{complaint.reference_number}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Full Name</th>
                                        <td>{complaint.full_name}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Email</th>
                                        <td>{complaint.email}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Phone</th>
                                        <td>{complaint.phone_number || '—'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Category</th>
                                        <td>{complaint.category}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Platform</th>
                                        <td>{complaint.platform}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Programme Name</th>
                                        <td>{complaint.programme_name || '—'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Incident At</th>
                                        <td>{complaint.incident_at}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Subject</th>
                                        <td>{complaint.subject}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Description</th>
                                        <td style={{ whiteSpace: 'pre-wrap' }}>{complaint.description}</td>
                                    </tr>
                                    {complaint.attachment && (
                                        <tr>
                                            <th className='text-muted'>Attachment</th>
                                            <td>
                                                <a
                                                    href={`${serverUrl}/storage/complaints/${complaint.attachment}`}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    download
                                                >
                                                    <FontAwesomeIcon icon={['fas', 'download']} className='me-1' />
                                                    {complaint.attachment}
                                                </a>
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <th className='text-muted'>Submitted At</th>
                                        <td className='text-muted'>{complaint.created_at}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
