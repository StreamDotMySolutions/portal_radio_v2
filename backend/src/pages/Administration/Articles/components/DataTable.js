import React, { useState, useEffect } from 'react'
import { Badge, Button, ButtonGroup, Form, InputGroup, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import EditModal from '../modals/Edit'
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
    const [foldersCount, setFoldersCount] = useState(0)
    const [pagesCount, setPagesCount] = useState(0)

    // Debounce: commit typed query after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    // Reset URL when parentId, search, sortBy, sortDir, or perPage changes
    useEffect(() => {
        const base = `${store.url}/articles/node/${parentId}`
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
        const url = store.getValue('url') ?? `${store.url}/articles/node/${parentId}`
        axios({ method: 'get', url })
            .then(response => {
                setItems(response.data.articles)
                setFoldersCount(response.data.folders_count ?? 0)
                setPagesCount(response.data.pages_count ?? 0)
                store.setValue('refresh', false)
            })
            .catch(error => console.warn(error))
    }, [store.getValue('url'), store.getValue('refresh')])

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

    const handleToggleActive = (itemId) => {
        // Optimistic update
        setItems(prev => ({
            ...prev,
            data: prev.data.map(item =>
                item.id === itemId
                    ? { ...item, article_setting: { ...item.article_setting, active: item.article_setting.active == 1 ? 0 : 1 } }
                    : item
            )
        }))

        axios({ method: 'patch', url: `${store.url}/article-settings/${itemId}/toggle` })
            .catch(() => {
                // Revert on failure
                setItems(prev => ({
                    ...prev,
                    data: prev.data.map(item =>
                        item.id === itemId
                            ? { ...item, article_setting: { ...item.article_setting, active: item.article_setting.active == 1 ? 0 : 1 } }
                            : item
                    )
                }))
            })
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
                        placeholder='Search by title...'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    {query && (
                        <Button variant='outline-secondary' onClick={() => setQuery('')}>
                            <FontAwesomeIcon icon={['fas', 'xmark']} />
                        </Button>
                    )}
                </InputGroup>
                <CreateModal />
            </div>

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
<th style={{ width: '110px' }}>Order</th>
                        <th style={{ width: '100px' }}>Status</th>
                        <th className='text-center' style={{ width: '80px' }}>Type</th>
                        <th style={{ width: '200px' }}>Title</th>
                        <th className='text-center' style={{ width: '80px' }}>Views</th>
                        <th className='text-center' style={{ width: '80px' }}>Content</th>
                        <th className='text-center' style={{ width: '160px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item) => (
                        <tr key={item.id}>
<td className='text-nowrap'>
                                <Ordering id={item.id} direction='up' />
                                {' '}
                                <Ordering id={item.id} direction='down' />
                            </td>
                            <td>
                                <Form.Check
                                    type='switch'
                                    checked={item.article_setting.active == 1}
                                    onChange={() => handleToggleActive(item.id)}
                                    title={item.article_setting.active == 1 ? 'Active' : 'Inactive'}
                                />
                            </td>
                            <td className='text-center'>
                                {item.type === 'folder'
                                    ? <Badge bg='warning' text='dark'>Folder</Badge>
                                    : <Badge bg='secondary'>Page</Badge>
                                }
                            </td>
                            <td>
                                <Link to={`/administration/articles/${item.id}`}>
                                    {item.type === 'folder' ? (
                                        <FontAwesomeIcon icon={['fas', 'folder']} className='me-2 text-warning' />
                                    ) : (
                                        <FontAwesomeIcon icon={['fas', 'file']} className='me-2 text-secondary' />
                                    )}
                                    {item.title}
                                </Link>
                            </td>
                            <td className='text-center'>
                                {item.analytics_views_count > 0 ? (
                                    <Badge bg='light' text='dark'>
                                        <FontAwesomeIcon icon={['fas', 'eye']} className='me-1 text-muted' />
                                        {item.analytics_views_count.toLocaleString()}
                                    </Badge>
                                ) : (
                                    <span className='text-muted'>—</span>
                                )}
                            </td>
                            <td className='text-center'>
                                <Link to={`/administration/articles-data/${item.id}`}>
                                    <Button size='sm' variant='outline-info' title='Edit content'>
                                        <FontAwesomeIcon icon={['fas', 'pen']} />
                                    </Button>
                                </Link>
                            </td>
                            <td className='text-center text-nowrap'>
                                {item.type === 'folder' ? (
                                    <>
                                        <Link to={`/administration/articles/${item.id}`}>
                                            <Button size='sm' variant={item.descendants?.length > 0 ? 'outline-warning' : 'outline-primary'} title='Manage sub-articles'>
                                                <FontAwesomeIcon icon={['fas', item.descendants?.length > 0 ? 'folder-open' : 'folder-plus']} />
                                            </Button>
                                        </Link>
                                        {' '}
                                    </>
                                ) : (
                                    <>
                                        <Button size='sm' variant='outline-secondary' disabled>
                                            <FontAwesomeIcon icon={['fas', 'file']} />
                                        </Button>
                                        {' '}
                                    </>
                                )}
                                <EditModal id={item.id} />
                                {' '}
                                <DeleteModal id={item.id} title={item.title} />
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='7' className='text-center text-muted py-4'>No articles found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div className='d-flex align-items-center justify-content-between mt-2'>
                <div className='d-flex align-items-center gap-3 text-muted small'>
                    <span>
                        <Badge bg='warning' text='dark' className='me-1'>Folder</Badge>
                        {foldersCount}
                    </span>
                    <span>
                        <Badge bg='secondary' className='me-1'>Page</Badge>
                        {pagesCount}
                    </span>
                </div>
                <div className='d-flex align-items-center gap-3'>
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
        </div>
    )
}

export default DataTable
