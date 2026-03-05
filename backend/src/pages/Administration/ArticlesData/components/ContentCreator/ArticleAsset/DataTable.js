import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Form, Pagination } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import useStore from '../../../../../store'
import axios from '../../../../../../libs/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DataTable = () => {
    const store = useStore()
    const { parentId } = useParams()
    const baseUrl = store.url + '/article-assets/' + parentId
    const [uploading, setUploading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [items, setItems] = useState([])
    const [copiedId, setCopiedId] = useState(null)
    const [fetchUrl, setFetchUrl] = useState(baseUrl)
    const fileRef = useRef(null)

    const serverUrl = process.env.REACT_APP_SERVER_URL
    const path = `${serverUrl}/storage/article_assets`

    useEffect(() => {
        axios({ method: 'get', url: fetchUrl })
            .then(response => {
                setRefresh(false)
                setItems(response.data.article_assets)
            })
            .catch(error => console.warn(error))
    }, [refresh, fetchUrl])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('article_asset', file)
        formData.append('article_id', parentId)

        axios({ method: 'post', url: `${store.url}/article-assets`, data: formData })
            .then(() => { setFetchUrl(baseUrl); setRefresh(true) })
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

    const handleCopyClick = (filename, id) => {
        navigator.clipboard.writeText(`${serverUrl}/storage/article_assets/${filename}`)
            .then(() => {
                setCopiedId(id)
                setTimeout(() => setCopiedId(null), 2000)
            })
            .catch((error) => {
                console.error('Failed to copy text to clipboard:', error);
            });
    };

    const handleDeleteClick = (id) => {
        const formData = new FormData() // data container  
        
        // Laravel special
        formData.append('_method', 'delete'); // get|post|put|patch|delete

         // send to Laravel
         axios({ 
                method: 'post', 
                url: `${store.url}/article-assets/${id}`,
                data: formData
           })
           .then( response => { // success 200
                setRefresh(true)
           })
           .catch( error => {
                console.warn(error)
           })
    }


    return (
        <div>
            <Table hover responsive>
                <thead className='table-light'>
                    <tr>
                        <th className='text-start'>Filename</th>
                        <th className='text-center' style={{ width: '120px' }}><FontAwesomeIcon icon={['fas', 'bolt']} /></th>
                    </tr>
                </thead>

                <tbody>
                    {items?.data?.map((item) => (
                        <tr key={item.id}>
                            <td className="align-middle">
                                {item.filename && /\.(jpg|jpeg|gif|png|webp)$/i.test(item.filename) ? (
                                    <img
                                        className='rounded me-2'
                                        src={`${path}/${item.filename}`}
                                        alt={item.filename}
                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={['fas', 'file']} className='me-2 text-secondary' />
                                )}
                                <small>{item.filename}</small>
                            </td>
                            <td className="align-middle text-center">
                                <Button
                                    size='sm'
                                    variant={copiedId === item.id ? 'success' : 'outline-secondary'}
                                    onClick={() => handleCopyClick(item.filename, item.id)}
                                    className='me-1'>
                                    <FontAwesomeIcon icon={['fas', copiedId === item.id ? 'check' : 'copy']} />
                                </Button>
                                <Button
                                    size='sm'
                                    onClick={() => handleDeleteClick(item.id)}
                                    variant='outline-danger'>
                                    <FontAwesomeIcon icon={['fas', 'trash']} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {items?.last_page > 1 && (
                <div className="d-flex">
                    <div className="ms-auto">
                        <Pagination className='mb-0'>
                            {items.links?.map((page, index) => (
                                <Pagination.Item
                                    key={index}
                                    active={page.active}
                                    disabled={page.url === null}
                                    onClick={() => page.url && setFetchUrl(page.url)}>
                                    <span dangerouslySetInnerHTML={{ __html: page.label }} />
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                </div>
            )}
            <hr />
            <div className='d-flex align-items-center gap-2'>
                <Form.Control
                    ref={fileRef}
                    type='file'
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                {uploading && <FontAwesomeIcon icon={['fas', 'spinner']} spin />}
            </div>
        </div>
    );
};
export default DataTable