import { useState, useEffect } from 'react'
import { Button, Table, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../../libs/axios'
import useStore from '../../../../store'

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

const AssetBrowser = () => {
    const store = useStore()
    const [tree, setTree] = useState([])
    const [treeLoading, setTreeLoading] = useState(true)
    const [selectedFolder, setSelectedFolder] = useState(null)
    const [files, setFiles] = useState([])
    const [filesLoading, setFilesLoading] = useState(false)
    const [copiedId, setCopiedId] = useState(null)

    useEffect(() => {
        axios({ method: 'get', url: `${store.url}/assets/tree` })
            .then(res => setTree(res.data.tree || []))
            .catch(err => console.warn(err))
            .finally(() => setTreeLoading(false))
    }, [])

    useEffect(() => {
        if (!selectedFolder) { setFiles([]); return }
        setFilesLoading(true)
        axios({ method: 'get', url: `${store.url}/assets/node/${selectedFolder}?per_page=100` })
            .then(res => {
                const all = res.data.assets?.data || []
                setFiles(all.filter(a => a.type === 'file'))
            })
            .catch(err => console.warn(err))
            .finally(() => setFilesLoading(false))
    }, [selectedFolder])

    const handleCopy = (filename, id) => {
        const url = `${storagePath}/${filename}`
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        })
    }

    if (treeLoading) return <div className='text-center py-4'><Spinner animation='border' size='sm' /></div>

    return (
        <div className='row'>
            <div className='col-md-4'>
                <div className='border rounded' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {tree.length === 0 ? (
                        <div className='text-center text-muted py-4'>No asset folders</div>
                    ) : tree.map(node => (
                        <TreeNode key={node.id} node={node} selectedId={selectedFolder} onSelect={setSelectedFolder} />
                    ))}
                </div>
            </div>
            <div className='col-md-8'>
                {!selectedFolder ? (
                    <div className='text-center text-muted py-4'>
                        <FontAwesomeIcon icon={['fas', 'arrow-left']} className='me-2' />
                        Select a folder to browse files
                    </div>
                ) : filesLoading ? (
                    <div className='text-center py-4'><Spinner animation='border' size='sm' /></div>
                ) : files.length === 0 ? (
                    <div className='text-center text-muted py-4'>No files in this folder</div>
                ) : (
                    <Table hover size='sm' style={{ '--bs-table-cell-padding-y': '0.5rem' }}>
                        <thead className='table-light'>
                            <tr>
                                <th>File</th>
                                <th style={{ width: '80px' }} className='text-center'>Copy URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map(file => (
                                <tr key={file.id}>
                                    <td>
                                        <FontAwesomeIcon icon={['fas', 'file']} className='me-2 text-secondary' />
                                        <small>{file.name}</small>
                                    </td>
                                    <td className='text-center'>
                                        <Button
                                            size='sm'
                                            variant={copiedId === file.id ? 'success' : 'outline-secondary'}
                                            onClick={() => handleCopy(file.name, file.id)}
                                        >
                                            <FontAwesomeIcon icon={['fas', copiedId === file.id ? 'check' : 'copy']} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </div>
    )
}

export default AssetBrowser
