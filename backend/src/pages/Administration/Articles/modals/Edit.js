import { useState } from 'react'
import { Button, Modal, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appendFormData } from '../../../../libs/FormInput'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import HtmlForm from '../components/HtmlForm'
import ParentPicker from '../components/ParentPicker'

export default function EditModal({ id }) {
    const store = useStore()

    const [show, setShow]         = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('details')
    const [parentId, setParentId]   = useState(null)

    const handleClose = () => {
        setShow(false)
        setActiveTab('details')
    }

    const handleShowClick = () => {
        store.setValue('errors', '')
        setActiveTab('details')
        setShow(true)

        axios({ method: 'get', url: `${store.url}/articles/${id}` })
            .then(response => {
                if (response?.data?.article) {
                    store.setValue('title', response.data.article.title)
                    store.setValue('type', response.data.article.type)
                    setParentId(response.data.article.parent_id ?? null)
                }
            })
            .catch(error => console.warn(error))
    }

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        appendFormData(formData, [
            { key: 'title',     value: store.getValue('title') },
            { key: 'type',      value: store.getValue('type') },
            { key: 'parent_id', value: parentId },
        ])
        formData.append('_method', 'put')

        axios({ method: 'post', url: `${store.url}/articles/${id}`, data: formData })
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
                    <Modal.Title>Edit Article</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Nav variant='tabs' className='mb-3' activeKey={activeTab} onSelect={setActiveTab}>
                        <Nav.Item>
                            <Nav.Link eventKey='details'>
                                <FontAwesomeIcon icon={['fas', 'pen']} className='me-2' />
                                Details
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='move'>
                                <FontAwesomeIcon icon={['fas', 'folder-tree']} className='me-2' />
                                Move To
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {activeTab === 'details' && (
                        <HtmlForm isLoading={isLoading} mode='edit' />
                    )}

                    {activeTab === 'move' && (
                        <ParentPicker
                            currentId={id}
                            value={parentId}
                            onChange={setParentId}
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
