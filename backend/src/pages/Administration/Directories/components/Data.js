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
                        {item.descendants && item.descendants.length > 0 ? (
                            <Link to={`/administration/directories/${item.id}`}>
                                <strong>{item.name.toUpperCase()}</strong>
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