import React, { useState, useEffect } from 'react'
import { Table,Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import useStore from '../../../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateButton from '../../../../libs/CreateButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateModal from '../modals/Create'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'


const Index = () => {
    const store = useStore() // store management
    const { parentId } = useParams() // parentid
    const url = store.url + '/articles/node/' + parentId // set the index url to /api/articles/node/{parentId}
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
                setItems(response.data.articles) // get the data
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
                        <th style={{ 'width': '20px'}}>ID</th>
                        <th>Title</th>
                        <th className='text-center'> <FontAwesomeIcon icon={['fas', 'bolt']} /></th>
                    </tr>
                </thead>

                <tbody>
                    {items?.data?.map((item,index) => (
                        
                        <tr key={index}>
                            <td><span className="badge bg-primary">{item.id}</span></td>
                            <td>{item.title}</td>
                            <td className='text-center' style={{'width':'200px'}}>
                                { parentId == 0 && 
                                    <Link to={`/administration/articles/${item.id}`}>
                                        <Button size='sm' variant='outline-info'>
                                            <FontAwesomeIcon icon={['fas', 'list']} />
                                        </Button>
                                    </Link>
                                }
                                { parentId != 0 && 
                                    <Link to={`/administration/articles/${item.id}`}>
                                        <Button size='sm' variant='outline-primary'>
                                            <FontAwesomeIcon icon={['fas', 'pen']} />
                                        </Button>
                                    </Link>
                                }
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