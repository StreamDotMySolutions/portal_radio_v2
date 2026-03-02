import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useProgrammesStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = { title: '', redirectUrl: '' }

export default function CreateModal() {
    const { url: apiBase, server: serverUrl } = useStore()
    const setRefresh = useProgrammesStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [imageFile, setImageFile] = useState(null)
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setForm(emptyForm)
        setImageFile(null)
        setErrors(null)
        setShow(true)
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        if (form.title) formData.append('title', form.title)
        if (form.redirectUrl) formData.append('redirect_url', form.redirectUrl)
        if (imageFile) formData.append('programme', imageFile)

        axios({ method: 'post', url: `${apiBase}/programmes`, data: formData })
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
            <Button variant='primary' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'file']} />{' '}Create
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Programme</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        filename={null}
                        onImageChange={setImageFile}
                        serverUrl={serverUrl}
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
