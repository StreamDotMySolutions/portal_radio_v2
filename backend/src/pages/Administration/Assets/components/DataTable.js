import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const formatBytes = (bytes) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const DataTable = () => {
    const store = useStore()
    const { parentId } = useParams()

    const serverUrl = process.env.REACT_APP_SERVER_URL
    const downloadPath = `${serverUrl}/api/frontend/download/asset`

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
        const base = `${store.url}/assets/node/${parentId}`
        const url = search ? `${base}?search=${encodeURIComponent(search)}` : base
        store.setValue('url', url)
    }, [parentId, search])

    // Fetch when url or refresh changes
    useEffect(() => {
        const url = store.getValue('url') ?? `${store.url}/assets/node/${parentId}`
        axios({ method: 'get', url })
            .then((response) => {
                setItems(response.data.assets)
                store.setValue('refresh', false)
            })
            .catch((error) => console.warn(error))
    }, [store.getValue('url'), store.getValue('refresh'), parentId])

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
                    {items.total} item{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th style={{ width: '100px' }}>Order</th>
                        <th>Name</th>
                        <th style={{ width: '180px' }}>Mimetype</th>
                        <th style={{ width: '100px' }}>Size</th>
                        <th className='text-center' style={{ width: '100px' }}>Downloads</th>
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
                                    ? <FontAwesomeIcon className='me-2 text-warning' icon={['fas', 'folder']} />
                                    : <FontAwesomeIcon className='me-2 text-secondary' icon={['fas', 'file']} />
                                }
                                {item.type === 'file'
                                    ? <a target='_blank' rel='noreferrer' href={`${downloadPath}/${item.name}`}>{item.name}</a>
                                    : <Link to={`/administration/assets/${item.id}`}>{item.name}</Link>
                                }
                            </td>
                            <td className='text-muted small'>{item.type === 'file' ? item.mimetype : '-'}</td>
                            <td className='text-muted small'>{item.type === 'file' ? formatBytes(item.filesize) : '-'}</td>
                            <td className='text-center'>
                                {item.type === 'file' && item.downloads_count > 0 ? (
                                    <Badge bg='light' text='dark'>
                                        <FontAwesomeIcon icon={['fas', 'download']} className='me-1 text-muted' />
                                        {item.downloads_count.toLocaleString()}
                                    </Badge>
                                ) : (
                                    <span className='text-muted'>—</span>
                                )}
                            </td>
                            <td className='text-center text-nowrap'>
                                <ShowModal id={item.id} />{' '}
                                <EditModal id={item.id} />{' '}
                                <DeleteModal id={item.id} name={item.name} type={item.type} />
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='6' className='text-center text-muted py-4'>
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
