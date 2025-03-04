import React, { useState, useEffect } from 'react'
import { Table,Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
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
    const url = store.url + '/vods/node/' + parentId // set the index url to /api/vods/node/{parentId}
    const [items, setItems] = useState([]) // data placeholder
    
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const path = `${serverUrl}/storage/vods`
    
    // to get items data
    // console.log( store.getValue('url'))
    // console.log( parentId )

    // if user browsing the node
    useEffect( () => {
        store.setValue('url', url)
    },[parentId])
    
    useEffect( () => 
        {
            // console.log(url)
            // console.log(  store.getValue('url') )

            
            // modified axios to prepend Bearer Token on header
            axios( 
                {
                    method: 'get', // method is GET
                    url: store.getValue('url')  ?  store.getValue('url') : url
                } 
            )
            .then( response => { // response block
                console.log(response)
                setItems(response.data.vods) // get the data
                store.setValue('refresh', false ) // reset the refresh state to false
                
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



    return (
        <div>
    
            <CreateButton>
                <CreateModal />
            </CreateButton>
            <Table>
                <thead>
                    <tr>
                        <th className='text-center' style={{ 'width': '20px'}}><FontAwesomeIcon icon={['fas', 'hashtag']} /></th>
                        <th className='text-center' style={{ 'width': '50px'}}>Ordering</th>
                  
                        <th>Name</th>
                        <th  style={{ 'width': '230px'}} className='text-center'> <FontAwesomeIcon icon={['fas', 'bolt']} /></th>
                    </tr>
                </thead>

                <tbody>
                    {items?.data?.map((item,index) => (
                        
                        <tr key={index}>
                            <td><span className="badge bg-primary">{item.id}</span></td>
                            <td className='text-center' style={{'width':'100px'}}>

                                <Ordering id={item.id} direction='up' disabled={index === 0}/>
                                {' '}
                                <Ordering id={item.id} direction='down' disabled={index === items.data.length - 1 }/>
                            
                            </td>
                           
                            <td>
                  
                                {item.type === 'folder' ?
                                    <FontAwesomeIcon className='me-2 text-warning' icon={['fas', 'fa-folder']} /> 
                                :
                                    <FontAwesomeIcon className='me-2 text-secondary' icon={['fas', 'fa-file']} />
                                }

                                {item.type == 'file' ? (
                                    <a target='_blank' href={`${path}/${item.name}`}>{item.name}</a>    
                                ) : (
                                    <Link to={`/administration/vods/${item.id}`}>{item.name}</Link>  
                                )}
                              
                            </td>
                            <td className='text-center'>
                               
                     
                                    
                                
                                {' '}
                                {/* <EditModal id={item.id} /> */}
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