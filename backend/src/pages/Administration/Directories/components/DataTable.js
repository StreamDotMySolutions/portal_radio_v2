import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import EditModal from '../modals/Edit'
import ShowModal from '../modals/Show'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const DataTable = () => {
    const store = useStore()
    const { parentId } = useParams()

    const [query, setQuery] = useState('')
    const [search, setSearch] = useState('')
    const [items, setItems] = useState([])

    // Debounce: commit typed query after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    // Reset URL when parentId or search changes
    useEffect(() => {
        const base = `${store.url}/directories/node/${parentId}`
        const url = search ? `${base}?search=${encodeURIComponent(search)}` : base
        store.setValue('url', url)
    }, [parentId, search])

    // Fetch when url or refresh changes
    useEffect(() => {
        const url = store.getValue('url') ?? `${store.url}/directories/node/${parentId}`
        axios({ method: 'get', url })
            .then(response => {
                setItems(response.data.directories)
                store.setValue('refresh', false)
            })
            .catch(error => console.warn(error))
    }, [store.getValue('url'), store.getValue('refresh')])

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
                        placeholder='Search by name...'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
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
                    {items.total} item{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th style={{ width: '110px' }}>Order</th>
                        <th style={{ width: '100px' }}>Type</th>
                        <th>Name</th>
                        <th className='text-center' style={{ width: '160px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item, index) => (
                        <tr key={item.id}>
                            <td className='text-nowrap'>
                                <Ordering id={item.id} direction='up' disabled={index === 0} />
                                {' '}
                                <Ordering id={item.id} direction='down' disabled={index === items.data.length - 1} />
                            </td>
                            <td>
                                {item.type === 'folder'
                                    ? <Badge bg='warning' text='dark'>Department</Badge>
                                    : <Badge bg='secondary'>Staff</Badge>
                                }
                            </td>
                            <td>
                                {item.type === 'folder'
                                    ? (
                                        <Link to={`/administration/directories/${item.id}`}>
                                            <FontAwesomeIcon className='me-2 text-warning' icon={['fas', item.descendants?.length > 0 ? 'folder-open' : 'folder']} />
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon className='me-2 text-secondary' icon={['fas', 'user']} />
                                            {item.name}
                                        </>
                                    )
                                }
                            </td>
                            <td className='text-center text-nowrap'>
                                {item.type === 'spreadsheet' && (
                                    <>
                                        <ShowModal id={item.id} />
                                        {' '}
                                    </>
                                )}
                                <EditModal id={item.id} />
                                {' '}
                                <DeleteModal id={item.id} name={item.name} />
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='4' className='text-center text-muted py-4'>
                                {search
                                    ? <>No items found matching <strong>"{search}"</strong>.</>
                                    : 'No items found.'
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <PaginatorLink store={store} items={items} />
        </div>
    )
}

export default DataTable
