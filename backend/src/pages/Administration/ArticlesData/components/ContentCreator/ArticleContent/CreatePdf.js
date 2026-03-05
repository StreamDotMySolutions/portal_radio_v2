import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Form, Modal } from 'react-bootstrap'
import { appendFormData } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'


export default function CreatePdf() {
    const store = useStore()
    const { parentId } = useParams()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [articleDataId, setArticleDataId] = useState(null)
    const [showUpload, setShowUpload] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const fileRef = useRef(null)

    const handleShowClick = () => {
        store.setValue('errors', null)
        setArticleDataId(null)
        setShowUpload(false)
        setShow(true)
    }

    const handleCloseClick = () => {
        store.setValue('refresh', true)
        setShow(false)
    }

    /**
     * Step 1: Create article_data block with contents='pdf'
     */
    const handleConfirmClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        appendFormData(formData, [
            { key: 'title', value: 'PDF' },
            { key: 'parent_id', value: parentId },
            { key: 'contents', value: 'pdf' },
        ])
        formData.append('_method', 'post')

        axios({ method: 'post', url: `${store.url}/article-data`, data: formData })
            .then(response => {
                setArticleDataId(response.data.article_data_id)
                setShowUpload(true)
                setIsLoading(false)
                store.setValue('refresh', true)
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    store.setValue('errors', error.response.data.errors)
                }
                setIsLoading(false)
            })
    }

    /**
     * Step 2: Auto-upload PDF on file select
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('article_pdf', file)
        formData.append('article_data_id', articleDataId)

        axios({ method: 'post', url: `${store.url}/article-pdf`, data: formData })
            .then(() => {
                setUploading(false)
                setUploaded(true)
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
            <Button variant="outline-primary" size="sm" onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'file-pdf']} />{' '}PDF
            </Button>

            <Modal show={show} onHide={handleCloseClick}>
                <Modal.Header closeButton>
                    <Modal.Title>PDF</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {showUpload ? (
                        <div className='text-center py-3'>
                            {uploaded ? (
                                <div className='text-success'>
                                    <FontAwesomeIcon icon={['fas', 'check-circle']} size='2x' />
                                    <p className='mt-2'>PDF uploaded successfully</p>
                                </div>
                            ) : (
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
                            )}
                        </div>
                    ) : (
                        <div className='text-center py-4'>
                            <h5 className='mb-3'>Create PDF block?</h5>
                            <Button disabled={isLoading} onClick={handleConfirmClick} variant='success'>Yes</Button>
                            {' '}
                            <Button onClick={handleCloseClick} variant='danger'>No</Button>
                        </div>
                    )}
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
