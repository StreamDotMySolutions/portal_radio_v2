import { Navigate, useNavigate } from "react-router-dom"
//import { useAuthStore } from "../../../../stores/AuthStore"
import useAuthStore from "../../stores/AuthStore";
import axios from "../../../../libs/axios"
import { useState } from "react"
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignOut = () =>  {
    // const isLoggedIn = useAuthStore( (state) => state.isLoggedIn ) // get state
    // const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn) // set state
    const store = useAuthStore()
    axios({
        url:  `${process.env.REACT_APP_BACKEND_URL}/logout`,
        method: 'post',
    })
    .then( response => {
        //console.log(response)
        localStorage.removeItem('token');
        //setIsLoggedIn(false) // store
        useAuthStore.setState({isAuthenticated:false})
    })
    .catch( error => {
        console.warn(error)
    })

    //if (isLoggedIn === false) {
    if(store.isAuthenticated === false){
        window.location.href = '/sign-in';
        //return <Navigate to='/sign-in' replace />
    }

    return (<>
        <Alert variant='info'>
            <h1> <i className="fa-solid fa-sync fa-spin"></i> {' '}Sedang keluar...</h1>
            Sistem sedang memproses.
            <hr />
            <Link to='/sign-in'>
                <FontAwesomeIcon icon="fa-solid fa-reply" /> Laman utama
            </Link>
        </Alert>
    </>)
  }
  export default SignOut
