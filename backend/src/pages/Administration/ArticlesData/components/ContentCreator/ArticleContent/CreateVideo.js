import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Form, Modal, Spinner, Table } from 'react-bootstrap'
import { appendFormData } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'

const serverUrl = process.env.REACT_APP_SERVER_URL
const storagePath = `${serverUrl}/storage/assets`

const TreeNode = ({ node, selectedId, onSelect, depth = 0 }) => {
    const [open, setOpen] = useState(depth < 1)
    const children = node.children || []
    const hasChildren = children.length > 0
    const isSelected = node.id === selectedId

    return (
        <div>
            <div
                onClick={() => onSelect(node.id)}
                className='d-flex align-items-center gap-2 rounded px-2 py-1'
                style={{
                    paddingLeft: `${depth * 20 + 8}px`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#0d6efd' : 'transparent',
                    color: isSelected ? 'white' : 'inherit',
                }}
            >
                <span
                    style={{ width: '16px', flexShrink: 0, textAlign: 'center', cursor: hasChildren ? 'pointer' : 'default' }}
                    onClick={(e) => { e.stopPropagation(); if (hasChildren) setOpen(o => !o) }}
                >
                    {hasChildren && (
                        <FontAwesomeIcon icon={['fas', open ? 'chevron-down' : 'chevron-right']} style={{ fontSize: '0.7rem' }} />
                    )}
                </span>
                <FontAwesomeIcon icon={['fas', 'folder']} style={{ color: isSelected ? 'inherit' : '#ffc107', fontSize: '0.9rem' }} />
                <span style={{ fontSize: '0.9rem' }}>{node.name}</span>
            </div>
            {open && hasChildren && children.map(child => (
                <TreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
            ))}
        </div>
    )
}

