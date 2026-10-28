import { useState } from 'react'
import { Alert, Button, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HlsPlayer from '../../Vods/components/HlsPlayer'
import { fmtDuration, fmtSize, StatusBadge } from '../components/format'

export default function ShowModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [video, setVideo] = useState(null)

    const handleShowClick = () => {
        setShow(true)
        setIsLoading(true)

        axios({ method: 'get', url: `${apiBase}/station-videos/${id}` })
            .then((response) => setVideo(response.data.video))
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => {
        setShow(false)
        setVideo(null)
    }

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Station Video</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className='text-center py-4'>
                            <Spinner animation='border' variant='secondary' />
                        </div>
                    ) : video && (
                        <>
                            {video.hls_url ? (
                                <div className='mb-3' style={{ background: '#000', borderRadius: '6px', overflow: 'hidden' }}>
                                    <HlsPlayer
                                        src={`${serverUrl}/storage/${video.hls_url}`}
                                        poster={video.poster_url ? `${serverUrl}/storage/${video.poster_url}` : undefined}
                                        height='auto'
                                    />
                                </div>
                            ) : (
                                <Alert variant='secondary' className='small'>
                                    The video is not available to play yet. It appears here once it is converted.
                                </Alert>
                            )}
                            {video.hls_url && video.status !== 'ready' && (
                                <Alert variant='info' className='small'>
                                    Showing the current version. A new file is being converted and will replace it.
                                </Alert>
                            )}

                            <table className='table table-borderless mb-0'>
                                <tbody>
                                    <tr><th style={{ width: '130px' }} className='text-muted'>Title</th><td>{video.title}</td></tr>
                                    <tr><th className='text-muted'>Station</th><td>{video.station?.title ?? '—'}</td></tr>
                                    <tr><th className='text-muted'>Description</th><td>{video.description || '—'}</td></tr>
                                    <tr><th className='text-muted'>Status</th><td><StatusBadge status={video.status} error={video.error} /></td></tr>
                                    {video.status === 'failed' && video.error && (
                                        <tr><th className='text-muted'>Error</th><td className='small text-danger' style={{ whiteSpace: 'pre-wrap' }}>{video.error}</td></tr>
                                    )}
                                    <tr><th className='text-muted'>Duration</th><td>{video.duration ? fmtDuration(video.duration) : '—'}</td></tr>
                                    <tr><th className='text-muted'>Size</th><td>{video.width ? `${video.width}×${video.height}` : '—'}</td></tr>
                                    <tr><th className='text-muted'>Renditions</th><td>{video.renditions?.length ? `${video.renditions.join(' / ')}p` : '—'}</td></tr>
                                    <tr><th className='text-muted'>HLS size</th><td>{fmtSize(video.hls_size)}</td></tr>
                                    <tr><th className='text-muted'>Uploaded</th><td>{video.created_at}</td></tr>
                                </tbody>
                            </table>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
