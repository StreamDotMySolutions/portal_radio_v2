import { useState, useEffect } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationCategoriesStore from '../store'
import HtmlForm from '../components/HtmlForm'

export default function EditModal({ id }) {
    const { url: apiBase } = useStore()
    const setRefresh = useStationCategoriesStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setShow(true)
        setIsFetching(true)
        axios({ method: 'get', url: `${apiBase}/station-categories/${id}` })
            .then((response) => {
                const cat = response.data.category
                setForm({
                    displayName: cat.display_name,
                    slug: cat.slug,
                    active: cat.active ? 1 : 0,
                    slugManuallyEdited: true,
                })
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsFetching(false))
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const payload = {
            display_name: form.displayName,
            slug: form.slug,
            active: form.active,
        }

        axios({ method: 'put', url: `${apiBase}/station-categories/${id}`, data: payload })
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
            <Button
                variant='warning'
                size='sm'
                onClick={handleShowClick}
                title='Edit'
            >
                <FontAwesomeIcon icon={['fas', 'pen']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Station Category</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isFetching ? (
                        <div className='text-center py-5'>
                            <Spinner animation='border' />
                        </div>
                    ) : (
                        <HtmlForm
                            form={form}
                            onChange={onChange}
                            errors={errors}
                            isLoading={isLoading}
                        />
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading || isFetching} onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='primary' disabled={isLoading || isFetching} onClick={handleSubmitClick}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
