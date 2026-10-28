import { useState } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationVideosStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = { stationId: '', title: '', description: '' }

export default function CreateModal() {
    const { url: apiBase } = useStore()
    const setRefresh = useStationVideosStore((s) => s.setRefresh)
    const stations = useStationVideosStore((s) => s.stations)
    const stationFilter = useStationVideosStore((s) => s.stationFilter)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState(null)
    const [message, setMessage] = useState('')
    const [progress, setProgress] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setForm({ ...emptyForm, stationId: stationFilter })
        setFile(null)
        setErrors(null)
        setMessage('')
        setProgress(null)
        setShow(true)
    }

    const handleClose = () => {
        if (!isLoading) setShow(false)
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        setErrors(null)
        setMessage('')
        const formData = new FormData()
        formData.append('station_id', form.stationId)
        formData.append('title', form.title)
        if (form.description) formData.append('description', form.description)
        if (file) formData.append('file', file)

        axios({
            method: 'post',
            url: `${apiBase}/station-videos`,
            data: formData,
            onUploadProgress: (e) => e.total && setProgress(Math.round((e.loaded * 100) / e.total)),
        })
            .then(() => {
                setRefresh()
                setShow(false)
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors)
                } else if (error.response?.status === 413) {
                    setMessage('The file is larger than the server allows.')
                } else {
                    setMessage(error.response?.data?.message || 'Upload failed. Please try again.')
                }
            })
            .finally(() => {
                setIsLoading(false)
                setProgress(null)
            })
    }

    return (
        <>
            <Button variant='primary' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'circle-plus']} className='me-1' />Create
            </Button>

            <Modal size='lg' show={show} onHide={handleClose} backdrop={isLoading ? 'static' : true}>
                <Modal.Header closeButton={!isLoading}>
                    <Modal.Title>Upload Station Video</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {message && <Alert variant='danger' className='py-2 small'>{message}</Alert>}
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        stations={stations}
                        onFileChange={setFile}
                        errors={errors}
                        isLoading={isLoading}
                        progress={progress}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>Close</Button>
                    <Button variant='primary' disabled={isLoading} onClick={handleSubmitClick}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
