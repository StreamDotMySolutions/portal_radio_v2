import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from 'react-bootstrap'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useProgrammesStore from '../store'

const Ordering = ({ id, direction, disabled = false }) => {
    const { url: apiBase } = useStore()
    const setRefresh = useProgrammesStore((s) => s.setRefresh)

    const handleClick = () => {
        axios(`${apiBase}/programmes/ordering/${id}?direction=${direction}`)
            .then(() => setRefresh())
            .catch((error) => console.warn(error))
    }

    return (
        <Button disabled={disabled} onClick={handleClick} size='sm' variant='outline-secondary'>
            <FontAwesomeIcon icon={['fas', `fa-caret-${direction}`]} />
        </Button>
    )
}

export default Ordering
