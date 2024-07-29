import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";
import axios from "../../../../libs/axios";
import { useEffect } from "react";
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignOut = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated,
        logout: state.logout,
    }));

    useEffect(() => {
        const signOut = async () => {
            try {
                await axios({
                    url: `${process.env.REACT_APP_BACKEND_URL}/logout`,
                    method: 'post',
                });
                localStorage.removeItem('token');
                logout();
                navigate('/sign-in', { replace: true });
            } catch (error) {
                console.warn(error);
            }
        };

        signOut();
    }, [logout, navigate]);

    return (
        <Alert variant='info'>
            <h1>
                <i className="fa-solid fa-sync fa-spin"></i> {' '}Logging out...
            </h1>
            Processing.
            <hr />
            <Link to='/sign-in'>
                <FontAwesomeIcon icon="fa-solid fa-reply" /> Home
            </Link>
        </Alert>
    );
}

export default SignOut;
