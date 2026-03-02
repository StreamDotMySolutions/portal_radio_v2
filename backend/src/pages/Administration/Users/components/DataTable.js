import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, InputGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useUsersStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/users`

    const refreshKey = useUsersStore((s) => s.refreshKey)
    const paginatorUrl = useUsersStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useUsersStore((s) => s.setPaginatorUrl)
    const search = useUsersStore((s) => s.search)
    const setSearch = useUsersStore((s) => s.setSearch)

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
            .then((response) => setItems(response.data.users))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search])

    const paginatorAdapter = {
        setValue: (key, value) => {
            if (key === 'url') setPaginatorUrl(value)
        },
    }

    const adminCount = items?.data?.filter(
        (user) => user.roles?.some((role) => role.name === 'admin')
    ).length ?? 0

    const handleClearSearch = () => {
        setQuery('')
    }

    return (
        <div>
            {/* Toolbar */}
            <div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
                <InputGroup style={{ maxWidth: '340px' }}>
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder='Search by name or email...'
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
                    {items.total} user{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th style={{ width: '100px' }}>Role</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th style={{ width: '150px' }}>Joined</th>
                        <th className='text-center' style={{ width: '160px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item) => {
                        const isLastAdmin =
                            adminCount === 1 &&
                            item.roles?.some((role) => role.name === 'admin')
                        return (
                            <tr key={item.id}>
                                <td>
                                    {item.roles?.map((role) => (
                                        <Badge key={role.id} bg='secondary' className='me-1'>
                                            {role.name}
                                        </Badge>
                                    ))}
                                </td>
                                <td>{item.name}</td>
                                <td className='text-muted'>{item.email}</td>
                                <td className='text-muted'>{item.created_at}</td>
                                <td className='text-end text-nowrap'>
                                    <ShowModal id={item.id} />{' '}
                                    <EditModal id={item.id} disabled={isLastAdmin} />{' '}
                                    <DeleteModal
                                        id={item.id}
                                        name={item.name}
                                        email={item.email}
                                        disabled={isLastAdmin}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='5' className='text-center text-muted py-4'>
                                {search
                                    ? <>No users found matching <strong>"{search}"</strong>.</>
                                    : 'No users found.'
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
