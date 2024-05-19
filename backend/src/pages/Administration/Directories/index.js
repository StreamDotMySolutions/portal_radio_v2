import { useParams } from 'react-router-dom'
import axios from '../../../libs/axios'
import React, { useState, useEffect } from 'react'
import useStore from './store' // global store

import Data from './components/Data'
import BreadCrumbMenu from './components/BreadCrumbMenu'
import PaginationLinks from './components/PaginationLinks'

const Index = () => {

    const { parentId } = useParams() // parentid
    const store = useStore() // store management
    const url = store.url + '/directories/' + parentId 

    const [title,setTitle] = useState('')
    const [ancestors,setAncestors] = useState([])
    const [data,setData] = useState([])
    const [links,setLinks] = useState([])

        // detect parentId change
        useEffect( () => {
            //console.log('parent id updated')
            store.setValue('url',  store.url + '/directories/' + parentId )
        },[parentId])

        // pagination change
        useEffect( () => {
            //console.log('updated')
            axios(store.getValue('url') ? store.getValue('url') : url)
            .then( response => { // response block
                //console.log(response)
                setTitle(response.data.title)
                setAncestors(response.data.ancestors)
                setData(response.data.items.data)
                setLinks(response.data.items.links)
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })
            .finally(
                store.setValue('refresh', false) // modal
            )
        },  [
                store.getValue('refresh'), // modal
                store.getValue('url') // pagination
            ] 
      ) // useEffect()

   
    return(
        <>
            <BreadCrumbMenu items={ancestors} />
            <Data items={data} />
            <PaginationLinks items={links} />
        </>
    )
}
export default Index
  