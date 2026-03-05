import React, { useState, useEffect } from 'react'
import { Badge, Button, ButtonGroup, Form, InputGroup, Table } from 'react-bootstrap'
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
    const [sortBy, setSortBy] = useState(null)
    const [sortDir, setSortDir] = useState('desc')
    const [perPage, setPerPage] = useState(25)
    const [items, setItems] = useState([])

    // Debounce: commit typed query after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    // Reset URL when parentId, search, sortBy, sortDir, or perPage changes
    useEffect(() => {
        const base = `${store.url}/directories/node/${parentId}`
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (sortBy) {
            params.append('sort_by', sortBy)
            params.append('sort_dir', sortDir)
        }
        params.append('per_page', perPage)
        const url = params.toString() ? `${base}?${params.toString()}` : base
        store.setValue('url', url)
    }, [parentId, search, sortBy, sortDir, perPage])

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

    const buildPath = (item) => {
        if (!item.ancestors || item.ancestors.length === 0) return ''
        return item.ancestors.map(a => a.name).join(' > ')
    }

    return (
        <div>
            {/* Toolbar */}
            <div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
                <ButtonGroup>
                    <Button
                        variant={sortBy === 'name' ? 'primary' : 'outline-secondary'}
                        onClick={() => handleToggleSort('name')}
                        title={sortBy === 'name' ? `Name (${sortDir === 'desc' ? 'Z → A' : 'A → Z'})` : 'Sort by Name'}
                    >
                        <FontAwesomeIcon icon={['fas', 'a']} className='me-1' />
                        Name {sortBy === 'name' && <FontAwesomeIcon icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']} className='ms-1' />}
                    </Button>
                    <Button
                        variant={sortBy === 'date' ? 'primary' : 'outline-secondary'}
                        onClick={() => handleToggleSort('date')}
                        title={sortBy === 'date' ? `Date (${sortDir === 'desc' ? 'newest first' : 'oldest first'})` : 'Sort by Date'}
                    >
                        <FontAwesomeIcon icon={['fas', 'calendar']} className='me-1' />
                        Date {sortBy === 'date' && <FontAwesomeIcon icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']} className='ms-1' />}
                    </Button>
                </ButtonGroup>
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
                        {sortBy === null && <th style={{ width: '110px' }}>Order</th>}
                        <th style={{ width: '100px' }}>Type</th>
                        <th>Name</th>
                        {search && <th>Path</th>}
                        <th className='text-center' style={{ width: '160px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item, index) => (
                        <tr key={item.id}>
                            {sortBy === null && (
                                <td className='text-nowrap'>
                                    <Ordering id={item.id} direction='up' disabled={index === 0} />
                                    {' '}
                                    <Ordering id={item.id} direction='down' disabled={index === items.data.length - 1} />
                                </td>
                            )}
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
                            {search && (
                                <td className='text-muted small'>
                                    {buildPath(item)}
                                </td>
                            )}
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
                            <td colSpan={sortBy === null ? (search ? 5 : 4) : (search ? 4 : 3)} className='text-center text-muted py-4'>
                                {search
                                    ? <>No items found matching <strong>"{search}"</strong>.</>
                                    : 'No items found.'
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div className='d-flex align-items-center justify-content-end gap-3'>
                <Form.Select
                    style={{ width: 'auto' }}
                    value={perPage}
                    onChange={e => setPerPage(Number(e.target.value))}
                >
                    <option value={10}>10 / page</option>
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                    <option value={100}>100 / page</option>
                </Form.Select>
                <PaginatorLink store={store} items={items} />
            </div>
        </div>
    )
}

export default DataTable
