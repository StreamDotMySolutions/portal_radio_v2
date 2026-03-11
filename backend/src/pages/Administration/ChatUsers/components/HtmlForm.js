import React from 'react'
import { Card, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ form, onChange, errors, isLoading }) => {
    return (
        <div className='d-flex flex-column gap-3'>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'user']} className='me-2 text-secondary' />
                    Account Info
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-2'>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '100px' }}>Username</InputGroup.Text>
                        <Form.Control
                            placeholder='Username'
                            value={form.username}
                            readOnly={isLoading}
                            isInvalid={!!errors?.username}
                            onChange={(e) => onChange('username')(e.target.value)}
                        />
                        {errors?.username && (
                            <Form.Control.Feedback type='invalid'>{errors.username[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '100px' }}>Email</InputGroup.Text>
                        <Form.Control
                            placeholder='Email address'
                            type='email'
                            value={form.email}
                            readOnly={isLoading}
                            isInvalid={!!errors?.email}
                            onChange={(e) => onChange('email')(e.target.value)}
                        />
                        {errors?.email && (
                            <Form.Control.Feedback type='invalid'>{errors.email[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'lock']} className='me-2 text-secondary' />
                    Password
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-2'>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '100px' }}>Password</InputGroup.Text>
                        <Form.Control
                            placeholder='New password (leave blank to keep)'
                            type='password'
                            value={form.password}
                            readOnly={isLoading}
                            isInvalid={!!errors?.password}
                            onChange={(e) => onChange('password')(e.target.value)}
                        />
                        {errors?.password && (
                            <Form.Control.Feedback type='invalid'>{errors.password[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '100px' }}>Confirm</InputGroup.Text>
                        <Form.Control
                            placeholder='Confirm password'
                            type='password'
                            value={form.passwordConfirmation}
                            readOnly={isLoading}
                            isInvalid={!!errors?.password_confirmation}
                            onChange={(e) => onChange('passwordConfirmation')(e.target.value)}
                        />
                        {errors?.password_confirmation && (
                            <Form.Control.Feedback type='invalid'>
                                {errors.password_confirmation[0]}
                            </Form.Control.Feedback>
                        )}
                    </InputGroup>
                </Card.Body>
            </Card>

        </div>
    )
}

export default HtmlForm
