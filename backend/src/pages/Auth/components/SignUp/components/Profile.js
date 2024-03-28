import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { Link, useParams} from 'react-router-dom'
import { Form,InputGroup,Button,Row,Col, Alert } from 'react-bootstrap'
import axio from '../../../../../libs/axios';
import useAuthStore from '../../../stores/AuthStore';

const Profile = () => {
    const store = useAuthStore()
    const errors = store.errors

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [message, setMessage] = useState(null)
    //const [errors, setErrors] = useState([]); // validation errors

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordConfirmation, setPasswordConfirmation] = useState(null)
    

    const handleClickSubmit = () => {}

    return (
        <div>

            <Row>
                <Col>
                    <InputGroup hasValidation className='mb-3'>
                        <InputGroup.Text><FontAwesomeIcon icon="fa-solid fa-user"></FontAwesomeIcon></InputGroup.Text>
                        <Form.Control 
                            placeholder='Fullname'
                            name='name'
                            
                            type="text" 
                            required 
                            isInvalid={errors?.hasOwnProperty('name')}
                            onChange={ (e) => useAuthStore.setState({ name: { value: e.target.value}} )}  
                        />

                        {
                            errors?.hasOwnProperty('name') &&
                                (
                                    <Form.Control.Feedback type="invalid">   
                                    { errors.name ? errors.name : null }
                                    </Form.Control.Feedback>
                                )
                        }  
                    </InputGroup>
                </Col>
                
                </Row>

                <Row>
                

                <Col>
                
                </Col>
            </Row>


                <InputGroup hasValidation className='mb-3'>
                    <InputGroup.Text><FontAwesomeIcon icon="fa-solid fa-address-card"></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
                        placeholder='Address'
                        name='address'
                        as='textarea'
                        rows={5}
                        required 
                        isInvalid={errors?.hasOwnProperty('address')}
                        onChange={ (e) => useAuthStore.setState({ address: { value: e.target.value}} )}  
                    />
                    {
                        errors?.hasOwnProperty('address') &&
                            (
                                <Form.Control.Feedback type="invalid">   
                                { errors.address ? errors.address : null }
                                </Form.Control.Feedback>
                            )
                    } 
                </InputGroup>

        </div>
    );
};

export default Profile;