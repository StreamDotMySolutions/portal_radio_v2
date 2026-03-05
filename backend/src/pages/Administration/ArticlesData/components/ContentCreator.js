import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContentData from './ContentCreator/ArticleContent/ContentData';
import DescriptionModal from './ContentCreator/DescriptionModal';
import useStore from '../../../store';
import { useParams } from 'react-router-dom'
import axios from '../../../../libs/axios';
import ArticlePosterModal from './ContentCreator/ArticlePoster/ArticlePosterModal';
import CreateContentWithEditor from './ContentCreator/ArticleContent/CreateWithEditor'
import CreateContentWithGallery from './ContentCreator/ArticleContent/CreateGallery'
import CreateContentWithPdf from './ContentCreator/ArticleContent/CreatePdf'
import CreateContentWithVideo from './ContentCreator/ArticleContent/CreateVideo'
import ArticleSetting from './ContentCreator/ArticleSetting/ArticleSetting';
import './App.css'

const ContentCreator = () => {
    const store=useStore()
    const { parentId } = useParams() // parentid

    useEffect( () => {
        
        // fetch data from server using given id
        axios({ 
            method: 'get', 
            url: `${store.url}/articles/${parentId}`,
            })
        .then( response => { // success 200
            //console.log(response)
        
            store.setValue('description', '' )
            if( response?.data?.article.hasOwnProperty('description') ){
              store.setValue('description', response?.data?.article?.description )
            }

            store.setValue('article_poster_image', '');
            if (response?.data?.article?.hasOwnProperty('article_poster') && response.data.article.article_poster !== null) {
                store.setValue('article_poster_image', response.data.article.article_poster);
            }
          
            })
        .catch( error => {
            console.warn(error)
     
        })

    },[store.getValue('refresh')])
    return (
        <Container>

            <div className='d-flex align-items-center justify-content-between mb-3'>
                <small className='text-muted'>
                    <FontAwesomeIcon icon={['fas', 'cube']} className='me-1' />
                    Content Builder
                </small>
                <ArticleSetting />
            </div>

            <Row className='mb-4'>
                <Col xs={4}>
                    <ArticlePosterModal />
                </Col>
                <Col xs={8}>
                    <DescriptionModal />
                </Col>
            </Row>

            <ContentData />

            <div className='border-2 border-dashed rounded p-3 text-center bg-light' style={{ borderStyle: 'dashed' }}>
                <small className='text-muted d-block mb-2'>Add content block</small>
                <div className='d-flex justify-content-center gap-2'>
                    <CreateContentWithEditor />
                    <CreateContentWithGallery />
                    <CreateContentWithPdf />
                    <CreateContentWithVideo />
                </div>
            </div>

        </Container>
    );
};
export default ContentCreator;