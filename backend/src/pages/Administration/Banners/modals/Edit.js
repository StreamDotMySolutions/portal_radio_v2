import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useBannersStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = {
    title: '',
    description: '',
    redirectUrl: '',
    active: '',
    publishedStart: '',
    publishedEnd: '',
}

export default function EditModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()
    const setRefresh = useBannersStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [filename, setFilename] = useState('')
    const [bannerFile, setBannerFile] = useState(null)
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setErrors(null)
        setBannerFile(null)
        setIsLoading(true)
        setShow(true)

        axios({ method: 'get', url: `${apiBase}/banners/${id}` })
            .then((response) => {
                const b = response.data.banner
                setForm({
                    title: b.title ?? '',
                    description: b.description ?? '',
                    redirectUrl: b.redirect_url ?? '',
                    active: b.active ?? '',
                    publishedStart: b.published_start ?? '',
                    publishedEnd: b.published_end ?? '',
                })
                setFilename(b.filename ?? '')
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        if (form.title) formData.append('title', form.title)
        if (form.description) formData.append('description', form.description)
        if (form.redirectUrl) formData.append('redirect_url', form.redirectUrl)
        if (form.active !== '') formData.append('active', form.active)
        if (form.publishedStart) formData.append('published_start', form.publishedStart)
        if (form.publishedEnd) formData.append('published_end', form.publishedEnd)
        if (bannerFile) formData.append('banner', bannerFile)
        formData.append('_method', 'put')

        axios({ method: 'post', url: `${apiBase}/banners/${id}`, data: formData })
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
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Banner</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        filename={filename}
                        onBannerChange={setBannerFile}
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
