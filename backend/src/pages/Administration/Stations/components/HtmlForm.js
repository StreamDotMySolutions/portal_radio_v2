import React, { useState, useEffect } from 'react'
import { Card, Form, InputGroup, Row, Col, Figure, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({
    form,
    onChange,
    errors,
    isLoading,
    thumbnailFilename,
    onThumbnailChange,
    bannerFilename,
    onBannerChange,
    serverUrl
}) => {
    const [replacingThumbnail, setReplacingThumbnail] = useState(false)
    const [replacingBanner, setReplacingBanner] = useState(false)

    const handleCancelThumbnailReplace = () => {
        setReplacingThumbnail(false)
        onThumbnailChange(null)
    }

    const handleCancelBannerReplace = () => {
        setReplacingBanner(false)
        onBannerChange(null)
    }

    return (
        <div className='d-flex flex-column gap-3'>
            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'radio']} className='me-2 text-secondary' />
                    Details
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-2'>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>Title</InputGroup.Text>
                        <Form.Control
                            placeholder='Station title'
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
                        <InputGroup.Text style={{ width: '110px' }}>Description</InputGroup.Text>
                        <Form.Control
                            as='textarea'
                            placeholder='Station description'
                            value={form.description}
                            readOnly={isLoading}
                            isInvalid={!!errors?.description}
                            onChange={(e) => onChange('description')(e.target.value)}
                            style={{ minHeight: '100px' }}
                        />
                        {errors?.description && (
                            <Form.Control.Feedback type='invalid'>
                                {errors.description[0]}
                            </Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>Frequency</InputGroup.Text>
                        <Form.Control
                            placeholder='e.g. 89.9 FM'
                            value={form.frequency}
                            readOnly={isLoading}
                            isInvalid={!!errors?.frequency}
                            onChange={(e) => onChange('frequency')(e.target.value)}
                        />
                        {errors?.frequency && (
                            <Form.Control.Feedback type='invalid'>{errors.frequency[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className='fw-semibold small text-muted mb-1'>Category</Form.Label>
                                <Form.Select
                                    value={form.category}
                                    disabled={isLoading}
                                    isInvalid={!!errors?.category}
                                    onChange={(e) => onChange('category')(e.target.value)}
                                    required
                                >
                                    <option value=''>Select category...</option>
                                    <option value='radio_online'>Radio Digital</option>
                                    <option value='nasional'>Nasional</option>
                                    <option value='negeri'>Negeri</option>
                                    <option value='radio_tempatan'>Radio Tempatan</option>
                                </Form.Select>
                                {errors?.category && (
                                    <Form.Control.Feedback type='invalid' className='d-block'>
                                        {errors.category[0]}
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

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'link']} className='me-2 text-secondary' />
                    Social & Stream URLs
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-2'>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>RTMKlik</InputGroup.Text>
                        <Form.Control
                            placeholder='RTMKlik player URL'
                            value={form.rtmklikPlayerUrl}
                            readOnly={isLoading}
                            isInvalid={!!errors?.rtmklik_player_url}
                            onChange={(e) => onChange('rtmklikPlayerUrl')(e.target.value)}
                        />
                        {errors?.rtmklik_player_url && (
                            <Form.Control.Feedback type='invalid'>{errors.rtmklik_player_url[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>Facebook</InputGroup.Text>
                        <Form.Control
                            placeholder='https://facebook.com/...'
                            value={form.facebookUrl}
                            readOnly={isLoading}
                            isInvalid={!!errors?.facebook_url}
                            onChange={(e) => onChange('facebookUrl')(e.target.value)}
                        />
                        {errors?.facebook_url && (
                            <Form.Control.Feedback type='invalid'>{errors.facebook_url[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>X (Twitter)</InputGroup.Text>
                        <Form.Control
                            placeholder='https://x.com/...'
                            value={form.xUrl}
                            readOnly={isLoading}
                            isInvalid={!!errors?.x_url}
                            onChange={(e) => onChange('xUrl')(e.target.value)}
                        />
                        {errors?.x_url && (
                            <Form.Control.Feedback type='invalid'>{errors.x_url[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>Instagram</InputGroup.Text>
                        <Form.Control
                            placeholder='https://instagram.com/...'
                            value={form.instagramUrl}
                            readOnly={isLoading}
                            isInvalid={!!errors?.instagram_url}
                            onChange={(e) => onChange('instagramUrl')(e.target.value)}
                        />
                        {errors?.instagram_url && (
                            <Form.Control.Feedback type='invalid'>{errors.instagram_url[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>YouTube</InputGroup.Text>
                        <Form.Control
                            placeholder='https://youtube.com/...'
                            value={form.youtubeUrl}
                            readOnly={isLoading}
                            isInvalid={!!errors?.youtube_url}
                            onChange={(e) => onChange('youtubeUrl')(e.target.value)}
                        />
                        {errors?.youtube_url && (
                            <Form.Control.Feedback type='invalid'>{errors.youtube_url[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>TikTok</InputGroup.Text>
                        <Form.Control
                            placeholder='https://tiktok.com/...'
                            value={form.tiktokUrl}
                            readOnly={isLoading}
                            isInvalid={!!errors?.tiktok_url}
                            onChange={(e) => onChange('tiktokUrl')(e.target.value)}
                        />
                        {errors?.tiktok_url && (
                            <Form.Control.Feedback type='invalid'>{errors.tiktok_url[0]}</Form.Control.Feedback>
                        )}
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'image']} className='me-2 text-secondary' />
                    Images
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-3'>
                    <InputGroup>
                        <InputGroup.Text>Accent Color</InputGroup.Text>
                        <Form.Control
                            type='color'
                            value={form.accentColor || ''}
                            readOnly={isLoading}
                            onChange={(e) => onChange('accentColor')(e.target.value)}
                        />
                    </InputGroup>

                    <div>
                        <Form.Label className='fw-semibold small text-muted mb-2'>
                            Thumbnail <small className='text-muted'>(card grid, square/portrait)</small>
                        </Form.Label>
                        {thumbnailFilename && !replacingThumbnail ? (
                            <div style={{ position: 'relative', display: 'block', marginBottom: '1rem', width: '100%' }}>
                                <Figure className='mb-0'>
                                    <Figure.Image
                                        style={{ maxWidth: '100%', maxHeight: '200px', display: 'block' }}
                                        src={`${serverUrl}/storage/stations/${thumbnailFilename}`}
                                    />
                                </Figure>
                                <Button
                                    size='sm'
                                    variant='light'
                                    disabled={isLoading}
                                    onClick={() => setReplacingThumbnail(true)}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #dee2e6',
                                        zIndex: 10,
                                    }}
                                >
                                    <FontAwesomeIcon icon={['fas', 'arrows-rotate']} className='me-1' />
                                    Replace
                                </Button>
                            </div>
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
                                        isInvalid={!!errors?.thumbnail}
                                        onChange={(e) => onThumbnailChange(e.target.files[0])}
                                    />
                                    {errors?.thumbnail && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.thumbnail[0]}
                                        </Form.Control.Feedback>
                                    )}
                                </InputGroup>
                                {thumbnailFilename && (
                                    <Button
                                        size='sm'
                                        variant='link'
                                        className='ps-0 mt-1 text-secondary'
                                        onClick={handleCancelThumbnailReplace}
                                    >
                                        Cancel replace
                                    </Button>
                                )}
                            </>
                        )}
                    </div>

                    <div>
                        <Form.Label className='fw-semibold small text-muted mb-2'>
                            Banner <small className='text-muted'>(detail page hero, wide/landscape)</small>
                        </Form.Label>
                        {bannerFilename && !replacingBanner ? (
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem', width: '100%' }}>
                                <Figure className='mb-0'>
                                    <Figure.Image
                                        style={{ maxWidth: '100%', maxHeight: '200px', display: 'block' }}
                                        src={`${serverUrl}/storage/stations/${bannerFilename}`}
                                    />
                                </Figure>
                                <Button
                                    size='sm'
                                    variant='light'
                                    disabled={isLoading}
                                    onClick={() => setReplacingBanner(true)}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #dee2e6',
                                        zIndex: 10,
                                    }}
                                >
                                    <FontAwesomeIcon icon={['fas', 'arrows-rotate']} className='me-1' />
                                    Replace
                                </Button>
                            </div>
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
                                        isInvalid={!!errors?.banner}
                                        onChange={(e) => onBannerChange(e.target.files[0])}
                                    />
                                    {errors?.banner && (
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.banner[0]}
                                        </Form.Control.Feedback>
                                    )}
                                </InputGroup>
                                {bannerFilename && (
                                    <Button
                                        size='sm'
                                        variant='link'
                                        className='ps-0 mt-1 text-secondary'
                                        onClick={handleCancelBannerReplace}
                                    >
                                        Cancel replace
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default HtmlForm
