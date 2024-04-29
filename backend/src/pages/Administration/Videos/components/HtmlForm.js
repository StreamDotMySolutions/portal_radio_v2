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
                    placeholder='Youtube Video ID'  
                    icon='fa-solid fa-hashtag'
                    isLoading={isLoading}
                />

            </Col>

             <hr />
            <Col className='mb-2'>
                {store.getValue('filename') ? 
                    <>
                    <h2>Poster Image</h2>
                    <Figure>
                        <Figure.Image
                            src={`${store.server}/storage/videos/${store.getValue('filename')}`}
                        />
                    </Figure>
                    </>
                          
                :
                    <InputFile
                        fieldName='poster' 
                        placeholder='Choose image'  
                        icon='fa-solid fa-image'
                        isLoading={isLoading}
                    />
                }
            </Col>
            
    
        </>
    );
};

export default HtmlForm;