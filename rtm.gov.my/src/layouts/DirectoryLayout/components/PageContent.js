import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import './style.css'


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
                //console.log(response)
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

    const contentItems = () => {
        // return items.map((item, index) => (
        //     <li key={index}>
        //         <Link to={`/directories/${item.id}`}>
        //             {item.name.toUpperCase()}
        //         </Link>
        //     </li>
        // ));
        if( departments.length > 0 ){
            return departments.map((item, index) => (
                <li key={index}>
                    <Link to={`/directories/${item.id}`}>
                        {item.name.toUpperCase()}
                    </Link>
                </li>
            ));
        }

        if( staffs.length > 0 ){
            return staffs.map((item, index) => (
                <li key={index}>
                    <Link to={`/directories/${item.id}`}>
                        {item.name.toUpperCase()}
                    </Link>
                </li>
            ));
        }
 
    };

 


    return (
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-1"></div>

                <div className="col-md-10">

                    <ul className="breadcrumb" style={{ "marginTop": "40px" }}>
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

                    
                    {staffs.length > 0 && <h1>STAFF</h1> }
                 
                    <ul>
                        {contentItems()}
                    </ul>
               

                    <div  style={{ "marginTop": "2rem" }}></div>
                </div>
            </div>
        </div>
    );
};

export default PageContent;
