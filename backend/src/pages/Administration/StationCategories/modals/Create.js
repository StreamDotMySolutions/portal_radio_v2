import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationCategoriesStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = {
    displayName: '',
    slug: '',
    sortOrder: 0,
    active: 1,
    slugManuallyEdited: false,
}

export default function CreateModal() {
    const { url: apiBase } = useStore()
    const setRefresh = useStationCategoriesStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setForm(emptyForm)
        setErrors(null)
        setShow(true)
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const payload = {
            display_name: form.displayName,
            slug: form.slug,
            sort_order: form.sortOrder,
            active: form.active,
        }

        axios({ method: 'post', url: `${apiBase}/station-categories`, data: payload })
            .then(() => {
                setRefresh()
                setTimeout(() => handleClose(), 500)
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
            <Button variant='primary' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'circle-plus']} className='me-1' />Create
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Station Category</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        errors={errors}
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
