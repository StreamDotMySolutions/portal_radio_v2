import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useStationCategoriesStore from '../store'

export default function Ordering({ id, direction, disabled }) {
    const { url: apiBase } = useStore()
    const setRefresh = useStationCategoriesStore((s) => s.setRefresh)

    const handleClick = () => {
        axios({
            method: 'get',
            url: `${apiBase}/station-categories/ordering/${id}?direction=${direction}`
        })
            .then((response) => {
                console.log('Order changed:', response.data)
                setRefresh()
            })
            .catch((error) => {
                console.error('Ordering error:', error.response?.data || error.message)
            })
    }

    const icon = direction === 'up' ? 'arrow-up' : 'arrow-down'

    return (
        <Button
            variant="outline-secondary"
            size="sm"
            disabled={disabled}
            onClick={handleClick}
            title={direction === 'up' ? 'Move up' : 'Move down'}
        >
            <FontAwesomeIcon icon={['fas', icon]} />
        </Button>
    )
}
