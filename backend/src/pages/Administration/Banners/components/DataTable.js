import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, InputGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useBannersStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/banners`

    const refreshKey = useBannersStore((s) => s.refreshKey)
    const paginatorUrl = useBannersStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useBannersStore((s) => s.setPaginatorUrl)
    const search = useBannersStore((s) => s.search)
    const setSearch = useBannersStore((s) => s.setSearch)
    const activeFilter = useBannersStore((s) => s.activeFilter)
    const setActiveFilter = useBannersStore((s) => s.setActiveFilter)

    const [query, setQuery] = useState(search)
    const [items, setItems] = useState([])

    // Debounce: commit typed query to store after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    const buildUrl = () => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (activeFilter !== '') params.set('active', activeFilter)
        const qs = params.toString()
        return qs ? `${baseUrl}?${qs}` : baseUrl
    }

    const effectiveUrl = paginatorUrl ?? buildUrl()

    useEffect(() => {
        axios({ method: 'get', url: effectiveUrl })
            .then((response) => setItems(response.data.banners))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search, activeFilter])

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
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                    >
                        <option value=''>All Status</option>
                        <option value='1'>Active</option>
                        <option value='0'>Inactive</option>
                    </Form.Select>
                </div>

                <CreateModal />
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} banner{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                    {activeFilter !== '' && (
                        <> — <Badge bg={activeFilter === '1' ? 'success' : 'secondary'}>
                            {activeFilter === '1' ? 'Active' : 'Inactive'}
                        </Badge></>
                    )}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th style={{ width: '100px' }}>Order</th>
                        <th style={{ width: '90px' }}>Active</th>
                        <th>Title</th>
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
                            <td>
                                {item.active == 1
                                    ? <Badge bg='success' pill>Active</Badge>
                                    : <Badge bg='secondary' pill>Inactive</Badge>
                                }
                            </td>
                            <td>{item.title}</td>
                            <td className='text-end text-nowrap'>
                                <ShowModal id={item.id} />{' '}
                                <EditModal id={item.id} />{' '}
                                <DeleteModal id={item.id} title={item.title} />
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='4' className='text-center text-muted py-4'>
                                No banners found
                                {search && <> matching <strong>"{search}"</strong></>}
                                {activeFilter !== '' && <> with status <strong>{activeFilter === '1' ? 'Active' : 'Inactive'}</strong></>}
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
