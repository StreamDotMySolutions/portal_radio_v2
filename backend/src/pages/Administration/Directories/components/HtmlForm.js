import React from 'react';
import { InputText,InputFile, InputTextarea } from '../../../../libs/FormInput';
import { Row,Col, Image, Figure } from 'react-bootstrap';
import useStore from '../../../store';

const HtmlForm = ({isLoading}) => {
    const store = useStore()
    return (
        <>
        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='title' 
                    placeholder='Title'  
                    icon='fa-solid fa-pencil'
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        <Row>    
            <Col className='mb-2'>
                <InputTextarea
                    fieldName='embed_code' 
                    placeholder='Youtube Video Embed Code'  
                    icon='fa-solid fa-hashtag'
                    rows={3}
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        </>
    );
};

export default HtmlForm;