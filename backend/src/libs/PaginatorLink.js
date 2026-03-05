    /**
     * Paginator Links
     */
    import { Pagination} from 'react-bootstrap'
    const PaginatorLink = ({store,items}) => {
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
            <div className="d-flex">
                <div className="ms-auto">
                    <Pagination className='mb-0'>
                    {links}
                    </Pagination>
                </div>
            </div>
        )
    }

    export default PaginatorLink