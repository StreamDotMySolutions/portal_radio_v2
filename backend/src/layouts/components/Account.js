import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuthStore from '../../pages/Auth/stores/AuthStore';

const Account = () => {
    const store = useAuthStore();
    const username = store.user?.name || store.user?.email || 'Account';

    return (
        <NavDropdown
            className='ms-auto'
            title={
                <span>
                    <FontAwesomeIcon icon={['fas', 'user-circle']} className='me-2' />
                    {username}
                </span>
            }
            align='end'
        >
            <NavDropdown.Item as={NavLink} to='/account'>
                <FontAwesomeIcon icon={['fas', 'id-card']} className='me-2 text-secondary' />
                My Profile
            </NavDropdown.Item>

            <NavDropdown.Divider />

            <NavDropdown.Item as={NavLink} to='/sign-out'>
                <FontAwesomeIcon icon={['fas', 'right-from-bracket']} className='me-2 text-danger' />
                <span className='text-danger'>Sign Out</span>
            </NavDropdown.Item>
        </NavDropdown>
    );
};

export default Account;
