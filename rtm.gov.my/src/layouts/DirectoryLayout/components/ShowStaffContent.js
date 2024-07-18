import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Image, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import StaffListing from './StaffListing';


const ShowStaffContent = () => {
    const { id } = useParams(); // parentid
    const [staff, setStaff] = useState(null);
    const [ancestors, setAncestors] = useState([]);
    const [settings, setSettings] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const [departments, setDepartments] = useState([]);
    const [staffs, setStaffs] = useState([]);

    const url = process.env.REACT_APP_API_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        axios(`${url}/directories/${id}/show`)
            .then(response => {
                //console.log(response)
                setStaff(response.data.staff)
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
        if (ancestors?.length > 0) {
            return ancestors.map((item, index) => {
                // Remove the prefix before the double underscore
                const nameWithoutPrefix = item.name.includes('__') 
                    ? item.name.split('__').slice(1).join('__') 
                    : item.name;
    
                return (
                    <li key={index}>
                        <Link to={`/directories/${item.id}`}>{nameWithoutPrefix}</Link>
                    </li>
                );
            });
        }
    };
    

    

    const HeadingLink = () => {
        return (
           
                <h3 style={{  backgroundColor: 'rgb(6, 57, 112)', color: 'white', padding: '1rem' }}>
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

                    

                    {staff ? 
                        <div className="container" id="containerdirektori" style={{ marginTop: '2rem', backgroundColor: 'rgb(6, 57, 112)', color: 'white', padding: '1rem' }}>
                            <div className="row">
                                <HeadingLink />
                                <hr />
                                <div className="container" id="containerdirektori">
                                    <div className="row">
                                        <div className="col-lg-4 justify-content-center">
                                            <Image 
                                                id="gambardirektoripegawai" 
                                                className="img-fluid rounded"
                                                src={`https://www.rtm.gov.my${staff?.photo}`} 
                                            
                                            />
                                        </div>
                                        <div className="col-lg-8" id="namecardkaler">
                                            <div className="row" style={{ marginTop: '1.5rem' }}>
                                                <div className="col-lg-5">
                                                    <h5 id="kalertulisan">JAWATAN</h5>
                                                    <p id="kalertulisan">{staff.occupation}</p>
                                                    <br />
                                                    <h5 id="kalertulisan">ALAMAT</h5>
                                                    <p id="kalertulisan">{staff.address}</p>
                                                    <br />
                                                </div>
                                                <div className="col-lg-7">
                                                    <h5 id="kalertulisan">EMEL</h5>
                                                    <a href={`mailto:${staff.email}`}><p id="kalertulisan">{staff.email}</p></a>
                                                    <br />
                                                    <h5 id="kalertulisan">NO. TELEFON</h5>
                                                    <p id="kalertulisan">{staff.phone}</p>
                                                    <br />
                                                
                                                    {(staff.facebook || staff.instagram || staff.twitter) && (
                                                        <div>
                                                            <h5 id="kalertulisan">MEDIA SOSIAL</h5>
                                                            {staff.facebook && (
                                                                <a target="_blank" href={staff.facebook}><img src="/img/facebook.svg" alt="Facebook" /></a>
                                                            )}
                                                            {' '}
                                                            {staff.instagram && (
                                                                <a target="_blank" href={staff.instagram}><img src="/img/instagram.svg" alt="Instagram" /></a>
                                                            )}
                                                            {' '}
                                                            {staff.twitter && (
                                                                <a target="_blank" href={staff.twitter}><img src="/img/twitter.png" alt="Twitter" /></a>
                                                            )}
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <>loading ...</>
                    }




            
                    
                    <div  style={{ "marginTop": "2rem" }}></div>
                </div>
            </div>
        </div>
    );
};

export default ShowStaffContent;
