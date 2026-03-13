import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useFooterStore from '../store'

const Ordering = ({ footerLink, isLoading = false }) => {
    const { url: apiBase } = useStore()
    const setRefresh = useFooterStore((s) => s.setRefresh)

    const handleOrdering = async (direction) => {
        try {
            const response = await axios({
                method: 'get',
                url: `${apiBase}/footer-links/ordering/${footerLink.id}?direction=${direction}`,
            })
            setRefresh()
        } catch (error) {
            console.error('Ordering failed:', error)
        }
    }

    return (
        <div className='d-flex gap-1'>
            <Button
                size='sm'
                variant='outline-secondary'
                onClick={() => handleOrdering('up')}
                disabled={isLoading}
                className='py-1 px-2'
                style={{ fontSize: '0.75rem' }}
                title='Move up'
            >
                <FontAwesomeIcon icon={['fas', 'arrow-up']} />
            </Button>
            <Button
                size='sm'
                variant='outline-secondary'
                onClick={() => handleOrdering('down')}
                disabled={isLoading}
                className='py-1 px-2'
                style={{ fontSize: '0.75rem' }}
                title='Move down'
            >
                <FontAwesomeIcon icon={['fas', 'arrow-down']} />
            </Button>
        </div>
    )
}

export default Ordering
