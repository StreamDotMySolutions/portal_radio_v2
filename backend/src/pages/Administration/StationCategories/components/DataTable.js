import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, InputGroup, Table, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useStationCategoriesStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/station-categories`

    const refreshKey = useStationCategoriesStore((s) => s.refreshKey)
    const paginatorUrl = useStationCategoriesStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useStationCategoriesStore((s) => s.setPaginatorUrl)
    const search = useStationCategoriesStore((s) => s.search)
    const setSearch = useStationCategoriesStore((s) => s.setSearch)

    const [sortBy, setSortBy] = useState(null)
    const [sortDir, setSortDir] = useState('asc')
    const [query, setQuery] = useState(search)
    const [perPage, setPerPage] = useState(15)
    const [items, setItems] = useState([])

    const handleToggleActive = (itemId) => {
        setItems(prev => ({
            ...prev,
            data: prev.data.map(item =>
                item.id === itemId
                    ? { ...item, active: item.active == 1 ? 0 : 1 }
                    : item
            )
        }))

        axios({ method: 'patch', url: `${apiBase}/station-categories/${itemId}/toggle` })
            .catch(() => {
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
                setSortDir('asc')
            }
        } else {
            setSortBy(field)
            setSortDir('desc')
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    const buildUrl = () => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
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
            .then((response) => setItems(response.data.categories))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search, perPage, sortBy, sortDir])

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
                {/* Left: sort buttons */}
                <ButtonGroup>
                    <Button
                        variant={sortBy === 'display_name' ? 'primary' : 'outline-secondary'}
                        size='sm'
                        onClick={() => handleToggleSort('display_name')}
                    >
                        <FontAwesomeIcon icon={['fas', 'a']} className='me-1' />
                        Name {sortBy === 'display_name' && <FontAwesomeIcon icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']} className='ms-1' />}
                    </Button>
                </ButtonGroup>

                {/* Middle: search */}
                <InputGroup style={{ maxWidth: '340px' }}>
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder='Search by name or slug...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <Button variant='outline-secondary' onClick={handleClearSearch}>
                            <FontAwesomeIcon icon={['fas', 'xmark']} />
                        </Button>
                    )}
                </InputGroup>

                {/* Right: create */}
                <CreateModal />
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} categor{items.total !== 1 ? 'ies' : 'y'} found
                    {search && <> for <strong>"{search}"</strong></>}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th style={{ width: '100px' }}>Order</th>
                        <th>Display Name</th>
                        <th style={{ width: '120px' }}>Slug</th>
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
                            <td>{item.display_name}</td>
                            <td><code>{item.slug}</code></td>
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
                                    <DeleteModal id={item.id} displayName={item.display_name} />
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='5' className='text-center text-muted py-4'>
                                No categories found
                                {search && <> matching <strong>"{search}"</strong></>}
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
