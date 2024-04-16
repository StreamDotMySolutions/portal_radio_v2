import React from 'react';
import { InputText,InputFile } from '../../../../libs/FormInput';
import { Row,Col, Image, Figure } from 'react-bootstrap';
import useStore from '../../../store';

const HtmlForm = ({isLoading}) => {
    const store = useStore()
    return (
        <>
            <Col className='mb-2'>
                <InputText 
                    fieldName='title' 
                    placeholder='Title'  
                    icon='fa-solid fa-pencil'
                    isLoading={isLoading}
                />

            </Col>
            
            <Col className='mb-2'>
                <InputText 
                    fieldName='redirect_url' 
                    placeholder='https://....'  
                    icon='fa-solid fa-globe'
                    isLoading={isLoading}
                />

            </Col>
            
    
        </>
    );
};

export default HtmlForm;