import React from 'react';
import { InputText,InputFile } from '../../../../libs/FormInput';
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

            <Col xs={12}>
                {store.getValue('redirect_url') ?
                    <>
                        <h2>Youtube Video</h2>
                        <iframe 
                            width="750px"
                            height={(750 * 9) / 16} // Calculate height for 16:9 aspect ratio
                            className="embed-responsive embed-responsive-16by9" 
                            src={`https://www.youtube.com/embed/${store.getValue('redirect_url')}`} 
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