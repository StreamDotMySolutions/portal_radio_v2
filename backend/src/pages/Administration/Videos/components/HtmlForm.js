import { useState } from 'react'
import { Button, Col, Figure, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ form, onChange, videos, filename, onPosterChange, serverUrl, errors, isLoading }) => {
    const [replacing, setReplacing] = useState(false)

    const handleCancelReplace = () => {
        setReplacing(false)
        onPosterChange(null)
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
                        <FontAwesomeIcon icon={['fas', 'film']} className='me-2' />
                        HLS Video
                    </InputGroup.Text>
                    <Form.Select
                        value={form.embedCode}
                        disabled={isLoading}
                        isInvalid={!!errors?.embed_code}
                        onChange={(e) => onChange('embedCode')(e.target.value)}
                    >
                        <option value=''>— Select video —</option>
                        {videos?.map((v) => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                    </Form.Select>
                    {errors?.embed_code && (
                        <Form.Control.Feedback type='invalid'>{errors.embed_code[0]}</Form.Control.Feedback>
                    )}
                </InputGroup>
            </Col>

            <Col className='mb-2'>
                {filename && !replacing ? (
                    <>
                        <Figure className='w-100'>
                            <Figure.Image
                                className='w-100 rounded'
                                src={`${serverUrl}/storage/videos/${filename}`}
                                alt='Poster'
                            />
                        </Figure>
                        <Button
                            size='sm'
                            variant='outline-secondary'
                            disabled={isLoading}
                            onClick={() => setReplacing(true)}
                        >
                            <FontAwesomeIcon icon={['fas', 'arrows-rotate']} className='me-1' />
                            Replace poster
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
                                isInvalid={!!errors?.poster}
                                onChange={(e) => onPosterChange(e.target.files[0])}
                            />
                            {errors?.poster && (
                                <Form.Control.Feedback type='invalid'>{errors.poster[0]}</Form.Control.Feedback>
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
