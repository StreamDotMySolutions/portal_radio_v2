import React, { useState, useEffect } from 'react'
import { Table,Button, Col, Badge, Row, Container } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import useStore from '../../../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateButton from '../../../../libs/CreateButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditModal from './ContentCreator/ArticleContent/Edit'
import DeleteModal from './ContentCreator/ArticleContent/Delete'

// import CreateModal from '../modals/Create'
// import EditModal from '../modals/Edit'
// import DeleteModal from '../modals/Delete'
import ShowModal from '../modals/Show'
import Ordering from './Ordering'


const ContentData = () => {
    const store = useStore() // store management
    const { parentId } = useParams() // parentid
    const url = store.url + '/articles-data/node/' + parentId // set the index url to /api/articles/node/{parentId}
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
                // console.log(response)
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
 
                    {items?.map((item,index) => (

                        <div className='mt-2 mb-2'>
                            <Col className="d-flex justify-content-center border border-3 border-dotted bg-light mb-2 p-2">
                                <Col>
                                    <Col className="text-end">
                                        <Ordering id={item.id} direction='up' disabled={index === 0}/>
                                        {' '}
                                        <Ordering id={item.id} direction='down' disabled={index === items.length - 1 }/>
                                        {' '}
                              
                                        <EditModal id={item.article_content?.id} />
                                        {' '} 
                                        <DeleteModal id={item.id} /> 
                                  
                                    </Col>
                                   <hr />
                                            
                                    <Col className='p-3 border border-2 border-dashed' style={{'backgroundColor': 'lightcyan'}}>
                                        {/* {item.article_content?.contents} */}
                                        {/* Render HTML content */}
                                        <div dangerouslySetInnerHTML={{ __html: item.article_content?.contents }} />
                                    </Col>
                                </Col>
                            </Col>

                        </div>
                        
                    ))}
            </>
       
    );
};
export default ContentData