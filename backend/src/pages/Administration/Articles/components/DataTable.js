import React, { useState, useEffect } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
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

    const [items, setItems] = useState([])

    // Reset URL when parentId changes
    useEffect(() => {
        store.setValue('url', `${store.url}/articles/node/${parentId}`)
    }, [parentId])

    // Fetch when url or refresh changes
    useEffect(() => {
        const url = store.getValue('url') ?? `${store.url}/articles/node/${parentId}`
        axios({ method: 'get', url })
            .then(response => {
                setItems(response.data.articles)
                store.setValue('refresh', false)
            })
            .catch(error => console.warn(error))
    }, [store.getValue('url'), store.getValue('refresh')])

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
            <div className='d-flex justify-content-end mb-3'>
                <CreateModal />
            </div>

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
<th style={{ width: '110px' }}>Order</th>
                        <th style={{ width: '100px' }}>Status</th>
                        <th className='text-center' style={{ width: '80px' }}>Type</th>
                        <th>Title</th>
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
                                    ? <FontAwesomeIcon className='text-warning' icon={['fas', 'folder']} />
                                    : <FontAwesomeIcon className='text-secondary' icon={['fas', 'file']} />
                                }
                            </td>
                            <td>
                                <Link to={`/administration/articles/${item.id}`}>{item.title}</Link>
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
                            <td colSpan='6' className='text-center text-muted py-4'>No articles found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <PaginatorLink store={store} items={items} />
        </div>
    )
}

export default DataTable
