import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useRolesStore from '../store'
import HtmlForm from '../components/HtmlForm'

export default function EditModal({ id }) {
    const { url: apiBase } = useStore()
    const setRefresh = useRolesStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [errors, setErrors] = useState(null)

    const handleShowClick = () => {
        setErrors(null)
        setIsLoading(true)
        setShow(true)

        axios({ method: 'get', url: `${apiBase}/roles/${id}` })
            .then((response) => {
                setName(response.data.role?.name ?? '')
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('_method', 'put')

        axios({ method: 'post', url: `${apiBase}/roles/${id}`, data: formData })
            .then(() => {
                setRefresh()
                handleClose()
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors)
                }
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button size='sm' variant='outline-primary' onClick={handleShowClick}>
                Edit
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Role</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        value={name}
                        onChange={setName}
                        error={errors?.name?.[0]}
                        isLoading={isLoading}
                    />
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
