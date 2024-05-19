import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Data = ({items}) => {

    //console.log(items)

    const contentItems = () => {
        if (items.length > 0) {
            return items.map((item, index) => (
                <tr key={index}>
                    <td><Badge>{item.id}</Badge></td>
                    <td>

                        {item.type === 'folder' && 
                            <FontAwesomeIcon className='me-2 text-warning' icon={['fas', 'fa-folder']} /> 
                        }
                        {item.type === 'spreadsheet' && 
                            <FontAwesomeIcon className='me-2 text-secondary' icon={['fas', 'fa-user']} /> 
                        }
                        {item.descendants && item.descendants.length > 0 ? (
                            <Link to={`/administration/directories/${item.id}`}>
                                {item.name.toUpperCase()}
                            </Link>
                        ) : (
                            item.name.toUpperCase()
                        )}
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
                        <th>NAME</th>
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