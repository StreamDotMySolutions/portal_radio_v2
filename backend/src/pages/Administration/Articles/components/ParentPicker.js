import React, { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'

const findNode = (nodes, id) => {
    for (const node of nodes) {
        if (node.id === id) return node
        if (node.children?.length) {
            const found = findNode(node.children, id)
            if (found) return found
        }
    }
    return null
}

const TreeNode = ({ node, selectedId, disabledId, onSelect, depth }) => {
    const [open, setOpen] = useState(depth < 2)
    const children = node.children || []
    const hasChildren = children.length > 0
    const isSelected = node.id === selectedId
    const isDisabled = node.id === disabledId

    const handleToggle = (e) => {
        e.stopPropagation()
        setOpen(o => !o)
    }

    const handleSelect = () => {
        if (!isDisabled) onSelect(node.id)
    }

    return (
        <div>
            <div
                onClick={handleSelect}
                style={{
                    paddingLeft: `${depth * 18 + 8}px`,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
                className={`d-flex align-items-center gap-2 py-1 px-2 rounded ${
                    isSelected ? 'bg-primary text-white' : isDisabled ? 'text-muted' : 'hover-bg'
                }`}
            >
                <span
                    style={{ width: '14px', flexShrink: 0 }}
                    onClick={hasChildren ? handleToggle : undefined}
                >
                    {hasChildren && (
                        <FontAwesomeIcon
                            icon={['fas', open ? 'chevron-down' : 'chevron-right']}
                            style={{ fontSize: '0.65rem' }}
                        />
                    )}
                </span>

                <FontAwesomeIcon
                    icon={['fas', node.type === 'folder'
                        ? (open && hasChildren ? 'folder-open' : 'folder')
                        : 'file'
                    ]}
                    className={isSelected ? '' : node.type === 'folder' ? 'text-warning' : 'text-secondary'}
                    style={{ fontSize: '0.85rem' }}
                />

                <span style={{ fontSize: '0.9rem' }}>{node.title}</span>
            </div>

            {open && hasChildren && children.map(child => (
                <TreeNode
                    key={child.id}
                    node={child}
                    selectedId={selectedId}
                    disabledId={disabledId}
                    onSelect={onSelect}
                    depth={depth + 1}
                />
            ))}
        </div>
    )
}

const ParentPicker = ({ currentId, value, onChange }) => {
    const [tree, setTree]       = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/articles/tree` })
            .then(response => setTree(response.data.tree || []))
            .catch(error => console.warn(error))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className='text-center py-4'><Spinner animation='border' size='sm' /></div>

    const selectedNode = value ? findNode(tree, value) : null

    return (
        <div>
            <div className='mb-3 p-2 bg-light rounded border'>
                <small className='text-muted d-block mb-1'>Selected parent</small>
                {selectedNode
                    ? <span className='fw-semibold'><FontAwesomeIcon icon={['fas', 'folder']} className='text-warning me-2' />{selectedNode.title}</span>
                    : <span className='text-muted fst-italic'>None selected</span>
                }
            </div>

            <div className='border rounded' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {tree.map(node => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        selectedId={value}
                        disabledId={currentId}
                        onSelect={onChange}
                        depth={0}
                    />
                ))}
            </div>

            <small className='text-muted mt-2 d-block'>
                <FontAwesomeIcon icon={['fas', 'circle-info']} className='me-1' />
                Click a folder to set it as the parent. The current article is disabled.
            </small>
        </div>
    )
}

export default ParentPicker
