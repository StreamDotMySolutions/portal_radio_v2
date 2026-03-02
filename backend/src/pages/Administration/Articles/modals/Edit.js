import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'

export default function EditModal({ id }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleClose = () => setShow(false)

    const handleShowClick = () => {
        store.setValue('errors', '')
        setShow(true)

        axios({ method: 'get', url: `${store.url}/articles/${id}` })
            .then(response => {
                if (response?.data?.article?.title) {
                    store.setValue('title', response.data.article.title)
                }
            })
            .catch(error => console.warn(error))
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        appendFormData(formData, [
            { key: 'title', value: store.getValue('title') },
        ])
        formData.append('_method', 'put')

        axios({ method: 'post', url: `${store.url}/articles/${id}`, data: formData })
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
                    <Modal.Title>Edit Article</Modal.Title>
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
