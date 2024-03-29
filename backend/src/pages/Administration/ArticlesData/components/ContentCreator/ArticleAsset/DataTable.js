import React, { useState, useEffect } from 'react'
import { Table,Button,Form } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import useStore from '../../../../../store'
import axios from '../../../../../../libs/axios'
import PaginatorLink from '../../../../../../libs/PaginatorLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InputFile,appendFormData } from '../../../../../../libs/FormInput'


const DataTable = () => {
    const store = useStore() // store management
   
    const { parentId } = useParams() // parentid
    const url = store.url + '/article-assets/' + parentId // set the index url to /api/article-assets/{parentId}
    const [isLoading, setIsLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [items, setItems] = useState([]) // data placeholder
    
    // to get items data
    useEffect( () => 
        {
            // modified axios to prepend Bearer Token on header
            axios( 
                {
                    method: 'get', // method is GET
                    url: store.getValue('url') ? store.getValue('url') : url
                } 
            )
            .then( response => { // response block
                //console.log(response)
                setRefresh(false)
                setItems(response.data.article_assets)
                //setItems(response.data.articles) // get the data
                store.setValue('refresh', false ) // reset the refresh state to false
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })
      },[refresh] ) // useEffect()

    // upload
    useEffect( () => {
        if(store.getValue('article_asset') !== null && store.getValue('article_asset') !== ''){
            //console.log('upload')

            const formData = new FormData();
            const dataArray = [
                { key: 'article_asset', value: store.getValue('article_asset') },
                { key: 'article_id', value: parentId },
            ];
            
            appendFormData(formData, dataArray);

            // Laravel special
            formData.append('_method', 'post'); // get|post|put|patch|delete

            // send to Laravel
            axios({ 
                method: 'post', 
                url: `${store.url}/article-assets`,
                data: formData
            })
            .then( response => { // success 200
                //console.log(response)
                store.setValue('article_asset', null )
                setRefresh(true)
            })
            .catch( error => {
                //console.warn(error)
                
                if( error.response?.status == 422 ){ // detect 422 errors by Laravel
                    console.warn(error.response.data.errors)
                    store.setValue('errors', error.response.data.errors ) // set the errors to store
                }

            })
        }

    },[store.getValue('article_asset')])

    
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
                               <img     
                                    
                                    className='img-fluid rounded' 
                                    src={`${store.server}/storage/article_assets/${item.filename}`} alt="Image" />
       
                            </td>
                            <td className="align-middle">
                                <Form.Control 
                                    value={`${store.server}/storage/article_assets/${item.filename}`} 
                                    style={{'backgroundColor':'lightCyan'}}
                                />
                            </td>
                            <td className="align-middle text-center">
                                <Button 
                                    size='sm' 
                                    onClick={() => handleCopyClick(`<img class="img-fluid" src="${store.server}/storage/article_assets/${item.filename}" />`)}
                                    variant='outline-primary'>
                                    <FontAwesomeIcon icon={['fas', 'copy']} />
                                </Button>
                                {' '}
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
            <InputFile
                fieldName='article_asset' 
                placeholder='Choose image'  
                icon='fa-solid fa-image'
                isLoading={isLoading}
            />
        </div>
    );
};
export default DataTable