import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { trackEvent } from '../../../libs/analytics';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import StaffListing from './StaffListing';
import Search from './Search';
import DepartmentItems from './DepartmentItems';
import { Helmet } from "react-helmet-async";

const cleanTitle = (name) => {
    if (!name) return 'Direktori';
    return /^[^_]+__/.test(name) ? name.split('__').slice(1).join('__') : name;
};

const PageContent = ({id}) => {
    const [items, setItems] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [staffs, setStaffs] = useState([]);

    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios(`${url}/directories/${id}?page=1`)
            .then(response => {
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
                setLoading(false);
            });
    }, [id]);

    const breadcrumbs = () => {
        if (ancestors?.length > 0) {
            return ancestors.map((item, index) => {
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
        return null;
    };

    const displayTitle = cleanTitle(title);

    return (
        <>
            <Helmet>
                <title>Direktori RTM : {displayTitle}</title>
            </Helmet>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-1"></div>

                    <div className="col-md-10">

                        <ul className="breadcrumb2 mt-5">
                            <li><Link to="/">Utama</Link></li>
                            <li><Link to="/directories">Direktori</Link></li>
                            {breadcrumbs()}
                            {!loading && <li>{displayTitle}</li>}
                        </ul>

                        <div className='mb-3'>
                            <h3 style={{ marginTop: '2rem', backgroundColor: 'rgb(6, 57, 112)', color: 'white', padding: '1rem', borderRadius: '.25rem' }}>
                                {displayTitle}
                            </h3>
                            <span className='text-muted'>
                                TIDAK DIBENARKAN menggunakan maklumat pada halaman ini untuk tujuan pengiklanan, pemasaran dan penjualan produk dan perkhidmatan serta menyebar maklumat pegawai tanpa kebenaran.
                            </span>
                        </div>

                        <Search />

                        {staffs?.length > 0 && (
                            <>
                                <StaffListing items={staffs} />
                                <hr />
                            </>
                        )}

                        {departments?.length > 0 && (
                            <ul className="directory-department list-group border border-1">
                                <DepartmentItems departments={departments} />
                            </ul>
                        )}

                        {items?.length > 0 && id == null && (
                            <ul className="directory-department list-group border border-1">
                                {items.map((item, index) => (
                                    <li key={index} className="list-group-item border-0">
                                        <Link to={`/directories/${item.id}`}>
                                            <h3 id="linkdirektori">
                                                <FontAwesomeIcon
                                                    icon={'fa-solid fa-building'}
                                                    className='mr-2'
                                                    style={{ color: '#303381' }}
                                                />
                                                {item.name.toUpperCase()}
                                            </h3>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-4"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageContent;
