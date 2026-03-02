import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from 'react-bootstrap'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'

const Ordering = ({id,direction, disabled=false}) => {
    const store = useStore() // global store

    const handleClick = () => {
        //console.log(`content ${id} ordering is ${direction}`)

        // send request to laravel
        axios(`${store.url}/article-data/ordering/${id}?direction=${direction}`)
        .then( response => {
            //console.log(response)
            store.setValue('refresh', true) // trigger DataTable useEffect()
        })
        .catch( error => {
            console.warn(error)
        })
    }

    return (
    
        <Button disabled={disabled} onClick={handleClick} size='sm' variant='outline-secondary'>
            <FontAwesomeIcon icon={['fas', `caret-${direction}`]} />
        </Button>
 
    )
}
export default Ordering;