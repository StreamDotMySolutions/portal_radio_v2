
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Image } from 'react-bootstrap';


const StaffListing = ({items}) => {
    

    //console.log(items)
    const staffItems = () => {
        if( items.length > 0 ){
            return items.map((item, index) => (
                // <li key={index}  className="list-group-item  border-0">
                //     <Link to={`/directories/${item.id}`}>
                //         <h3 id="linkdirektori">
                //             <FontAwesomeIcon 
                //                 icon={'fa-solid fa-person'} 
                //                 className='text-dark mr-2'>
                //             </FontAwesomeIcon>
                //             {item.name.toUpperCase()}
                //         </h3>
                //     </Link>
                // </li>
                <tr key={index}>
                    <td id="linklistp" style={{width:'50px'}} className='text-light text-center'><Badge>{item.number}</Badge></td>
                    <td id="linklistp" style={{width:'140px'}}>
                        <Link to={`/directories/${item.id}/show`}>
                            <Image 
                                id="gambardirektorilist" 
                                src={`https://www.rtm.gov.my${item.photo}`} 
                                style={{ width: '140px' }} 
                            />
                        </Link>
                    </td>
                    <td id="linklistp">
                    <Link to={`/directories/${item.id}/show`}>
                         <h3>{item.name}</h3>     
                    </Link>
                    </td>
                    <td id="linklistp" className='text-dark'>{item.occupation}</td>
                    <td id="linklistp" className='text-dark'>{item.email}</td>
                    <td id="linklistp" className='text-dark'>{item.phone}</td>
                </tr>
              
            ));
        }
    }
    if(items.length > 0 ){
        return (
            // <div>
            //     <h1>STAFF</h1>
            //     <ul className="directory-staffs list-group border border-1" >
            //         {staffItems()} 
            //     </ul>
            // </div>
            <div className="table-responsive">
            <table id="table-id" className="table responsive-table table-striped table">
                <thead>
                    <tr style={{ backgroundColor: 'rgb(6, 57, 112)' }}>
                        <th style={{ color: 'white' }}>NO.</th>
                        <th style={{ color: 'white' }}>GAMBAR</th>
                        <th style={{ color: 'white' }}>NAMA PEGAWAI</th>
                        <th style={{ color: 'white' }}>JAWATAN</th>
                        <th style={{ color: 'white' }}>EMEL</th>
                        <th style={{ color: 'white' }}>NO. TELEFON</th>
                    </tr>
                </thead>
                <tbody>
                    {staffItems()}
                    {/* Add more table rows here */}
                </tbody>
            </table>
        </div>
        );

    }
   
};

export default StaffListing;