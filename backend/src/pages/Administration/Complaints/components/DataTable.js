import React, { useState, useEffect } from 'react'
import { Badge, Button, ButtonGroup, Form, InputGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import { useComplaintStore } from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import ShowModal from '../modals/Show'
import DeleteModal from '../modals/Delete'

const categoryOptions = [
    'Kandungan Siaran',
    'Masalah Teknikal',
    'Perkhidmatan Pelanggan',
    'Lain-lain'
];

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/complaints`

    const refreshKey = useComplaintStore((s) => s.refreshKey)
    const paginatorUrl = useComplaintStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useComplaintStore((s) => s.setPaginatorUrl)
    const search = useComplaintStore((s) => s.search)
    const setSearch = useComplaintStore((s) => s.setSearch)
    const categoryFilter = useComplaintStore((s) => s.categoryFilter)
    const setCategoryFilter = useComplaintStore((s) => s.setCategoryFilter)

    const [query, setQuery] = useState(search)
    const [items, setItems] = useState([])
    const [sortBy, setSortBy] = useState(null)
    const [sortDir, setSortDir] = useState('desc')

    // Debounce: commit typed query to store after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query, setSearch])

    const handleToggleSort = (field) => {
        if (sortBy === field) {
            // Same field: cycle desc -> asc -> null
            if (sortDir === 'desc') {
                setSortDir('asc')
            } else {
                setSortBy(null)
                setSortDir('desc')
            }
        } else {
            // Different field: switch to that field at desc
            setSortBy(field)
            setSortDir('desc')
        }
    }

    const buildUrl = () => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (categoryFilter) params.set('category', categoryFilter)
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
            .then((response) => {
                setItems(response.data.complaints)
            })
            .catch((error) => {
                console.error('API Error:', error)
                console.error('URL was:', effectiveUrl)
            })
    }, [refreshKey, paginatorUrl, search, categoryFilter, sortBy, sortDir])

    const paginatorAdapter = {
        setValue: (key, value) => {
            if (key === 'url') setPaginatorUrl(value)
        },
    }

    const handleClearSearch = () => setQuery('')

    return (
        <div>
            {/* Toolbar */}
            <div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
                {/* Left: Sort buttons */}
                <ButtonGroup>
                    <Button
                        variant={sortBy === 'name' ? 'primary' : 'outline-secondary'}
                        onClick={() => handleToggleSort('name')}
                    >
                        <FontAwesomeIcon icon={['fas', 'a']} className='me-1' />
                        Name
                        {sortBy === 'name' && (
                            <FontAwesomeIcon
                                icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']}
                                className='ms-1'
                            />
                        )}
                    </Button>
                    <Button
                        variant={sortBy === 'date' ? 'primary' : 'outline-secondary'}
                        onClick={() => handleToggleSort('date')}
                    >
                        <FontAwesomeIcon icon={['fas', 'calendar']} className='me-1' />
                        Date
                        {sortBy === 'date' && (
                            <FontAwesomeIcon
                                icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']}
                                className='ms-1'
                            />
                        )}
                    </Button>
                </ButtonGroup>

                {/* Middle: Search and filter */}
                <div className='d-flex gap-2'>
                    <InputGroup style={{ maxWidth: '340px' }}>
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder='Search by name, email, subject...'
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
                        style={{ maxWidth: '200px' }}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value=''>All Categories</option>
                        {categoryOptions.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} complaint{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                    {categoryFilter !== '' && (
                        <> — <Badge bg='info'>{categoryFilter}</Badge></>
                    )}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th>Ref No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Category</th>
                        <th>Platform</th>
                        <th>Subject</th>
                        <th>Incident At</th>
                        <th>Submitted At</th>
                        <th className='text-center' style={{ width: '100px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item) => (
                        <tr key={item.id}>
                            <td className='text-nowrap'><Badge bg='secondary'>{item.reference_number}</Badge></td>
                            <td>{item.full_name}</td>
                            <td><small>{item.email}</small></td>
                            <td><small>{item.category}</small></td>
                            <td><small>{item.platform}</small></td>
                            <td><small>{item.subject}</small></td>
                            <td><small>{item.incident_at}</small></td>
                            <td><small>{item.created_at}</small></td>
                            <td className='text-center text-nowrap'>
                                <ShowModal id={item.id} />{' '}
                                <DeleteModal id={item.id} name={item.full_name} />
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='9' className='text-center text-muted py-4'>
                                No complaints found
                                {search && <> matching <strong>"{search}"</strong></>}
                                {categoryFilter !== '' && <> in <strong>{categoryFilter}</strong></>}
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
