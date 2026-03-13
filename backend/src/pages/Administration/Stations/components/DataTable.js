import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, InputGroup, Table, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useStationsStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/stations`

    const refreshKey = useStationsStore((s) => s.refreshKey)
    const paginatorUrl = useStationsStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useStationsStore((s) => s.setPaginatorUrl)
    const search = useStationsStore((s) => s.search)
    const setSearch = useStationsStore((s) => s.setSearch)
    const categoryFilter = useStationsStore((s) => s.categoryFilter)
    const setCategoryFilter = useStationsStore((s) => s.setCategoryFilter)

    const [sortBy, setSortBy] = useState(null)
    const [sortDir, setSortDir] = useState('desc')
    const [query, setQuery] = useState(search)
    const [perPage, setPerPage] = useState(15)
    const [items, setItems] = useState([])

    const handleToggleActive = (itemId) => {
        // Optimistic update
        setItems(prev => ({
            ...prev,
            data: prev.data.map(item =>
                item.id === itemId
                    ? { ...item, active: item.active == 1 ? 0 : 1 }
                    : item
            )
        }))

        axios({ method: 'patch', url: `${apiBase}/stations/${itemId}/toggle` })
            .catch(() => {
                // Revert on failure
                setItems(prev => ({
                    ...prev,
                    data: prev.data.map(item =>
                        item.id === itemId
                            ? { ...item, active: item.active == 1 ? 0 : 1 }
                            : item
                    )
                }))
            })
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
    }

    // Debounce: commit typed query to store after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    const buildUrl = () => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (categoryFilter) params.set('category', categoryFilter)
        params.set('per_page', perPage)
        if (sortBy) {
            params.set('sort_by', sortBy)
            params.set('sort_dir', sortDir)
        }
        const qs = params.toString()
        return qs ? `${baseUrl}?${qs}` : baseUrl
    }

    const effectiveUrl = paginatorUrl ?? buildUrl()

    useEffect(() => {
        axios({ method: 'get', url: effectiveUrl })
            .then((response) => setItems(response.data.stations))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search, categoryFilter, perPage, sortBy, sortDir])

    const paginatorAdapter = {
        setValue: (key, value) => {
            if (key === 'url') setPaginatorUrl(value)
        },
    }

    const handleClearSearch = () => setQuery('')

    const categoryBadgeVariant = (cat) => {
        if (cat === 'nasional') return 'primary'
        if (cat === 'negeri') return 'info'
        return 'warning'
    }

    return (
        <div>
            {/* Toolbar */}
            <div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
                {/* Left: sort buttons */}
                <ButtonGroup>
                    <Button
                        variant={sortBy === 'created_at' ? 'primary' : 'outline-secondary'}
                        size='sm'
                        onClick={() => handleToggleSort('created_at')}
                    >
                        <FontAwesomeIcon icon={['fas', 'calendar']} className='me-1' />
                        Date {sortBy === 'created_at' && <FontAwesomeIcon icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']} className='ms-1' />}
                    </Button>
                </ButtonGroup>

                {/* Middle: search and category filter */}
                <div className='d-flex gap-2'>
                    <InputGroup style={{ maxWidth: '300px' }}>
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder='Search by title...'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <Button variant='outline-secondary' onClick={handleClearSearch}>
                                <FontAwesomeIcon icon={['fas', 'xmark']} />
                            </Button>
                        )}
                    </InputGroup>

                    <Form.Select
                        style={{ maxWidth: '150px' }}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value=''>All Categories</option>
                        <option value='nasional'>Nasional</option>
                        <option value='negeri'>Negeri</option>
                        <option value='radio_tempatan'>Radio Tempatan</option>
                    </Form.Select>
                </div>

                {/* Right: create */}
                <CreateModal />
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} station{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                    {categoryFilter && (
                        <> — <Badge bg={categoryBadgeVariant(categoryFilter)}>
                            {categoryFilter === 'nasional' ? 'Nasional' : categoryFilter === 'negeri' ? 'Negeri' : 'Radio Tempatan'}
                        </Badge></>
                    )}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th style={{ width: '100px' }}>Order</th>
                        <th>Title</th>
                        <th style={{ width: '120px' }}>Category</th>
                        <th style={{ width: '100px' }}>Frequency</th>
                        <th style={{ width: '90px' }}>Pageviews</th>
                        <th style={{ width: '90px' }}>Active</th>
                        <th className='text-center' style={{ width: '160px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item, index) => (
                        <tr key={item.id}>
                            <td className='text-nowrap'>
                                <Ordering id={item.id} direction='up' disabled={index === 0} />
                                {' '}
                                <Ordering
                                    id={item.id}
                                    direction='down'
                                    disabled={index === items.data.length - 1}
                                />
                            </td>
                            <td>{item.title}</td>
                            <td>
                                <Badge bg={categoryBadgeVariant(item.category)}>
                                    {item.category === 'nasional' ? 'Nasional' : item.category === 'negeri' ? 'Negeri' : 'Radio Tempatan'}
                                </Badge>
                            </td>
                            <td>{item.frequency || '—'}</td>
                            <td>{item.pageview_hits || 0}</td>
                            <td>
                                <Form.Check
                                    type='switch'
                                    checked={item.active == 1}
                                    onChange={() => handleToggleActive(item.id)}
                                    title={item.active == 1 ? 'Active' : 'Inactive'}
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
                            <td colSpan='6' className='text-center text-muted py-4'>
                                No stations found
                                {search && <> matching <strong>"{search}"</strong></>}
                                {categoryFilter && <> in <strong>{categoryFilter === 'nasional' ? 'Nasional' : categoryFilter === 'negeri' ? 'Negeri' : 'Radio Tempatan'}</strong></>}
                                .
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <PaginatorLink store={paginatorAdapter} items={items} perPage={perPage} onPerPageChange={setPerPage} />
        </div>
    )
}

export default DataTable
