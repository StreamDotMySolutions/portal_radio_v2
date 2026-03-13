import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationCategoriesStore from '../store'

export default function DeleteModal({ id, displayName }) {
    const { url: apiBase } = useStore()
    const setRefresh = useStationCategoriesStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleShowClick = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleDeleteClick = () => {
        setIsLoading(true)
        axios({ method: 'delete', url: `${apiBase}/station-categories/${id}` })
            .then(() => {
                setRefresh()
                setTimeout(() => handleClose(), 500)
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button
                variant='danger'
                size='sm'
                onClick={handleShowClick}
                title='Delete'
            >
                <FontAwesomeIcon icon={['fas', 'trash']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Category</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to delete <strong>{displayName}</strong>?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant='danger' disabled={isLoading} onClick={handleDeleteClick}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
