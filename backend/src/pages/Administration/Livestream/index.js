import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../libs/axios'
import BreadCrumb from '../../../libs/BreadCrumb'

const breadcrumbItems = [
    { url: '/', label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge> },
    { url: '', label: 'Livestream' },
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
                        title={`${d.date}: ${d.views} plays`}
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
const LivestreamManagement = () => {
    const url = process.env.REACT_APP_BACKEND_URL + '/livestream'

    const [data, setData]         = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [editing, setEditing]   = useState(false)
    const [urlValue, setUrlValue] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Load data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios({ method: 'get', url })
                setData(res.data)
                setUrlValue(res.data.stream_url || '')
            } catch (err) {
                console.warn(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Save URL
    const handleSaveUrl = async () => {
        setIsSaving(true)
        try {
            const settingsUrl = process.env.REACT_APP_BACKEND_URL + '/settings/livestream_url'
            await axios({ method: 'put', url: settingsUrl, data: { value: urlValue } })
            setData({ ...data, stream_url: urlValue })
            setEditing(false)
        } catch (err) {
            console.warn(err)
            alert('Failed to save stream URL')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className='p-3 text-muted'>Loading...</div>
    if (!data)     return <div className='p-3 text-danger'>Failed to load livestream data.</div>

    const { stream_url, stats } = data

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />

            <div className='d-flex flex-column gap-3'>

                {/* ── Summary cards ── */}
                <Row className='g-3'>
                    <Col md={4}>
                        <StatCard
                            title='Total Plays'
                            value={stats.total}
                            icon='tower-broadcast'
                            color='primary'
                        />
                    </Col>
                    <Col md={4}>
                        <StatCard
                            title='Today'
                            value={stats.today}
                            icon='eye'
                            color='success'
                        />
                    </Col>
                    <Col md={4}>
                        <StatCard
                            title='This Week'
                            value={stats.this_week}
                            icon='calendar-week'
                            color='info'
                        />
                    </Col>
                </Row>

                {/* ── Stream URL Setting ── */}
                <Card>
                    <Card.Header className='fw-semibold'>
                        <FontAwesomeIcon icon={['fas', 'link']} className='me-2 text-secondary' />
                        Stream URL
                    </Card.Header>
                    <Card.Body>
                        {editing ? (
                            <div className='d-flex gap-2'>
                                <InputGroup>
                                    <Form.Control
                                        type='url'
                                        value={urlValue}
                                        onChange={(e) => setUrlValue(e.target.value)}
                                        placeholder='Enter HLS stream URL...'
                                    />
                                </InputGroup>
                                <Button
                                    variant='primary'
                                    onClick={handleSaveUrl}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    variant='outline-secondary'
                                    onClick={() => {
                                        setEditing(false)
                                        setUrlValue(stream_url || '')
                                    }}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <div className='d-flex justify-content-between align-items-center'>
                                <div style={{ wordBreak: 'break-all' }}>
                                    {stream_url ? (
                                        <code>{stream_url}</code>
                                    ) : (
                                        <span className='text-muted'>No stream URL configured</span>
                                    )}
                                </div>
                                <Button
                                    variant='outline-primary'
                                    size='sm'
                                    onClick={() => setEditing(true)}
                                >
                                    <FontAwesomeIcon icon={['fas', 'pen']} /> Edit
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* ── 30-day chart ── */}
                <Card>
                    <Card.Header className='fw-semibold'>
                        <FontAwesomeIcon icon={['fas', 'chart-bar']} className='me-2 text-secondary' />
                        Plays — Last 30 Days
                    </Card.Header>
                    <Card.Body>
                        <DailyChart data={stats.daily_plays} />
                    </Card.Body>
                </Card>

            </div>
        </>
    )
}

export default LivestreamManagement
