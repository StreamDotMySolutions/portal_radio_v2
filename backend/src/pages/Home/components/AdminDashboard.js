import { useEffect, useState } from 'react'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import axios from '../../../libs/axios'
import BreadCrumb from '../../../libs/BreadCrumb'
import useAuthStore from '../../Auth/stores/AuthStore'

const breadcrumbItems = [
    { url: '/', label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge> },
    { url: '', label: 'Dashboard' },
]

const ContentCard = ({ title, value, icon, color, to }) => {
    const navigate = useNavigate()
    return (
        <Card className='h-100' onClick={() => navigate(to)} style={{ cursor: 'pointer' }}>
            <Card.Body className='d-flex align-items-center gap-3'>
                <div
                    className={`text-${color} bg-${color} bg-opacity-10 rounded p-3 fs-4`}
                    style={{ lineHeight: 1 }}
                >
                    <FontAwesomeIcon icon={['fas', icon]} />
                </div>
                <div>
                    <div className='text-muted small'>{title}</div>
                    <div className='fw-bold fs-4'>{value}</div>
                </div>
            </Card.Body>
        </Card>
    )
}

const StatCard = ({ title, value, icon, color }) => (
    <Card className='h-100'>
        <Card.Body className='d-flex align-items-center gap-3'>
            <div
                className={`text-${color} bg-${color} bg-opacity-10 rounded p-3 fs-4`}
                style={{ lineHeight: 1 }}
            >
                <FontAwesomeIcon icon={['fas', icon]} />
            </div>
            <div>
                <div className='text-muted small'>{title}</div>
                <div className='fw-bold fs-4'>{value}</div>
            </div>
        </Card.Body>
    </Card>
)

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

