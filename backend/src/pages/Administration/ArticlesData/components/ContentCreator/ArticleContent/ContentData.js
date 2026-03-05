import React, { useState, useEffect } from 'react'
import { Badge } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useStore from '../../../../../store'
import axios from '../../../../../../libs/axios'

import EditModal from './Edit'
import DeleteModal from './Delete'

// import CreateModal from '../modals/Create'
// import EditModal from '../modals/Edit'
// import DeleteModal from '../modals/Delete'
// import ShowModal from '../modals/Show'

import Ordering from './Ordering'
import EditVisual from './EditVisual';
import EditGallery from './EditGallery';
import ShowGallery from './ShowGallery';
import EditPdf from './EditPdf';
import ShowPdf from './ShowPdf';
import EditVideo from './EditVideo';
import ShowVideo from './ShowVideo';


const ContentData = () => {
    const store = useStore() // store management
    const { parentId } = useParams() // parentid
    //const url = store.url + '/article-data/node/' + parentId // set the index url to /api/articles/node/{parentId}
    const url = process.env.REACT_APP_BACKEND_URL + '/article-data/node/' + parentId 
    const [items, setItems] = useState([]) // data placeholder
    
    // console.log(url)
    // to get items data
    useEffect( () => 
        {
            // modified axios to prepend Bearer Token on header
            axios( 
                {
                    method: 'get', // method is GET
                    url:  url
                } 
            )
            .then( response => { // response block
                // console.log(response)
                setItems(response.data.articles) // get the data
                store.setValue('refresh', false ) // reset the refresh state to false
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })
      },
        [
            //store.getValue('url'), // listener when url changed by pagination click
            store.getValue('refresh'), // listener when create / update / delete / search performed
            parentId // when use navigate to parent
        ] 

    ) // useEffect()



    return (
            <>
                {Array.isArray(items) && items.length === 0 && (
                    <div className='text-center text-muted py-5 mb-3'>
                        <FontAwesomeIcon icon={['fas', 'layer-group']} size='2x' className='mb-2 d-block mx-auto opacity-50' />
                        <small>No content blocks yet. Add one below.</small>
                    </div>
                )}

                {Array.isArray(items) && items.map((item, index) => (

                    <div key={item.id} className='border rounded bg-white shadow-sm mb-3'>
                        <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-light rounded-top border-bottom">
                            <div className='d-flex align-items-center gap-2'>
                                <small className='text-muted fw-semibold'>#{index + 1}</small>
                                {item.contents === 'pdf' ? (
                                    <Badge bg='warning' text='dark'><FontAwesomeIcon icon={['fas', 'file-pdf']} className='me-1' />PDF</Badge>
                                ) : item.contents === 'gallery' ? (
                                    <Badge bg='secondary'><FontAwesomeIcon icon={['fas', 'images']} className='me-1' />Gallery</Badge>
                                ) : item.contents === 'video' ? (
                                    <Badge bg='danger'><FontAwesomeIcon icon={['fas', 'video']} className='me-1' />Video</Badge>
                                ) : (
                                    <Badge bg='info'><FontAwesomeIcon icon={['fas', 'code']} className='me-1' />HTML</Badge>
                                )}
                            </div>
                            <div className='d-flex gap-1'>
                                <Ordering id={item.id} direction='up' disabled={index === 0}/>
                                <Ordering id={item.id} direction='down' disabled={index === items.length - 1 }/>
                                {item.contents === 'pdf' ? (
                                    <EditPdf id={item.id} />
                                ) : item.contents === 'gallery' ? (
                                    <EditGallery id={item.id} />
                                ) : item.contents === 'video' ? (
                                    <EditVideo id={item.id} />
                                ) : (
                                    <EditVisual id={item.id} />
                                )}
                                <DeleteModal id={item.id} />
                            </div>
                        </div>

                        <div className='p-3'>
                            {item.contents === 'pdf' ? (
                                <ShowPdf article_data_id={item.id} />
                            ) : item.contents === 'gallery' ? (
                                <ShowGallery article_data_id={item.id} />
                            ) : item.contents === 'video' ? (
                                <ShowVideo article_data_id={item.id} vod={item.vod} videoPoster={item.video_poster} />
                            ) : (
                                <div className='preview-content' dangerouslySetInnerHTML={{ __html: item.contents }} />
                            )}
                        </div>
                    </div>

                ))}
            </>

    );
};
export default ContentData