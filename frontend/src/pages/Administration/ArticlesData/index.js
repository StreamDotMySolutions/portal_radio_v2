import { Badge } from 'react-bootstrap'
import DataTable from "./components/DataTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'
import { Link, useParams } from 'react-router-dom'
import useStore from '../../store'
import axios from '../../../libs/axios'
import React, { useState, useEffect } from 'react'
import ContentCreator from './components/ContentCreator'

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
                        console.log(response)
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

    if(data){
        items.push({ url: `/administration/articles/${data.id}`, label: data.title })
    }
    

    return(
        <>
            <BreadCrumb items={items} />
            {/* <DataTable /> */}
            <ContentCreator />
        </>
    )
}
export default Index
  