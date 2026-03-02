import { useState } from 'react'
import { Badge, Button, Modal, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import axios from '../../../../libs/axios'

const formatBytes = (bytes) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const buildTree = (nodes, parentId) =>
    nodes
        .filter(n => n.parent_id === parentId)
        .map(n => ({ ...n, children: buildTree(nodes, n.id) }))

const TreeNode = ({ node, depth = 0 }) => (
    <>
        <div
            className='d-flex align-items-center py-1 border-bottom'
            style={{ paddingLeft: `${depth * 24 + 8}px` }}
        >
            {node.type === 'folder' ? (
                <>
                    <FontAwesomeIcon icon={['fas', 'folder']} className='text-warning me-2' />
                    <span className='fw-semibold'>{node.name}</span>
                </>
            ) : (
                <>
                    <FontAwesomeIcon icon={['fas', 'video']} className='text-secondary me-2' />
                    <span>{node.name}</span>
                </>
            )}
        </div>
        {node.children?.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </>
)

export default function ViewModal({ id }) {
    const store = useStore()
    const serverUrl = process.env.REACT_APP_SERVER_URL

    const [show, setShow] = useState(false)
    const [vod, setVod] = useState(null)
    const [copied, setCopied] = useState(false)
    const [copiedOriginal, setCopiedOriginal] = useState(false)

    const handleShowClick = () => {
        setShow(true)
        setVod(null)
        setCopied(false)
        setCopiedOriginal(false)

        axios({ method: 'get', url: `${store.url}/vods/${id}` })
            .then(response => setVod(response?.data?.vod))
            .catch(error => console.warn(error))
    }

    const handleClose = () => setShow(false)

    const hlsUrl      = vod ? `${serverUrl}/storage/vods/${vod.id}/playlist.m3u8` : ''
    const originalUrl = vod ? `${serverUrl}/storage/vods/${vod.name}` : ''

    const handleCopy = () => {
        navigator.clipboard.writeText(hlsUrl).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    const handleCopyOriginal = () => {
        navigator.clipboard.writeText(originalUrl).then(() => {
            setCopiedOriginal(true)
            setTimeout(() => setCopiedOriginal(false), 2000)
        })
    }

    const treeData = vod?.descendants ? buildTree(vod.descendants, vod.id) : []

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {vod?.type === 'folder'
                            ? <><FontAwesomeIcon icon={['fas', 'folder']} className='text-warning me-2' />{vod.name}</>
                            : 'VOD Details'
                        }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {!vod ? (
                        <div className='text-center py-4 text-muted'>
                            <FontAwesomeIcon icon={['fas', 'spinner']} spin className='me-2' />
                            Loading...
                        </div>
                    ) : vod.type === 'file' ? (
                        <>
                            <Table borderless className='mb-3'>
                                <tbody>
                                    <tr>
                                        <th style={{ width: '130px' }} className='text-muted fw-normal'>Name</th>
                                        <td style={{ wordBreak: 'break-all' }}>{vod.name}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Mimetype</th>
                                        <td><Badge bg='secondary'>{vod.mimetype ?? '-'}</Badge></td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Original size</th>
                                        <td>{formatBytes(vod.filesize)}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>HLS size</th>
                                        <td>
                                            {vod.hls_size
                                                ? formatBytes(vod.hls_size)
                                                : <span className='text-muted small fst-italic'>Processing...</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Uploaded</th>
                                        <td>{vod.created_at}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <div className='p-3 bg-light rounded mb-2'>
                                <div className='small text-muted mb-2'>HLS Stream URL</div>
                                <div className='d-flex align-items-center gap-2'>
                                    <code className='flex-grow-1 text-break small'>{hlsUrl}</code>
                                    <Button
                                        size='sm'
                                        variant={copied ? 'success' : 'outline-secondary'}
                                        onClick={handleCopy}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        <FontAwesomeIcon icon={['fas', copied ? 'check' : 'copy']} className='me-1' />
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>
                            </div>

                            <div className='p-3 bg-light rounded'>
                                <div className='small text-muted mb-2'>Original Video URL</div>
                                <div className='d-flex align-items-center gap-2'>
                                    <code className='flex-grow-1 text-break small'>{originalUrl}</code>
                                    <Button
                                        size='sm'
                                        variant={copiedOriginal ? 'success' : 'outline-secondary'}
                                        onClick={handleCopyOriginal}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        <FontAwesomeIcon icon={['fas', copiedOriginal ? 'check' : 'copy']} className='me-1' />
                                        {copiedOriginal ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='border rounded overflow-hidden'>
                            {treeData.length === 0 ? (
                                <div className='text-center text-muted py-4'>This folder is empty.</div>
                            ) : (
                                treeData.map(node => (
                                    <TreeNode key={node.id} node={node} depth={0} />
                                ))
                            )}
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
