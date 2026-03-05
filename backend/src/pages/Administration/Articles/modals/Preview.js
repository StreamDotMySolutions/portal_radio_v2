import { useState } from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import axios from '../../../../libs/axios'

export default function PreviewModal({ id, title, asLink }) {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [blocks, setBlocks] = useState([])

    const serverUrl = process.env.REACT_APP_SERVER_URL

    const handleShowClick = () => {
        setShow(true)
        setLoading(true)
        setBlocks([])

        axios({ method: 'get', url: `${store.url}/article-data/node/${id}` })
            .then(response => {
                setBlocks(response.data.articles || [])
                setLoading(false)
            })
            .catch(error => {
                console.warn(error)
                setLoading(false)
            })
    }

    return (
        <>
            {asLink ? (
                <a href='#' onClick={(e) => { e.preventDefault(); handleShowClick() }} role='button'>
                    <FontAwesomeIcon icon={['fas', 'file-code']} className='me-2' style={{ color: '#1a3a5c' }} />
                    {title}
                </a>
            ) : (
                <Button size='sm' variant='outline-info' onClick={handleShowClick} title='Preview content'>
                    <FontAwesomeIcon icon={['fas', 'eye']} />
                </Button>
            )}

            <Modal size='xl' show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className='fs-6'>
                        <FontAwesomeIcon icon={['fas', 'eye']} className='me-2 text-info' />
                        {title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className='p-0'>
                    {loading ? (
                        <div className='text-center py-5 text-muted'>
                            <FontAwesomeIcon icon={['fas', 'spinner']} spin size='2x' />
                        </div>
                    ) : blocks.length === 0 ? (
                        <div className='text-center py-5 text-muted'>
                            <FontAwesomeIcon icon={['fas', 'file']} size='2x' className='mb-2 d-block mx-auto opacity-50' />
                            <small>No content blocks</small>
                        </div>
                    ) : (
                        <div className='bg-light p-3'>
                            <div className='bg-white shadow-sm rounded p-4 mx-auto' style={{ maxWidth: '800px' }}>
                                {blocks.map((block, index) => (
                                    <div key={block.id}>
                                        {block.contents === 'pdf' ? (
                                            <div className='text-center py-3'>
                                                <Badge bg='warning' text='dark'>
                                                    <FontAwesomeIcon icon={['fas', 'file-pdf']} className='me-1' />
                                                    PDF Block
                                                </Badge>
                                                {block.article_pdf?.filename && (
                                                    <div className='mt-2'>
                                                        <iframe
                                                            src={`${serverUrl}/storage/article_pdf/${block.article_pdf.filename}`}
                                                            title='PDF'
                                                            width='100%'
                                                            height='500px'
                                                            className='rounded border'
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) : block.contents === 'gallery' ? (
                                            <div className='text-center py-3'>
                                                <Badge bg='secondary'>
                                                    <FontAwesomeIcon icon={['fas', 'images']} className='me-1' />
                                                    Gallery Block
                                                </Badge>
                                            </div>
                                        ) : block.contents === 'video' && block.vod ? (
                                            <div className='text-center py-3'>
                                                <Badge bg='danger' className='mb-2'>
                                                    <FontAwesomeIcon icon={['fas', 'video']} className='me-1' />
                                                    {block.vod.name}
                                                </Badge>
                                            </div>
                                        ) : (
                                            <div className='preview-content' dangerouslySetInnerHTML={{ __html: block.contents }} />
                                        )}
                                        {index < blocks.length - 1 && <hr />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <style>{`
                        .preview-content img { max-width: 100%; height: auto; }
                        .preview-content h1, .preview-content h2, .preview-content h3 { margin-top: 0.5em; margin-bottom: 0.5em; }
                        .preview-content p { line-height: 1.7; }
                        .preview-content a { color: #0d6efd; }
                        .preview-content table { width: 100%; border-collapse: collapse; margin: 1em 0; }
                        .preview-content table td, .preview-content table th { border: 1px solid #dee2e6; padding: 0.5rem; }
                    `}</style>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