const AdminDashboard = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const url = process.env.REACT_APP_BACKEND_URL + '/dashboard'

    const [data, setData]           = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        axios({ method: 'get', url })
            .then((res) => setData(res.data))
            .catch((err) => console.warn(err))
            .finally(() => setIsLoading(false))
    }, [])

    const v = (val) => isLoading ? '…' : (val ?? 0)

    const counts    = data?.counts   || {}
    const analytics = data?.analytics || {}

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />

            <div className='d-flex flex-column gap-3'>

                {/* Welcome */}
                <Card>
                    <Card.Body>
                        <h5 className='mb-0'>
                            <FontAwesomeIcon icon={['fas', 'gauge']} className='me-2 text-secondary' />
                            Welcome back, <strong>{user?.name || user?.email}</strong>
                        </h5>
                    </Card.Body>
                </Card>

                {/* Content */}
                <div>
                    <p className='text-muted small fw-semibold text-uppercase mb-2'>Content</p>
                    <Row className='g-3'>
                        <Col md={3}>
                            <Card className='h-100' onClick={() => navigate('/administration/articles/0')} style={{ cursor: 'pointer' }}>
                                <Card.Body className='d-flex align-items-center gap-3'>
                                    <div
                                        className='text-primary bg-primary bg-opacity-10 rounded p-3 fs-4'
                                        style={{ lineHeight: 1 }}
                                    >
                                        <FontAwesomeIcon icon={['fas', 'newspaper']} />
                                    </div>
                                    <div>
                                        <div className='text-muted small'>Articles</div>
                                        <div className='fw-bold'>
                                            {isLoading ? '…' : (
                                                <>
                                                    {counts.articles_breakdown?.folders || 0} Folder{counts.articles_breakdown?.folders !== 1 ? 's' : ''} / {counts.articles_breakdown?.pages || 0} Page{counts.articles_breakdown?.pages !== 1 ? 's' : ''}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className='h-100' onClick={() => navigate('/administration/directories/0')} style={{ cursor: 'pointer' }}>
                                <Card.Body className='d-flex align-items-center gap-3'>
                                    <div
                                        className='text-info bg-info bg-opacity-10 rounded p-3 fs-4'
                                        style={{ lineHeight: 1 }}
                                    >
                                        <FontAwesomeIcon icon={['fas', 'address-book']} />
                                    </div>
                                    <div>
                                        <div className='text-muted small'>Directories</div>
                                        <div className='fw-bold'>
                                            {isLoading ? '…' : (
                                                <>
                                                    {counts.directories_breakdown?.departments || 0} Dept{counts.directories_breakdown?.departments !== 1 ? 's' : ''} / {counts.directories_breakdown?.staffs || 0} Staff{counts.directories_breakdown?.staffs !== 1 ? 's' : ''}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className='h-100' onClick={() => navigate('/administration/assets/0')} style={{ cursor: 'pointer' }}>
                                <Card.Body className='d-flex align-items-center gap-3'>
                                    <div
                                        className='text-warning bg-warning bg-opacity-10 rounded p-3 fs-4'
                                        style={{ lineHeight: 1 }}
                                    >
                                        <FontAwesomeIcon icon={['fas', 'folder-open']} />
                                    </div>
                                    <div>
                                        <div className='text-muted small'>Assets</div>
                                        <div className='fw-bold'>
                                            {isLoading ? '…' : formatFileSize(counts.assets_filesize)}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className='h-100' onClick={() => navigate('/administration/vods')} style={{ cursor: 'pointer' }}>
                                <Card.Body className='d-flex align-items-center gap-3'>
                                    <div
                                        className='text-danger bg-danger bg-opacity-10 rounded p-3 fs-4'
                                        style={{ lineHeight: 1 }}
                                    >
                                        <FontAwesomeIcon icon={['fas', 'film']} />
                                    </div>
                                    <div>
                                        <div className='text-muted small'>VODs</div>
                                        <div className='fw-bold'>
                                            {isLoading ? '…' : formatFileSize(counts.vods_filesize)}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Homepage */}
                <div>
                    <p className='text-muted small fw-semibold text-uppercase mb-2'>Homepage</p>
                    <Row className='g-3'>
                        <Col md={4}>
                            <ContentCard title='Banners'    value={v(counts.banners)}    icon='image'  color='success'   to='/administration/banners' />
                        </Col>
                        <Col md={4}>
                            <ContentCard title='Programmes' value={v(counts.programmes)} icon='list'   color='secondary' to='/administration/programmes' />
                        </Col>
                        <Col md={4}>
                            <ContentCard title='Videos'     value={v(counts.videos)}     icon='video'  color='primary'   to='/administration/videos' />
                        </Col>
                    </Row>
                </div>

                {/* System */}
                <div>
                    <p className='text-muted small fw-semibold text-uppercase mb-2'>System</p>
                    <Card>
                        <Card.Header className='d-flex align-items-center justify-content-between'>
                            <h6 className='mb-0'>
                                <FontAwesomeIcon icon={['fas', 'users']} className='me-2' />
                                Users
                            </h6>
                            <Badge bg='dark'>{counts.users}</Badge>
                        </Card.Header>
                        <Card.Body>
                            {isLoading ? (
                                <p className='text-muted'>Loading…</p>
                            ) : counts.users_list && counts.users_list.length > 0 ? (
                                <div className='d-flex flex-column gap-2'>
                                    {counts.users_list.map((user) => (
                                        <div key={user.id} className='d-flex justify-content-between align-items-center p-2 border-bottom'>
                                            <div className='flex-grow-1'>
                                                <div className='fw-semibold'>{user.name}</div>
                                                <div className='text-muted small'>{user.email}</div>
                                            </div>
                                            <Badge bg='secondary' className='ms-2'>{user.activities_count} activity{user.activities_count !== 1 ? 'ies' : ''}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-muted mb-0'>No users found.</p>
                            )}
                        </Card.Body>
                    </Card>
                </div>

                {/* Public portal live stats */}
                <div>
                    <p className='text-muted small fw-semibold text-uppercase mb-2'>Public Portal — Live Stats</p>
                    <Row className='g-3'>
                        <Col md={4}>
                            <StatCard title='Pageviews Today'     value={v(analytics.today)}    icon='eye'           color='primary' />
                        </Col>
                        <Col md={4}>
                            <StatCard title='Pageviews This Week' value={v(analytics.week)}     icon='calendar-week' color='success' />
                        </Col>
                        <Col md={4}>
                            <StatCard title='Unique Visitors (30d)' value={v(analytics.visitors)} icon='users'  color='info' />
                        </Col>
                    </Row>
                </div>

            </div>
        </>
    )
}

export default AdminDashboard
