import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from 'react-bootstrap'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

const Ordering = ({ id, direction, disabled = false }) => {
    const store = useStore()

    const handleClick = () => {
        axios(`${store.url}/directories/ordering/${id}?direction=${direction}`)
            .then(() => store.setValue('refresh', true))
            .catch(error => console.warn(error))
    }

    return (
        <Button disabled={disabled} onClick={handleClick} size='sm' variant='outline-secondary'>
            <FontAwesomeIcon icon={['fas', `caret-${direction}`]} />
        </Button>
    )
}

export default Ordering
