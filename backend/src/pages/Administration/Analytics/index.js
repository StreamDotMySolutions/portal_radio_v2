import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../libs/axios'
import BreadCrumb from '../../../libs/BreadCrumb'

const isoDate = (d) => d.toISOString().split('T')[0]
const todayIso = () => isoDate(new Date())
const daysAgoIso = (n) => isoDate(new Date(Date.now() - n * 86400000))

const presetToRange = (key) => {
    if (key === '7d')   return [daysAgoIso(6),  todayIso()]
    if (key === '30d')  return [daysAgoIso(29), todayIso()]
    if (key === '90d')  return [daysAgoIso(89), todayIso()]
    if (key === 'this_month') {
        const now = new Date()
        return [isoDate(new Date(now.getFullYear(), now.getMonth(), 1)), todayIso()]
    }
    if (key === 'last_month') {
        const now = new Date()
        const first = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const last  = new Date(now.getFullYear(), now.getMonth(), 0)
        return [isoDate(first), isoDate(last)]
    }
    return null
}

const inferPreset = (from, to) => {
    if (to !== todayIso()) {
        const lm = presetToRange('last_month')
        if (lm && from === lm[0] && to === lm[1]) return 'last_month'
        return 'custom'
    }
    if (from === daysAgoIso(6))  return '7d'
    if (from === daysAgoIso(29)) return '30d'
    if (from === daysAgoIso(89)) return '90d'
    const tm = presetToRange('this_month')
    if (tm && from === tm[0]) return 'this_month'
    return 'custom'
}

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

// ── Variable-range bar chart ─────────────────────────────────────────────────
const DailyChart = ({ data, from, to }) => {
    // Build a full day-by-day array between from..to, filling gaps with 0
    const fromDate = new Date(from + 'T00:00:00')
    const toDate   = new Date(to + 'T00:00:00')
    const dayCount = Math.max(1, Math.round((toDate - fromDate) / 86400000) + 1)
    const days = []
    for (let i = 0; i < dayCount; i++) {
        const d = new Date(fromDate.getTime() + i * 86400000)
        const dateStr = isoDate(d)
        const found = data.find((r) => r.date === dateStr)
        days.push({ date: dateStr, views: found ? Number(found.views) : 0 })
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
                <small className='text-muted'>{days[days.length - 1]?.date}</small>
            </div>
        </div>
    )
}

