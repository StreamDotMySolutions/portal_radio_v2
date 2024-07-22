import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const DepartmentItems = ({ departments }) => {
    const [visibleChildren, setVisibleChildren] = useState({});

    const toggleChildren = (index) => {
        setVisibleChildren(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    if (!departments || departments.length === 0) {
        return null;
    }

    const half = Math.ceil(departments.length / 2);
    const firstHalf = departments.slice(0, half);
    const secondHalf = departments.slice(half);

    const renderColumn = (items, columnIndex) => (
        items.map((item, index) => {
            const itemIndex = columnIndex * half + index;
            const isVisible = visibleChildren[itemIndex];

            return (
                <div key={item.id} className="col">
                    <div className="d-flex align-items-center">
                        <Link id="linkdirektoridiv" to={`/directories/${item.id}`} className="flex-grow-1">
                            <h3 id="linkdirektori">{item.name.toUpperCase()}</h3>
                        </Link>
                        {item.children && item.children.length > 0 && (
                            <FontAwesomeIcon
                                icon={isVisible ? faMinus : faPlus}
                                onClick={() => toggleChildren(itemIndex)}
                                style={{ cursor: 'pointer', marginLeft: '10px' }}
                            />
                        )}
                    </div>
                    {isVisible && item.children.map((child) => (
                        <Link key={child.id} id="linkdirektorip" to={`/directories/${child.id}`}>
                            <p>{child.name}</p>
                        </Link>
                    ))}
                </div>
            );
        })
    );

    return (
        <div className="row">
            <div className="col-md-6">
                {renderColumn(firstHalf, 0)}
            </div>
            <div className="col-md-6">
                {renderColumn(secondHalf, 1)}
            </div>
        </div>
    );
};

export default DepartmentItems;
