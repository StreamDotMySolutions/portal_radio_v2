import { Form } from 'react-bootstrap'

const HtmlForm = ({ formData, setFormData, isSubmitting = false }) => {
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <>
            <Form.Group className='mb-3'>
                <Form.Label>Section</Form.Label>
                <Form.Select
                    value={formData.section || ''}
                    onChange={(e) => handleChange('section', e.target.value)}
                    disabled={isSubmitting}
                >
                    <option value=''>-- Select Section --</option>
                    <option value='quick'>Quick Links</option>
                    <option value='network'>Network Links</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type='text'
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder='Link title'
                    disabled={isSubmitting}
                />
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Label>URL</Form.Label>
                <Form.Control
                    type='text'
                    value={formData.url || ''}
                    onChange={(e) => handleChange('url', e.target.value)}
                    placeholder='https://example.com or /page'
                    disabled={isSubmitting}
                />
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Check
                    type='checkbox'
                    label='External Link'
                    checked={formData.is_external || false}
                    onChange={(e) => handleChange('is_external', e.target.checked)}
                    disabled={isSubmitting}
                />
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Check
                    type='checkbox'
                    label='Active'
                    checked={formData.active !== false}
                    onChange={(e) => handleChange('active', e.target.checked)}
                    disabled={isSubmitting}
                />
            </Form.Group>
        </>
    )
}

export default HtmlForm
