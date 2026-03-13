import { Badge } from 'react-bootstrap'
import DataTable from "./components/DataTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'

const Index = () => {
    let items = [
        {
            url: '/',
            label: (
                <Badge>
                    <FontAwesomeIcon icon={['fas', 'home']} />
                </Badge>
            ),
        },
        { url: '/administration/station-categories', label: 'Station Categories' },
    ]

    return (
        <>
            <BreadCrumb items={items} />
            <DataTable />
        </>
    )
}

export default Index
