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
        const type = store.getValue('type')

        const fields = [
            { key: 'type', value: type },
            { key: 'parent_id', value: parentId },
            { key: 'name', value: store.getValue('name') },
        ]

        if (type === 'spreadsheet') {
            fields.push(
                { key: 'photo', value: store.getValue('photo') },
                { key: 'occupation', value: store.getValue('occupation') },
                { key: 'email', value: store.getValue('email') },
                { key: 'phone', value: store.getValue('phone') },
                { key: 'address', value: store.getValue('address') },
                { key: 'facebook', value: store.getValue('facebook') },
                { key: 'twitter', value: store.getValue('twitter') },
                { key: 'instagram', value: store.getValue('instagram') },
            )
        }

        appendFormData(formData, fields)

        axios({ method: 'post', url: `${store.url}/directories`, data: formData })
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
                    <Modal.Title>Create Directory</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm isLoading={isLoading} mode='create' />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>Close</Button>
                    <Button variant='primary' disabled={isLoading || !store.getValue('type')} onClick={handleSubmitClick}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
