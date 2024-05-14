import React from 'react';
import { InputText,InputFile, InputRadio, InputDate } from '../../../../libs/FormInput';
import { Form,Row,Col, Image, Figure, FormGroup } from 'react-bootstrap';
import useStore from '../../../store';



const HtmlForm = ({isLoading}) => {
    const store = useStore()
    return (
        <>
            <Col className='mb-2'>
                <h3>Publishing</h3>
                <Form.Group>
    
              <Row>
                <Col>
                    <Form.Label>Start</Form.Label>
                    <InputDate icon='fa-calendar' fieldName='published_start' />
                </Col>
                <Col>
                    <Form.Label>End</Form.Label>
                    <InputDate  icon='fa-calendar' fieldName='published_end' />
                </Col>
              </Row>
            </Form.Group>
                <Form.Group className='col-4 mt-3'>
                <InputRadio
                    fieldName='active' 
                    label='Active'
                    options={[
                    { label: 'Yes', value: 1 },
                    { label: 'No', value: 0 }
                    ]}
                    
                    />
                </Form.Group>    
            </Col>
            <hr />
            <h3>Metadata</h3>
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
                    fieldName='description' 
                    placeholder='Short Description'  
                    icon='fa-solid fa-pencil'
                    isLoading={isLoading}
                />

            </Col>

  

            <Col className='mb-2'>
                <InputText 
                    fieldName='redirect_url' 
                    placeholder='URL'  
                    icon='fa-solid fa-globe'
                    isLoading={isLoading}
                />
            </Col>
            
            <hr />
            <h3>Banner</h3>
            <Col className='mb-2'>
                {store.getValue('filename') ? 

                    <Figure>
                        <Figure.Image
                            src={`${store.server}/storage/banners/${store.getValue('filename')}`}
                        />
                    </Figure>
                          
                :
                    <InputFile
                        fieldName='banner' 
                        placeholder='Choose banner'  
                        icon='fa-solid fa-image'
                        isLoading={isLoading}
                    />
                }
            </Col>
        
        </>
    );
};

export default HtmlForm;