import { useState } from 'react'
import { Alert, Button, Card, Figure, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

const HtmlForm = ({ form, onChange, videos, filename, onPosterChange, serverUrl, errors, isLoading }) => {
    const [replacing, setReplacing] = useState(false)

    const handleCancelReplace = () => {
        setReplacing(false)
        onPosterChange(null)
    }

    return (
        <div className='d-flex flex-column gap-3'>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2 text-secondary' />
                    Basic Info
                </Card.Header>
                <Card.Body>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '80px' }}>Title</InputGroup.Text>
                        <Form.Control
                            placeholder='Enter video title'
                            value={form.title}
                            readOnly={isLoading}
                            isInvalid={!!errors?.title}
                            onChange={(e) => onChange('title')(e.target.value)}
                        />
                        {errors?.title && (
                            <Form.Control.Feedback type='invalid'>{errors.title[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'film']} className='me-2 text-secondary' />
                    HLS Video
                </Card.Header>
                <Card.Body>
                    <p className='text-muted small mb-2'>
                        Select a video from the VOD Library. The selected video will be streamed using HLS on the public portal.
                    </p>
                    <Form.Select
                        value={form.embedCode}
                        disabled={isLoading || !videos?.length}
                        isInvalid={!!errors?.embed_code}
                        onChange={(e) => onChange('embedCode')(e.target.value)}
                    >
                        <option value=''>— Select video —</option>
                        {videos?.map((v) => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                    </Form.Select>
                    {errors?.embed_code && (
                        <Form.Control.Feedback type='invalid' className='d-block'>
                            {errors.embed_code[0]}
                        </Form.Control.Feedback>
                    )}
                    {!isLoading && videos?.length === 0 && (
                        <Alert variant='warning' className='mt-2 py-2 mb-0 small'>
                            <FontAwesomeIcon icon={['fas', 'triangle-exclamation']} className='me-1' />
                            No videos found in the VOD Library.{' '}
                            <Link to='/administration/vods/0'>Go to VOD Management</Link> and add a video first.
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'image']} className='me-2 text-secondary' />
                    Poster Image
                </Card.Header>
                <Card.Body>
                    <p className='text-muted small mb-2'>
                        Upload a thumbnail image displayed on the video player before playback starts.
                    </p>
                    {filename && !replacing ? (
                        <>
                            <Figure className='w-100 mb-2'>
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
                                    <FontAwesomeIcon icon={['fas', 'upload']} />
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
                </Card.Body>
            </Card>

        </div>
    )
}

export default HtmlForm
