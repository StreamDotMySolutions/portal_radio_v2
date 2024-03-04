import { React, useState }  from 'react'

export const Pagination = (props) => {
    //console.log(props.data.links)
    //const [active , setActive] = useState(false)
    const pages = props.data.meta.links

    //console.log(pages)
    
    const loadPage = (url) => {
        if(url !== null){
            if(props.sorting){
                props.setPage(url + props.sorting)
            } else {
                props.setPage(url)
            }
        } 
    }

    const pageItems = pages.map( (page) => 
       
        <li 
            key={page.label} 
            className={page.active === true ? 'page-item active' : (page.url === null) ? 'page-item disabled' :  'page-item'}>
            <a 
                className="page-link" 
                href="#"
                onClick={ e => loadPage(page.url) }
                >
                <span dangerouslySetInnerHTML={{__html: page.label}} />
            </a>
        </li>
    )

    const handleClick = () => {
        //console.log('klik set')
        //props.setPage(2)
    }
    
    return (
        <div className='row'>
            <div className='col'>Showing {props.data.meta.from} to {props.data.meta.to} of {props.data.meta.total} </div>
            <div className='col'>
            <nav>
                <ul className="pagination justify-content-end">       
                    {pageItems}
                </ul>
            </nav>

            </div>
        </div>
    )
}
