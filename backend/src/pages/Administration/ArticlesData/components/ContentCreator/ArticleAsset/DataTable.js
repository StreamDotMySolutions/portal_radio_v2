import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import useStore from '../../../../../store'
import axios from '../../../../../../libs/axios'
import PaginatorLink from '../../../../../../libs/PaginatorLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DataTable = () => {
    const store = useStore()
    const { parentId } = useParams()
    const url = store.url + '/article-assets/' + parentId
    const [uploading, setUploading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [items, setItems] = useState([])
    const fileRef = useRef(null)

    const serverUrl = process.env.REACT_APP_SERVER_URL
    const path = `${serverUrl}/storage/article_assets`

    useEffect(() => {
        axios({ method: 'get', url: store.getValue('url') || url })
            .then(response => {
                setRefresh(false)
                setItems(response.data.article_assets)
                store.setValue('refresh', false)
            })
            .catch(error => console.warn(error))
    }, [refresh])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('article_asset', file)
        formData.append('article_id', parentId)
        formData.append('_method', 'post')

        axios({ method: 'post', url: `${store.url}/article-assets`, data: formData })
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

    
    const handleCopyClick = (value) => {
        navigator.clipboard.writeText(value)
            .then(() => {
               // console.log('Text copied to clipboard:', value);
                // Optionally, you can show a message to the user indicating the successful copy.
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
            <Table>
                <thead>
                    <tr>
                        <th className='text-center' style={{ 'width': '20px'}}><FontAwesomeIcon icon={['fas', 'hashtag']} /></th>
                    
                        <th className='text-center' style={{ 'width': '100px'}}><FontAwesomeIcon icon={['fas', 'image']} /></th>
                        <th className='text-start' style={{ 'width': '100vH'}}>URL</th>
                        <th className='text-center' style={{ 'width': '100px'}}><FontAwesomeIcon icon={['fas', 'bolt']} /></th>
                    </tr>
                </thead>

                <tbody>
                    {items?.data?.map((item,index) => (
                       
                        <tr key={index}>
                            <td><span className="badge bg-primary">{item.id}</span></td>
                 
                            <td>
                               {/* <img     
                                    className='img-fluid rounded' 
                                    src={`${store.server}/storage/article_assets/${item.filename}`} 
                                    alt="Image" 
                                /> */}

                                {item.filename && /\.(jpg|gif|png)$/.test(item.filename) ? (
                                    <img
                                        className='img-fluid rounded'
                                        src={`${path}/${item.filename}`}
                                        alt="Image"
                                    />
                                ) : (
                                    // Render something else if the filename extension is not jpg, gif, or png
                                    <div>Not an image</div>
                                )}

       
                            </td>
                            <td className="align-middle">
                                <Form.Control 
                                    value={`/storage/article_assets/${item.filename}`} 
                                    style={{'backgroundColor':'lightCyan'}}
                                />
                            </td>
                            <td className="align-middle text-center" style={{width:"200px"}}>
                                {/* <Button 
                                    size='sm' 
                                    onClick={() => handleCopyClick(`/storage/article_assets/${item.filename}`)}
                                    variant='outline-primary'>
                                    <FontAwesomeIcon icon={['fas', 'copy']} />
                                </Button>
                                {' '} */}
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
            <PaginatorLink store={store} items={items} />
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