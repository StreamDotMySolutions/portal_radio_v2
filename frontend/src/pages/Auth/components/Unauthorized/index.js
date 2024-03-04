import React from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Unauthorized = () => {
    return (
    <Alert variant='warning'>
        <h1><FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" /> {' '}Akses Terhad</h1>
        Akaun anda tidak mempunyai akses ke sistem.
        <hr />
        <Link to='/sign-in'>
            <FontAwesomeIcon icon="fa-solid fa-reply" /> Laman utama
        </Link>
    </Alert>
    );
};

export default Unauthorized;