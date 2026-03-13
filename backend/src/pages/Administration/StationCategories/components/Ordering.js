import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

export default function Ordering({ id, direction, disabled }) {
    const { url: apiBase } = useStore()
    const setRefresh = useStore((s) => s.setRefresh) // Using global store for refresh

    const handleClick = () => {
        axios({
            method: 'patch',
            url: `${apiBase}/station-categories/ordering/${id}`,
            data: { direction }
        })
            .then(() => {
                // Trigger refresh through global store
                setRefresh && setRefresh()
            })
            .catch((error) => console.warn(error))
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
