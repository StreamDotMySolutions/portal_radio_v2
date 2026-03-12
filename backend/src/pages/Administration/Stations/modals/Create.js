import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationsStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = {
    title: '',
    description: '',
    frequency: '',
    category: '',
    rtmklkPlayerUrl: '',
    facebookUrl: '',
    xUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    accentColor: '',
    active: 1,
}

export default function CreateModal() {
    const { url: apiBase, server: serverUrl } = useStore()
    const setRefresh = useStationsStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [bannerFile, setBannerFile] = useState(null)
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setForm(emptyForm)
        setThumbnailFile(null)
        setBannerFile(null)
        setErrors(null)
        setShow(true)
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        if (form.title) formData.append('title', form.title)
        if (form.description) formData.append('description', form.description)
        if (form.frequency) formData.append('frequency', form.frequency)
        if (form.category) formData.append('category', form.category)
        if (form.rtmklkPlayerUrl) formData.append('rtmklik_player_url', form.rtmklkPlayerUrl)
        if (form.facebookUrl) formData.append('facebook_url', form.facebookUrl)
        if (form.xUrl) formData.append('x_url', form.xUrl)
        if (form.instagramUrl) formData.append('instagram_url', form.instagramUrl)
        if (form.youtubeUrl) formData.append('youtube_url', form.youtubeUrl)
        if (form.tiktokUrl) formData.append('tiktok_url', form.tiktokUrl)
        if (form.accentColor) formData.append('accent_color', form.accentColor)
        if (form.active !== '') formData.append('active', form.active)
        if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
        if (bannerFile) formData.append('banner', bannerFile)

        axios({ method: 'post', url: `${apiBase}/stations`, data: formData })
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
                <FontAwesomeIcon icon={['fas', 'circle-plus']} className='me-1' />Create
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Station</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        errors={errors}
                        isLoading={isLoading}
                        thumbnailFilename={null}
                        onThumbnailChange={setThumbnailFile}
                        bannerFilename={null}
                        onBannerChange={setBannerFile}
                        serverUrl={serverUrl}
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
