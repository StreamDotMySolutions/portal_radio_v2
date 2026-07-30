import { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationsStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = {
    title: '',
    slug: '',
    description: '',
    frequency: '',
    station_category_id: '',
    playerType: 'm3u8',
    streamUrl: '',
    rtmklikPlayerUrl: '',
    facebookUrl: '',
    xUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    threadsUrl: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    accentColor: '',
    active: '',
}

const toSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

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
    const [playerFile, setPlayerFile] = useState(null)
    const [playerFilename, setPlayerFilename] = useState(null)
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: field === 'slug' ? toSlug(value) : value }))

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
                    slug: station.slug || '',
                    description: station.description || '',
                    frequency: station.frequency || '',
                    station_category_id: station.station_category_id || '',
                    playerType: station.player_type || 'm3u8',
                    streamUrl: station.stream_url || '',
                    rtmklikPlayerUrl: station.rtmklik_player_url || '',
                    facebookUrl: station.facebook_url || '',
                    xUrl: station.x_url || '',
                    instagramUrl: station.instagram_url || '',
                    youtubeUrl: station.youtube_url || '',
                    tiktokUrl: station.tiktok_url || '',
                    threadsUrl: station.threads_url || '',
                    contactPhone: station.contact_phone || '',
                    contactEmail: station.contact_email || '',
                    contactAddress: station.contact_address || '',
                    accentColor: station.accent_color || '',
                    active: station.active,
                })
                setThumbnailFilename(station.thumbnail_filename || null)
                setBannerFilename(station.banner_filename || null)
                setPlayerFilename(station.player_filename || null)
                setThumbnailFile(null)
                setBannerFile(null)
                setPlayerFile(null)
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
        if (form.slug) formData.append('slug', form.slug)
        if (form.description) formData.append('description', form.description)
        if (form.frequency) formData.append('frequency', form.frequency)
        if (form.station_category_id) formData.append('station_category_id', form.station_category_id)
        formData.append('player_type', form.playerType)
        if (form.playerType === 'm3u8' && form.streamUrl) {
            formData.append('stream_url', form.streamUrl)
        }
        if (form.playerType === 'iframe' && form.rtmklikPlayerUrl) {
            formData.append('rtmklik_player_url', form.rtmklikPlayerUrl)
        }
        if (form.facebookUrl) formData.append('facebook_url', form.facebookUrl)
        if (form.xUrl) formData.append('x_url', form.xUrl)
        if (form.instagramUrl) formData.append('instagram_url', form.instagramUrl)
        if (form.youtubeUrl) formData.append('youtube_url', form.youtubeUrl)
        if (form.tiktokUrl) formData.append('tiktok_url', form.tiktokUrl)
        if (form.threadsUrl) formData.append('threads_url', form.threadsUrl)
        formData.append('contact_phone', form.contactPhone || '')
        formData.append('contact_email', form.contactEmail || '')
        formData.append('contact_address', form.contactAddress || '')
        if (form.accentColor) formData.append('accent_color', form.accentColor)
        if (form.active !== '') formData.append('active', form.active)
        if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
        if (bannerFile) formData.append('banner', bannerFile)
        if (playerFile) formData.append('player', playerFile)

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
                        playerFilename={playerFilename}
                        onPlayerChange={setPlayerFile}
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
