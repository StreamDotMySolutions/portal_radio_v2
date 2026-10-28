import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationVideosStore from '../store'

export default function DeleteModal({ id, title }) {
    const { url: apiBase } = useStore()
    const setRefresh = useStationVideosStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [acknowledged, setAcknowledged] = useState(false)

    const handleShowClick = () => {
        setAcknowledged(false)
        setShow(true)
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)

        axios({ method: 'delete', url: `${apiBase}/station-videos/${id}` })
            .then(() => {
                setRefresh()
                handleClose()
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button size='sm' variant='outline-danger' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'trash']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Station Video</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to delete <strong>{title}</strong>? The video and all its HLS files are removed.</p>
                    <Form.Check
                        type='checkbox'
                        label='I acknowledge this action is irreversible'
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>Close</Button>
                    <Button variant='danger' disabled={isLoading || !acknowledged} onClick={handleSubmitClick}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
