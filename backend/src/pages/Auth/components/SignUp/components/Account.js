import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { Link, useParams} from 'react-router-dom'
import { Form,InputGroup,Button,Row,Col, Alert } from 'react-bootstrap'
import axios from '../../../../../libs/axios'
import useAuthStore from '../../../stores/AuthStore'

const Account = () => {
    const store = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [message, setMessage] = useState(null)
   // const [errors, setErrors] = useState(); // init from store
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordConfirmation, setPasswordConfirmation] = useState(null)

    const handleClickSubmit = () => {}

    //console.log(store.errors)
    const errors = store.errors

    return (
        <div>
                <InputGroup hasValidation>
                    <InputGroup.Text><FontAwesomeIcon icon="fa-solid fa-envelope"></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
                        placeholder='E-Mail address'
                        name='email'
                        size='lg' 
                        type="text" 
                        required 
                        isInvalid={errors?.hasOwnProperty('email')}
                        onChange={ (e) => useAuthStore.setState({ email: { value: e.target.value}} )} 
                    />

                    {
                        errors?.hasOwnProperty('email') &&
                            (
                                <Form.Control.Feedback type="invalid">   
                                { errors.email ? errors.email : null }
                                </Form.Control.Feedback>
                            )
                    }  
                </InputGroup>

                <InputGroup hasValidation className='mt-3 mb-3'>
                    <InputGroup.Text><FontAwesomeIcon icon="fa-solid fa-lock"></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
                        placeholder='Password'
                        name='password'
                        size='lg' 
                        type="text" 
                        required 
                        isInvalid={errors?.hasOwnProperty('password')}
                        onChange={ (e) => useAuthStore.setState({ password: { value: e.target.value}} )} 
                    />

                    {
                        errors?.hasOwnProperty('password') &&
                            (
                                <Form.Control.Feedback type="invalid">   
                                { errors.password ? errors.password : null }
                                </Form.Control.Feedback>
                            )
                    } 
                </InputGroup>

                <InputGroup hasValidation>
                    <InputGroup.Text><FontAwesomeIcon icon="fa-solid fa-lock"></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
                        placeholder='Confirm Password'
                        name='password_confirm'
                        size='lg' 
                        type="text" 
                        required 
                        isInvalid={errors?.hasOwnProperty('password')}
                        onChange={ (e) => useAuthStore.setState({ password_confirmation: { value: e.target.value}} )} 
                    />

                    <Form.Control.Feedback type="invalid">    
                    </Form.Control.Feedback>
                </InputGroup>

        </div>
    );
};

export default Account;