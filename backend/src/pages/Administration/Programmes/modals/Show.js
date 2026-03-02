import { useState } from 'react'
import { Button, Figure, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [programme, setProgramme] = useState(null)

    const handleShowClick = () => {
        setShow(true)
        setIsLoading(true)

        axios({ method: 'get', url: `${apiBase}/programmes/${id}` })
            .then((response) => setProgramme(response.data.programme))
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => {
        setShow(false)
        setProgramme(null)
    }

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Programme Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-4'>
                            <Spinner animation='border' variant='secondary' />
                        </div>
                    ) : programme && (
                        <>
                            {programme.filename && (
                                <Figure className='w-100'>
                                    <Figure.Image
                                        className='w-100 rounded'
                                        src={`${serverUrl}/storage/programmes/${programme.filename}`}
                                        alt={programme.title}
                                    />
                                </Figure>
                            )}

                            <table className='table table-borderless mb-0'>
                                <tbody>
                                    <tr>
                                        <th style={{ width: '130px' }} className='text-muted'>Title</th>
                                        <td>{programme.title}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>URL</th>
                                        <td>
                                            {programme.redirect_url
                                                ? <a href={programme.redirect_url} target='_blank' rel='noreferrer'>{programme.redirect_url}</a>
                                                : <span className='text-muted'>—</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>File</th>
                                        <td className='text-muted' style={{ fontSize: '0.85rem' }}>
                                            {programme.filename ?? '—'}
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
