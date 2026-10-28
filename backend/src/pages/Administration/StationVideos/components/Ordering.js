import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationVideosStore from '../store'

const Ordering = ({ id, direction, disabled = false }) => {
    const { url: apiBase } = useStore()
    const setRefresh = useStationVideosStore((s) => s.setRefresh)

    const handleClick = () => {
        axios(`${apiBase}/station-videos/ordering/${id}?direction=${direction}`)
            .then(() => setRefresh())
            .catch((error) => console.warn(error))
    }

    return (
        <Button disabled={disabled} onClick={handleClick} size='sm' variant='outline-secondary'>
            <FontAwesomeIcon icon={['fas', `caret-${direction}`]} />
        </Button>
    )
}

export default Ordering
