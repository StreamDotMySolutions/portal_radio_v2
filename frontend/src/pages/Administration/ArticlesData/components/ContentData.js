import React, { useState, useEffect } from 'react'
import { Table,Button, Col, Badge } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import useStore from '../../../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateButton from '../../../../libs/CreateButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateModal from '../modals/Create'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import ShowModal from '../modals/Show'
import Ordering from './Ordering'


const ContentData = () => {
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
            <>
                    {items?.data?.map((item,index) => (

                        
                        <Col className="d-flex justify-content-center border border-3 border-dotted bg-light mb-2" style={{ height: '150px' }}>
                            <p className="text-center m-auto ">
                                <Badge><h1>{item.title}</h1></Badge>
                                <hr />
                                <Ordering id={item.id} direction='up' disabled={index === 0}/>
                                {' '}
                                <Ordering id={item.id} direction='down' disabled={index === items.data.length - 1 }/>
                                {' '}
                                <ShowModal id={item.id} />{' '}<EditModal id={item.id} />{' '} <DeleteModal id={item.id} /> 
                            </p>
                        </Col>
                        
                        // <tr key={index}>
                        //     <td><span className="badge bg-primary">{item.id}</span></td>
                        //     <td>{item.title}</td>
                        //     <td className='text-center' style={{'width':'200px'}}>
                        //         {' '}
                        //         <EditModal id={item.id} />
                        //         {' '}
                        //         <DeleteModal id={item.id} /> 
                        //     </td>
                        // </tr>
                    ))}
            
            {/* <PaginatorLink store={store} items={items} /> */}
            </>
       
    );
};
export default ContentData