import { useState } from 'react'
import { Button, Modal} from 'react-bootstrap'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function EditModal({id}) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleClose = () => setShow(false)
    const handleCloseClick = () => handleClose()

    const handleShowClick = () => {
        store.emptyData()
        setShow(true)

        axios({ method: 'get', url: `${store.url}/assets/${id}` })
            .then(response => {
                const asset = response?.data?.asset
                store.setValue('type', asset?.type)
                store.setValue('name', asset?.name)
                store.setValue('rename', asset?.name)
                store.setValue('mimetype', asset?.mimetype)
                store.setValue('filesize', asset?.filesize)
                setIsLoading(false)
            })
            .catch(error => {
                console.warn(error)
                setIsLoading(false)
            })
    }

    const handleSubmitClick = () => {
        const formData = new FormData()
        formData.append('_method', 'put')

        if (store.getValue('type') === 'folder') {
            formData.append('name', store.getValue('name'))
        }

        if (store.getValue('type') === 'file') {
            if (store.getValue('rename')) {
                formData.append('rename', store.getValue('rename'))
            }
            if (store.getValue('file')) {
                formData.append('file', store.getValue('file'))
            }
        }

        axios({ method: 'post', url: `${store.url}/assets/${id}`, data: formData })
            .then(response => {
                store.setValue('refresh', true)
                setIsLoading(false)
                handleClose()
            })
            .catch(error => {
                if (error.response?.status == 422) {
                    store.setValue('errors', error.response.data.errors)
                }
                setIsLoading(false)
            })
    }

    return (
        <>
            <Button size="sm" variant="outline-primary" onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal size={'lg'} show={show} onHide={handleCloseClick}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit asset</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm isLoading={isLoading} mode='edit' />
                </Modal.Body>

                <Modal.Footer>
                    <Button disabled={isLoading} variant="secondary" onClick={handleCloseClick}>
                        Close
                    </Button>
                    <Button disabled={isLoading} variant="primary" onClick={handleSubmitClick}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
