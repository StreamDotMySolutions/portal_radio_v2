import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Form, Modal } from 'react-bootstrap'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'


export default function EditPdf({ id }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [currentFilename, setCurrentFilename] = useState(null)
    const fileRef = useRef(null)

    const handleShowClick = () => {
        store.setValue('errors', null)
        axios({ method: 'get', url: `${store.url}/article-pdf/${id}` })
            .then(response => {
                setCurrentFilename(response.data.article_pdf?.filename || null)
            })
            .catch(error => console.warn(error))
        setShow(true)
    }

    const handleCloseClick = () => {
        store.setValue('refresh', true)
        setShow(false)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('article_pdf', file)
        formData.append('article_data_id', id)

        axios({ method: 'post', url: `${store.url}/article-pdf`, data: formData })
            .then(() => {
                setUploading(false)
                setCurrentFilename(file.name)
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    store.setValue('errors', error.response.data.errors)
                }
                setUploading(false)
            })
            .finally(() => {
                if (fileRef.current) fileRef.current.value = ''
            })
    }

    return (
        <>
            <Button size="sm" variant="outline-primary" onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal show={show} onHide={handleCloseClick}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit PDF</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {currentFilename ? (
                        <p className='text-muted small mb-3'>
                            <FontAwesomeIcon icon={['fas', 'file-pdf']} className='me-1 text-danger' />
                            {currentFilename}
                        </p>
                    ) : (
                        <p className='text-muted small mb-3'>No PDF attached</p>
                    )}
                    <div className='d-flex align-items-center gap-2'>
                        <Form.Control
                            ref={fileRef}
                            type='file'
                            accept='.pdf'
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        {uploading && <FontAwesomeIcon icon={['fas', 'spinner']} spin />}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseClick}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
