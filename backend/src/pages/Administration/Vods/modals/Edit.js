import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'

export default function EditModal({ id }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleShowClick = () => {
        store.emptyData()
        setShow(true)

        axios({ method: 'get', url: `${store.url}/vods/${id}` })
            .then(response => {
                const vod = response?.data?.vod
                store.setValue('type', vod?.type)
                store.setValue('name', vod?.name)
                store.setValue('rename', vod?.name)
            })
            .catch(error => console.warn(error))
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)

        const formData = new FormData()
        formData.append('_method', 'put')

        if (store.getValue('type') === 'folder') {
            formData.append('name', store.getValue('name'))
        }

        if (store.getValue('type') === 'file' && store.getValue('rename')) {
            formData.append('rename', store.getValue('rename'))
        }

        axios({ method: 'post', url: `${store.url}/vods/${id}`, data: formData })
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
            <Button size='sm' variant='outline-primary' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit VOD</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm isLoading={isLoading} mode='edit' />
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
