import React, { useState } from 'react'
import { Button, Card, Figure, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ form, onChange, filename, onImageChange, serverUrl, errors, isLoading }) => {
    const [replacing, setReplacing] = useState(false)
    const [preview, setPreview] = useState(null)

    const handleCancelReplace = () => {
        setReplacing(false)
        setPreview(null)
        onImageChange(null)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        onImageChange(file)
        setPreview(URL.createObjectURL(file))
    }

    return (
        <div className='d-flex flex-column gap-3'>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2 text-secondary' />
                    Basic Info
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-2'>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '80px' }}>Title</InputGroup.Text>
                        <Form.Control
                            placeholder='Programme title'
                            value={form.title}
                            readOnly={isLoading}
                            isInvalid={!!errors?.title}
                            onChange={(e) => onChange('title')(e.target.value)}
                        />
                        {errors?.title && (
                            <Form.Control.Feedback type='invalid'>{errors.title[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '80px' }}>URL</InputGroup.Text>
                        <Form.Control
                            placeholder='https://...'
                            value={form.redirectUrl}
                            readOnly={isLoading}
                            isInvalid={!!errors?.redirect_url}
                            onChange={(e) => onChange('redirectUrl')(e.target.value)}
                        />
                        {errors?.redirect_url && (
                            <Form.Control.Feedback type='invalid'>
                                {errors.redirect_url[0]}
                            </Form.Control.Feedback>
                        )}
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'image']} className='me-2 text-secondary' />
                    Programme Image
                </Card.Header>
                <Card.Body>
                    <p className='text-muted small mb-2'>
                        Upload an image representing this programme. It will be displayed on the public portal.
                    </p>
                    {filename && !replacing ? (
                        <>
                            <Figure className='mb-2'>
                                <Figure.Image
                                    className='rounded'
                                    src={`${serverUrl}/storage/programmes/${filename}`}
                                />
                            </Figure>
                            <div>
                                <Button
                                    size='sm'
                                    variant='outline-secondary'
                                    disabled={isLoading}
                                    onClick={() => setReplacing(true)}
                                >
                                    <FontAwesomeIcon icon={['fas', 'arrows-rotate']} className='me-1' />
                                    Replace image
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={['fas', 'upload']} />
                                </InputGroup.Text>
                                <Form.Control
                                    type='file'
                                    accept='image/*'
                                    disabled={isLoading}
                                    isInvalid={!!errors?.programme}
                                    onChange={handleFileChange}
                                />
                                {errors?.programme && (
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.programme[0]}
                                    </Form.Control.Feedback>
                                )}
                            </InputGroup>
                            {preview && (
                                <Figure className='mt-2 mb-0'>
                                    <Figure.Image className='rounded' src={preview} />
                                </Figure>
                            )}
                            {filename && (
                                <Button
                                    size='sm'
                                    variant='link'
                                    className='ps-0 mt-1 text-secondary'
                                    onClick={handleCancelReplace}
                                >
                                    Cancel replace
                                </Button>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

        </div>
    )
}

export default HtmlForm
