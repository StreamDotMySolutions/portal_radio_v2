import { useEffect, useState } from 'react'
import {
    Badge,
    Button,
    Card,
    Form,
    Table,
    Spinner,
    Alert,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../libs/axios'
import BreadCrumb from '../../../libs/BreadCrumb'
import DataTable from './components/DataTable'

const breadcrumbItems = [
    { url: '/', label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge> },
    { url: '/administration/footer', label: 'Footer Management' },
]

export default function FooterManagement() {
    const baseUrl = process.env.REACT_APP_BACKEND_URL
    const settingsUrl = `${baseUrl}/settings`

    // Footer text settings state
    const [settings, setSettings] = useState([])
    const [isLoadingSettings, setIsLoadingSettings] = useState(true)
    const [editingKey, setEditingKey] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    // Load footer text settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoadingSettings(true)
                const res = await axios({ method: 'get', url: settingsUrl })
                // Filter to footer_* keys only
                const footerSettings = (res.data.settings || []).filter(
                    (s) => s.key.startsWith('footer_')
                )
                setSettings(footerSettings)
                setError(null)
            } catch (err) {
                console.warn(err)
                setError('Failed to load footer text settings')
            } finally {
                setIsLoadingSettings(false)
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
            const settingUrl = `${baseUrl}/settings/${key}`
            await axios({
                method: 'put',
                url: settingUrl,
                data: { value: editValue },
            })

            // Update local state
            setSettings(
                settings.map((s) =>
                    s.key === key ? { ...s, value: editValue } : s
                )
            )
            setEditingKey(null)
            setError(null)
        } catch (err) {
            console.warn(err)
            setError('Failed to save footer text setting')
        } finally {
            setIsSaving(false)
        }
    }

    // Helper to display friendly labels for footer_ keys
    const getLabel = (key) => {
        const labels = {
            footer_description: 'Description',
            footer_phone: 'Phone',
            footer_email: 'Email',
            footer_address: 'Address',
            footer_copyright: 'Copyright',
        }
        return labels[key] || key.replace('footer_', '')
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />

            {error && <Alert variant='danger'>{error}</Alert>}

            {/* Footer Text Settings Card */}
            <Card className='mb-4'>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon
                        icon={['fas', 'sliders']}
                        className='me-2 text-secondary'
                    />
                    Footer Text Settings
                </Card.Header>
                <Card.Body>
                    {isLoadingSettings ? (
                        <div className='text-center py-4'>
                            <Spinner
                                animation='border'
                                role='status'
                                size='sm'
                                className='me-2'
                            />
                            Loading settings...
                        </div>
                    ) : settings.length === 0 ? (
                        <div className='text-muted text-center py-4'>
                            No footer settings found
                        </div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead className='table-light'>
                                <tr>
                                    <th style={{ width: '25%' }}>Field</th>
                                    <th style={{ width: '55%' }}>Value</th>
                                    <th style={{ width: '20%' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.map((setting) => (
                                    <tr key={setting.id}>
                                        {/* Field Label */}
                                        <td>
                                            <code style={{ fontSize: '0.9rem' }}>
                                                {getLabel(setting.key)}
                                            </code>
                                        </td>

                                        {/* Value */}
                                        {editingKey === setting.key ? (
                                            <td>
                                                <Form.Control
                                                    as={
                                                        setting.key ===
                                                        'footer_description'
                                                            ? 'textarea'
                                                            : 'input'
                                                    }
                                                    type='text'
                                                    size='sm'
                                                    value={editValue}
                                                    onChange={(e) =>
                                                        setEditValue(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoFocus
                                                    rows={
                                                        setting.key ===
                                                        'footer_description'
                                                            ? 3
                                                            : 1
                                                    }
                                                />
                                            </td>
                                        ) : (
                                            <td style={{ fontSize: '0.9rem' }}>
                                                {setting.value || '(empty)'}
                                            </td>
                                        )}

                                        {/* Actions */}
                                        <td>
                                            {editingKey === setting.key ? (
                                                <div className='d-flex gap-1'>
                                                    <Button
                                                        size='sm'
                                                        variant='primary'
                                                        onClick={() =>
                                                            handleSave(
                                                                setting.key
                                                            )
                                                        }
                                                        disabled={isSaving}
                                                        className='py-1 px-2'
                                                        style={{
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        {isSaving ? (
                                                            <>
                                                                <Spinner
                                                                    animation='border'
                                                                    size='sm'
                                                                    className='me-1'
                                                                />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FontAwesomeIcon
                                                                    icon={[
                                                                        'fas',
                                                                        'check',
                                                                    ]}
                                                                    className='me-1'
                                                                />
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
                                                        style={{
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={[
                                                                'fas',
                                                                'xmark',
                                                            ]}
                                                        />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size='sm'
                                                    variant='outline-primary'
                                                    onClick={() =>
                                                        handleEdit(
                                                            setting.key,
                                                            setting.value
                                                        )
                                                    }
                                                    className='py-1 px-2'
                                                    style={{
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={['fas', 'pen']}
                                                    />{' '}
                                                    Edit
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

            {/* Footer Links Card */}
            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon
                        icon={['fas', 'link']}
                        className='me-2 text-secondary'
                    />
                    Footer Links
                </Card.Header>
                <Card.Body>
                    <DataTable />
                </Card.Body>
            </Card>
        </>
    )
}
