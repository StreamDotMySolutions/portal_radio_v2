import { Badge } from 'react-bootstrap'
import DataTable from "./components/DataTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'
import { Link, useParams } from 'react-router-dom'
import useStore from '../../store'
import axios from '../../../libs/axios'
import React, { useState, useEffect } from 'react'

const Index = () => {
    const { parentId } = useParams() // parentid
    const store = useStore() // store management
    const url = store.url + '/assets/' + parentId 
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
                        setAncestor(response.data.asset)
                        setData(response.data.asset)
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
        { url: '/administration/assets/0', label: 'Asset Management' },
    ];
    
    if(data.ancestors){
        data.ancestors.map((ancestor, index) => (
            items.push({ url: `/administration/assets/${ancestor.id}`, label: ancestor.name })
        ));
    }

    if(data.name){
        items.push({ url: `/administration/assets/${data.id}`, label: data.name })
    }
    

    return(
        <>
            <BreadCrumb items={items} />
            <DataTable />
        </>
    )
}
export default Index
  