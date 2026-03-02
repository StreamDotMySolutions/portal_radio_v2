import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { trackEvent } from '../../../libs/analytics';
import { Link, useParams } from 'react-router-dom';
// import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './style.css'
import StaffListing from './StaffListing';
import Search from './Search';
import DepartmentItems from './DepartmentItems';
import { Helmet } from "react-helmet-async";


const PageContent = ({id}) => {
    //const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [settings, setSettings] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const [departments, setDepartments] = useState([]);
    const [staffs, setStaffs] = useState([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [links, setLinks] = useState([]);
    const [paginate, setPaginate] = useState('');

    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        let apiUrl = paginate ? paginate : `${url}/directories/${id}?page=1`;
        //axios(`${url}/directories/${id}`)
        axios(apiUrl)
            .then(response => {
                //console.log(response)
                setItems(response.data.items.data)
                setDepartments(response.data.departments.data)
                setStaffs(response.data.staffs.data)
                setAncestors(response.data.ancestors.ancestors)
                setTitle(response.data.title.name)
                setLoading(false);
                trackEvent('pageview', 'directory', id, response.data.title.name);
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id]);

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
    

    // const departmentItems = () => {

    //     if( departments?.length > 0 ){
    //         return departments.map((item, index) => (
    //             <li key={index} className="list-group-item  border-0">
    //                 <Link to={`/directories/${item.id}`}>
    //                     <h3 id="linkdirektori">
    //                         <FontAwesomeIcon 
    //                             icon={'fa-solid fa-building'} 
    //                             className='text-dark mr-2'>
    //                         </FontAwesomeIcon>
    //                         {item.name.toUpperCase()}
    //                     </h3>
    //                 </Link>
    //             </li>
    //         ));
    //     }

    // };
    // const departmentItems = (departments) => {
    //     if (departments?.length > 0) {
    //         return departments.map((item, index) => (
    //             <div key={index} className="col-md-6">
    //                 <a id="linkdirektoridiv" href={`/directories/${item.id}`}>
    //                     <h3 id="linkdirektori">{item.name.toUpperCase()}</h3>
    //                 </a>
    //                 {item.children && item.children.length > 0 && (
    //                     item.children.map((child, childIndex) => (
    //                         <a key={childIndex} id="linkdirektorip" href={`/directories/${child.id}`}>
    //                             <p>{child.name}</p>
    //                         </a>
    //                     ))
    //                 )}
    //             </div>
    //         ));
    //     } else {
    //         return null;
    //     }
    // };
    // const departmentItems = (departments) => {
    //     if (departments?.length > 0) {
    //         const half = Math.ceil(departments.length / 2);
    //         const firstHalf = departments.slice(0, half);
    //         const secondHalf = departments.slice(half);
    
    //         const renderColumn = (items) => (
    //             items.map((item, index) => (
    //                 <div key={index} className="col">
    //                     <Link id="linkdirektoridiv" to={`/directories/${item.id}`}>
    //                         <h3 id="linkdirektori">{item.name.toUpperCase()}</h3>
    //                     </Link>
    //                     {item.children && item.children.length > 0 && (
    //                         item.children.map((child, childIndex) => (
    //                             <Link key={childIndex} id="linkdirektorip" to={`/directories/${child.id}`}>
    //                                 <p>{child.name}</p>
    //                             </Link>
    //                         ))
    //                     )}
    //                 </div>
    //             ))
    //         );
    
    //         return (
    //             <div className="row">
    //                 <div className="col-md-6">
    //                     {renderColumn(firstHalf)}
    //                 </div>
    //                 <div className="col-md-6">
    //                     {renderColumn(secondHalf)}
    //                 </div>
    //             </div>
    //         );
    //     } else {
    //         return null;
    //     }
    // };
    
    
    // Usage example assuming 'departments' is your main list of departments
    // return (
    //     <ul className="list-group">
    //         {departmentItems(departments)}
    //     </ul>
    // );
    

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
            <h3 style={{ marginTop: '2rem', backgroundColor: 'rgb(6, 57, 112)', color: 'white', padding: '1rem', borderRadius: '.25rem' }}>
                {title && /^[^_]+__/.test(title) ? title.split('__').slice(1).join('__') : (title ? title : 'Direktori')}
            </h3>
            <span className='text-muted'>
                TIDAK DIBENARKAN menggunakan maklumat pada halaman ini untuk tujuan pengiklanan, pemasaran dan penjualan produk dan perkhidmatan serta menyebar maklumat pegawai tanpa kebenaran.
            </span>
            </div>
        );
    };

    return (
        <>
            <Helmet>
                <title>Direktori RTM : {title && /^[^_]+__/.test(title) ? title.split('__').slice(1).join('__') : (title ? title : 'Direktori')}</title>
            </Helmet>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-1"></div>

                    <div className="col-md-10">

                        <ul className="breadcrumb2 mt-5">
                            <li><Link to="/">Utama</Link></li>
                            <li><Link to="/directories">Direktori</Link></li>
                            
                            {breadcrumbs()}
                            

                            {loading ? (
                                <li>
                                    {/* <Spinner animation="grow" size="sm" /> */}
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
                        
                        <div className="mt-4"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageContent;
