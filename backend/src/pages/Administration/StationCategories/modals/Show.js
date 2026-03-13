import { useState, useEffect } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [category, setCategory] = useState(null)

    const handleShowClick = () => {
        setShow(true)
        setIsLoading(true)
        axios({ method: 'get', url: `${apiBase}/station-categories/${id}` })
            .then((response) => setCategory(response.data.category))
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => setShow(false)

    return (
        <>
            <Button
                variant='info'
                size='sm'
                onClick={handleShowClick}
                title='Show'
            >
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>View Station Category</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-5'>
                            <Spinner animation='border' />
                        </div>
                    ) : category ? (
                        <div className='d-flex flex-column gap-3'>
                            <div>
                                <label className='fw-semibold small text-muted'>Display Name</label>
                                <p>{category.display_name}</p>
                            </div>
                            <div>
                                <label className='fw-semibold small text-muted'>Slug</label>
                                <p><code>{category.slug}</code></p>
                            </div>
                            <div>
                                <label className='fw-semibold small text-muted'>Sort Order</label>
                                <p>{category.sort_order}</p>
                            </div>
                            <div>
                                <label className='fw-semibold small text-muted'>Active</label>
                                <p>{category.active ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                                <label className='fw-semibold small text-muted'>Created</label>
                                <p>{category.created_at}</p>
                            </div>
                            <div>
                                <label className='fw-semibold small text-muted'>Updated</label>
                                <p>{category.updated_at}</p>
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
