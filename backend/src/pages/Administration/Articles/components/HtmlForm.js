import React from 'react'
import { InputText, InputRadio } from '../../../../libs/FormInput'
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

            {/* Type selector */}
            {(
                <Card>
                    <Card.Header><strong>Type</strong></Card.Header>
                    <Card.Body>
                        <InputRadio fieldName='type' label='Type' options={options} />
                    </Card.Body>
                </Card>
            )}

            {/* Title input — shown once type is selected (create) or always (edit) */}
            {(mode === 'edit' || store.getValue('type')) && (
                <Card>
                    <Card.Header>
                        <strong>
                            {store.getValue('type') === 'folder' ? 'Folder Name' : 'Article Title'}
                        </strong>
                    </Card.Header>
                    <Card.Body>
                        <InputText
                            fieldName='title'
                            placeholder='Title'
                            icon='fa-solid fa-pencil'
                            isLoading={isLoading}
                        />
                    </Card.Body>
                </Card>
            )}

        </div>
    )
}

export default HtmlForm
