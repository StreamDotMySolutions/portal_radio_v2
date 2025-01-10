import React, { useEffect } from 'react';
import {Col, Container, Row } from 'react-bootstrap';
import ContentData from './ContentCreator/ArticleContent/ContentData';
import DescriptionModal from './ContentCreator/DescriptionModal';
import useStore from '../../../store';
import { useParams } from 'react-router-dom'
import axios from '../../../../libs/axios';
import ArticlePosterModal from './ContentCreator/ArticlePoster/ArticlePosterModal';
import CreateContent from './ContentCreator/ArticleContent/Create'
import CreateContentWithEditor from './ContentCreator/ArticleContent/CreateWithEditor'
import CreateContentWithHtml from './ContentCreator/ArticleContent/CreateWithHtml'
import CreateContentWithGallery from './ContentCreator/ArticleContent/CreateGallery'
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

            <Row>
                <Col>
                {/* <CreateModal /> */}
                   
                    <Col className="d-flex justify-content-center border border-3 border-dotted bg-light p-3" >
                   
                        <Col className='text-center'>
                            <ArticleSetting />
                        </Col>
                

                    </Col>
                </Col>
            </Row>
                
            <Row className='mt-2'>
                <Col xs={4} >
                    <ArticlePosterModal />
                </Col>
                <Col xs={8}>
                    <DescriptionModal />
                </Col>
            </Row>

            <Row className='mt-2'>
                <Col>
                    <ContentData />
                </Col>
            </Row>

            <Row>
                <Col>
           
                   
                    <Col className="d-flex justify-content-center border border-3 border-dotted bg-light p-3" >
                   
                        <Col className='text-center'>
                            <CreateContentWithEditor />{' '}<CreateContentWithHtml />{' '}<CreateContentWithGallery />
                        </Col>
                

                    </Col>
                </Col>
            </Row>

        </Container>
    );
};
export default ContentCreator;