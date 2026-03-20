import { useState, useEffect, useRef } from 'react'
import { Button, Modal, Table, Badge, Figure, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()
    const audioRef = useRef(null)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [station, setStation] = useState(null)
    const [categories, setCategories] = useState([])
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        axios({ method: 'get', url: `${apiBase}/station-categories/all` })
            .then((response) => {
                const cats = response.data.categories || []
                setCategories(Array.isArray(cats) ? cats : [])
            })
            .catch((error) => {
                console.error('Error fetching categories:', error)
                setCategories([])
            })
    }, [apiBase])

    const handleShowClick = () => {
        setIsLoading(true)
        axios({ method: 'get', url: `${apiBase}/stations/${id}` })
            .then((response) => {
                setStation(response.data.station)
                setShow(true)
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => {
        setShow(false)
        setStation(null)
    }

    const categoryVariant = (slug) => {
        const variants = {
            'nasional': 'primary',
            'negeri': 'info',
            'radio-tempatan': 'warning',
            'radio-online': 'success'
        }
        return variants[slug] || 'secondary'
    }

    const getCategoryDisplayName = (slug) => {
        const cat = categories.find(c => c.slug === slug)
        return cat ? cat.display_name : slug
    }

    return (
        <>
            <Button size='sm' variant='outline-secondary' onClick={handleShowClick} title='View'>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>View Station</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {station && (
                        <>
                            {/* Player Preview */}
                            {station.player_type === 'm3u8' && station.stream_url ? (
                                <Card className='mb-3' style={{ backgroundColor: '#f8f9fa' }}>
                                    <Card.Body>
                                        <div className='d-flex align-items-center gap-2 mb-2'>
                                            <FontAwesomeIcon icon={['fas', 'play']} className='text-primary' />
                                            <h6 className='mb-0'>M3U8 Player Preview</h6>
                                        </div>
                                        <div style={{ backgroundColor: '#000', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <button
                                                onClick={() => {
                                                    if (playing) {
                                                        audioRef.current?.pause()
                                                    } else {
                                                        audioRef.current?.play()
                                                    }
                                                    setPlaying(!playing)
                                                }}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#007bff',
                                                    border: 'none',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <FontAwesomeIcon icon={['fas', playing ? 'pause' : 'play']} />
                                            </button>
                                            <audio
                                                ref={audioRef}
                                                onPause={() => setPlaying(false)}
                                                onEnded={() => setPlaying(false)}
                                                style={{ flex: 1 }}
                                            >
                                                <source src={station.stream_url} type='application/x-mpegURL' />
                                            </audio>
                                            <small style={{ color: '#999' }}>{station.title}</small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ) : station.player_type === 'iframe' && station.rtmklik_player_url ? (
                                <Card className='mb-3' style={{ backgroundColor: '#f8f9fa' }}>
                                    <Card.Body>
                                        <div className='d-flex align-items-center gap-2 mb-2'>
                                            <FontAwesomeIcon icon={['fas', 'window-restore']} className='text-warning' />
                                            <h6 className='mb-0'>RTMKlik Player Preview</h6>
                                        </div>
                                        <div style={{ aspectRatio: '1/1.03', position: 'relative', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                                            <iframe
                                                src={station.rtmklik_player_url}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    border: 'none',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0
                                                }}
                                                allow='autoplay'
                                                scrolling='no'
                                                title={`${station.title} player`}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            ) : (
                                <Card className='mb-3' style={{ backgroundColor: '#f8f9fa' }}>
                                    <Card.Body className='text-center text-muted'>
                                        <FontAwesomeIcon icon={['fas', 'info-circle']} className='me-2' />
                                        No player configured
                                    </Card.Body>
                                </Card>
                            )}

                            {/* Station Details Table */}
                        <Table bordered>
                            <tbody>
                                <tr>
                                    <td className='fw-semibold' style={{ width: '180px' }}>Title</td>
                                    <td>{station.title}</td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Description</td>
                                    <td>{station.description || '—'}</td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Frequency</td>
                                    <td>{station.frequency || '—'}</td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Category</td>
                                    <td>
                                        <Badge bg={categoryVariant(station.category)}>
                                            {getCategoryDisplayName(station.category)}
                                        </Badge>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Active</td>
                                    <td>
                                        <Badge bg={station.active == 1 ? 'success' : 'secondary'}>
                                            {station.active == 1 ? 'Yes' : 'No'}
                                        </Badge>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Player Type</td>
                                    <td>
                                        <Badge bg={station.player_type === 'm3u8' ? 'primary' : 'warning'}>
                                            {station.player_type === 'm3u8' ? 'M3U8 (HLS)' : 'RTMKlik (iframe)'}
                                        </Badge>
                                    </td>
                                </tr>
                                {station.player_type === 'm3u8' && (
                                    <tr>
                                        <td className='fw-semibold'>Stream URL</td>
                                        <td>
                                            {station.stream_url ? (
                                                <code style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                                                    {station.stream_url}
                                                </code>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                    </tr>
                                )}
                                {station.player_type === 'iframe' && (
                                    <tr>
                                        <td className='fw-semibold'>RTMKlik URL</td>
                                        <td>
                                            {station.rtmklik_player_url ? (
                                                <a href={station.rtmklik_player_url} target='_blank' rel='noreferrer'>
                                                    {station.rtmklik_player_url}
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td className='fw-semibold'>Facebook</td>
                                    <td>
                                        {station.facebook_url ? (
                                            <a href={station.facebook_url} target='_blank' rel='noreferrer'>
                                                {station.facebook_url}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>X (Twitter)</td>
                                    <td>
                                        {station.x_url ? (
                                            <a href={station.x_url} target='_blank' rel='noreferrer'>
                                                {station.x_url}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Instagram</td>
                                    <td>
                                        {station.instagram_url ? (
                                            <a href={station.instagram_url} target='_blank' rel='noreferrer'>
                                                {station.instagram_url}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>YouTube</td>
                                    <td>
                                        {station.youtube_url ? (
                                            <a href={station.youtube_url} target='_blank' rel='noreferrer'>
                                                {station.youtube_url}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>TikTok</td>
                                    <td>
                                        {station.tiktok_url ? (
                                            <a href={station.tiktok_url} target='_blank' rel='noreferrer'>
                                                {station.tiktok_url}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Accent Color</td>
                                    <td>
                                        {station.accent_color ? (
                                            <div className='d-flex align-items-center gap-2'>
                                                <div
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        backgroundColor: station.accent_color,
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <code>{station.accent_color}</code>
                                            </div>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Thumbnail</td>
                                    <td>
                                        {station.thumbnail_filename ? (
                                            <Figure className='mb-0'>
                                                <Figure.Image
                                                    style={{ maxWidth: '150px', maxHeight: '150px' }}
                                                    src={`${serverUrl}/storage/stations/${station.thumbnail_filename}`}
                                                />
                                            </Figure>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Banner</td>
                                    <td>
                                        {station.banner_filename ? (
                                            <Figure className='mb-0'>
                                                <Figure.Image
                                                    style={{ maxWidth: '300px', maxHeight: '150px' }}
                                                    src={`${serverUrl}/storage/stations/${station.banner_filename}`}
                                                />
                                            </Figure>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Created</td>
                                    <td>{station.created_at}</td>
                                </tr>
                                <tr>
                                    <td className='fw-semibold'>Updated</td>
                                    <td>{station.updated_at}</td>
                                </tr>
                            </tbody>
                        </Table>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
