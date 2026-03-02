import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useVideosStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = { title: '', embedCode: '' }

export default function EditModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()
    const setRefresh = useVideosStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [filename, setFilename] = useState('')
    const [posterFile, setPosterFile] = useState(null)
    const [videos, setVideos] = useState([])
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setErrors(null)
        setPosterFile(null)
        setIsLoading(true)
        setShow(true)

        Promise.all([
            axios({ method: 'get', url: `${apiBase}/vods/list-videos` }),
            axios({ method: 'get', url: `${apiBase}/videos/${id}` }),
        ])
            .then(([vodRes, videoRes]) => {
                setVideos(vodRes.data.vods)
                const v = videoRes.data.video
                setForm({
                    title: v.title ?? '',
                    embedCode: v.embed_code ?? '',
                })
                setFilename(v.filename ?? '')
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        if (form.title) formData.append('title', form.title)
        if (form.embedCode) formData.append('embed_code', form.embedCode)
        if (posterFile) formData.append('poster', posterFile)
        formData.append('_method', 'put')

        axios({ method: 'post', url: `${apiBase}/videos/${id}`, data: formData })
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
                    <Modal.Title>Edit Video</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        videos={videos}
                        filename={filename}
                        onPosterChange={setPosterFile}
                        serverUrl={serverUrl}
                        errors={errors}
                        isLoading={isLoading}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>Close</Button>
                    <Button variant='primary' disabled={isLoading} onClick={handleSubmitClick}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
