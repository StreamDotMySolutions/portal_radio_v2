import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Ordering from './Ordering'

const Data = ({items}) => {

    //console.log(items)

    const contentItems = () => {
        if (items.length > 0) {
            return items.map((item, index) => (
                <tr key={index}>
                    <td><Badge>{item.id}</Badge></td>
                    {/* <td className='text-center' style={{'width':'100px'}}>

                        <Ordering id={item.id} direction='up' disabled={index === 0}/>
                        {' '}
                        <Ordering id={item.id} direction='down' disabled={index === items.length - 1 }/>

                    </td> */}
                    <td>

                        {item.type === 'folder' && 
                            <FontAwesomeIcon className='me-2 text-warning' icon={['fas', 'fa-folder']} /> 
                        }
                        {item.type === 'spreadsheet' && 
                            <FontAwesomeIcon className='me-2 text-secondary' icon={['fas', 'fa-user']} /> 
                        }
                        {item.descendants && item.descendants.length > 0 ? (
                            <Link to={`/administration/directories/${item.id}`}>
                                {item.name}
                            </Link>
                        ) : (
                            item.name
                        )}
                    </td>
                    <td className='text-center'>
                    {item.type === 'spreadsheet' && 
                        <Button>Edit</Button>
                    }
                    </td>
                </tr>
            ));
        }
    };
    
    
    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th style={{width: '15px'}}>ID</th>
                        {/* <th>ORDERING</th> */}
                        <th>NAME</th>
                        <th className='text-center'>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {contentItems()}
                </tbody>
            </Table>
        </div>
    );
};

export default Data;