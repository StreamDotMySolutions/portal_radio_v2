import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ value, onChange, error, isLoading }) => {
    return (
        <InputGroup>
            <InputGroup.Text style={{ width: '130px' }}>
                <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2' />
                Role name
            </InputGroup.Text>
            <Form.Control
                placeholder='Role name'
                value={value}
                readOnly={isLoading}
                isInvalid={!!error}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && (
                <Form.Control.Feedback type='invalid'>
                    {error}
                </Form.Control.Feedback>
            )}
        </InputGroup>
    )
}

export default HtmlForm