export default function CreateVideo() {
    const store = useStore()
    const { parentId } = useParams()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // VOD picker
    const [vods, setVods] = useState([])
    const [vodsLoading, setVodsLoading] = useState(false)
    const [selectedVod, setSelectedVod] = useState(null)

    // Poster picker (asset browser - images only)
    const [assetTree, setAssetTree] = useState([])
    const [treeLoading, setTreeLoading] = useState(false)
    const [selectedFolder, setSelectedFolder] = useState(null)
    const [files, setFiles] = useState([])
    const [filesLoading, setFilesLoading] = useState(false)
    const [selectedPoster, setSelectedPoster] = useState(null)

    const handleShowClick = () => {
        store.setValue('errors', null)
        setSelectedVod(null)
        setSelectedPoster(null)
        setSelectedFolder(null)
        setShow(true)

        // Load VODs
        setVodsLoading(true)
        axios({ method: 'get', url: `${store.url}/vods/list-videos` })
            .then(res => setVods(res.data.vods || []))
            .catch(err => console.warn(err))
            .finally(() => setVodsLoading(false))

        // Load asset tree
        setTreeLoading(true)
        axios({ method: 'get', url: `${store.url}/assets/tree` })
            .then(res => setAssetTree(res.data.tree || []))
            .catch(err => console.warn(err))
            .finally(() => setTreeLoading(false))
    }

    const handleCloseClick = () => {
        store.setValue('refresh', true)
        setShow(false)
    }

    // Load images when folder selected
    useEffect(() => {
        if (!selectedFolder) { setFiles([]); return }
        setFilesLoading(true)
        axios({ method: 'get', url: `${store.url}/assets/node/${selectedFolder}?per_page=100` })
            .then(res => {
                const all = res.data.assets?.data || []
                setFiles(all.filter(a => a.type === 'file' && a.mimetype?.startsWith('image/')))
            })
            .catch(err => console.warn(err))
            .finally(() => setFilesLoading(false))
    }, [selectedFolder])

    const handleSubmitClick = () => {
        if (!selectedVod) return

        setIsLoading(true)
        const formData = new FormData()
        appendFormData(formData, [
            { key: 'title', value: 'Video' },
            { key: 'parent_id', value: parentId },
            { key: 'contents', value: 'video' },
            { key: 'vod_id', value: selectedVod },
            { key: 'video_poster', value: selectedPoster },
        ])
        formData.append('_method', 'post')

        axios({ method: 'post', url: `${store.url}/article-data`, data: formData })
            .then(() => {
                store.setValue('refresh', true)
                setIsLoading(false)
                setShow(false)
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    store.setValue('errors', error.response.data.errors)
                }
                setIsLoading(false)
            })
    }

    const selectedVodData = vods.find(v => v.id === selectedVod)

    return (
        <>
            <Button variant="outline-primary" size="sm" onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'video']} />{' '}VIDEO
            </Button>

            <Modal size='xl' show={show} onHide={handleCloseClick}>
                <Modal.Header closeButton>
                    <Modal.Title className='fs-6'>
                        <FontAwesomeIcon icon={['fas', 'video']} className='me-2' />
                        Add Video Block
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* Step 1: Select VOD */}
                    <h6 className='mb-2'>1. Select Video</h6>
                    {vodsLoading ? (
                        <div className='text-center py-3'><Spinner animation='border' size='sm' /></div>
                    ) : (
                        <Form.Select
                            value={selectedVod || ''}
                            onChange={e => setSelectedVod(Number(e.target.value) || null)}
                            className='mb-3'
                        >
                            <option value=''>-- Choose a video --</option>
                            {vods.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </Form.Select>
                    )}

                    {selectedVodData && (
                        <div className='bg-light rounded p-2 mb-3 text-center'>
                            <small className='text-muted'>
                                <FontAwesomeIcon icon={['fas', 'check-circle']} className='text-success me-1' />
                                Selected: <strong>{selectedVodData.name}</strong>
                            </small>
                        </div>
                    )}

                    {/* Step 2: Select poster (optional) */}
                    <h6 className='mb-2'>2. Select Poster Image <span className='text-muted fw-normal'>(optional)</span></h6>

                    {selectedPoster && (
                        <div className='mb-3 p-2 bg-light rounded d-flex align-items-center gap-2'>
                            <img src={`${storagePath}/${selectedPoster}`} alt='Poster' className='rounded' style={{ height: '60px', objectFit: 'cover' }} />
                            <small className='text-muted flex-grow-1'>{selectedPoster}</small>
                            <Button size='sm' variant='outline-danger' onClick={() => setSelectedPoster(null)}>
                                <FontAwesomeIcon icon={['fas', 'xmark']} />
                            </Button>
                        </div>
                    )}

                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='border rounded' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {treeLoading ? (
                                    <div className='text-center py-3'><Spinner animation='border' size='sm' /></div>
                                ) : assetTree.length === 0 ? (
                                    <div className='text-center text-muted py-3 small'>No asset folders</div>
                                ) : assetTree.map(node => (
                                    <TreeNode key={node.id} node={node} selectedId={selectedFolder} onSelect={setSelectedFolder} />
                                ))}
                            </div>
                        </div>
                        <div className='col-md-8'>
                            {!selectedFolder ? (
                                <div className='text-center text-muted py-4 small'>
                                    <FontAwesomeIcon icon={['fas', 'arrow-left']} className='me-1' />
                                    Select a folder to browse images
                                </div>
                            ) : filesLoading ? (
                                <div className='text-center py-4'><Spinner animation='border' size='sm' /></div>
                            ) : files.length === 0 ? (
                                <div className='text-center text-muted py-4 small'>No images in this folder</div>
                            ) : (
                                <div className='row g-2' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {files.map(file => (
                                        <div key={file.id} className='col-4 col-md-3'>
                                            <div
                                                onClick={() => setSelectedPoster(file.name)}
                                                className={`border rounded p-1 text-center ${selectedPoster === file.name ? 'border-primary border-2' : ''}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={`${storagePath}/${file.name}`}
                                                    alt={file.name}
                                                    className='rounded'
                                                    style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                                                />
                                                <div className='text-truncate small mt-1'>{file.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseClick}>Close</Button>
                    <Button
                        variant='primary'
                        onClick={handleSubmitClick}
                        disabled={isLoading || !selectedVod}
                    >
                        {isLoading ? <Spinner animation='border' size='sm' /> : 'Add Video Block'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
