import { useEffect, useState } from 'react'
import { Badge, Card, Col, Row, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../libs/axios'
import BreadCrumb from '../../../libs/BreadCrumb'

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL || ''

const pageUrl = (pageType, referenceId) => {
    if (!referenceId) return null
    if (pageType === 'article')  return `${PUBLIC_URL}/contents/${referenceId}`
    if (pageType === 'listing')  return `${PUBLIC_URL}/listings/${referenceId}`
    if (pageType === 'directory') return `${PUBLIC_URL}/directories/${referenceId}`
    if (pageType === 'station')  return `${PUBLIC_URL}/station/${referenceId}`
    return null
}

const pageIcon = (pageType) => {
    if (pageType === 'home')     return 'house'
    if (pageType === 'station')  return 'radio'
    if (pageType === 'chat')     return 'comments'
    if (pageType === 'contact')  return 'envelope'
    if (pageType === 'about')    return 'circle-info'
    if (pageType === 'stations_list') return 'list'
    return 'file'
}

const breadcrumbItems = [
    { url: '/', label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge> },
    { url: '', label: 'Analytics' },
]

// ── Stat card ────────────────────────────────────────────────────────────────
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
                <div className='fw-bold fs-4'>{value ?? '—'}</div>
            </div>
        </Card.Body>
    </Card>
)

