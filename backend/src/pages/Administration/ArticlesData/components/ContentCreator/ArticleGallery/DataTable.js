import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import useStore from '../../../../../store'
import axios from '../../../../../../libs/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DataTable = ({ article_data_id }) => {
    const store = useStore()
    const url = store.url + '/article-galleries/' + article_data_id
    const [uploading, setUploading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [items, setItems] = useState([])
    const fileRef = useRef(null)

    const serverUrl = process.env.REACT_APP_SERVER_URL
    const path = `${serverUrl}/storage/article_galleries`

    useEffect(() => {
        axios({ method: 'get', url })
            .then(response => {
                setRefresh(false)
                setItems(response.data.article_galleries)
            })
            .catch(error => console.warn(error))
    }, [refresh])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('article_gallery', file)
        formData.append('article_data_id', article_data_id)

        axios({ method: 'post', url: `${store.url}/article-galleries`, data: formData })
            .then(() => setRefresh(true))
            .catch(error => {
                if (error.response?.status === 422) {
                    console.warn(error.response.data.errors)
                }
            })
            .finally(() => {
                setUploading(false)
                if (fileRef.current) fileRef.current.value = ''
            })
    }

    const handleDeleteClick = (id) => {
        const formData = new FormData()
        formData.append('_method', 'delete')

        axios({ method: 'post', url: `${store.url}/article-galleries/${id}`, data: formData })
            .then(() => setRefresh(true))
            .catch(error => console.warn(error))
    }

    return (
        <div>
            <Table hover responsive>
                <thead className='table-light'>
                    <tr>
                        <th className='text-center' style={{ width: '80px' }}><FontAwesomeIcon icon={['fas', 'image']} /></th>
                        <th className='text-start'>Filename</th>
                        <th className='text-center' style={{ width: '80px' }}><FontAwesomeIcon icon={['fas', 'bolt']} /></th>
                    </tr>
                </thead>

                <tbody>
                    {items?.map((item) => (
                        <tr key={item.id}>
                            <td className='text-center align-middle'>
                                {item.filename && /\.(jpg|jpeg|gif|png|webp)$/i.test(item.filename) ? (
                                    <img
                                        className='rounded'
                                        src={`${path}/${item.filename}`}
                                        alt={item.filename}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={['fas', 'file']} className='text-secondary' />
                                )}
                            </td>
                            <td className='align-middle'>
                                <small>{item.filename}</small>
                            </td>
                            <td className='align-middle text-center'>
                                <Button
                                    size='sm'
                                    onClick={() => handleDeleteClick(item.id)}
                                    variant='outline-danger'>
                                    <FontAwesomeIcon icon={['fas', 'trash']} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {items?.length === 0 && (
                        <tr>
                            <td colSpan='3' className='text-center text-muted py-4'>No images in gallery</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <hr />
            <div className='d-flex align-items-center gap-2'>
                <Form.Control
                    ref={fileRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                {uploading && <FontAwesomeIcon icon={['fas', 'spinner']} spin />}
            </div>
        </div>
    )
}
export default DataTable
