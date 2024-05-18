import { Link, useParams } from 'react-router-dom'
import axios from '../../../libs/axios'
import React, { useState, useEffect } from 'react'
import useStore from '../../store'

import BreadCrumb from './components/BreadCrumb'
import Data from './components/Data'
import Pagination from './components/Pagination'

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
                setTitle(response.title)
                setAncestors(response.data.ancestors.ancestors)
                setData(response.data.item.data)
                setLinks(response.data.item.links)
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })
        },[parentId] 
      ) // useEffect()
   
    return(
        <>
            <BreadCrumb items={ancestors} />
            <Data />
            <Pagination />
        </>
    )
}
export default Index
  