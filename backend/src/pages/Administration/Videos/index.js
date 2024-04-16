import { Badge } from 'react-bootstrap'
import DataTable from "./components/DataTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'

const Index = () => {


    // items for navigation
    let items = [
        { url: '/', label: (
          <Badge>
            <FontAwesomeIcon icon={['fas', 'home']} /> {/* fas = font awesome solid  */}
          </Badge>
        )},
        { url: '/administration/videos', label: 'Video Management' },
    ];
    

    

    return(
        <>
            <BreadCrumb items={items} />
            <DataTable />
        </>
    )
}
export default Index
  