// ── 30-day bar chart ─────────────────────────────────────────────────────────
const DailyChart = ({ data }) => {
    // Build a full 30-day array, filling gaps with 0
    const days = []
    for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const found = data.find((r) => r.date === dateStr)
        days.push({ date: dateStr, views: found ? found.views : 0 })
    }

    const max = Math.max(...days.map((d) => d.views), 1)

    return (
        <div>
            <div className='d-flex align-items-end gap-1' style={{ height: '100px' }}>
                {days.map((d, i) => (
                    <div
                        key={i}
                        title={`${d.date}: ${d.views} views`}
                        className='rounded-top flex-fill bg-primary'
                        style={{
                            height:    `${(d.views / max) * 100}%`,
                            minHeight: d.views > 0 ? '3px' : '1px',
                            opacity:   d.views > 0 ? 1 : 0.15,
                            cursor:    'default',
                        }}
                    />
                ))}
            </div>
            <div className='d-flex justify-content-between mt-1'>
                <small className='text-muted'>{days[0]?.date}</small>
                <small className='text-muted'>{days[29]?.date}</small>
            </div>
        </div>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const Analytics = () => {
    const url = process.env.REACT_APP_BACKEND_URL + '/analytics'

    const [data, setData]         = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        axios({ method: 'get', url })
            .then((res) => setData(res.data))
            .catch((err) => console.warn(err))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) return <div className='p-3 text-muted'>Loading...</div>
    if (!data)     return <div className='p-3 text-danger'>Failed to load analytics.</div>

    const { summary, top_articles, top_searches, top_downloads, daily_views, device_split } = data

    const totalDevices = device_split.reduce((s, d) => s + d.count, 0) || 1

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />

            <div className='d-flex flex-column gap-3'>

                {/* ── Summary cards ── */}
                <Row className='g-3'>
                    <Col md={3}>
                        <StatCard title='Today'          value={summary.today}    icon='eye'          color='primary' />
                    </Col>
                    <Col md={3}>
                        <StatCard title='This Week'      value={summary.week}     icon='calendar-week' color='success' />
                    </Col>
                    <Col md={3}>
                        <StatCard title='This Month'     value={summary.month}    icon='calendar'     color='info' />
                    </Col>
                    <Col md={3}>
                        <StatCard title='Unique Visitors (30d)' value={summary.visitors} icon='users' color='warning' />
                    </Col>
                </Row>

                {/* ── 30-day chart ── */}
                <Card>
                    <Card.Header className='fw-semibold'>
                        <FontAwesomeIcon icon={['fas', 'chart-bar']} className='me-2 text-secondary' />
                        Pageviews — Last 30 Days
                    </Card.Header>
                    <Card.Body>
                        <DailyChart data={daily_views} />
                    </Card.Body>
                </Card>

                {/* ── Bottom row ── */}
                <Row className='g-3'>

                    {/* Top Articles */}
                    <Col md={6}>
                        <Card className='h-100'>
                            <Card.Header className='fw-semibold'>
                                <FontAwesomeIcon icon={['fas', 'newspaper']} className='me-2 text-secondary' />
                                Top Pages
                            </Card.Header>
                            <Card.Body className='p-0'>
                                <Table hover responsive className='mb-0'>
                                    <thead className='table-light'>
                                        <tr>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>#</th>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>Page</th>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }} className='text-end'>Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_articles.length === 0 && (
                                            <tr><td colSpan={3} className='text-center text-muted py-3'>No data yet</td></tr>
                                        )}
                                        {top_articles.map((item, i) => {
                                            const url = pageUrl(item.page_type, item.reference_id)
                                            return (
                                                <tr key={i}>
                                                    <td className='text-muted'>{i + 1}</td>
                                                    <td>
                                                        <FontAwesomeIcon icon={['fas', pageIcon(item.page_type)]} className='me-2 text-muted' />
                                                        {url ? (
                                                            <a href={url} target='_blank' rel='noreferrer'>
                                                                {item.reference_title || `ID ${item.reference_id}`}
                                                            </a>
                                                        ) : (
                                                            item.reference_title || <span className='text-muted'>ID {item.reference_id}</span>
                                                        )}
                                                        <Badge bg='secondary' className='ms-2 small'>{item.page_type}</Badge>
                                                    </td>
                                                    <td className='text-end fw-semibold'>{item.views}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Top Downloads */}
                    {top_downloads.length > 0 && (
                        <Col md={6}>
                            <Card className='h-100'>
                                <Card.Header className='fw-semibold'>
                                    <FontAwesomeIcon icon={['fas', 'download']} className='me-2 text-secondary' />
                                    Top Downloads
                                </Card.Header>
                                <Card.Body className='p-0'>
                                    <Table hover responsive className='mb-0'>
                                        <thead className='table-light'>
                                            <tr>
                                                <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>#</th>
                                                <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>File</th>
                                                <th style={{ '--bs-table-cell-padding-y': '0.85rem' }} className='text-end'>Downloads</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {top_downloads.map((item, i) => (
                                                <tr key={i}>
                                                    <td className='text-muted'>{i + 1}</td>
                                                    <td className='text-truncate' style={{ maxWidth: '250px' }}>
                                                        <FontAwesomeIcon icon={['fas', 'file-pdf']} className='me-2 text-danger' />
                                                        {item.filename}
                                                    </td>
                                                    <td className='text-end fw-semibold'>{item.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}

                    {/* Top Searches + Device split */}
                    <Col md={6} className='d-flex flex-column gap-3'>

                        <Card>
                            <Card.Header className='fw-semibold'>
                                <FontAwesomeIcon icon={['fas', 'magnifying-glass']} className='me-2 text-secondary' />
                                Top Searches
                            </Card.Header>
                            <Card.Body className='p-0'>
                                <Table hover responsive className='mb-0'>
                                    <thead className='table-light'>
                                        <tr>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>#</th>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>Query</th>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }} className='text-end'>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_searches.length === 0 && (
                                            <tr><td colSpan={3} className='text-center text-muted py-3'>No searches yet</td></tr>
                                        )}
                                        {top_searches.map((item, i) => (
                                            <tr key={i}>
                                                <td className='text-muted'>{i + 1}</td>
                                                <td>{item.query}</td>
                                                <td className='text-end fw-semibold'>{item.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Header className='fw-semibold'>
                                <FontAwesomeIcon icon={['fas', 'mobile-screen']} className='me-2 text-secondary' />
                                Devices
                            </Card.Header>
                            <Card.Body className='d-flex flex-column gap-2'>
                                {device_split.length === 0 && (
                                    <span className='text-muted'>No data yet</span>
                                )}
                                {device_split.map((item, i) => {
                                    const pct = Math.round((item.count / totalDevices) * 100)
                                    return (
                                        <div key={i}>
                                            <div className='d-flex justify-content-between mb-1'>
                                                <span className='text-capitalize'>{item.device_type || 'unknown'}</span>
                                                <span className='text-muted small'>{item.count} ({pct}%)</span>
                                            </div>
                                            <div className='progress' style={{ height: '6px' }}>
                                                <div
                                                    className='progress-bar'
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>

            </div>
        </>
    )
}

export default Analytics
