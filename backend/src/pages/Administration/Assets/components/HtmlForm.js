import React from 'react';
import { InputText, InputRadio, InputFile } from '../../../../libs/FormInput';
import { Badge, Card } from 'react-bootstrap';
import useStore from '../../../store';

const formatBytes = (bytes) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const HtmlForm = ({ isLoading, mode = 'create' }) => {
    const store = useStore()
    const data = store.data // Subscribe to store.data changes
    const options = [
        { label: 'File', value: 'file' },
        { label: 'Folder', value: 'folder' },
    ];

    return (
        <div className='d-flex flex-column gap-3'>

            {/* Type selector — create only */}
            {mode === 'create' && (
                <Card>
                    <Card.Header><strong>Type</strong></Card.Header>
                    <Card.Body>
                        <InputRadio fieldName='type' label='Type' options={options} />
                    </Card.Body>
                </Card>
            )}

            {/* Folder: name input */}
            {store.getValue('type') === 'folder' && (
                <Card>
                    <Card.Header><strong>Folder Name</strong></Card.Header>
                    <Card.Body>
                        <InputText
                            fieldName='name'
                            placeholder='Name'
                            icon='fa-solid fa-folder'
                            isLoading={isLoading}
                        />
                    </Card.Body>
                </Card>
            )}

            {/* File: create — upload input */}
            {store.getValue('type') === 'file' && mode === 'create' && (
                <Card>
                    <Card.Header><strong>File</strong></Card.Header>
                    <Card.Body>
                        <InputFile
                            fieldName='name'
                            placeholder='Choose file'
                            icon='fa-solid fa-file'
                            accept='.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp'
                            isLoading={isLoading}
                        />
                    </Card.Body>
                </Card>
            )}

            {/* File: edit — rename + current info + optional replace */}
            {store.getValue('type') === 'file' && mode === 'edit' && (
                <Card>
                    <Card.Header><strong>File</strong></Card.Header>
                    <Card.Body className='d-flex flex-column gap-3'>
                        <InputText
                            fieldName='rename'
                            placeholder='Filename'
                            icon='fa-solid fa-pencil'
                            isLoading={isLoading}
                        />
                        <div className='p-3 bg-light rounded'>
                            <div className='small text-muted mb-1'>Current file</div>
                            <div className='fw-semibold mb-2' style={{ wordBreak: 'break-all' }}>
                                {store.getValue('name')}
                            </div>
                            <div className='d-flex gap-2 align-items-center flex-wrap'>
                                {store.getValue('mimetype') && (
                                    <Badge bg='secondary'>{store.getValue('mimetype')}</Badge>
                                )}
                                <span className='text-muted small'>{formatBytes(store.getValue('filesize'))}</span>
                            </div>
                        </div>
                        <InputFile
                            fieldName='file'
                            placeholder='Replace file (optional)'
                            icon='fa-solid fa-arrow-up-from-bracket'
                            accept='.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp'
                            isLoading={isLoading}
                        />
                    </Card.Body>
                </Card>
            )}

        </div>
    );
};

export default HtmlForm;
