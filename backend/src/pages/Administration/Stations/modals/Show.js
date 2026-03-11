import { useState } from 'react'
import { Button, Modal, Table, Badge, Figure } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function ShowModal({ id }) {
    const { url: apiBase, server: serverUrl } = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [station, setStation] = useState(null)

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

    const categoryVariant = (cat) => {
        return cat === 'nasional' ? 'primary' : 'info'
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
                                            {station.category === 'nasional' ? 'Nasional' : 'Negeri'}
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
                                                    src={`${serverUrl}/storage/station-thumbnails/${station.thumbnail_filename}`}
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
                                                    src={`${serverUrl}/storage/station-banners/${station.banner_filename}`}
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
