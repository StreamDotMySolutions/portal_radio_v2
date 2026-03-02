import { useState } from 'react'
import { Button, Figure, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [video, setVideo] = useState(null)

    const handleShowClick = () => {
        setShow(true)
        setIsLoading(true)

        axios({ method: 'get', url: `${apiBase}/videos/${id}` })
            .then((response) => setVideo(response.data.video))
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => {
        setShow(false)
        setVideo(null)
    }

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Video Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-4'>
                            <Spinner animation='border' variant='secondary' />
                        </div>
                    ) : video && (
                        <>
                            {video.filename && (
                                <Figure className='w-100'>
                                    <Figure.Image
                                        className='w-100 rounded'
                                        src={`${serverUrl}/storage/videos/${video.filename}`}
                                        alt={video.title}
                                    />
                                </Figure>
                            )}

                            <table className='table table-borderless mb-0'>
                                <tbody>
                                    <tr>
                                        <th style={{ width: '130px' }} className='text-muted'>Title</th>
                                        <td>{video.title}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Embed Code</th>
                                        <td className='text-muted' style={{ fontSize: '0.85rem' }}>
                                            {video.embed_code ?? '—'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>File</th>
                                        <td className='text-muted' style={{ fontSize: '0.85rem' }}>
                                            {video.filename ?? '—'}
                                        </td>
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
