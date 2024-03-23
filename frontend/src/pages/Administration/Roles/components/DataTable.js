import React, { useState, useEffect } from 'react'
import { Table,Pagination, Button } from 'react-bootstrap'
import useMohonItemStore from '../store'
import useStore from '../../../store'
import axios from '../../../../libs/axios'


const Index = () => {
    //const store = useMohonItemStore()
    const store = useStore()
    const [items, setItems] = useState([])
    const [paginatorUrl, setPaginatorUrl] = useState(store.url)

    //console.log(store.getValue('url'))
    // to get items data
    useEffect( () => 
        {
            console.log('fetch')
            // modified axios to prepend Bearer Token on header
            axios( 
                {
                    method: 'get', // method is GET
                    //url: `${store.url}` // eg GET http://localhost:8000/api/mohon-items/123
                    url: store.getValue('url') ? store.getValue('url') : store.url
                } 
            )
            .then( response => { // response block
                //console.log(response.data.items)   // output to console  
                setItems(response.data.roles) // assign data to const = mohons
                store.setValue('refresh', false ) // set MohonIndex listener back to FALSE
            })
            .catch( error => { // error block
                console.warn(error) // output to console
            })
      },
        [
            //store.url // pagination listener
            store.getValue('url')
        ] 

    ) // useEffect()

    /**
     * Paginator Links
     */
    const PaginatorLink = ({items}) => {
        //console.log(items.links)
        const handlePaginationClick = (url) => {
            //useStore.setState({url: url}) // update the url state in store
            store.setValue('url',url)
        }

        // extract the data from Laravel Paginator JSON
        const links = items?.links?.map( (page,index) => 
        <>
        
        <Pagination.Item
            key={index} 
            active={page.active}
            disabled={page.url === null}
            onClick={() => handlePaginationClick(page.url)}
            >
                <span dangerouslySetInnerHTML={{__html: page.label}} />
        </Pagination.Item>
        </>
        )
    
        return  (
        <Pagination className='mt-3'>
        {links}
        </Pagination>
        )
    }

    return (
        <div>

            <div className="d-flex bd-highlight mb-3">
                <div className="ms-auto p-2 bd-highlight">
                    create
                </div>
            </div>


            <Table>
                <thead>
                    <tr>
                        <th style={{ 'width': '20px'}}>ID</th>
                        <th>Name</th>
             
                    </tr>
                </thead>

                <tbody>
                    {items?.data?.map((item,index) => (
                        <tr key={index}>
                            <td> <span className="badge bg-primary">{item.id}</span></td>
                            <td>{item.name}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex bd-highlight mb-3">
                <div className="ms-auto p-2 bd-highlight">
                    <PaginatorLink items={items} />
                </div>
            </div>
        </div>
    );
};
export default Index;
