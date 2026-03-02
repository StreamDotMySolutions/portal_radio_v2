import React from 'react'
import { InputText, InputRadio, InputFile } from '../../../../libs/FormInput'
import { Card } from 'react-bootstrap'
import useStore from '../../../store'

const HtmlForm = ({ isLoading, mode = 'create' }) => {
    const store = useStore()
    const options = [
        { label: 'Folder', value: 'folder' },
        { label: 'File', value: 'file' },
    ]

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
                    <Card.Header><strong>Video File</strong></Card.Header>
                    <Card.Body>
                        <InputFile
                            fieldName='name'
                            placeholder='Choose video'
                            icon='fa-solid fa-video'
                            accept='video/*'
                            isLoading={isLoading}
                        />
                    </Card.Body>
                </Card>
            )}

            {/* File: edit — rename only (extension preserved by backend) */}
            {store.getValue('type') === 'file' && mode === 'edit' && (
                <Card>
                    <Card.Header><strong>Video File</strong></Card.Header>
                    <Card.Body className='d-flex flex-column gap-3'>
                        <div className='p-3 bg-light rounded'>
                            <div className='small text-muted mb-1'>Current filename</div>
                            <div className='fw-semibold' style={{ wordBreak: 'break-all' }}>
                                {store.getValue('name')}
                            </div>
                        </div>
                        <InputText
                            fieldName='rename'
                            placeholder='Rename file'
                            icon='fa-solid fa-pencil'
                            isLoading={isLoading}
                        />
                        <div className='small text-muted'>
                            The file extension is preserved automatically.
                            The HLS stream URL is unaffected by renaming.
                        </div>
                    </Card.Body>
                </Card>
            )}

        </div>
    )
}

export default HtmlForm
