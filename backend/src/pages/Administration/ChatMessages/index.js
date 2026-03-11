import { useState, useEffect, useRef, useCallback } from 'react'
import { Badge, Button, Form, InputGroup, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'
import useStore from '../../store'
import axios from '../../../libs/axios'
import PaginatorLink from '../../../libs/PaginatorLink'

const Index = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/chat-messages`

    const [items, setItems] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)
    const [paginatorUrl, setPaginatorUrl] = useState(null)
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')
    const [showClearModal, setShowClearModal] = useState(false)
    const [clearAcknowledged, setClearAcknowledged] = useState(false)
    const [isClearing, setIsClearing] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const breadcrumbItems = [
        { url: '/', label: (
            <Badge>
                <FontAwesomeIcon icon={['fas', 'home']} />
            </Badge>
        )},
        { url: '', label: 'Chat Management' }
    ]

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(query)
            setPaginatorUrl(null)
        }, 400)
        return () => clearTimeout(timer)
    }, [query])

    const effectiveUrl = paginatorUrl
        ?? (search ? `${baseUrl}?search=${encodeURIComponent(search)}` : baseUrl)

    useEffect(() => {
        axios({ method: 'get', url: effectiveUrl })
            .then((response) => setItems(response.data.messages))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search])

    const paginatorAdapter = {
        setValue: (key, value) => {
            if (key === 'url') setPaginatorUrl(value)
        },
    }

    const handleDelete = (id) => {
        setDeletingId(id)
        axios({ method: 'delete', url: `${apiBase}/chat-messages/${id}` })
            .then(() => setRefreshKey(k => k + 1))
            .catch((error) => console.warn(error))
            .finally(() => setDeletingId(null))
    }

    const handleClearAll = () => {
        setIsClearing(true)
        axios({ method: 'delete', url: `${apiBase}/chat-messages` })
            .then(() => {
                setRefreshKey(k => k + 1)
                setShowClearModal(false)
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsClearing(false))
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />

            {/* Toolbar */}
            <div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
                <InputGroup style={{ maxWidth: '340px' }}>
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder='Search by message or username...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <Button variant='outline-secondary' onClick={() => setQuery('')}>
                            <FontAwesomeIcon icon={['fas', 'xmark']} />
                        </Button>
                    )}
                </InputGroup>

                <Button
                    variant='danger'
                    onClick={() => { setShowClearModal(true); setClearAcknowledged(false) }}
                    disabled={!items?.data?.length}
                >
                    <FontAwesomeIcon icon={['fas', 'trash-can']} className='me-1' />
                    Clear All
                </Button>
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} message{items.total !== 1 ? 's' : ''}
                    {search && <> matching <strong>"{search}"</strong></>}
                </p>
            )}

            {/* Messages list */}
            <div className='d-flex flex-column gap-2'>
                {items?.data?.map((msg) => (
                    <div
                        key={msg.id}
                        className='d-flex align-items-start gap-3 p-3 border rounded'
                        style={{ background: '#fff' }}
                    >
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className='d-flex align-items-baseline gap-2 mb-1'>
                                <strong style={{ color: msg.color, fontSize: '0.9rem' }}>
                                    {msg.username}
                                </strong>
                                <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                                    {msg.created_at}
                                </span>
                                <span className='text-muted' style={{ fontSize: '0.7rem' }}>
                                    #{msg.id}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                                {msg.message}
                            </div>
                        </div>
                        <Button
                            size='sm'
                            variant='outline-danger'
                            onClick={() => handleDelete(msg.id)}
                            disabled={deletingId === msg.id}
                            title='Delete message'
                        >
                            <FontAwesomeIcon icon={['fas', 'trash']} />
                        </Button>
                    </div>
                ))}
                {items?.data?.length === 0 && (
                    <div className='text-center text-muted py-4'>
                        {search
                            ? <>No messages found matching <strong>"{search}"</strong>.</>
                            : 'No messages found.'
                        }
                    </div>
                )}
            </div>

            <div className='mt-3'>
                <PaginatorLink store={paginatorAdapter} items={items} />
            </div>

            {/* Clear All Modal */}
            <Modal show={showClearModal} onHide={() => setShowClearModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Clear All Messages</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to delete <strong>all chat messages</strong>?
                    </p>
                    <p className='text-danger small'>
                        This action cannot be undone. All {items?.total ?? 0} messages will be permanently deleted.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Check
                        className='me-4'
                        reverse
                        disabled={isClearing}
                        label='Acknowledge'
                        type='checkbox'
                        checked={clearAcknowledged}
                        onChange={(e) => setClearAcknowledged(e.target.checked)}
                    />
                    <Button variant='secondary' disabled={isClearing} onClick={() => setShowClearModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant='danger'
                        disabled={isClearing || !clearAcknowledged}
                        onClick={handleClearAll}
                    >
                        {isClearing ? 'Clearing...' : 'Delete All'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Index
