import { useEffect, useState } from 'react'
import { Badge, Button, Card, Form, Table, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../libs/axios'
import BreadCrumb from '../../../libs/BreadCrumb'

const breadcrumbItems = [
    { url: '/', label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge> },
    { url: '', label: 'System' },
    { url: '', label: 'Settings' },
]

export default function SettingsManagement() {
    const url = process.env.REACT_APP_BACKEND_URL + '/settings'

    const [settings, setSettings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingKey, setEditingKey] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Load all settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true)
                const res = await axios({ method: 'get', url })
                setSettings(res.data.settings || [])
                setError(null)
            } catch (err) {
                console.warn(err)
                setError('Failed to load settings')
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()
    }, [])

    // Start editing a setting
    const handleEdit = (key, value) => {
        setEditingKey(key)
        setEditValue(value || '')
    }

    // Cancel editing
    const handleCancel = () => {
        setEditingKey(null)
        setEditValue('')
    }

    // Save a setting
    const handleSave = async (key) => {
        setIsSaving(true)
        try {
            const settingUrl = `${process.env.REACT_APP_BACKEND_URL}/settings/${key}`
            await axios({ method: 'put', url: settingUrl, data: { value: editValue } })

            // Update local state
            setSettings(settings.map(s =>
                s.key === key ? { ...s, value: editValue } : s
            ))
            setEditingKey(null)
            setError(null)
        } catch (err) {
            console.warn(err)
            setError('Failed to save setting')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className='p-3 text-center'>
                <Spinner animation='border' role='status' size='sm' className='me-2' />
                Loading settings...
            </div>
        )
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />

            {error && <Alert variant='danger'>{error}</Alert>}

            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'sliders']} className='me-2 text-secondary' />
                    Global Settings
                </Card.Header>
                <Card.Body>
                    {settings.length === 0 ? (
                        <div className='text-muted text-center py-4'>No settings configured</div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead className='table-light'>
                                <tr>
                                    <th style={{ width: '20%' }}>Key</th>
                                    <th style={{ width: '40%' }}>Description</th>
                                    <th style={{ width: '30%' }}>Value</th>
                                    <th style={{ width: '10%' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.map((setting) => (
                                    <tr key={setting.id}>
                                        {/* Key */}
                                        <td>
                                            <code style={{ fontSize: '0.85rem' }}>{setting.key}</code>
                                        </td>

                                        {/* Description */}
                                        <td style={{ fontSize: '0.9rem' }}>
                                            {setting.description || '—'}
                                        </td>

                                        {/* Value */}
                                        {editingKey === setting.key ? (
                                            <td>
                                                <Form.Control
                                                    type='text'
                                                    size='sm'
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    autoFocus
                                                />
                                            </td>
                                        ) : (
                                            <td>
                                                <code style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                                                    {setting.value || '(empty)'}
                                                </code>
                                            </td>
                                        )}

                                        {/* Actions */}
                                        <td>
                                            {editingKey === setting.key ? (
                                                <div className='d-flex gap-1'>
                                                    <Button
                                                        size='sm'
                                                        variant='primary'
                                                        onClick={() => handleSave(setting.key)}
                                                        disabled={isSaving}
                                                        className='py-1 px-2'
                                                        style={{ fontSize: '0.75rem' }}
                                                    >
                                                        {isSaving ? (
                                                            <>
                                                                <Spinner animation='border' size='sm' className='me-1' />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FontAwesomeIcon icon={['fas', 'check']} className='me-1' />
                                                                Save
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size='sm'
                                                        variant='outline-secondary'
                                                        onClick={handleCancel}
                                                        disabled={isSaving}
                                                        className='py-1 px-2'
                                                        style={{ fontSize: '0.75rem' }}
                                                    >
                                                        <FontAwesomeIcon icon={['fas', 'xmark']} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size='sm'
                                                    variant='outline-primary'
                                                    onClick={() => handleEdit(setting.key, setting.value)}
                                                    className='py-1 px-2'
                                                    style={{ fontSize: '0.75rem' }}
                                                >
                                                    <FontAwesomeIcon icon={['fas', 'pen']} /> Edit
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </>
    )
}
