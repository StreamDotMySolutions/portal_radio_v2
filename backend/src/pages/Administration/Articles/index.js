import { Alert, Badge } from 'react-bootstrap'
import DataTable from "./components/DataTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'
import { Link, useParams } from 'react-router-dom'
import useStore from '../../store'
import axios from '../../../libs/axios'
import React, { useState, useEffect } from 'react'
import AdminSearch from '../../../libs/AdminSearch'

const Index = () => {
    const { parentId } = useParams() // parentid
    const store = useStore() // store management
    const url = store.url + '/articles/' + parentId 
    const [ancestor,setAncestor] = useState(null)
    const [data,setData] = useState([])

    // to get items data

    
        useEffect( () => 
            {
                if( parentId != 0){
                    // modified axios to prepend Bearer Token on header
                    axios( 
                        {
                            method: 'get', // method is GET
                            url:  url
                        } 
                    )
                    .then( response => { // response block
                        //console.log(response)
                        setAncestor(response.data.article)
                        setData(response.data.article)
                    })
                    .catch( error => { // error block
                        console.warn(error) // output to console
                    })
                } else {
                    setAncestor(null)
                    setData([])
                }
        },
            [
                parentId // when use navigate to parent
            ] 
            
            

        ) // useEffect()
   

    // items for navigation
    let items = [
        { url: '/', label: (
          <Badge>
            <FontAwesomeIcon icon={['fas', 'home']} /> {/* fas = font awesome solid  */}
          </Badge>
        )},
        { url: '/administration/articles/0', label: 'Article Management' },
    ];
    
    if(data.ancestors){
        data.ancestors.map((ancestor, index) => (
            items.push({ url: `/administration/articles/${ancestor.id}`, label: ancestor.title })
        ));
    }

    if(data.title){
        items.push({ url: `/administration/articles/${data.id}`, label: data.title })
    }
    

    return(
        <>
            <BreadCrumb items={items} />
            <AdminSearch />

            {parentId === '0' && (
                <Alert variant='warning' className='mb-3'>
                    <Alert.Heading>
                        <FontAwesomeIcon icon={['fas', 'triangle-exclamation']} className='me-2' />
                        Compulsory Root Folders
                    </Alert.Heading>
                    <p className='mb-2'>
                        The following three root-level folders <strong>must exist</strong> and must use these exact titles.
                        They drive the public site navigation and footer menus.
                    </p>
                    <div className='d-flex flex-column gap-1'>
                        <div>
                            <Badge bg='dark' className='me-2'>MENU-1</Badge>
                            Primary navigation menu displayed on the public site header.
                        </div>
                        <div>
                            <Badge bg='dark' className='me-2'>MENU-2</Badge>
                            Secondary navigation menu displayed on the public site header.
                        </div>
                        <div>
                            <Badge bg='dark' className='me-2'>FOOTER</Badge>
                            Footer links displayed at the bottom of every public page.
                        </div>
                    </div>
                </Alert>
            )}

            <DataTable />
        </>
    )
}
export default Index
  