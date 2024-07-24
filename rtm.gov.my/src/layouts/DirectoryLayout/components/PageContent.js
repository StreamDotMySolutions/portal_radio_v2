import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './style.css'
import StaffListing from './StaffListing';
import Search from './Search';
import DepartmentItems from './DepartmentItems';


const PageContent = ({id}) => {
    //console.log(id)
    //const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [settings, setSettings] = useState([]);
    const [title, setTitle] = useState('');
   

    const [departments, setDepartments] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const url = process.env.REACT_APP_API_URL;

    const [links, setLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [paginate, setPaginate] = useState(null);
    const [idHasChanged, setIdHasChanged] = useState(false);

    useEffect(() => {
        let apiUrl = paginate && !idHasChanged ? paginate : `${url}/directories/${id}?page=1`;

        axios(apiUrl)
            .then(response => {
                setItems(response.data.items.data);
                setDepartments(response.data.departments.data);
                setStaffs(response.data.staffs.data);
                setAncestors(response.data.ancestors.ancestors);
                setTitle(response.data.title.name);

                setLinks(response.data.items.links); // Paginator links
                setCurrentPage(response.data.items.current_page); // Current page for pagination

                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id, paginate]);

    useEffect(() => {
        setIdHasChanged(true);
    }, [id]);

    const handlePaginationClick = (url) => {
        setPaginate(url);
        setIdHasChanged(false); // Reset the idHasChanged state when pagination is clicked
    };

    const paginatorItems = () => {
        return links.map((item, index) => (
            <li key={index} className={currentPage == item.label ? "active" : ""} onClick={() => handlePaginationClick(item.url)}>
                <span style={index === 0 || index === links.length - 1 ? { backgroundColor: '#01447e', color: 'white' } : null}>
                    {index === 0 ? '<' : index === links.length - 1 ? '>' : item.label}
                </span>
            </li>
        ));
    };

    const PagePaginator = ({items}) => {
        return (
        <div className="pagination-container float-right" style={{ marginBottom: '6rem' }}>
            <nav>
                <ul className="pagination">
                    {items}
                </ul>
            </nav>
        </div>
        )
    }

    const breadcrumbs = () => {
        if (ancestors?.length > 0) {
            return ancestors.map((item, index) => {
                // Check if the name contains the pattern XX__ and remove the prefix
                const nameWithoutPrefix = item.name.match(/^\w+__/) 
                    ? item.name.split('__').slice(1).join('__') 
                    : item.name;
    
                return (
                    <li key={index}>
                        <Link to={`/directories/${item.id}`}>
                            {nameWithoutPrefix}
                        </Link>
                    </li>
                    
                );
            });
        }
        return null; // Return null if ancestors are not loaded or empty
    };
    

    

    const rootItems = () => {

        if( items?.length > 0 ){
            return items.map((item, index) => (
                <li key={index} className="list-group-item  border-0">
                    <Link to={`/directories/${item.id}`}>
                        <h3 id="linkdirektori">
                            <FontAwesomeIcon 
                                icon={'fa-solid fa-globe'} 
                                className='text-dark mr-2'>
                            </FontAwesomeIcon>
                            {item.name.toUpperCase()}
                        </h3>
                    </Link>
                </li>
            ));
        }

    };

    const HeadingLink = () => {
        return (
           
            <div className='mb-3'>
            <h3 style={{ marginTop: '2rem', backgroundColor: 'rgb(6, 57, 112)', color: 'white', padding: '1rem' }}>
                {title && /^[^_]+__/.test(title) ? title.split('__').slice(1).join('__').toUpperCase() : (title ? title.toUpperCase() : 'Direktori')}
            </h3>
            <span className='text-muted'>
                TIDAK DIBENARKAN menggunakan maklumat pada halaman ini untuk tujuan pengiklanan, pemasaran dan penjualan produk dan perkhidmatan serta menyebar maklumat pegawai tanpa kebenaran.
            </span>
            </div>
        );
    };

    return (
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-1"></div>

                <div className="col-md-10">

                    <ul className="breadcrumb2" style={{ "marginTop": "40px" }}>
                        <li><Link to="/">Utama</Link></li>
                        <li><Link to="/directories">Direktori</Link></li>
                        
                        {breadcrumbs()}
                        

                        {loading ? (
                            <li>
                                <Spinner animation="grow" size="sm" />
                            </li> // Show spinner while loading
                        ) : (
                            <li>{title && /^[^_]+__/.test(title) ? title.split('__').slice(1).join('__') : (title ? title : 'Direktori')}</li>                            
                        )}
                    </ul>

                    <HeadingLink />

                    <Search />

                    {staffs?.length > 0 && <StaffListing items={staffs} />}
                    <hr />

                    {departments?.length > 0 && 
                        <>
                           
                            <ul className="directory-department list-group border border-1" >
                                {/* {departmentItems()}  */}
                                {/* {departmentItems(departments)} */}
                                <DepartmentItems departments={departments} />
                            </ul>
                        </>
                    }

                    
                    {items?.length > 0 && id == null && 
                        <>
                           
                            <ul className="directory-department list-group border border-1" >
                                {rootItems()} 
                            </ul>
                        </>
                    }
                    
                    <div  style={{ "marginTop": "2rem" }}></div>
                    <PagePaginator items={paginatorItems()}/>
                </div>
            </div>
        </div>
    );
};

export default PageContent;
