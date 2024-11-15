import React from 'react';
import { InputText,InputRadio, InputFile } from '../../../../libs/FormInput';
import { Col } from 'react-bootstrap';
import useStore from '../../../store';

const HtmlForm = ({isLoading}) => {
    const store= useStore()
    const options = [
        { label: 'File', value: 'file' },
        { label: 'Folder', value: 'folder' },
    ];

    return (
        <div>
            <Col xs={12} className='border border-1 p-4 rounded'>
                <InputRadio 
                    fieldName='type'
                    label='Type'
                    options={options}
                />
            </Col>

           
            {store.getValue('type') === 'folder' && (
            <Col xs={12} className='border border-1 p-4 rounded mt-2' style={{'backgroundColor': '#999'}}>
            
                <InputText 
                    fieldName='name' 
                    placeholder='Name'  
                    icon='fa-solid fa-pencil'
                    isLoading={isLoading}
                />
            </Col>
            )}   

            {store.getValue('type') === 'file' && (
                <Col  className='border border-1 p-4 rounded mt-2' style={{'backgroundColor': '#999'}}>
                    {store.getValue('current_filename') ? 
                        <>
                            {`${store.server}/storage/assets/${store.getValue('filename')}`}
                        </>   
                    :
                        <InputFile
                            fieldName='filename' 
                            placeholder='Choose file'  
                            icon='fa-solid fa-file'
                            isLoading={isLoading}
                        />
                    }
                </Col>
                
            )}
          
        </div>
    );
};

export default HtmlForm;