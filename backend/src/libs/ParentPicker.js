import React, { useState, useEffect } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from './axios'

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

const TreeNode = ({ node, selectedId, disabledId, onSelect, depth, isLast = true, parentOpen = true }) => {
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

    const treeLineHeight = '1.5rem'
    const indentSize = 20

    return (
        <div style={{ position: 'relative' }}>
            {/* Vertical connector line from parent */}
            {depth > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${(depth - 1) * indentSize + 10}px`,
                        top: `-${parseInt(treeLineHeight) / 2}px`,
                        width: '1px',
                        height: treeLineHeight,
                        backgroundColor: '#ddd',
                    }}
                />
            )}

            {/* Horizontal connector line */}
            {depth > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${(depth - 1) * indentSize + 10}px`,
                        top: '50%',
                        width: `${indentSize}px`,
                        height: '1px',
                        backgroundColor: '#ddd',
                        transform: 'translateY(-50%)',
                    }}
                />
            )}

            {/* Node container */}
            <div
                onClick={handleSelect}
                style={{
                    paddingLeft: `${depth * indentSize + 8}px`,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    height: treeLineHeight,
                    display: 'flex',
                    alignItems: 'center',
                }}
                className={`d-flex align-items-center gap-2 rounded transition-all ${
                    isSelected ? 'bg-primary text-white' : isDisabled ? 'text-muted opacity-50' : ''
                }`}
                style={{
                    paddingLeft: `${depth * indentSize + 8}px`,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    height: treeLineHeight,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isSelected ? '#0d6efd' : 'transparent',
                    color: isSelected ? 'white' : isDisabled ? '#999' : 'inherit',
                    borderRadius: '0.25rem',
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem',
                    paddingRight: '0.5rem',
                }}
            >
                {/* Toggle button */}
                <span
                    style={{
                        width: '16px',
                        flexShrink: 0,
                        textAlign: 'center',
                        cursor: hasChildren ? 'pointer' : 'default',
                        opacity: hasChildren ? 1 : 0.3,
                    }}
                    onClick={hasChildren ? handleToggle : undefined}
                >
                    {hasChildren && (
                        <FontAwesomeIcon
                            icon={['fas', open ? 'chevron-down' : 'chevron-right']}
                            style={{ fontSize: '0.7rem' }}
                        />
                    )}
                    {!hasChildren && (
                        <FontAwesomeIcon
                            icon={['fas', 'minus']}
                            style={{ fontSize: '0.6rem' }}
                        />
                    )}
                </span>

                {/* Folder icon */}
                <FontAwesomeIcon
                    icon={['fas', 'folder']}
                    style={{
                        fontSize: '0.9rem',
                        color: isSelected ? 'inherit' : '#ffc107',
                    }}
                />

                {/* Label */}
                <span style={{ fontSize: '0.9rem', fontWeight: depth === 0 ? '600' : '400' }}>
                    {node.name}
                </span>
            </div>

            {/* Children */}
            {open && hasChildren && (
                <div>
                    {children.map((child, index) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            selectedId={selectedId}
                            disabledId={disabledId}
                            onSelect={onSelect}
                            depth={depth + 1}
                            isLast={index === children.length - 1}
                            parentOpen={open}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

/**
 * ParentPicker - Generic parent selector for nested set models
 * @param {string} endpoint - API endpoint to fetch tree (e.g., '/directories/tree', '/articles/tree')
 * @param {number} currentId - Current node ID to disable from being selected as parent
 * @param {number} value - Currently selected parent ID
 * @param {function} onChange - Callback when parent selection changes
 * @param {string} selectionLabel - Label for selected parent display (default: "Selected parent")
 * @param {string} instructionText - Help text for user (default: "Click a folder...")
 */
const ParentPicker = ({
    endpoint,
    currentId,
    value,
    onChange,
    selectionLabel = 'Selected parent',
    instructionText = 'Click a folder to set it as the parent. The current item is disabled.'
}) => {
    const [tree, setTree] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        axios({ method: 'get', url: endpoint })
            .then(response => {
                const treeData = response.data.tree || []
                setTree(treeData)
                setError(null)
            })
            .catch(err => {
                console.error(`Error loading tree from ${endpoint}:`, err)
                setError(`Failed to load items from ${endpoint}`)
                setTree([])
            })
            .finally(() => setLoading(false))
    }, [endpoint])

    if (loading) return <div className='text-center py-4'><Spinner animation='border' size='sm' /></div>

    if (error) return <Alert variant='danger'>{error}</Alert>

    const selectedNode = value ? findNode(tree, value) : null

    return (
        <div>
            <div className='mb-3 p-2 bg-light rounded border'>
                <small className='text-muted d-block mb-1'>{selectionLabel}</small>
                {selectedNode
                    ? <span className='fw-semibold'><FontAwesomeIcon icon={['fas', 'folder']} className='text-warning me-2' />{selectedNode.name}</span>
                    : <span className='text-muted fst-italic'>None selected</span>
                }
            </div>

            <div className='border rounded' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {tree.length > 0 ? (
                    tree.map(node => (
                        <TreeNode
                            key={node.id}
                            node={node}
                            selectedId={value}
                            disabledId={currentId}
                            onSelect={onChange}
                            depth={0}
                        />
                    ))
                ) : (
                    <div className='text-center py-4 text-muted'>
                        No items available
                    </div>
                )}
            </div>

            <small className='text-muted mt-2 d-block'>
                <FontAwesomeIcon icon={['fas', 'circle-info']} className='me-1' />
                {instructionText}
            </small>
        </div>
    )
}

export default ParentPicker
