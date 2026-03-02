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

const AdminDashboard = () => {
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
                            <ContentCard title='Articles'    value={v(counts.articles)}    icon='newspaper'    color='primary'   to='/administration/articles/0' />
                        </Col>
                        <Col md={3}>
                            <ContentCard title='Directories' value={v(counts.directories)} icon='address-book' color='info'      to='/administration/directories/0' />
                        </Col>
                        <Col md={3}>
                            <ContentCard title='Assets'      value={v(counts.assets)}      icon='folder-open'  color='warning'   to='/administration/assets/0' />
                        </Col>
                        <Col md={3}>
                            <ContentCard title='VODs'        value={v(counts.vods)}        icon='film'         color='danger'    to='/administration/vods/0' />
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
                    <Row className='g-3'>
                        <Col md={3}>
                            <ContentCard title='Users' value={v(counts.users)} icon='users' color='dark' to='/administration/users' />
                        </Col>
                    </Row>
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
                            <StatCard title='Sessions (30 days)'  value={v(analytics.sessions)} icon='signal'        color='info' />
                        </Col>
                    </Row>
                </div>

            </div>
        </>
    )
}

export default AdminDashboard
