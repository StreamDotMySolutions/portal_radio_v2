import { useEffect, useState } from 'react'
import { Badge, Card, Form, InputGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../libs/axios'
import BreadCrumb from '../../../libs/BreadCrumb'

const breadcrumbItems = [
    { url: '/', label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge> },
    { url: '', label: 'Activity Log' },
]

const MODEL_LABELS = {
    'App\\Models\\Article':   'Article',
    'App\\Models\\Directory': 'Directory',
    'App\\Models\\Asset':     'Asset',
    'App\\Models\\Vod':       'VOD',
    'App\\Models\\Banner':    'Banner',
    'App\\Models\\Programme': 'Programme',
    'App\\Models\\Video':     'Video',
    'App\\Models\\User':      'User',
}

const EVENT_VARIANTS = {
    created: 'success',
    updated: 'primary',
    deleted: 'danger',
}

const Activity = () => {
    const url = process.env.REACT_APP_BACKEND_URL + '/activity'

    const [data, setData]         = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [subjectType, setSubjectType] = useState('')
    const [event, setEvent]       = useState('')
    const [page, setPage]         = useState(1)

    useEffect(() => {
        setIsLoading(true)
        const params = new URLSearchParams({ page })
        if (subjectType) params.append('subject_type', subjectType)
        if (event)       params.append('event', event)

        axios({ method: 'get', url: `${url}?${params}` })
            .then((res) => setData(res.data.activities))
            .catch((err) => console.warn(err))
            .finally(() => setIsLoading(false))
    }, [subjectType, event, page])

    const handleSubjectChange = (e) => { setSubjectType(e.target.value); setPage(1) }
    const handleEventChange   = (e) => { setEvent(e.target.value); setPage(1) }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />

            <div className='d-flex flex-column gap-3'>

                <Card>
                    <Card.Header className='fw-semibold'>
                        <FontAwesomeIcon icon={['fas', 'clock-rotate-left']} className='me-2 text-secondary' />
                        Activity Log
                    </Card.Header>
                    <Card.Body className='d-flex gap-2'>
                        <InputGroup style={{ maxWidth: 220 }}>
                            <InputGroup.Text>Model</InputGroup.Text>
                            <Form.Select value={subjectType} onChange={handleSubjectChange}>
                                <option value=''>All</option>
                                {Object.entries(MODEL_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                        <InputGroup style={{ maxWidth: 180 }}>
                            <InputGroup.Text>Action</InputGroup.Text>
                            <Form.Select value={event} onChange={handleEventChange}>
                                <option value=''>All</option>
                                <option value='created'>Created</option>
                                <option value='updated'>Updated</option>
                                <option value='deleted'>Deleted</option>
                            </Form.Select>
                        </InputGroup>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body className='p-0'>
                        <Table hover responsive className='mb-0'>
                            <thead className='table-light'>
                                <tr>
                                    <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>Date</th>
                                    <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>User</th>
                                    <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>Action</th>
                                    <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>Model</th>
                                    <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>Description</th>
                                    <th style={{ '--bs-table-cell-padding-y': '0.85rem' }}>Changes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr><td colSpan={6} className='text-center text-muted py-3'>Loading...</td></tr>
                                )}
                                {!isLoading && data?.data?.length === 0 && (
                                    <tr><td colSpan={6} className='text-center text-muted py-3'>No activity yet</td></tr>
                                )}
                                {!isLoading && data?.data?.map((item) => (
                                    <tr key={item.id}>
                                        <td className='text-muted small text-nowrap'>
                                            {new Date(item.created_at).toLocaleString('en-GB', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </td>
                                        <td className='text-nowrap'>
                                            {item.causer?.name || item.causer?.email || <span className='text-muted'>System</span>}
                                        </td>
                                        <td>
                                            <Badge bg={EVENT_VARIANTS[item.event] || 'secondary'} className='text-capitalize'>
                                                {item.event}
                                            </Badge>
                                        </td>
                                        <td className='text-nowrap'>
                                            {MODEL_LABELS[item.subject_type] || item.subject_type}
                                            <span className='text-muted ms-1'>#{item.subject_id}</span>
                                        </td>
                                        <td>{item.description}</td>
                                        <td>
                                            {item.event === 'updated' && item.properties?.old && (
                                                <details>
                                                    <summary className='text-muted small' style={{ cursor: 'pointer' }}>
                                                        {Object.keys(item.properties.attributes || {}).length} field(s)
                                                    </summary>
                                                    <div className='mt-1'>
                                                        {Object.entries(item.properties.attributes || {}).map(([key, newVal]) => (
                                                            <div key={key} className='small'>
                                                                <span className='fw-semibold'>{key}:</span>{' '}
                                                                <span className='text-danger'>{String(item.properties.old[key] ?? '—')}</span>
                                                                {' → '}
                                                                <span className='text-success'>{String(newVal ?? '—')}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </details>
                                            )}
                                            {item.event !== 'updated' && <span className='text-muted'>—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                    {data && data.last_page > 1 && (
                        <Card.Footer className='d-flex justify-content-between align-items-center'>
                            <span className='text-muted small'>
                                Page {data.current_page} of {data.last_page} — {data.total} records
                            </span>
                            <div className='d-flex gap-2'>
                                <button
                                    className='btn btn-sm btn-outline-secondary'
                                    disabled={data.current_page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    className='btn btn-sm btn-outline-secondary'
                                    disabled={data.current_page === data.last_page}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </Card.Footer>
                    )}
                </Card>

            </div>
        </>
    )
}

export default Activity
