import React, { useState } from 'react'
import { Button, Col, Figure, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ form, onChange, filename, onImageChange, serverUrl, errors, isLoading }) => {
    const [replacing, setReplacing] = useState(false)

    const handleCancelReplace = () => {
        setReplacing(false)
        onImageChange(null)
    }

    return (
        <>
            <Col className='mb-2'>
                <InputGroup>
                    <InputGroup.Text style={{ width: '130px' }}>
                        <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2' />
                        Title
                    </InputGroup.Text>
                    <Form.Control
                        placeholder='Title'
                        value={form.title}
                        readOnly={isLoading}
                        isInvalid={!!errors?.title}
                        onChange={(e) => onChange('title')(e.target.value)}
                    />
                    {errors?.title && (
                        <Form.Control.Feedback type='invalid'>{errors.title[0]}</Form.Control.Feedback>
                    )}
                </InputGroup>
            </Col>

            <Col className='mb-2'>
                <InputGroup>
                    <InputGroup.Text style={{ width: '130px' }}>
                        <FontAwesomeIcon icon={['fas', 'globe']} className='me-2' />
                        URL
                    </InputGroup.Text>
                    <Form.Control
                        placeholder='https://....'
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
            </Col>

            <Col className='mb-2'>
                {filename && !replacing ? (
                    <>
                        <Figure>
                            <Figure.Image src={`${serverUrl}/storage/programmes/${filename}`} />
                        </Figure>
                        <Button
                            size='sm'
                            variant='outline-secondary'
                            disabled={isLoading}
                            onClick={() => setReplacing(true)}
                        >
                            <FontAwesomeIcon icon={['fas', 'arrows-rotate']} className='me-1' />
                            Replace image
                        </Button>
                    </>
                ) : (
                    <>
                        <InputGroup>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={['fas', 'image']} />
                            </InputGroup.Text>
                            <Form.Control
                                type='file'
                                accept='image/*'
                                disabled={isLoading}
                                isInvalid={!!errors?.programme}
                                onChange={(e) => onImageChange(e.target.files[0])}
                            />
                            {errors?.programme && (
                                <Form.Control.Feedback type='invalid'>
                                    {errors.programme[0]}
                                </Form.Control.Feedback>
                            )}
                        </InputGroup>
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
            </Col>
        </>
    )
}

export default HtmlForm
