import React, { useState, useEffect, useRef } from 'react'
import { Form, InputGroup, Button, ListGroup, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from './axios'

const AdminSearch = () => {
    const [query, setQuery]         = useState('')
    const [results, setResults]     = useState([])
    const [searching, setSearching] = useState(false)
    const debounceRef = useRef(null)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (query.trim().length < 2) {
            setResults([])
            return
        }

        debounceRef.current = setTimeout(async () => {
            setSearching(true)
            try {
                const response = await axios({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/articles/search?q=${encodeURIComponent(query)}` })
                setResults(response.data.results || [])
            } catch {
                setResults([])
            } finally {
                setSearching(false)
            }
        }, 400)
    }, [query])

    const clearSearch = () => { setQuery(''); setResults([]) }

    const resolveLink = (item) =>
        item.type === 'folder'
            ? `/administration/articles/${item.id}`
            : `/administration/articles-data/${item.id}`

    return (
        <div className='mb-3'>
            <InputGroup style={{ maxWidth: '400px' }}>
                <InputGroup.Text>
                    <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
                </InputGroup.Text>
                <Form.Control
                    placeholder='Global article search...'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                {query && (
                    <Button variant='outline-secondary' onClick={clearSearch}>
                        <FontAwesomeIcon icon={['fas', 'xmark']} />
                    </Button>
                )}
            </InputGroup>

            {query.trim().length >= 2 && (
                <div className='mt-2' style={{ maxWidth: '400px' }}>
                    {searching && (
                        <p className='text-muted small mb-0'>Searching...</p>
                    )}
                    {!searching && results.length === 0 && (
                        <p className='text-muted small mb-0'>No results for "<strong>{query}</strong>".</p>
                    )}
                    {!searching && results.length > 0 && (
                        <>
                            <p className='text-muted small mb-1'>{results.length} result{results.length !== 1 ? 's' : ''} found</p>
                            <ListGroup>
                                {results.map(item => (
                                    <ListGroup.Item key={item.id} className='py-2'>
                                        <FontAwesomeIcon
                                            icon={['fas', item.type === 'folder' ? 'folder' : 'file']}
                                            className={`me-2 ${item.type === 'folder' ? 'text-warning' : 'text-secondary'}`}
                                        />
                                        <Link to={resolveLink(item)} onClick={clearSearch} className='text-decoration-none'>
                                            {item.title}
                                        </Link>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default AdminSearch
