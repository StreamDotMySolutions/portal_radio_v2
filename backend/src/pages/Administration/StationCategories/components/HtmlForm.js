import React, { useEffect } from 'react'
import { Card, Form, InputGroup, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Str } from 'lodash-es'

const HtmlForm = ({
    form,
    onChange,
    errors,
    isLoading,
}) => {
    // Auto-generate slug from display_name on change
    useEffect(() => {
        if (form.displayName && !form.slugManuallyEdited) {
            // Using a simple slug function
            const slug = form.displayName
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '_')
                .replace(/^-+|-+$/g, '')
            onChange('slug')(slug)
        }
    }, [form.displayName, form.slugManuallyEdited, onChange])

    const handleSlugChange = (value) => {
        onChange('slug')(value)
        onChange('slugManuallyEdited')(true)
    }

    return (
        <div className='d-flex flex-column gap-3'>
            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'tag']} className='me-2 text-secondary' />
                    Category Details
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-2'>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '120px' }}>Display Name</InputGroup.Text>
                        <Form.Control
                            placeholder='e.g. Radio Digital'
                            value={form.displayName}
                            readOnly={isLoading}
                            isInvalid={!!errors?.display_name}
                            onChange={(e) => onChange('displayName')(e.target.value)}
                        />
                        {errors?.display_name && (
                            <Form.Control.Feedback type='invalid'>{errors.display_name[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '120px' }}>Slug</InputGroup.Text>
                        <Form.Control
                            placeholder='e.g. radio_online'
                            value={form.slug}
                            readOnly={isLoading}
                            isInvalid={!!errors?.slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                        />
                        {errors?.slug && (
                            <Form.Control.Feedback type='invalid'>{errors.slug[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className='fw-semibold small text-muted mb-1'>Sort Order</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={form.sortOrder}
                                    disabled={isLoading}
                                    isInvalid={!!errors?.sort_order}
                                    onChange={(e) => onChange('sortOrder')(parseInt(e.target.value) || 0)}
                                />
                                {errors?.sort_order && (
                                    <Form.Control.Feedback type='invalid' className='d-block'>
                                        {errors.sort_order[0]}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className='fw-semibold small text-muted mb-1'>Active</Form.Label>
                                <div className='d-flex gap-3'>
                                    <Form.Check
                                        type='radio'
                                        label='Yes'
                                        name='active'
                                        value='1'
                                        checked={form.active == 1}
                                        disabled={isLoading}
                                        onChange={() => onChange('active')(1)}
                                    />
                                    <Form.Check
                                        type='radio'
                                        label='No'
                                        name='active'
                                        value='0'
                                        checked={form.active == 0}
                                        disabled={isLoading}
                                        onChange={() => onChange('active')(0)}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}

export default HtmlForm
