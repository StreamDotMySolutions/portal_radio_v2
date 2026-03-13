import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, InputGroup, Table, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useFooterStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/footer-links`

    const refreshKey = useFooterStore((s) => s.refreshKey)
    const paginatorUrl = useFooterStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useFooterStore((s) => s.setPaginatorUrl)
    const search = useFooterStore((s) => s.search)
    const setSearch = useFooterStore((s) => s.setSearch)
    const sectionFilter = useFooterStore((s) => s.sectionFilter)
    const setSectionFilter = useFooterStore((s) => s.setSectionFilter)
    const activeFilter = useFooterStore((s) => s.activeFilter)
    const setActiveFilter = useFooterStore((s) => s.setActiveFilter)

    const [query, setQuery] = useState(search)
    const [items, setItems] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleToggleActive = (itemId) => {
        // Optimistic update
        setItems((prev) => ({
            ...prev,
            data: prev.data.map((item) =>
                item.id === itemId
                    ? { ...item, active: item.active == 1 ? 0 : 1 }
                    : item
            ),
        }))

        axios({ method: 'patch', url: `${apiBase}/footer-links/${itemId}/toggle` })
            .catch(() => {
                // Revert on failure
                setItems((prev) => ({
                    ...prev,
                    data: prev.data.map((item) =>
                        item.id === itemId
                            ? { ...item, active: item.active == 1 ? 0 : 1 }
                            : item
                    ),
                }))
            })
    }

    // Debounce: commit typed query to store after 400ms idle
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    const buildUrl = () => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (sectionFilter) params.set('section', sectionFilter)
        if (activeFilter !== '') params.set('active', activeFilter)
        params.set('per_page', 15)
        const qs = params.toString()
        return qs ? `${baseUrl}?${qs}` : baseUrl
    }

    // Fetch data
    useEffect(() => {
        const fetchUrl = paginatorUrl || buildUrl()
        setIsLoading(true)

        axios({ method: 'get', url: fetchUrl })
            .then((response) => {
                setItems(response.data.footer_links)
                setPaginatorUrl(null)
            })
            .catch((error) => {
                console.error('Error fetching footer links:', error)
                setItems(null)
            })
            .finally(() => setIsLoading(false))
    }, [search, sectionFilter, activeFilter, refreshKey, paginatorUrl])

    if (isLoading && !items) {
        return (
            <div className='text-center py-5'>
                <Spinner animation='border' role='status' size='sm' className='me-2' />
                Loading footer links...
            </div>
        )
    }

    return (
        <>
            {/* Toolbar */}
            <div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
                {/* Section Filter */}
                <Form.Select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    style={{ maxWidth: '160px' }}
                    size='sm'
                >
                    <option value=''>All Sections</option>
                    <option value='quick'>Quick Links</option>
                    <option value='network'>Network</option>
                </Form.Select>

                {/* Search */}
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
                        <Button
                            variant='outline-secondary'
                            onClick={() => setQuery('')}
                        >
                            <FontAwesomeIcon icon={['fas', 'xmark']} />
                        </Button>
                    )}
                </InputGroup>

                {/* Create Button */}
                <CreateModal />
            </div>

            {/* Table */}
            {items && items.data && items.data.length > 0 ? (
                <div>
                    <Table striped bordered hover responsive size='sm'>
                        <thead className='table-light'>
                            <tr>
                                <th style={{ width: '20%' }}>Title</th>
                                <th style={{ width: '40%' }}>URL</th>
                                <th style={{ width: '12%' }}>Section</th>
                                <th style={{ width: '8%' }}>Type</th>
                                <th style={{ width: '8%' }}>Status</th>
                                <th style={{ width: '12%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                                        <code>{item.url}</code>
                                    </td>
                                    <td>
                                        <Badge
                                            bg={
                                                item.section === 'quick'
                                                    ? 'info'
                                                    : 'warning'
                                            }
                                        >
                                            {item.section === 'quick'
                                                ? 'Quick'
                                                : 'Network'}
                                        </Badge>
                                    </td>
                                    <td>
                                        {item.is_external ? (
                                            <FontAwesomeIcon
                                                icon={[
                                                    'fas',
                                                    'arrow-up-right-from-square',
                                                ]}
                                                className='text-muted'
                                                title='External'
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={['fas', 'link']}
                                                className='text-muted'
                                                title='Internal'
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <Form.Check
                                            type='switch'
                                            checked={item.active == 1}
                                            onChange={() =>
                                                handleToggleActive(item.id)
                                            }
                                            disabled={isLoading}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td>
                                        <div className='d-flex gap-1'>
                                            <Ordering
                                                footerLink={item}
                                                isLoading={isLoading}
                                            />
                                            <ShowModal footerLink={item} />
                                            <EditModal footerLink={item} />
                                            <DeleteModal footerLink={item} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Paginator */}
                    {items.links && items.links.length > 0 && (
                        <PaginatorLink
                            links={items.links}
                            onLinkClick={(url) => setPaginatorUrl(url)}
                        />
                    )}
                </div>
            ) : (
                <div className='text-center text-muted py-5'>
                    No footer links found
                </div>
            )}
        </>
    )
}

export default DataTable
