import { useState } from 'react'
import { Button, Modal, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

        axios({ method: 'get', url: `${store.url}/vods/${id}` })
            .then(response => {
                const vod = response?.data?.vod
                store.setValue('type', vod?.type)
                store.setValue('name', vod?.name)
                store.setValue('rename', vod?.name)
                setParentId(vod?.parent_id ?? null)
            })
            .catch(error => {
                console.error('Error fetching vod:', error)
                alert('Failed to load vod data')
            })
    }

    const handleSubmitClick = () => {
        setIsLoading(true)

        const formData = new FormData()
        formData.append('_method', 'put')

        if (store.getValue('type') === 'folder') {
            formData.append('name', store.getValue('name'))
            if (parentId) {
                formData.append('parent_id', parentId)
            }
        }

        if (store.getValue('type') === 'file' && store.getValue('rename')) {
            formData.append('rename', store.getValue('rename'))
        }

        axios({ method: 'post', url: `${store.url}/vods/${id}`, data: formData })
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
                    <Modal.Title>Edit VOD</Modal.Title>
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
                            endpoint="/vods/tree"
                            currentId={id}
                            value={parentId}
                            onChange={setParentId}
                            selectionLabel="Move to parent"
                            instructionText="Select a folder to move this VOD into. The current VOD is disabled."
                        />
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='primary' disabled={isLoading} onClick={handleSubmitClick}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
