import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Form, InputGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useStationVideosStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'
import { fmtDuration, fmtSize, StatusBadge } from './format'

const POLL_MS = 5000

const DataTable = () => {
    const { url: apiBase, server: serverUrl } = useStore()
    const baseUrl = `${apiBase}/station-videos`

    const refreshKey = useStationVideosStore((s) => s.refreshKey)
    const setRefresh = useStationVideosStore((s) => s.setRefresh)
    const paginatorUrl = useStationVideosStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useStationVideosStore((s) => s.setPaginatorUrl)
    const search = useStationVideosStore((s) => s.search)
    const setSearch = useStationVideosStore((s) => s.setSearch)
    const stationFilter = useStationVideosStore((s) => s.stationFilter)
    const setStationFilter = useStationVideosStore((s) => s.setStationFilter)
    const stations = useStationVideosStore((s) => s.stations)
    const setStations = useStationVideosStore((s) => s.setStations)

    const [sortBy, setSortBy] = useState(null)
    const [sortDir, setSortDir] = useState('desc')
    const [query, setQuery] = useState(search)
    const [items, setItems] = useState([])

    useEffect(() => {
        axios({ method: 'get', url: `${apiBase}/stations?per_page=500` })
            .then((response) => setStations(response.data.stations?.data ?? []))
            .catch((error) => console.warn(error))
    }, [])

    // Debounce: commit typed query to store after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    const buildUrl = () => {
        if (paginatorUrl) return paginatorUrl
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (stationFilter) params.set('station_id', stationFilter)
        if (sortBy) {
            params.set('sort_by', sortBy)
            params.set('sort_dir', sortDir)
        }
        const qs = params.toString()
        return qs ? `${baseUrl}?${qs}` : baseUrl
    }

    useEffect(() => {
        axios({ method: 'get', url: buildUrl() })
            .then((response) => setItems(response.data.videos))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search, stationFilter, sortBy, sortDir])

    // Refresh while anything on screen is still waiting for, or in, the transcoder
    const busy = items?.data?.some((v) => v.status === 'pending' || v.status === 'processing')
    useEffect(() => {
        if (!busy) return
        const timer = setInterval(setRefresh, POLL_MS)
        return () => clearInterval(timer)
    }, [busy])

    const paginatorAdapter = {
        setValue: (key, value) => {
            if (key === 'url') setPaginatorUrl(value)
        },
    }

    const handleToggleSort = (field) => {
        if (sortBy === field) {
            if (sortDir === 'desc') {
                setSortDir('asc')
            } else {
                setSortBy(null)
                setSortDir('desc')
            }
        } else {
            setSortBy(field)
            setSortDir('desc')
        }
        setPaginatorUrl(null)
    }

    const handleToggleActive = (itemId) => {
        const flip = (prev) => ({
            ...prev,
            data: prev.data.map((item) => (item.id === itemId ? { ...item, active: !item.active } : item)),
        })
        setItems(flip)
        axios({ method: 'patch', url: `${baseUrl}/${itemId}/toggle` })
            .catch(() => setItems(flip))   // revert on failure
    }

    const handleRetry = (itemId) => {
        axios({ method: 'post', url: `${baseUrl}/${itemId}/retry` })
            .then(() => setRefresh())
            .catch((error) => alert(error.response?.data?.message || 'Retry failed'))
    }

    // Ordering is per station, so the arrows only make sense with one station shown in its own order
    const canOrder = !!stationFilter && !sortBy && !search

    return (
        <div>
            {/* Toolbar */}
            <div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
                <ButtonGroup>
                    <Button variant={sortBy === 'name' ? 'primary' : 'outline-secondary'} onClick={() => handleToggleSort('name')}>
                        <FontAwesomeIcon icon={['fas', 'a']} className='me-1' />
                        Name {sortBy === 'name' && <FontAwesomeIcon icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']} className='ms-1' />}
                    </Button>
                    <Button variant={sortBy === 'date' ? 'primary' : 'outline-secondary'} onClick={() => handleToggleSort('date')}>
                        <FontAwesomeIcon icon={['fas', 'calendar']} className='me-1' />
                        Date {sortBy === 'date' && <FontAwesomeIcon icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']} className='ms-1' />}
                    </Button>
                </ButtonGroup>

                <div className='d-flex gap-2'>
                    <InputGroup style={{ maxWidth: '340px' }}>
                        <InputGroup.Text><FontAwesomeIcon icon={['fas', 'magnifying-glass']} /></InputGroup.Text>
                        <Form.Control placeholder='Search by title...' value={query} onChange={(e) => setQuery(e.target.value)} />
                        {query && (
                            <Button variant='outline-secondary' onClick={() => setQuery('')}>
                                <FontAwesomeIcon icon={['fas', 'xmark']} />
                            </Button>
                        )}
                    </InputGroup>

                    <Form.Select style={{ maxWidth: '220px' }} value={stationFilter} onChange={(e) => setStationFilter(e.target.value)}>
                        <option value=''>All Stations</option>
                        {stations.map((s) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                    </Form.Select>
                </div>

                <CreateModal />
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} video{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                    {!canOrder && items.total > 1 && <> — choose one station (no sort or search) to change the order</>}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th style={{ width: '100px' }}>Order</th>
                        <th style={{ width: '110px' }}>Poster</th>
                        <th>Title</th>
                        <th style={{ width: '160px' }}>Station</th>
                        <th style={{ width: '80px' }}>Duration</th>
                        <th style={{ width: '120px' }}>Renditions</th>
                        <th style={{ width: '90px' }}>Size</th>
                        <th style={{ width: '120px' }}>Status</th>
                        <th style={{ width: '80px' }}>Active</th>
                        <th className='text-center' style={{ width: '160px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item, index) => (
                        <tr key={item.id}>
                            <td className='text-nowrap'>
                                <Ordering id={item.id} direction='up' disabled={!canOrder || index === 0} />
                                {' '}
                                <Ordering id={item.id} direction='down' disabled={!canOrder || index === items.data.length - 1} />
                            </td>
                            <td>
                                {item.poster_url ? (
                                    <img src={`${serverUrl}/storage/${item.poster_url}`} alt='' className='rounded'
                                         style={{ width: '96px', aspectRatio: '16 / 9', objectFit: 'cover', background: '#000' }} />
                                ) : (
                                    <div className='rounded bg-light d-flex align-items-center justify-content-center text-muted'
                                         style={{ width: '96px', aspectRatio: '16 / 9' }}>
                                        <FontAwesomeIcon icon={['fas', 'film']} />
                                    </div>
                                )}
                            </td>
                            <td>{item.title}</td>
                            <td>{item.station?.title ?? '—'}</td>
                            <td>{item.duration ? fmtDuration(item.duration) : '—'}</td>
                            <td>{item.renditions?.length ? `${item.renditions.join('/')}p` : '—'}</td>
                            <td>{fmtSize(item.hls_size)}</td>
                            <td className='text-nowrap'>
                                <StatusBadge status={item.status} error={item.error} />
                                {item.status === 'failed' && (
                                    <Button size='sm' variant='link' className='p-0 ms-2' onClick={() => handleRetry(item.id)} title='Retry transcode'>
                                        <FontAwesomeIcon icon={['fas', 'rotate-right']} />
                                    </Button>
                                )}
                            </td>
                            <td>
                                <Form.Check
                                    type='switch'
                                    checked={!!item.active}
                                    onChange={() => handleToggleActive(item.id)}
                                    title={item.active ? 'Active' : 'Inactive'}
                                />
                            </td>
                            <td className='text-end text-nowrap'>
                                <ButtonGroup size='sm' style={{ gap: '0' }}>
                                    <ShowModal id={item.id} />
                                    <EditModal id={item.id} />
                                    <DeleteModal id={item.id} title={item.title} />
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='10' className='text-center text-muted py-4'>
                                No station videos found
                                {search && <> matching <strong>"{search}"</strong></>}
                                .
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <PaginatorLink store={paginatorAdapter} items={items} />
        </div>
    )
}

export default DataTable
