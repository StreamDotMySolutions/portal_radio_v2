import { useState, useEffect } from 'react'
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
    station_category_id: '',
    rtmklikPlayerUrl: '',
    facebookUrl: '',
    xUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    accentColor: '',
    active: '',
}

export default function EditModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()
    const setRefresh = useStationsStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [thumbnailFilename, setThumbnailFilename] = useState(null)
    const [bannerFile, setBannerFile] = useState(null)
    const [bannerFilename, setBannerFilename] = useState(null)
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setIsLoading(true)
        setErrors(null)
        axios({ method: 'get', url: `${apiBase}/stations/${id}` })
            .then((response) => {
                const station = response.data.station
                console.log('Station data loaded:', station)
                console.log('rtmklik_player_url:', station.rtmklik_player_url)
                setForm({
                    title: station.title || '',
                    description: station.description || '',
                    frequency: station.frequency || '',
                    station_category_id: station.station_category_id || '',
                    rtmklikPlayerUrl: station.rtmklik_player_url || '',
                    facebookUrl: station.facebook_url || '',
                    xUrl: station.x_url || '',
                    instagramUrl: station.instagram_url || '',
                    youtubeUrl: station.youtube_url || '',
                    tiktokUrl: station.tiktok_url || '',
                    accentColor: station.accent_color || '',
                    active: station.active,
                })
                setThumbnailFilename(station.thumbnail_filename || null)
                setBannerFilename(station.banner_filename || null)
                setThumbnailFile(null)
                setBannerFile(null)
                setShow(true)
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => {
        setShow(false)
        setForm(emptyForm)
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('_method', 'PUT')
        if (form.title) formData.append('title', form.title)
        if (form.description) formData.append('description', form.description)
        if (form.frequency) formData.append('frequency', form.frequency)
        if (form.station_category_id) formData.append('station_category_id', form.station_category_id)
        if (form.rtmklikPlayerUrl) formData.append('rtmklik_player_url', form.rtmklikPlayerUrl)
        if (form.facebookUrl) formData.append('facebook_url', form.facebookUrl)
        if (form.xUrl) formData.append('x_url', form.xUrl)
        if (form.instagramUrl) formData.append('instagram_url', form.instagramUrl)
        if (form.youtubeUrl) formData.append('youtube_url', form.youtubeUrl)
        if (form.tiktokUrl) formData.append('tiktok_url', form.tiktokUrl)
        if (form.accentColor) formData.append('accent_color', form.accentColor)
        if (form.active !== '') formData.append('active', form.active)
        if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
        if (bannerFile) formData.append('banner', bannerFile)

        console.log('Form submitted with rtmklikPlayerUrl:', form.rtmklikPlayerUrl)
        console.log('Submitting to:', `${apiBase}/stations/${id}`)

        axios({ method: 'post', url: `${apiBase}/stations/${id}`, data: formData })
            .then(() => {
                console.log('Submit successful')
                setRefresh()
                setTimeout(() => handleClose(), 500)
            })
            .catch((error) => {
                console.error('Submit error:', error.response?.status, error.response?.data)
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors)
                    console.error('Validation errors:', error.response.data.errors)
                }
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button size='sm' variant='outline-secondary' onClick={handleShowClick} title='Edit'>
                <FontAwesomeIcon icon={['fas', 'pencil']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Station</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        errors={errors}
                        isLoading={isLoading}
                        thumbnailFilename={thumbnailFilename}
                        onThumbnailChange={setThumbnailFile}
                        bannerFilename={bannerFilename}
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
