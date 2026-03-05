import { useState } from 'react'
import { Button, Modal, Nav } from 'react-bootstrap'
import axios from '../../../../libs/axios'
import ParentPicker from '../../../../libs/ParentPicker'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function EditModal({id}) {
    const store = useStore()
    const data = store.data // Subscribe to store.data changes

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('details')
    const [parentId, setParentId] = useState(null)

    const handleClose = () => {
        setShow(false)
        setActiveTab('details')
    }
    const handleCloseClick = () => handleClose()

    const handleShowClick = () => {
        store.emptyData()
        setActiveTab('details')
        setShow(true)

        axios({ method: 'get', url: `${store.url}/assets/${id}` })
            .then(response => {
                const asset = response?.data?.asset
                store.setValue('type', asset?.type)
                store.setValue('name', asset?.name)
                store.setValue('rename', asset?.name)
                store.setValue('mimetype', asset?.mimetype)
                store.setValue('filesize', asset?.filesize)
                setParentId(asset?.parent_id ?? null)
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Error fetching asset:', error)
                alert('Failed to load asset data')
                setIsLoading(false)
            })
    }

    const handleSubmitClick = () => {
        const formData = new FormData()
        formData.append('_method', 'put')

        if (store.getValue('type') === 'folder') {
            formData.append('name', store.getValue('name'))
            if (parentId) {
                formData.append('parent_id', parentId)
            }
        }

        if (store.getValue('type') === 'file') {
            if (store.getValue('rename')) {
                formData.append('rename', store.getValue('rename'))
            }
            if (store.getValue('file')) {
                formData.append('file', store.getValue('file'))
            }
        }

        axios({ method: 'post', url: `${store.url}/assets/${id}`, data: formData })
            .then(response => {
                store.setValue('refresh', true)
                setIsLoading(false)
                handleClose()
            })
            .catch(error => {
                if (error.response?.status == 422) {
                    store.setValue('errors', error.response.data.errors)
                }
                setIsLoading(false)
            })
    }

    return (
        <>
            <Button size="sm" variant="outline-primary" onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal size={'lg'} show={show} onHide={handleCloseClick}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit asset</Modal.Title>
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
                            endpoint="/assets/tree"
                            currentId={id}
                            value={parentId}
                            onChange={setParentId}
                            selectionLabel="Move to parent"
                            instructionText="Select a folder to move this asset into. The current asset is disabled."
                        />
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button disabled={isLoading} variant="secondary" onClick={handleCloseClick}>
                        Close
                    </Button>
                    <Button disabled={isLoading} variant="primary" onClick={handleSubmitClick}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
