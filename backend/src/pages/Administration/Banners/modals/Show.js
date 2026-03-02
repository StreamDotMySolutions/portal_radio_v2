import { useState } from 'react'
import { Button, Figure, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [banner, setBanner] = useState(null)

    const handleShowClick = () => {
        setShow(true)
        setIsLoading(true)

        axios({ method: 'get', url: `${apiBase}/banners/${id}` })
            .then((response) => setBanner(response.data.banner))
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => {
        setShow(false)
        setBanner(null)
    }

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Banner Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-4'>
                            <Spinner animation='border' variant='secondary' />
                        </div>
                    ) : banner && (
                        <>
                            {banner.filename && (
                                <Figure className='w-100'>
                                    <Figure.Image
                                        className='w-100 rounded'
                                        src={`${serverUrl}/storage/banners/${banner.filename}`}
                                        alt={banner.title}
                                    />
                                </Figure>
                            )}

                            <table className='table table-borderless mb-0'>
                                <tbody>
                                    <tr>
                                        <th style={{ width: '130px' }} className='text-muted'>Title</th>
                                        <td>{banner.title}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Description</th>
                                        <td>{banner.description}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>URL</th>
                                        <td>
                                            {banner.redirect_url
                                                ? <a href={banner.redirect_url} target='_blank' rel='noreferrer'>{banner.redirect_url}</a>
                                                : <span className='text-muted'>—</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Active</th>
                                        <td>{banner.active == 1 ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Start</th>
                                        <td className='text-muted'>{banner.published_start ?? '—'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>End</th>
                                        <td className='text-muted'>{banner.published_end ?? '—'}</td>
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
