import React, { useState, useEffect } from 'react'
import { Button, Form, InputGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useProgrammesStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/programmes`

    const refreshKey = useProgrammesStore((s) => s.refreshKey)
    const paginatorUrl = useProgrammesStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useProgrammesStore((s) => s.setPaginatorUrl)
    const search = useProgrammesStore((s) => s.search)
    const setSearch = useProgrammesStore((s) => s.setSearch)

    const [query, setQuery] = useState(search)
    const [items, setItems] = useState([])

    // Debounce: commit typed query to store after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    const effectiveUrl = paginatorUrl
        ?? (search ? `${baseUrl}?search=${encodeURIComponent(search)}` : baseUrl)

    useEffect(() => {
        axios({ method: 'get', url: effectiveUrl })
            .then((response) => setItems(response.data.programmes))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search])

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
                <InputGroup style={{ maxWidth: '340px' }}>
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
                <CreateModal />
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} programme{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th style={{ width: '100px' }}>Order</th>
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
                            <td colSpan='3' className='text-center text-muted py-4'>
                                {search
                                    ? <>No programmes found matching <strong>"{search}"</strong>.</>
                                    : 'No programmes found.'
                                }
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
