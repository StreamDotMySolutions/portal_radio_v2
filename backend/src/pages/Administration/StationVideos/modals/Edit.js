import { useState } from 'react'
import { Alert, Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationVideosStore from '../store'
import HtmlForm from '../components/HtmlForm'

export default function EditModal({ id }) {
    const { url: apiBase } = useStore()
    const setRefresh = useStationVideosStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({ stationId: '', title: '', description: '' })
    const [stationTitle, setStationTitle] = useState('')
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState(null)
    const [message, setMessage] = useState('')
    const [progress, setProgress] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setFile(null)
        setErrors(null)
        setMessage('')
        setProgress(null)
        setShow(true)
        setIsFetching(true)

        axios({ method: 'get', url: `${apiBase}/station-videos/${id}` })
            .then((response) => {
                const v = response.data.video
                setForm({ stationId: v.station_id, title: v.title ?? '', description: v.description ?? '' })
                setStationTitle(v.station?.title ?? '')
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsFetching(false))
    }

    const handleClose = () => {
        if (!isLoading) setShow(false)
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        setErrors(null)
        setMessage('')
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description ?? '')
        if (file) formData.append('file', file)

        axios({
            method: 'post',
            url: `${apiBase}/station-videos/${id}`,
            data: formData,
            onUploadProgress: (e) => file && e.total && setProgress(Math.round((e.loaded * 100) / e.total)),
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
                    setMessage(error.response?.data?.message || 'Update failed. Please try again.')
                }
            })
            .finally(() => {
                setIsLoading(false)
                setProgress(null)
            })
    }

    return (
        <>
            <Button size='sm' variant='outline-primary' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose} backdrop={isLoading ? 'static' : true}>
                <Modal.Header closeButton={!isLoading}>
                    <Modal.Title>Edit Station Video</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isFetching ? (
                        <div className='text-center py-4'><Spinner animation='border' variant='secondary' /></div>
                    ) : (
                        <>
                            {message && <Alert variant='danger' className='py-2 small'>{message}</Alert>}
                            <HtmlForm
                                form={form}
                                onChange={onChange}
                                stations={[]}
                                onFileChange={setFile}
                                errors={errors}
                                isLoading={isLoading}
                                progress={progress}
                                editing
                                currentStation={stationTitle}
                            />
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>Close</Button>
                    <Button variant='primary' disabled={isLoading || isFetching} onClick={handleSubmitClick}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
