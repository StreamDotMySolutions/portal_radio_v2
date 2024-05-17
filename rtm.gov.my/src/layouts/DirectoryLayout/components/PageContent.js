import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import StaffListing from './StaffListing';


const PageContent = ({id}) => {
    //const { id } = useParams(); // parentid
    const [items, setItems] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [settings, setSettings] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const [departments, setDepartments] = useState([]);
    const [staffs, setStaffs] = useState([]);

    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios(`${url}/directories/${id}`)
            .then(response => {
                console.log(response)
                setItems(response.data.items.data)
                setDepartments(response.data.departments.data)
                setStaffs(response.data.staffs.data)
                setAncestors(response.data.ancestors.ancestors)
                setTitle(response.data.title.name)
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                console.warn(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, [id]);

    const breadcrumbs = () => {
        return ancestors.map((item, index) => (
            <li key={index}>
                <Link to={`/directories/${item.id}`}>{item.name.toUpperCase()}</Link>
            </li>
        ));
    }

    const departmentItems = () => {

        if( departments.length > 0 ){
            return departments.map((item, index) => (
                <li key={index} className="list-group-item  border-0">
                    <Link to={`/directories/${item.id}`}>
                        <h3 id="linkdirektori">
                            <FontAwesomeIcon 
                                icon={'fa-solid fa-building'} 
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
           
                <h3 style={{ marginTop: '2rem', backgroundColor: 'rgb(6, 57, 112)', color: 'white', padding: '1rem' }}>
                    {title}
                </h3>
           
        );
    };


 


    return (
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-1"></div>

                <div className="col-md-10">

                    <ul className="breadcrumb2" style={{ "marginTop": "40px" }}>
                        <li><Link to="/">Utama</Link></li>
                        
                        {breadcrumbs()}

                        {loading ? (
                            <li>
                                <Spinner animation="grow" size="sm" />
                            </li> // Show spinner while loading
                        ) : (
                            <li>{title ? title.toUpperCase() : 'Direktori'}</li> // Show title when loaded
                        )}
                    </ul>

                    <HeadingLink />

                    <StaffListing items={staffs} />
                    <hr />

                    {departments.length > 0 && 
                        <>
                            <h1>JABATAN</h1>
                            <ul className="directory-department list-group border border-1" >
                                {departmentItems()} 
                            </ul>
                        </>
                    }
                    
                    <div  style={{ "marginTop": "2rem" }}></div>
                </div>
            </div>
        </div>
    );
};

export default PageContent;
