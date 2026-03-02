import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal } from 'react-bootstrap'
import { InputFile } from '../../../../../../libs/FormInput'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'


export default function EditPdf({ id }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [currentFilename, setCurrentFilename] = useState(null)

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

    const handleSubmitClick = () => {
        const fileInput = document.querySelector('input[name="article_pdf"]')
        if (!fileInput?.files[0]) return

        setIsLoading(true)
        const formData = new FormData()
        formData.append('article_pdf', fileInput.files[0])
        formData.append('article_data_id', id)

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
            <Button size="sm" variant="outline-primary" onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal show={show} onHide={handleCloseClick}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit PDF</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {currentFilename ? (
                        <p className='text-muted small mb-3'>Current file: {currentFilename}</p>
                    ) : (
                        <p className='text-muted small mb-3'>No PDF attached</p>
                    )}
                    <InputFile fieldName='article_pdf' accept='.pdf' icon={['fas', 'file-pdf']} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseClick}>
                        Close
                    </Button>
                    <Button disabled={isLoading} variant="primary" onClick={handleSubmitClick}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
