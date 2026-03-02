import { useState } from 'react'
import { Button, Image, Modal, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [staff, setStaff] = useState(null)

    const handleClose = () => setShow(false)

    const handleShowClick = () => {
        setStaff(null)
        setShow(true)

        axios({ method: 'get', url: `${store.url}/directories/${id}` })
            .then(response => setStaff(response.data.directory))
            .catch(error => console.warn(error))
    }

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{staff?.name ?? 'Staff Details'}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {!staff ? (
                        <div className='text-center py-4 text-muted'>
                            <FontAwesomeIcon icon={['fas', 'spinner']} spin className='me-2' />
                            Loading...
                        </div>
                    ) : (
                        <>
                            {staff.photo && (
                                <div className='text-center mb-3'>
                                    <Image
                                        className='img-fluid rounded border'
                                        src={`https://www.rtm.gov.my/${staff.photo}`}
                                        alt='Staff Photo'
                                        style={{ maxHeight: '200px' }}
                                    />
                                </div>
                            )}
                            <Table borderless>
                                <tbody>
                                    <tr>
                                        <th style={{ width: '130px' }} className='text-muted fw-normal'>Name</th>
                                        <td>{staff.name}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Occupation</th>
                                        <td>{staff.occupation ?? '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Email</th>
                                        <td>{staff.email ?? '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Phone</th>
                                        <td>{staff.phone ?? '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Address</th>
                                        <td>{staff.address ?? '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Facebook</th>
                                        <td>{staff.facebook ?? '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Twitter / X</th>
                                        <td>{staff.twitter ?? '-'}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Instagram</th>
                                        <td>{staff.instagram ?? '-'}</td>
                                    </tr>
                                </tbody>
                            </Table>
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
