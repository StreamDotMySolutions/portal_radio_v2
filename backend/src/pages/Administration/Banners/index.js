import { Badge } from 'react-bootstrap'
import DataTable from "./components/DataTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'
import { Link, useParams } from 'react-router-dom'
import useStore from '../../store'
import axios from '../../../libs/axios'
import React, { useState, useEffect } from 'react'

const Index = () => {


    // items for navigation
    let items = [
        { url: '/', label: (
          <Badge>
            <FontAwesomeIcon icon={['fas', 'home']} /> {/* fas = font awesome solid  */}
          </Badge>
        )},
        { url: '/administration/banners', label: 'Banner Management' },
    ];
    

    

    return(
        <>
            <BreadCrumb items={items} />
            <DataTable />
        </>
    )
}
export default Index
  