import React, { useState, useEffect } from 'react'
import { Badge, Button, Form, InputGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useChatUsersStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/chat-users`

    const refreshKey = useChatUsersStore((s) => s.refreshKey)
    const paginatorUrl = useChatUsersStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useChatUsersStore((s) => s.setPaginatorUrl)
    const search = useChatUsersStore((s) => s.search)
    const setSearch = useChatUsersStore((s) => s.setSearch)
    const setRefresh = useChatUsersStore((s) => s.setRefresh)

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
            .then((response) => setItems(response.data.chat_users))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search])

    const paginatorAdapter = {
        setValue: (key, value) => {
            if (key === 'url') setPaginatorUrl(value)
        },
    }

    const handleClearSearch = () => {
        setQuery('')
    }

    const handleToggleBan = (id) => {
        axios({ method: 'patch', url: `${apiBase}/chat-users/${id}/toggle-ban` })
            .then(() => setRefresh())
            .catch((error) => console.warn(error))
    }

    const handleVerify = (id) => {
        axios({ method: 'patch', url: `${apiBase}/chat-users/${id}/verify` })
            .then(() => setRefresh())
            .catch((error) => console.warn(error))
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
                        placeholder='Search by username or email...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <Button variant='outline-secondary' onClick={handleClearSearch}>
                            <FontAwesomeIcon icon={['fas', 'xmark']} />
                        </Button>
                    )}
                </InputGroup>
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} chat user{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th style={{ width: '80px' }} className='text-center'>Status</th>
                        <th style={{ width: '80px' }} className='text-center'>Verified</th>
                        <th style={{ width: '80px' }} className='text-center'>Messages</th>
                        <th style={{ width: '130px' }}>Joined</th>
                        <th className='text-center' style={{ width: '180px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <span style={{ color: item.color, fontWeight: 600 }}>{item.username}</span>
                            </td>
                            <td className='text-muted'>{item.email}</td>
                            <td className='text-center'>
                                {item.is_banned
                                    ? <Badge bg='danger'>Banned</Badge>
                                    : <Badge bg='success'>Active</Badge>
                                }
                            </td>
                            <td className='text-center'>
                                {item.email_verified_at
                                    ? <Badge bg='info'>Yes</Badge>
                                    : <Badge bg='secondary'>No</Badge>
                                }
                            </td>
                            <td className='text-center text-muted'>{item.messages_count}</td>
                            <td className='text-muted'>{item.created_at}</td>
                            <td className='text-end text-nowrap'>
                                <ShowModal id={item.id} />{' '}
                                <EditModal id={item.id} />{' '}
                                {!item.email_verified_at && (
                                    <Button
                                        size='sm'
                                        variant='outline-info'
                                        onClick={() => handleVerify(item.id)}
                                        title='Verify Email'
                                    >
                                        <FontAwesomeIcon icon={['fas', 'check']} />
                                    </Button>
                                )}{' '}
                                <Button
                                    size='sm'
                                    variant={item.is_banned ? 'outline-success' : 'outline-warning'}
                                    onClick={() => handleToggleBan(item.id)}
                                    title={item.is_banned ? 'Unban' : 'Ban'}
                                >
                                    <FontAwesomeIcon icon={['fas', item.is_banned ? 'lock-open' : 'ban']} />
                                </Button>{' '}
                                <DeleteModal
                                    id={item.id}
                                    username={item.username}
                                    email={item.email}
                                />
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='7' className='text-center text-muted py-4'>
                                {search
                                    ? <>No chat users found matching <strong>"{search}"</strong>.</>
                                    : 'No chat users found.'
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