// ── Date range filter bar ────────────────────────────────────────────────────
const FilterBar = ({ preset, from, to, onChange }) => {
    const [draftFrom, setDraftFrom] = useState(from)
    const [draftTo, setDraftTo]     = useState(to)

    useEffect(() => { setDraftFrom(from); setDraftTo(to) }, [from, to])

    const handlePreset = (e) => {
        const key = e.target.value
        if (key === 'custom') {
            onChange({ preset: 'custom', from, to })
            return
        }
        const range = presetToRange(key)
        if (range) onChange({ preset: key, from: range[0], to: range[1] })
    }

    const handleApplyCustom = () => {
        if (!draftFrom || !draftTo) return
        const [f, t] = draftFrom <= draftTo ? [draftFrom, draftTo] : [draftTo, draftFrom]
        onChange({ preset: 'custom', from: f, to: t })
    }

    const isCustom = preset === 'custom'

    return (
        <Card className='mb-3'>
            <Card.Body className='py-2'>
                <Row className='g-2 align-items-center'>
                    <Col xs='auto'>
                        <Form.Select size='sm' value={preset} onChange={handlePreset} style={{ minWidth: '160px' }}>
                            <option value='7d'>Last 7 days</option>
                            <option value='30d'>Last 30 days</option>
                            <option value='90d'>Last 90 days</option>
                            <option value='this_month'>This month</option>
                            <option value='last_month'>Last month</option>
                            <option value='custom'>Custom range</option>
                        </Form.Select>
                    </Col>
                    <Col xs='auto'>
                        <InputGroup size='sm'>
                            <InputGroup.Text>From</InputGroup.Text>
                            <Form.Control
                                type='date'
                                value={isCustom ? draftFrom : from}
                                disabled={!isCustom}
                                onChange={(e) => setDraftFrom(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs='auto'>
                        <InputGroup size='sm'>
                            <InputGroup.Text>To</InputGroup.Text>
                            <Form.Control
                                type='date'
                                value={isCustom ? draftTo : to}
                                disabled={!isCustom}
                                onChange={(e) => setDraftTo(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    {isCustom && (
                        <Col xs='auto'>
                            <Button size='sm' variant='primary' onClick={handleApplyCustom}>
                                <FontAwesomeIcon icon={['fas', 'check']} className='me-1' /> Apply
                            </Button>
                        </Col>
                    )}
                    <Col className='text-muted small text-end'>
                        Showing {from} → {to}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const Analytics = () => {
    const url = process.env.REACT_APP_BACKEND_URL + '/analytics'

    const initialParams = new URLSearchParams(window.location.search)
    const initialFrom = initialParams.get('from') || daysAgoIso(29)
    const initialTo   = initialParams.get('to')   || todayIso()

    const [from, setFrom]     = useState(initialFrom)
    const [to, setTo]         = useState(initialTo)
    const [preset, setPreset] = useState(inferPreset(initialFrom, initialTo))
    const [data, setData]     = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        const qs = new URLSearchParams({ from, to }).toString()
        const newUrl = `${window.location.pathname}?${qs}`
        if (window.location.search !== `?${qs}`) {
            window.history.replaceState(null, '', newUrl)
        }
        axios({ method: 'get', url: `${url}?${qs}` })
            .then((res) => setData(res.data))
            .catch((err) => console.warn(err))
            .finally(() => setIsLoading(false))
    }, [from, to])

    const handleFilterChange = ({ preset: nextPreset, from: nextFrom, to: nextTo }) => {
        setPreset(nextPreset)
        setFrom(nextFrom)
        setTo(nextTo)
    }

    if (isLoading && !data) return (
        <>
            <BreadCrumb items={breadcrumbItems} />
            <FilterBar preset={preset} from={from} to={to} onChange={handleFilterChange} />
            <div className='p-3 text-muted'>Loading...</div>
        </>
    )
    if (!data) return <div className='p-3 text-danger'>Failed to load analytics.</div>

    const {
        top_articles, top_searches, top_downloads, daily_views, device_split,
        livestream_daily,
        top_stations_by_plays = [], playback_daily = [],
        visitors_daily = [], visitors_by_device = [],
        unique_visitors = 0,
    } = data

    const totalDevices = device_split.reduce((s, d) => s + d.count, 0) || 1
    const totalUniqueDevices = visitors_by_device.reduce((s, d) => s + Number(d.count), 0) || 1
    const playerDaily = playback_daily.map((r) => ({ date: r.date, views: Number(r.player_plays) }))
    const livestreamDailyFromPlayback = playback_daily.map((r) => ({ date: r.date, views: Number(r.livestream_plays) }))

    // Range-scoped totals (computed from existing daily arrays — no extra requests)
    const totalPageviews   = daily_views.reduce((s, r) => s + Number(r.views ?? 0), 0)
    const totalPlayerPlays = playback_daily.reduce((s, r) => s + Number(r.player_plays ?? 0), 0)
    const totalLivestream  = playback_daily.reduce((s, r) => s + Number(r.livestream_plays ?? 0), 0)
    const pagesPerVisitor  = unique_visitors > 0 ? (totalPageviews / unique_visitors).toFixed(2) : '—'

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />
            <FilterBar preset={preset} from={from} to={to} onChange={handleFilterChange} />

            <div className='d-flex flex-column gap-3'>

                {/* ── Range-scoped summary cards (always reflect the active filter) ── */}
                <Row className='g-3'>
                    <Col md={6} lg>
                        <StatCard title='Pageviews'        value={totalPageviews.toLocaleString()}          icon='eye'         color='primary' />
                    </Col>
                    <Col md={6} lg>
                        <StatCard title='Unique Visitors'  value={Number(unique_visitors).toLocaleString()} icon='users'       color='success' />
                    </Col>
                    <Col md={6} lg>
                        <StatCard title='Player Plays'     value={totalPlayerPlays.toLocaleString()}        icon='play'        color='info' />
                    </Col>
                    <Col md={6} lg>
                        <StatCard title='Livestream Plays' value={totalLivestream.toLocaleString()}         icon='headphones'  color='danger' />
                    </Col>
                    <Col md={6} lg>
                        <StatCard title='Pages / Visitor'  value={pagesPerVisitor}                          icon='layer-group' color='secondary' />
                    </Col>
                </Row>

                {/* ── Pageviews chart (range-aware) ── */}
                <Card>
                    <Card.Header className='fw-semibold'>
                        <FontAwesomeIcon icon={['fas', 'chart-bar']} className='me-2 text-secondary' />
                        Pageviews — {data.range?.from} → {data.range?.to}
                    </Card.Header>
                    <Card.Body>
                        <DailyChart data={daily_views} from={data.range.from} to={data.range.to} />
                    </Card.Body>
                </Card>

                {/* ── Livestream chart (range-aware) ── */}
                <Card>
                    <Card.Header className='fw-semibold'>
                        <FontAwesomeIcon icon={['fas', 'chart-bar']} className='me-2 text-secondary' />
                        Livestream Plays — {data.range?.from} → {data.range?.to}
                    </Card.Header>
                    <Card.Body>
                        <DailyChart data={livestream_daily} from={data.range.from} to={data.range.to} />
                    </Card.Body>
                </Card>

                {/* ── Playback (player_play vs livestream_play) charts ── */}
                <Card>
                    <Card.Header className='fw-semibold'>
                        <FontAwesomeIcon icon={['fas', 'chart-bar']} className='me-2 text-secondary' />
                        Playback — {data.range?.from} → {data.range?.to}
                    </Card.Header>
                    <Card.Body>
                        <Row className='g-3'>
                            <Col md={6}>
                                <div className='small text-muted mb-1'>Player Plays</div>
                                <DailyChart data={playerDaily} from={data.range.from} to={data.range.to} />
                            </Col>
                            <Col md={6}>
                                <div className='small text-muted mb-1'>Livestream Plays</div>
                                <DailyChart data={livestreamDailyFromPlayback} from={data.range.from} to={data.range.to} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* ── Unique visitors chart (range-aware) ── */}
                <Card>
                    <Card.Header className='fw-semibold'>
                        <FontAwesomeIcon icon={['fas', 'chart-bar']} className='me-2 text-secondary' />
                        Unique Visitors — {data.range?.from} → {data.range?.to}
                    </Card.Header>
                    <Card.Body>
                        <DailyChart data={visitors_daily} from={data.range.from} to={data.range.to} />
                    </Card.Body>
                </Card>

                {/* ── Top Stations by Plays + Visitors by Device ── */}
                <Row className='g-3'>
                    <Col md={6}>
                        <Card className='h-100'>
                            <Card.Header className='fw-semibold'>
                                <FontAwesomeIcon icon={['fas', 'radio']} className='me-2 text-secondary' />
                                Top Stations by Plays
                            </Card.Header>
                            <Card.Body className='p-0'>
                                <Table hover responsive className='mb-0'>
                                    <thead className='table-light'>
                                        <tr>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>#</th>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>Station</th>
                                            <th style={{ '--bs-table-cell-padding-y': '0.85rem' }} className='text-end'>Plays</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top_stations_by_plays.length === 0 && (
                                            <tr><td colSpan={3} className='text-center text-muted py-3'>No data yet</td></tr>
                                        )}
                                        {top_stations_by_plays.map((item, i) => {
                                            const url = pageUrl('station', item.reference_id)
                                            return (
                                                <tr key={i}>
                                                    <td className='text-muted'>{i + 1}</td>
                                                    <td>
                                                        <FontAwesomeIcon icon={['fas', 'radio']} className='me-2 text-muted' />
                                                        {url ? (
                                                            <a href={url} target='_blank' rel='noreferrer'>
                                                                {item.reference_title || `ID ${item.reference_id}`}
                                                            </a>
                                                        ) : (
                                                            item.reference_title || <span className='text-muted'>ID {item.reference_id}</span>
                                                        )}
                                                    </td>
                                                    <td className='text-end fw-semibold'>{item.plays}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className='h-100'>
                            <Card.Header className='fw-semibold'>
                                <FontAwesomeIcon icon={['fas', 'user-group']} className='me-2 text-secondary' />
                                Unique Visitors by Device
                            </Card.Header>
                            <Card.Body className='d-flex flex-column gap-2'>
                                {visitors_by_device.length === 0 && (
                                    <span className='text-muted'>No data yet</span>
                                )}
                                {visitors_by_device.map((item, i) => {
                                    const count = Number(item.count)
                                    const pct = Math.round((count / totalUniqueDevices) * 100)
                                    return (
                                        <div key={i}>
                                            <div className='d-flex justify-content-between mb-1'>
                                                <span className='text-capitalize'>{item.device_type || 'unknown'}</span>
                                                <span className='text-muted small'>{count} ({pct}%)</span>
                                            </div>
                                            <div className='progress' style={{ height: '6px' }}>
                                                <div
                                                    className='progress-bar bg-warning'
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
