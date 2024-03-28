import React, { useState } from 'react';
import {Form, Container,Row,Col,Tab, Tabs, Card, Button, Alert } from 'react-bootstrap';
import Account from './components/Account';
import Profile from './components/Profile';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuthStore from '../../stores/AuthStore';
import axios from 'axios';


const SignUpForm = () => {

    const store = useAuthStore()
    const [isSuccess,setIsSuccess] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    

    const handleClickSubmit = () => {

        setIsSuccess(false)
        setIsLoading(true)
        useAuthStore.setState({ errors: null}) // reset error
        console.log(store)

  
        const formData = new FormData()

        const fields = [
            'email',
            'password',
            'password_confirmation',
            'name',
            'address',
    
          ];
          
          fields.forEach(fieldName => {
            if (store && store[fieldName]?.value) {
              formData.append(fieldName, store[fieldName].value);
            }
          });

        axios({
            url: store.store_url,
            method: 'post',
            data: formData
        })
        .then(response => {
            //console.log(response)
            setIsSuccess(true)
            setIsLoading(false)

            // reset the store value
            fields.forEach((field) => {
                useAuthStore.setState({ [field]: { value: null } });
            });
 
        })
        .catch(error => {
            setIsLoading(false)
            if( error.response?.status == 422 ){
                console.log('422')
                useAuthStore.setState({ errors:error.response.data.errors  })
            }
        })
    }

    if(isSuccess){
        return (
            <Alert variant='success'>
                Registration was succesful.
                <hr />
                <Link to='/sign-in'>
                    <FontAwesomeIcon icon="fa-solid fa-reply" /> Home
                </Link>
            </Alert>

        )
    }

    return (
        
        <Container>
            <Account />
        
        <Row className='col-12 mt-3 text-center text-lg-start mt-4 pt-2 d-flex justify-content-center'>
                <Col className='col-6'>
                <button onClick={handleClickSubmit} type="submit" className="btn btn-primary btn-lg login-button">
                { isLoading ? 
                <>
                <i className="fa-solid fa-sync fa-spin"></i>
                </>
                :
                <>
                Register
                </>
                }
                
            
            </button>
                    {' '}
                    <Link onClick={ () =>  useAuthStore.setState({ errors: null}) } to='/sign-in'>
                        <FontAwesomeIcon className='ms-4' icon="fa-solid fa-reply" /> Log In
                    </Link>

                </Col>
                    

           
        </Row>

     
        </Container>
        
    );
};

export default SignUpForm;