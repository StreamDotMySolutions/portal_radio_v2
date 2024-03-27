import React, { useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import PosterHolder from './ContentCreator/PosterHolder';
import DescriptionHolder from './ContentCreator/DescriptionHolder';
import ContentHolder from './ContentCreator/ContentHolder';
import SettingHolder from './ContentCreator/SettingHolder';
import './App.css'
import CreateModal from '../modals/Create';
import ContentData from './ContentData';
import DescriptionModal from './ContentCreator/DescriptionModal';
import useStore from '../../../store';
import { useParams } from 'react-router-dom'
import axios from '../../../../libs/axios';
import ArticlePosterModal from './ContentCreator/ArticlePosterModal';
import HtmlModal from './ContentCreator/HtmlModal';

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
            if( response?.data?.article.hasOwnProperty('description') ){
              store.setValue('description', response?.data?.article?.description )
            }

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
                    <SettingHolder />
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
                {/* <CreateModal /> */}
                   
                    <Col className="d-flex justify-content-center border border-3 border-dotted bg-light p-3" >
                   
                        <Col className='text-center'>
                            <HtmlModal />
                        </Col>
                

                    </Col>
                </Col>
            </Row>

        </Container>
    );
};
export default ContentCreator;