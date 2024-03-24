import React, { useState, useEffect } from 'react'
import { Table,Button, Badge } from 'react-bootstrap'
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
    const url = store.url + '/users' // set the index url to /api/users
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
                console.log(response)
                setItems(response.data.users) // get the data
                store.setValue('refresh', false ) // reset the refresh state to false
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })
      },
        [
            store.getValue('url'), // listener when url changed by pagination click
            store.getValue('refresh') // listener when create / update / delete / search performed
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
                        <th style={{ 'width': '20px'}}><FontAwesomeIcon icon={['fas', 'hashtag']} />{' '}</th>
                        <th><FontAwesomeIcon icon={['fas', 'briefcase']} />{' '}Role</th>
                        <th><FontAwesomeIcon icon={['fas', 'person']} />{' '}Name</th>
                        <th><FontAwesomeIcon icon={['fas', 'envelope']} />{' '}Email</th>
                        <th><FontAwesomeIcon icon={['fas', 'clock']} />{' '}Created At</th>
                        <th className='text-center'><FontAwesomeIcon icon={['fas', 'bolt']} /></th>
                    </tr>
                </thead>

                <tbody>
                    {items?.data?.map((item,index) => (
                        <tr key={index}>
                            <td><span className="badge bg-primary">{item.id}</span></td>
                            <td style={{'width':'80px'}}>
                                {item.roles?.map((role, index) => (
                                    <React.Fragment key={index}>
                                       {' '}<Badge bg='secondary'>{role.name}</Badge>
                                    </React.Fragment>
                                ))}
                            </td>
                            <td>{item.name}</td>
                            <td style={{'width':'150px'}}>{item.email}</td>
                            <td style={{'width':'180px'}}>{item.created_at}</td>
                            <td className='text-center' style={{'width':'200px'}}><EditModal id={item.id} />{' '}<DeleteModal id={item.id} /> </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <PaginatorLink store={store} items={items} />
        </div>
    );
};
export default Index