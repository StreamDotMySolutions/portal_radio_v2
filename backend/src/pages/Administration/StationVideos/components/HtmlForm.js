import { Card, Form, InputGroup, ProgressBar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const MAX_MB = Number(process.env.REACT_APP_STATION_VIDEO_MAX_MB || 1024)

// `editing`: the station is fixed and the file is optional (a new one is transcoded again)
const HtmlForm = ({ form, onChange, stations, onFileChange, errors, isLoading, progress, editing = false, currentStation }) => {
    return (
        <div className='d-flex flex-column gap-3'>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2 text-secondary' />
                    Basic Info
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-3'>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>Station</InputGroup.Text>
                        {editing ? (
                            <Form.Control value={currentStation ?? ''} readOnly disabled />
                        ) : (
                            <Form.Select
                                value={form.stationId}
                                disabled={isLoading}
                                isInvalid={!!errors?.station_id}
                                onChange={(e) => onChange('stationId')(e.target.value)}
                            >
                                <option value=''>— Select station —</option>
                                {stations.map((s) => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                ))}
                            </Form.Select>
                        )}
                        {errors?.station_id && <Form.Control.Feedback type='invalid'>{errors.station_id[0]}</Form.Control.Feedback>}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>Title</InputGroup.Text>
                        <Form.Control
                            placeholder='Enter video title'
                            value={form.title}
                            readOnly={isLoading}
                            isInvalid={!!errors?.title}
                            onChange={(e) => onChange('title')(e.target.value)}
                        />
                        {errors?.title && <Form.Control.Feedback type='invalid'>{errors.title[0]}</Form.Control.Feedback>}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '110px' }}>Description</InputGroup.Text>
                        <Form.Control
                            as='textarea'
                            rows={3}
                            placeholder='Optional'
                            value={form.description}
                            readOnly={isLoading}
                            isInvalid={!!errors?.description}
                            onChange={(e) => onChange('description')(e.target.value)}
                        />
                        {errors?.description && <Form.Control.Feedback type='invalid'>{errors.description[0]}</Form.Control.Feedback>}
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'film']} className='me-2 text-secondary' />
                    Video File
                </Card.Header>
                <Card.Body>
                    <p className='text-muted small mb-2'>
                        {editing
                            ? 'Leave empty to keep the current video. A new file replaces it once converted.'
                            : `MP4, MOV, AVI, MKV, WebM or MPEG, up to ${MAX_MB} MB.`}
                        {' '}It is converted to adaptive HLS (1080p / 720p / 480p) in the background, which takes a few minutes.
                    </p>
                    <Form.Control
                        type='file'
                        accept='video/*'
                        disabled={isLoading}
                        isInvalid={!!errors?.file}
                        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                    />
                    {errors?.file && <Form.Control.Feedback type='invalid' className='d-block'>{errors.file[0]}</Form.Control.Feedback>}
                    {progress !== null && (
                        <ProgressBar
                            className='mt-3'
                            now={progress}
                            label={progress < 100 ? `Uploading ${progress}%` : 'Saving…'}
                            animated={progress >= 100}
                        />
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default HtmlForm
