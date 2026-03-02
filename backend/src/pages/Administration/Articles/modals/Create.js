import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'

export default function CreateModal() {
    const store = useStore()
    const { parentId } = useParams()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleClose = () => setShow(false)

    const handleShowClick = () => {
        store.emptyData()
        setShow(true)
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        appendFormData(formData, [
            { key: 'title', value: store.getValue('title') },
            { key: 'type', value: store.getValue('type') },
            { key: 'parent_id', value: parentId },
        ])
        formData.append('_method', 'post')

        axios({ method: 'post', url: `${store.url}/articles`, data: formData })
            .then(() => {
                store.setValue('refresh', true)
                handleClose()
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    store.setValue('errors', error.response.data.errors)
                }
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button variant='primary' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'circle-plus']} className='me-2' />
                Create
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Article</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm isLoading={isLoading} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='primary' disabled={isLoading} onClick={handleSubmitClick}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
