import { useState } from 'react'
import { Button, Modal, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import ParentPicker from '../../../../libs/ParentPicker'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'

export default function EditModal({ id }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('details')
    const [parentId, setParentId] = useState(null)

    const handleClose = () => {
        setShow(false)
        setActiveTab('details')
    }

    const handleShowClick = () => {
        store.emptyData()
        setActiveTab('details')
        setShow(true)

        axios({ method: 'get', url: `${store.url}/directories/${id}` })
            .then(response => {
                const d = response.data.directory
                store.setValue('type', d.type)
                store.setValue('name', d.name)
                setParentId(d.parent_id ?? null)
                if (d.type === 'spreadsheet') {
                    store.setValue('photo', d.photo)
                    store.setValue('occupation', d.occupation)
                    store.setValue('email', d.email)
                    store.setValue('phone', d.phone)
                    store.setValue('address', d.address)
                    store.setValue('facebook', d.facebook)
                    store.setValue('twitter', d.twitter)
                    store.setValue('instagram', d.instagram)
                }
            })
            .catch(error => {
                console.error('Error fetching directory:', error)
                alert('Failed to load directory data')
            })
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        const type = store.getValue('type')
        const formData = new FormData()

        const fields = [
            { key: 'name', value: store.getValue('name') },
            { key: 'parent_id', value: parentId },
        ]

        if (type === 'spreadsheet') {
            fields.push(
                { key: 'photo', value: store.getValue('photo') },
                { key: 'occupation', value: store.getValue('occupation') },
                { key: 'email', value: store.getValue('email') },
                { key: 'phone', value: store.getValue('phone') },
                { key: 'address', value: store.getValue('address') },
                { key: 'facebook', value: store.getValue('facebook') },
                { key: 'twitter', value: store.getValue('twitter') },
                { key: 'instagram', value: store.getValue('instagram') },
            )
        }

        appendFormData(formData, fields)
        formData.append('_method', 'put')

        axios({ method: 'post', url: `${store.url}/directories/${id}`, data: formData })
            .then(() => {
                store.setValue('refresh', true)
                handleClose()
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    store.setValue('errors', error.response.data.errors)
                }
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button size='sm' variant='outline-primary' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Directory</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Nav variant='tabs' className='mb-3' activeKey={activeTab} onSelect={setActiveTab}>
                        <Nav.Item>
                            <Nav.Link eventKey='details'>
                                <FontAwesomeIcon icon={['fas', 'pen']} className='me-2' />
                                Details
                            </Nav.Link>
                        </Nav.Item>
                        {store.getValue('type') === 'folder' && (
                            <Nav.Item>
                                <Nav.Link eventKey='move'>
                                    <FontAwesomeIcon icon={['fas', 'folder-tree']} className='me-2' />
                                    Move To
                                </Nav.Link>
                            </Nav.Item>
                        )}
                    </Nav>

                    {activeTab === 'details' && (
                        <HtmlForm isLoading={isLoading} mode='edit' />
                    )}

                    {activeTab === 'move' && (
                        <ParentPicker
                            endpoint="/directories/tree"
                            currentId={id}
                            value={parentId}
                            onChange={setParentId}
                            selectionLabel="Move to parent"
                            instructionText="Select a folder to move this directory into. The current directory is disabled."
                        />
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>Close</Button>
                    <Button variant='primary' disabled={isLoading} onClick={handleSubmitClick}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
