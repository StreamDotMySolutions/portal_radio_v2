import { Badge } from 'react-bootstrap'
import DataTable from "./components/DataTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'

const Index = () => {
    let items = [
        { url: '/', label: (
          <Badge>
            <FontAwesomeIcon icon={['fas', 'home']} />
          </Badge>
        )},
        { url: '/administration/complaints', label: 'Complaints Management' },
    ];

    return(
        <>
            <BreadCrumb items={items} />
            <DataTable />
        </>
    )
}
export default Index
