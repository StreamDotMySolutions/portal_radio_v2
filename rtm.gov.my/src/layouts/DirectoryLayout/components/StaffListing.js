
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { Badge, Image } from 'react-bootstrap';


const StaffListing = ({items}) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    

    //console.log(items)
    const staffItems = () => {
        if( items.length > 0 ){
            return items.map((item, index) => (
    
                <tr key={index}>
                    <td id="linklistp" style={{width:'50px'}} className='text-light text-center'><span className="badge badge-dark text-light">{item.number}</span></td>
                    <td id="linklistp" style={{width:'140px'}}>
                        <Link to={`/directories/${item.id}/show`}>
                            <img
                                id="gambardirektorilist"
                                src={`${serverUrl}${item.photo}`}
                                style={{ width: '140px' }}
                            />
                        </Link>
                    </td>
                    <td id="linklistp">
                    <Link to={`/directories/${item.id}/show`}>
                         <p>{item.name}</p>     
                    </Link>
                    </td>
                    <td id="linklistp" className='text-dark'>{item.occupation}</td>
                    <td id="linklistp" className='text-dark'>{item.email}</td>
                    <td id="linklistp" className='text-dark'>{item.phone}</td>
                    {/* <td id="linklistp" className='text-dark'>{item.address}</td> */}
                </tr>
              
            ));
        }
    }
    if(items.length > 0 ){
        return (

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
                        {/* <th style={{ color: 'white' }}>ALAMAT</th> */}
                    </tr>
                </thead>
                <tbody>
                    {staffItems()}
                </tbody>
            </table>
        </div>
        );

    }
   
};

export default StaffListing;