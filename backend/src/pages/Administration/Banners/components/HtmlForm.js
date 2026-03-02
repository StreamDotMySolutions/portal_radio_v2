import React, { useState, useEffect } from 'react'
import { Alert, Button, Col, Figure, Form, InputGroup, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ form, onChange, filename, onBannerChange, serverUrl, errors, isLoading }) => {
    const [hasStart, setHasStart] = useState(!!form.publishedStart)
    const [hasEnd, setHasEnd] = useState(!!form.publishedEnd)
    const [replacing, setReplacing] = useState(false)

    const handleCancelReplace = () => {
        setReplacing(false)
        onBannerChange(null)
    }

    // Sync toggles when Edit modal populates the form from the API
    useEffect(() => { setHasStart(!!form.publishedStart) }, [form.publishedStart])
    useEffect(() => { setHasEnd(!!form.publishedEnd) }, [form.publishedEnd])

    const handleStartToggle = (checked) => {
        setHasStart(checked)
        if (!checked) onChange('publishedStart')('')
    }

    const handleEndToggle = (checked) => {
        setHasEnd(checked)
        if (!checked) onChange('publishedEnd')('')
    }

    const statusText = () => {
        const start = form.publishedStart
        const end = form.publishedEnd
        if (start && end) return `Runs from ${start} to ${end}.`
        if (start)        return `Runs from ${start} indefinitely.`
        if (end)          return `Runs until ${end}.`
        return 'Runs forever — no schedule set.'
    }

    return (
        <>
            <Col className='mb-2'>
                <h3>Publishing</h3>

                <Alert variant='info' className='py-2 mb-3'>
                    <FontAwesomeIcon icon={['fas', 'circle-info']} className='me-2' />
                    {statusText()}
                </Alert>

                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Check
                                type='switch'
                                label='Schedule start date'
                                checked={hasStart}
                                disabled={isLoading}
                                className='mb-2'
                                onChange={(e) => handleStartToggle(e.target.checked)}
                            />
                            {hasStart && (
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={['fas', 'calendar']} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        value={form.publishedStart}
                                        disabled={isLoading}
                                        onChange={(e) => onChange('publishedStart')(e.target.value)}
                                    />
                                </InputGroup>
                            )}
                        </Col>
                        <Col>
                            <Form.Check
                                type='switch'
                                label='Schedule end date'
                                checked={hasEnd}
                                disabled={isLoading}
                                className='mb-2'
                                onChange={(e) => handleEndToggle(e.target.checked)}
                            />
                            {hasEnd && (
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={['fas', 'calendar']} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        value={form.publishedEnd}
                                        disabled={isLoading}
                                        onChange={(e) => onChange('publishedEnd')(e.target.value)}
                                    />
                                </InputGroup>
                            )}
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group className='col-4 mt-3'>
                    <Form.Label><h6>Active</h6></Form.Label>
                    <Row>
                        <Col>
                            <Form.Check
                                type='radio'
                                label='Yes'
                                name='active'
                                value='1'
                                checked={form.active == 1}
                                onChange={() => onChange('active')(1)}
                            />
                        </Col>
                        <Col>
                            <Form.Check
                                type='radio'
                                label='No'
                                name='active'
                                value='0'
                                checked={form.active == 0}
                                onChange={() => onChange('active')(0)}
                            />
                        </Col>
                    </Row>
                </Form.Group>
            </Col>

            <hr />
            <h3>Metadata</h3>

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
                        <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2' />
                        Description
                    </InputGroup.Text>
                    <Form.Control
                        placeholder='Short Description'
                        value={form.description}
                        readOnly={isLoading}
                        isInvalid={!!errors?.description}
                        onChange={(e) => onChange('description')(e.target.value)}
                    />
                    {errors?.description && (
                        <Form.Control.Feedback type='invalid'>
                            {errors.description[0]}
                        </Form.Control.Feedback>
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
                        placeholder='URL'
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

            <hr />
            <h3>Banner</h3>

            <Col className='mb-2'>
                {filename && !replacing ? (
                    <>
                        <Figure className='w-100'>
                            <Figure.Image className='w-100 rounded' src={`${serverUrl}/storage/banners/${filename}`} />
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
                                isInvalid={!!errors?.banner}
                                onChange={(e) => onBannerChange(e.target.files[0])}
                            />
                            {errors?.banner && (
                                <Form.Control.Feedback type='invalid'>
                                    {errors.banner[0]}
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
