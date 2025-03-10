import React, { useEffect, useState } from 'react';
import { InputText,InputFile, InputTextarea, InputSelect } from '../../../../libs/FormInput';
import { Row,Col, Image, Figure } from 'react-bootstrap';
import useStore from '../../../store';
import axios from '../../../../libs/axios'
import HlsPlayer from '../../Vods/components/HlsPlayer';

const HtmlForm = ({isLoading}) => {
    const store = useStore()
    const [videos, setVideos] = useState([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    //console.log(store.getValue('poster'))
    if(store.getValue('poster')) {
        const file = store.getValue('poster')
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        // Fetch data dari server
        axios
          .get(`${store.url}/vods/list-videos`)
          .then((response) => {
            console.log(response.data); // Cetak data video
            setVideos(response.data.vods)
          })
          .catch((error) => {
            console.error("Error fetching videos:", error);
          });
      }, []); // Dependency array betul di sini

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

        <hr />
        <Row>    
      
            <hr /> 
            <h2>Poster Image</h2>
            <Col className='mb-2 border border-1 rounded mb-3 m-2 p-2'>
                {store.getValue('filename') ? 
                    <>
                   
                    <Row>
                        <Col className='text-center p-4'>
                            <h5>Current Image</h5>
                            <Figure>
                                <Figure.Image
                                    src={`${store.server}/storage/videos/${store.getValue('filename')}`}
                                />
                            </Figure>
                        </Col>
                        <Col className='text-center p-4'>
                        {imagePreviewUrl && (<>
                            <h5>New Image</h5>    
                            <Figure>
                                <Figure.Image
                                    src={imagePreviewUrl}
                                />
                            </Figure>
                            </>)}
                        </Col>
                    </Row>


                    <InputFile
                        fieldName='poster' 
                        placeholder='Choose image'  
                        icon='fa-solid fa-image'
                        isLoading={isLoading}
                    />
                    </>
                          
                :
                <>
                         {imagePreviewUrl && (
                     
                            <Figure>
                                 <Figure.Image
                                     src={imagePreviewUrl}
                                 />
                             </Figure>
                        )}

                        <InputFile
                            
                            fieldName='poster' 
                            placeholder='Choose image'  
                            icon='fa-solid fa-image'
                            isLoading={isLoading}
                        />
                </>
                   
                }
            </Col>
            
            <h2>HLS Video</h2>    
            <Col className='mb-2'>
        
                <InputSelect
                    fieldName='embed_code' 
                    placeholder='Video ID'  
                    icon='fa-solid fa-hashtag'
                    options={videos}
                    rows={1}
                    isLoading={isLoading}
                />

            </Col>

            
            {store.getValue('embed_code') &&
                <>
                    <h2></h2>
                    <Col className='mb-2 border border-1 rounded m-2 p-2 ' >
                    
                    <HlsPlayer id={store.getValue('embed_code')} />

                    {/* <iframe 
                        width="750px"
                        height={(750 * 9) / 16} // Calculate height for 16:9 aspect ratio
                        className="embed-responsive embed-responsive-16by9" 
                        src={`https://www.youtube.com/embed/${store.getValue('embed_code')}`} 
                        //title="Old World - Announcement Trailer | 4X Turn-Based Strategy Game" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen>

                    </iframe>     */}
                </Col>
                </>
            } 
        
            
        </Row>
        </>
    );
};

export default HtmlForm;