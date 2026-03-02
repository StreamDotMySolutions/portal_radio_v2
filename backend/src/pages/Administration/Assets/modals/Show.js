import { useState } from 'react'
import { Badge, Button, Modal, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import axios from '../../../../libs/axios'

const serverUrl = process.env.REACT_APP_SERVER_URL
const storagePath = `${serverUrl}/storage/assets`

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
                    <FontAwesomeIcon icon={['fas', 'file']} className='text-secondary me-2' />
                    <a
                        href={`${storagePath}/${node.name}`}
                        target='_blank'
                        rel='noreferrer'
                        className='me-2 text-truncate'
                        style={{ maxWidth: '300px' }}
                    >
                        {node.name}
                    </a>
                    {node.mimetype && <Badge bg='secondary' className='me-2'>{node.mimetype}</Badge>}
                    <span className='text-muted small ms-auto pe-2'>{formatBytes(node.filesize)}</span>
                </>
            )}
        </div>
        {node.children?.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </>
)

export default function ShowModal({ id }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [asset, setAsset] = useState(null)
    const [copied, setCopied] = useState(false)

    const handleShowClick = () => {
        setShow(true)
        setAsset(null)
        setCopied(false)

        axios({ method: 'get', url: `${store.url}/assets/${id}` })
            .then(response => setAsset(response?.data?.asset))
            .catch(error => console.warn(error))
    }

    const handleClose = () => setShow(false)

    const fileUrl = asset ? `${storagePath}/${asset.name}` : ''

    const handleCopy = () => {
        navigator.clipboard.writeText(fileUrl).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    const treeData = asset?.descendants ? buildTree(asset.descendants, asset.id) : []

    return (
        <>
            <Button size='sm' variant='outline-info' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {asset?.type === 'folder'
                            ? <><FontAwesomeIcon icon={['fas', 'folder']} className='text-warning me-2' />{asset.name}</>
                            : 'Asset Details'
                        }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {!asset ? (
                        <div className='text-center py-4 text-muted'>
                            <FontAwesomeIcon icon={['fas', 'spinner']} spin className='me-2' />
                            Loading...
                        </div>
                    ) : asset.type === 'file' ? (
                        <>
                            <Table borderless className='mb-3'>
                                <tbody>
                                    <tr>
                                        <th style={{ width: '130px' }} className='text-muted fw-normal'>Name</th>
                                        <td style={{ wordBreak: 'break-all' }}>{asset.name}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Mimetype</th>
                                        <td><Badge bg='secondary'>{asset.mimetype ?? '-'}</Badge></td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Size</th>
                                        <td>{formatBytes(asset.filesize)}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-muted fw-normal'>Uploaded</th>
                                        <td>{asset.created_at}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <div className='p-3 bg-light rounded'>
                                <div className='small text-muted mb-2'>File URL</div>
                                <div className='d-flex align-items-center gap-2'>
                                    <code className='flex-grow-1 text-break small'>{fileUrl}</code>
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
                        </>
                    ) : (
                        /* Folder tree view */
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
