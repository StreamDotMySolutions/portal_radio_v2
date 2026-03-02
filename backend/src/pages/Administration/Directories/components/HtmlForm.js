import React from 'react'
import { Card } from 'react-bootstrap'
import { InputRadio, InputText, InputTextarea } from '../../../../libs/FormInput'
import useStore from '../../../store'

const HtmlForm = ({ isLoading, mode = 'create' }) => {
    const store = useStore()

    const typeOptions = [
        { label: 'Department', value: 'folder' },
        { label: 'Staff', value: 'spreadsheet' },
    ]

    const type = store.getValue('type')

    return (
        <div className='d-flex flex-column gap-3'>

            {/* Type selector — create only */}
            {mode === 'create' && (
                <Card>
                    <Card.Header><strong>Type</strong></Card.Header>
                    <Card.Body>
                        <InputRadio fieldName='type' label='Type' options={typeOptions} />
                    </Card.Body>
                </Card>
            )}

            {/* Name — shown once type is selected (create) or always (edit) */}
            {(mode === 'edit' || type) && (
                <Card>
                    <Card.Header><strong>{type === 'folder' ? 'Department Name' : 'Full Name'}</strong></Card.Header>
                    <Card.Body>
                        <InputText fieldName='name' placeholder='Name' icon='fa-solid fa-pencil' isLoading={isLoading} />
                    </Card.Body>
                </Card>
            )}

            {/* Staff fields */}
            {(type === 'spreadsheet') && (
                <>
                    <Card>
                        <Card.Header><strong>Profile</strong></Card.Header>
                        <Card.Body className='d-flex flex-column gap-2'>
                            <InputText fieldName='photo' placeholder='Photo URL' icon='fa-solid fa-image' isLoading={isLoading} />
                            <InputText fieldName='occupation' placeholder='Occupation' icon='fa-solid fa-briefcase' isLoading={isLoading} />
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header><strong>Contact</strong></Card.Header>
                        <Card.Body className='d-flex flex-column gap-2'>
                            <InputText fieldName='email' placeholder='Email' icon='fa-solid fa-envelope' isLoading={isLoading} />
                            <InputText fieldName='phone' placeholder='Phone' icon='fa-solid fa-phone' isLoading={isLoading} />
                            <InputTextarea fieldName='address' placeholder='Address' icon='fa-solid fa-location-dot' rows={3} isLoading={isLoading} />
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header><strong>Social</strong></Card.Header>
                        <Card.Body className='d-flex flex-column gap-2'>
                            <InputText fieldName='facebook' placeholder='Facebook' icon='fa-solid fa-globe' isLoading={isLoading} />
                            <InputText fieldName='twitter' placeholder='Twitter / X' icon='fa-solid fa-globe' isLoading={isLoading} />
                            <InputText fieldName='instagram' placeholder='Instagram' icon='fa-solid fa-globe' isLoading={isLoading} />
                        </Card.Body>
                    </Card>
                </>
            )}

        </div>
    )
}

export default HtmlForm
