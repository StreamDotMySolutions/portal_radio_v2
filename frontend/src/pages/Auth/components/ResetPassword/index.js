import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { Link, useParams} from 'react-router-dom'
import { Form,InputGroup,Button,Row,Col, Alert } from 'react-bootstrap'
import axios from '../../../../libs/axios'

const ResetPassword = () => {

    const token = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [message, setMessage] = useState(null)
    const [errors, setErrors] = useState([]); // validation errors

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordConfirmation, setPasswordConfirmation] = useState(null)

    const handleClickSubmit = () => {

        setIsError(false)
        setIsSuccess(false)
        setIsDisabled(true)
        setIsLoading(true)
        setErrors(null)

        // console.log(token.token)
        // console.log(password)
        // console.log(passwordConfirmation)

        const formData = new FormData()
        formData.append('token', token.token)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('password_confirmation', passwordConfirmation)

        axios({
            url:  process.env.REACT_APP_BACKEND_URL + '/password/reset',
            method: 'post',
            data: formData
        })
        .then(response => {

            setIsSuccess(true)
            setIsLoading(false)
            setIsDisabled(false)
            
            console.log(response)
        })
        .catch(error => {
            console.warn(error)
            setIsError(true)
            setIsLoading(false)
            setIsDisabled(false)
           
            if( error.response?.status == 422 ){
                if(error.response.data.message){
                    setMessage(error.response.data.message)
                }
                if(error.response.data.errors){
                    setErrors(error.response.data.errors)
                }
            } else {
                setMessage(error.message)
            }
        })

    }

    return (
        <>

        {!isSuccess && !isError && !isLoading && (
        <Alert variant='info'>
            Now you can reset the password.
            <br />
            <br />
            <span className='text-muted'>Password sekurang-kurangnya 6 aksara</span>
        </Alert>
        )}

        {isError && (

            <Alert variant='danger'>
                {message ? message : 'Error.'}
            </Alert>
        )}

        
        { isLoading && (
            <Alert variant='warning'>
                    <i className="fa-solid fa-sync fa-spin"></i>{' '}sedang memproses...
            </Alert>
        )}

        {isSuccess && (

        <Alert variant='success'>
            Anda berjaya reset password anda.
            <span className='fs-6 ms-3'>
                <Link to='/sign-in'><FontAwesomeIcon icon="fa-solid fa-reply"></FontAwesomeIcon>{' '}Log Masuk</Link>
            </span>
        </Alert>
        )}

        {!isSuccess && (
            <Form>

                <InputGroup hasValidation>
                    <InputGroup.Text><FontAwesomeIcon icon="fa-solid fa-envelope"></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
                        placeholder='Email'
                        name='email'
                        size='lg' 
                        type="text" 
                        required 
                        isInvalid={errors?.hasOwnProperty('email')}
                        onChange={ (e) => setEmail(e.target.value)} 
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
                        placeholder='New password'
                        name='password'
                        size='lg' 
                        type="text" 
                        required 
                        isInvalid={errors?.hasOwnProperty('password')}
                        onChange={ (e) => setPassword(e.target.value)} 
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
                        placeholder='Confirm password'
                        name='password_confirm'
                        size='lg' 
                        type="text" 
                        required 
                        //isInvalid={isError}
                        onChange={ (e) => setPasswordConfirmation(e.target.value)} 
                    />

                    <Form.Control.Feedback type="invalid">    
                    </Form.Control.Feedback>
                </InputGroup>

                <Row className='col-12 mt-3 text-center text-lg-start mt-4 pt-2'>
                    <Col>
                        <Button 
                            disabled={isLoading}
                            onClick={handleClickSubmit}
                            size='lg' 
                            className='login-button'>Send</Button>
                        <span className='fs-6 ms-4'>
                            <Link to='/sign-in'><FontAwesomeIcon icon="fa-solid fa-reply"></FontAwesomeIcon>{' '}Log Masuk</Link>
                        </span>
                    </Col>
                </Row>
            </Form>
        )}
    </>
    );
};

export default ResetPassword;