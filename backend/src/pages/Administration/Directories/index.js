import { Link, useParams } from 'react-router-dom'
import axios from '../../../libs/axios'
import React, { useState, useEffect } from 'react'
import useStore from '../../store'

import Data from './components/Data'
import Pagination from './components/Pagination'
import { Breadcrumb,BreadcrumbItem } from 'react-bootstrap'
import BreadCrumbMenu from './components/BreadCrumbMenu'

const Index = () => {

  const { parentId } = useParams() // parentid
    const store = useStore() // store management
    const url = store.url + '/directories/' + parentId 

    const [title,setTitle] = useState('')
    const [ancestors,setAncestors] = useState([])
    const [data,setData] = useState([])
    const [links,setLinks] = useState([])

        useEffect( () => {  
            axios(url)
            .then( response => { // response block
                console.log(response)
                setTitle(response.data.title)
                setAncestors(response.data.ancestors)
                setData(response.data.items.data)
                setLinks(response.data.items.links)
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })
        },[parentId] 
      ) // useEffect()

   
    return(
        <>
            <BreadCrumbMenu items={ancestors} />
            <Data items={data} />
            <Pagination items={links} />
        </>
    )
}
export default Index
  