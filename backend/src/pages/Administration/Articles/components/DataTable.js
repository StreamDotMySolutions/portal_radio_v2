import React, { useState, useEffect } from 'react'
import { Table,Button } from 'react-bootstrap'
import { Link, parsePath, useParams } from 'react-router-dom'
import useStore from '../../../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateButton from '../../../../libs/CreateButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateModal from '../modals/Create'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const Index = () => {
    const store = useStore() // store management
    const { parentId } = useParams() // parentid
    const url = store.url + '/articles/node/' + parentId // set the index url to /api/articles/node/{parentId}
    const [items, setItems] = useState([]) // data placeholder
    
    // to get items data
    //console.log( store.getValue('url'))
    useEffect( () => 
        {
    
            let apiUrl = null

            if(parentId){
                apiUrl = url
                //store.setValue('url', null ) 
            }
            
            if(store.getValue('url')){
                apiUrl = store.getValue('url')
            }
            // modified axios to prepend Bearer Token on header
            axios( 
                {
                    method: 'get', // method is GET
                    //url: store.getValue('url') ? store.getValue('url') : url 
                    url: apiUrl 
                } 
            )
            .then( response => { // response block
                //console.log(response)
                setItems(response.data.articles) // get the data
                store.setValue('refresh', false ) // reset the refresh state to false
                //store.setValue('url', null ) // reset the refresh state to false
                
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })


      },
        [
            store.getValue('url'), // listener when url changed by pagination click
            store.getValue('refresh'), // listener when create / update / delete / search performed
            parentId // when use navigate to parent
        ] 

    ) // useEffect()


    // bt parentId
    // useEffect( () => 
    //     {
    
            
    //         // modified axios to prepend Bearer Token on header
    //         axios( 
    //             {
    //                 method: 'get', // method is GET
    //                 url: url
    //             } 
    //         )
    //         .then( response => { // response block
    //             //console.log(response)
    //             setItems(response.data.articles) // get the data
    //             store.setValue('refresh', false ) // reset the refresh state to false
    //             //store.setValue('url', null ) // reset the refresh state to false
                
    //         })
    //         .catch( error => { // error block
    //             console.warn(error) // output to console
    //         })


    //   },
    //     [
    //         parentId // when use navigate to parent
    //     ] 

    // ) // useEffect()




    return (
        <div>
        
            <CreateButton>
                <CreateModal />
            </CreateButton>
            <Table>
                <thead>
                    <tr>
                        <th className='text-center' style={{ 'width': '20px'}}><FontAwesomeIcon icon={['fas', 'hashtag']} /></th>
                        <th className='text-center'>Ordering</th>
                        <th className='text-center' style={{ 'width': '100px'}}>Active ?</th>
                        <th>Title</th>
                        <th  style={{ 'width': '230px'}} className='text-center'> <FontAwesomeIcon icon={['fas', 'bolt']} /></th>
                    </tr>
                </thead>

                <tbody>
                    {items?.data?.map((item,index) => (
                        
                        <tr key={index}>
                            <td><span className="badge bg-primary">{item.id}</span></td>
                            <td className='text-center' style={{'width':'100px'}}>

                                <Ordering id={item.id} direction='up' />
                                {' '}
                                <Ordering id={item.id} direction='down'/>
                            
                            </td>
                            <td className='text-center'>{item.article_setting.active == 1 ? <FontAwesomeIcon className='text-success'  icon={['fas', 'check']} /> : <FontAwesomeIcon className='text-danger' icon={['fas', 'stop']} />  }</td>
                            <td>
                                {item.descendants && item.descendants.length > 0 ?
                                    <FontAwesomeIcon className='me-2 text-warning' icon={['fas', 'fa-folder']} /> 
                                :
                                    <FontAwesomeIcon className='me-2 text-secondary' icon={['fas', 'fa-file']} />
                                }
                                <Link to={`/administration/articles/${item.id}`}>{item.title}</Link>    
                            </td>
                            <td className='text-center'>
                               
                                    <Link to={`/administration/articles/${item.id}`}>
                                        <Button size='sm' variant='outline-secondary'>
                                            <FontAwesomeIcon className='text-info'  icon={['fas', 'fa-folder-plus']} />{' '}
                                        </Button>
                                    </Link>
                                {' '}
                                   
                                    <Link to={`/administration/articles-data/${item.id}`}>
                                        <Button 
                                            //disabled={item.descendants.length > 0 }
                                            size='sm' variant='outline-primary'>
                                            <FontAwesomeIcon icon={['fas', 'pen']} />{' '}
                                        </Button>
                                    </Link>
                                    
                                
                                {' '}
                                <EditModal id={item.id} />
                                {' '}
                                <DeleteModal id={item.id} /> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <PaginatorLink store={store} items={items} />
        </div>
    );
};
export default Index