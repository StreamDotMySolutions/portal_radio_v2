import { useState } from 'react'
import { Badge, Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase, server } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null)

    const handleShowClick = () => {
        setShow(true)
        setIsLoading(true)

        axios({ method: 'get', url: `${apiBase}/chat-users/${id}` })
            .then((response) => setUser(response.data.chat_user))
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
                    <Modal.Title>Chat User Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-4'>
                            <Spinner animation='border' variant='secondary' />
                        </div>
                    ) : user && (
                        <>
                            {user.avatar_filename && (
                                <div className='text-center mb-3'>
                                    <img
                                        src={`${server}/storage/chat-avatars/${user.avatar_filename}`}
                                        alt='Avatar'
                                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            <table className='table table-borderless mb-0'>
                                <tbody>
                                    <tr>
                                        <th style={{ width: '120px' }} className='text-muted'>Username</th>
                                        <td><span style={{ color: user.color, fontWeight: 600 }}>{user.username}</span></td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Email</th>
                                        <td>{user.email}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Full Name</th>
                                        <td>{user.full_name || <span className='text-muted'>—</span>}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Gender</th>
                                        <td>{user.gender || <span className='text-muted'>—</span>}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Location</th>
                                        <td>{user.location || <span className='text-muted'>—</span>}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Status</th>
                                        <td>
                                            {user.is_banned
                                                ? <Badge bg='danger'>Banned</Badge>
                                                : <Badge bg='success'>Active</Badge>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Verified</th>
                                        <td>
                                            {user.email_verified_at
                                                ? <Badge bg='info'>{user.email_verified_at}</Badge>
                                                : <Badge bg='secondary'>No</Badge>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>About</th>
                                        <td>{user.about_me || <span className='text-muted'>—</span>}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted'>Joined</th>
                                        <td className='text-muted'>{user.created_at}</td>
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
