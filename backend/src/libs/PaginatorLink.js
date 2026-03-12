    /**
     * Paginator Links
     */
    import { Pagination, Form } from 'react-bootstrap'
    const PaginatorLink = ({store, items, perPage, onPerPageChange}) => {
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
            <div className="d-flex align-items-center gap-3">
                <div>
                    <Form.Select
                        style={{ width: '100px' }}
                        size='sm'
                        value={perPage}
                        onChange={(e) => onPerPageChange && onPerPageChange(parseInt(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </Form.Select>
                </div>
                <div className="ms-auto">
                    <Pagination className='mb-0'>
                    {links}
                    </Pagination>
                </div>
            </div>
        )
    }

    export default PaginatorLink