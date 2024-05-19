import React from 'react';
import { Pagination, Row } from 'react-bootstrap';
import useStore from '../store' // global store

const PaginationLinks = ({items}) => {

    const store = useStore()

    const handlePaginationClick = (url) => {
        //useStore.setState({url: url}) // update the url state in store
        store.setValue('url',url)
        //console.log(url)
    }

    const paginationItems = () => {
        if (items?.length > 0) {
            return items.map((page, index) => {
              
                return (
                    <Pagination.Item
                        key={index} 
                        active={page.active}
                        disabled={page.url === null}
                        onClick={() => handlePaginationClick(page.url)}
                    >
                        <span dangerouslySetInnerHTML={{__html: page.label}} />
                    </Pagination.Item>
                );
            });
        }

      
    };


    return (

        <div className="d-flex bd-highlight mb-3">
            <div className="ms-auto p-2 bd-highlight">
                <Row>
                    <Pagination >
                        {paginationItems()}
                    </Pagination>
                </Row>
            </div>
        </div>

   
    );
};

export default PaginationLinks;