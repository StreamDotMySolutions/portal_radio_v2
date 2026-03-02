import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal } from 'react-bootstrap'
import { appendFormData, InputFile } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'


export default function CreatePdf() {
    const store = useStore()
    const { parentId } = useParams()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [articleDataId, setArticleDataId] = useState(null)
    const [showUpload, setShowUpload] = useState(false)

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
     * Step 2: Upload the PDF file
     */
    const handleUploadClick = () => {
        const fileInput = document.querySelector('input[name="article_pdf"]')
        if (!fileInput?.files[0]) return

        setIsLoading(true)
        const formData = new FormData()
        formData.append('article_pdf', fileInput.files[0])
        formData.append('article_data_id', articleDataId)

        axios({ method: 'post', url: `${store.url}/article-pdf`, data: formData })
            .then(() => {
                setIsLoading(false)
                handleCloseClick()
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    store.setValue('errors', error.response.data.errors)
                }
                setIsLoading(false)
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
                        <>
                            <InputFile fieldName='article_pdf' accept='.pdf' icon={['fas', 'file-pdf']} />
                            <div className='text-center mt-3'>
                                <Button disabled={isLoading} variant='primary' onClick={handleUploadClick}>
                                    Upload PDF
                                </Button>
                            </div>
                        </>
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
