import { Badge, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'

export const fmtDuration = (seconds) => {
    const s = Math.round(seconds || 0)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export const fmtSize = (bytes) => {
    if (!bytes) return '—'
    const mb = bytes / 1048576
    return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`
}

export const StatusBadge = ({ status, error }) => {
    switch (status) {
        case 'ready':
            return <Badge bg='success'>Ready</Badge>
        case 'processing':
            return <Badge bg='info'><Spinner animation='border' size='sm' className='me-1' style={{ width: '0.7rem', height: '0.7rem' }} />Processing</Badge>
        case 'failed':
            return (
                <OverlayTrigger placement='top' overlay={<Tooltip>{error || 'Transcode failed'}</Tooltip>}>
                    <Badge bg='danger' style={{ cursor: 'help' }}>Failed</Badge>
                </OverlayTrigger>
            )
        default:
            return <Badge bg='secondary'>Pending</Badge>
    }
}
