import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../libs/axios'
import BreadCrumb from '../../libs/BreadCrumb'

const breadcrumbItems = [
    { url: '/', label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge> },
    { url: '', label: 'Account' },
]

const emptyForm = {
    name: '',
    email: '',
    address: '',
    password: '',
    password_confirmation: '',
}

const Account = () => {
    const url = process.env.REACT_APP_BACKEND_URL + '/account'

    const [form, setForm]       = useState(emptyForm)
    const [role, setRole]       = useState('')
    const [errors, setErrors]   = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving]   = useState(false)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    useEffect(() => {
        axios({ method: 'get', url })
            .then((response) => {
                const account = response.data.account
                setForm({
                    name:    account.name ?? '',
                    email:   account.email ?? '',
                    address: account.profile?.address ?? '',
                    password: '',
                    password_confirmation: '',
                })
                setRole(account.role ?? '')
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }, [])

    const handleSubmit = () => {
        setIsSaving(true)
        setErrors(null)

        const formData = new FormData()
        formData.append('_method', 'put')
        formData.append('name',    form.name)
        formData.append('email',   form.email)
        formData.append('address', form.address)
        if (form.password) {
            formData.append('password',              form.password)
            formData.append('password_confirmation', form.password_confirmation)
        }

        axios({ method: 'post', url, data: formData })
            .then(() => {
                setForm((prev) => ({ ...prev, password: '', password_confirmation: '' }))
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors)
                }
            })
            .finally(() => setIsSaving(false))
    }

    if (isLoading) return <Container className='p-3'>Loading...</Container>

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />

            <Container>
                <div className='d-flex flex-column gap-3'>

                    <Card>
                        <Card.Header className='fw-semibold'>
                            <FontAwesomeIcon icon={['fas', 'user']} className='me-2 text-secondary' />
                            Profile
                        </Card.Header>
                        <Card.Body className='d-flex flex-column gap-2'>

                            <InputGroup>
                                <InputGroup.Text style={{ width: '120px' }}>Name</InputGroup.Text>
                                <Form.Control
                                    placeholder='Full name'
                                    value={form.name}
                                    readOnly={isSaving}
                                    isInvalid={!!errors?.name}
                                    onChange={(e) => onChange('name')(e.target.value)}
                                />
                                {errors?.name && (
                                    <Form.Control.Feedback type='invalid'>{errors.name[0]}</Form.Control.Feedback>
                                )}
                            </InputGroup>

                            <InputGroup>
                                <InputGroup.Text style={{ width: '120px' }}>Role</InputGroup.Text>
                                <Form.Control value={role} readOnly />
                            </InputGroup>

                            <InputGroup>
                                <InputGroup.Text style={{ width: '120px' }}>Address</InputGroup.Text>
                                <Form.Control
                                    as='textarea'
                                    rows={3}
                                    placeholder='Your address'
                                    value={form.address}
                                    readOnly={isSaving}
                                    isInvalid={!!errors?.address}
                                    onChange={(e) => onChange('address')(e.target.value)}
                                />
                                {errors?.address && (
                                    <Form.Control.Feedback type='invalid'>{errors.address[0]}</Form.Control.Feedback>
                                )}
                            </InputGroup>

                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header className='fw-semibold'>
                            <FontAwesomeIcon icon={['fas', 'lock']} className='me-2 text-secondary' />
                            Login Info
                        </Card.Header>
                        <Card.Body className='d-flex flex-column gap-2'>

                            <InputGroup>
                                <InputGroup.Text style={{ width: '120px' }}>Email</InputGroup.Text>
                                <Form.Control
                                    type='email'
                                    placeholder='Email address'
                                    value={form.email}
                                    readOnly={isSaving}
                                    isInvalid={!!errors?.email}
                                    onChange={(e) => onChange('email')(e.target.value)}
                                />
                                {errors?.email && (
                                    <Form.Control.Feedback type='invalid'>{errors.email[0]}</Form.Control.Feedback>
                                )}
                            </InputGroup>

                            <InputGroup>
                                <InputGroup.Text style={{ width: '120px' }}>Password</InputGroup.Text>
                                <Form.Control
                                    type='password'
                                    placeholder='Leave blank to keep current'
                                    value={form.password}
                                    readOnly={isSaving}
                                    isInvalid={!!errors?.password}
                                    onChange={(e) => onChange('password')(e.target.value)}
                                />
                                {errors?.password && (
                                    <Form.Control.Feedback type='invalid'>{errors.password[0]}</Form.Control.Feedback>
                                )}
                            </InputGroup>

                            <InputGroup>
                                <InputGroup.Text style={{ width: '120px' }}>Confirm</InputGroup.Text>
                                <Form.Control
                                    type='password'
                                    placeholder='Confirm new password'
                                    value={form.password_confirmation}
                                    readOnly={isSaving}
                                    isInvalid={!!errors?.password_confirmation}
                                    onChange={(e) => onChange('password_confirmation')(e.target.value)}
                                />
                                {errors?.password_confirmation && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.password_confirmation[0]}
                                    </Form.Control.Feedback>
                                )}
                            </InputGroup>

                        </Card.Body>
                    </Card>

                    <div className='text-end'>
                        <Button variant='primary' disabled={isSaving} onClick={handleSubmit}>
                            <FontAwesomeIcon icon={['fas', 'floppy-disk']} className='me-2' />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                </div>
            </Container>
        </>
    )
}

export default Account
