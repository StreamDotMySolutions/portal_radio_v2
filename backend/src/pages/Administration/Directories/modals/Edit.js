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
        store.emptyData()
        setShow(true)

        axios({ method: 'get', url: `${store.url}/directories/${id}` })
            .then(response => {
                const d = response.data.directory
                store.setValue('type', d.type)
                store.setValue('name', d.name)
                if (d.type === 'spreadsheet') {
                    store.setValue('photo', d.photo)
                    store.setValue('occupation', d.occupation)
                    store.setValue('email', d.email)
                    store.setValue('phone', d.phone)
                    store.setValue('address', d.address)
                    store.setValue('facebook', d.facebook)
                    store.setValue('twitter', d.twitter)
                    store.setValue('instagram', d.instagram)
                }
            })
            .catch(error => console.warn(error))
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        const type = store.getValue('type')
        const formData = new FormData()

        const fields = [
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
        formData.append('_method', 'put')

        axios({ method: 'post', url: `${store.url}/directories/${id}`, data: formData })
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
                    <Modal.Title>Edit Directory</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm isLoading={isLoading} mode='edit' />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>Close</Button>
                    <Button variant='primary' disabled={isLoading} onClick={handleSubmitClick}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
