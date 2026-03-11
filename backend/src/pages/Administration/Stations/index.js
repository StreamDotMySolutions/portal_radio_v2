import { Badge } from 'react-bootstrap'
import DataTable from "./components/DataTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'

const Index = () => {
    // items for navigation
    let items = [
        {
            url: '/',
            label: (
                <Badge>
                    <FontAwesomeIcon icon={['fas', 'home']} />
                </Badge>
            ),
        },
        { url: '/administration/stations', label: 'Station Management' },
    ]

    return (
        <>
            <BreadCrumb items={items} />
            <DataTable />
        </>
    )
}

export default Index
