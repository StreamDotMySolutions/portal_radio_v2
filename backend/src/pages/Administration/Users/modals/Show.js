import { useState } from 'react'
import { Badge, Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null)

    const handleShowClick = () => {
        setShow(true)
        setIsLoading(true)

        axios({ method: 'get', url: `${apiBase}/users/${id}` })
            .then((response) => setUser(response.data.user))
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => {
        setShow(false)
        setUser(null)
    }

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-4'>
                            <Spinner animation='border' variant='secondary' />
                        </div>
                    ) : user && (
                        <table className='table table-borderless mb-0'>
                            <tbody>
                                <tr>
                                    <th style={{ width: '100px' }} className='text-muted'>Name</th>
                                    <td>{user.name}</td>
                                </tr>
                                <tr>
                                    <th className='text-muted'>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <th className='text-muted'>Role</th>
                                    <td>
                                        {user.role
                                            ? <Badge bg='secondary'>{user.role}</Badge>
                                            : <span className='text-muted'>—</span>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th className='text-muted'>Joined</th>
                                    <td className='text-muted'>{user.created_at}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
