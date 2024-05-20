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
                    rows={1}
                    isLoading={isLoading}
                />

            </Col>

            <hr /> 
            <h2>Poster Image</h2>
            <Col className='mb-2 border border-1 rounded mb-3 m-2 p-2'>
                {store.getValue('filename') ? 
                    <>
                   
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
            
            <h2>Youtube Video</h2>
            <Col className='mb-2 border border-1 rounded m-2 p-2 bg-dark' >
                {store.getValue('embed_code') ?
                    <>
                        
                        <iframe 
                            width="750px"
                            height={(750 * 9) / 16} // Calculate height for 16:9 aspect ratio
                            className="embed-responsive embed-responsive-16by9" 
                            src={`https://www.youtube.com/embed/${store.getValue('embed_code')}`} 
                            //title="Old World - Announcement Trailer | 4X Turn-Based Strategy Game" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerpolicy="strict-origin-when-cross-origin" 
                            allowfullscreen>

                        </iframe>
                    </>
                    :
                    <></>
                } 
            </Col>
            
        </Row>
        </>
    );
};

export default HtmlForm;