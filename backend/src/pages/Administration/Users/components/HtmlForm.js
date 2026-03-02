import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ form, onChange, roles, errors, isLoading }) => {
    return (
        <div>
            <InputGroup>
                <InputGroup.Text style={{ width: '130px' }}>
                    <FontAwesomeIcon icon={['fas', 'user']} className='me-2' />
                    Name
                </InputGroup.Text>
                <Form.Control
                    placeholder='Name'
                    value={form.name}
                    readOnly={isLoading}
                    isInvalid={!!errors?.name}
                    onChange={(e) => onChange('name')(e.target.value)}
                />
                {errors?.name && (
                    <Form.Control.Feedback type='invalid'>{errors.name[0]}</Form.Control.Feedback>
                )}
            </InputGroup>
            <br />

            <InputGroup>
                <InputGroup.Text>
                    <FontAwesomeIcon icon={['fas', 'person']} />
                </InputGroup.Text>
                <Form.Select
                    value={form.roleId}
                    disabled={isLoading}
                    isInvalid={!!errors?.role_id}
                    onChange={(e) => onChange('roleId')(e.target.value)}
                >
                    <option value=''>Choose a role</option>
                    {roles?.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </Form.Select>
                {errors?.role_id && (
                    <Form.Control.Feedback type='invalid'>{errors.role_id[0]}</Form.Control.Feedback>
                )}
            </InputGroup>
            <br />

            <InputGroup>
                <InputGroup.Text style={{ width: '130px' }}>
                    <FontAwesomeIcon icon={['fas', 'envelope']} className='me-2' />
                    E-mail
                </InputGroup.Text>
                <Form.Control
                    placeholder='E-mail'
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
            <br />

            <InputGroup>
                <InputGroup.Text style={{ width: '130px' }}>
                    <FontAwesomeIcon icon={['fas', 'lock']} className='me-2' />
                    Password
                </InputGroup.Text>
                <Form.Control
                    placeholder='Password'
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
            <br />

            <InputGroup>
                <InputGroup.Text style={{ width: '130px' }}>
                    <FontAwesomeIcon icon={['fas', 'lock']} className='me-2' />
                    Confirm
                </InputGroup.Text>
                <Form.Control
                    placeholder='Confirm Password'
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
        </div>
    )
}

export default HtmlForm
