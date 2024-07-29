import React from 'react';
import { InputText,InputFile, InputTextarea } from './FormInput';
import { Row,Col, Image, Figure } from 'react-bootstrap';
import useStore from '../store';

const HtmlForm = ({isLoading}) => {
    const store = useStore()
    return (
        <>
        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='photo' 
                    placeholder='Path gambar'  
                    icon='fa-solid fa-image'
                    isLoading={isLoading}
                />

            </Col>
        </Row>

        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='name' 
                    placeholder='Nama'  
                    icon='fa-solid fa-user'
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='occupation' 
                    placeholder='Jawatan'  
                    icon='fa-solid fa-briefcase'
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='email' 
                    placeholder='Emel'  
                    icon='fa-solid fa-envelope'
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='phone' 
                    placeholder='No Telefon'  
                    icon='fa-solid fa-phone'
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='facebook' 
                    placeholder='Facebook'  
                    icon='fa-solid fa-globe'
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='twitter' 
                    placeholder='Twitter/X'  
                    icon='fa-solid fa-globe'
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        <Row>
            <Col className='mb-2'>
                <InputText 
                    fieldName='instagram' 
                    placeholder='Instagram'  
                    icon='fa-solid fa-globe'
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        <Row>    
            <Col className='mb-2'>
                <InputTextarea
                    fieldName='address' 
                    placeholder='Address'  
                    icon='fa-solid fa-home'
                    rows={5}
                    isLoading={isLoading}
                />

            </Col>
        </Row>
        </>
    );
};

export default HtmlForm;