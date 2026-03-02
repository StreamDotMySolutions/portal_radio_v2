import React, { useState, useEffect } from 'react'
import { Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'
import BreadCrumb from '../../../libs/BreadCrumb'
import axios from '../../../libs/axios'
import useStore from '../../store'
import DataTable from './components/DataTable'

const Index = () => {
    const { parentId } = useParams()
    const store = useStore()
    const [data, setData] = useState([])

    useEffect(() => {
        if (parentId && parentId !== '0') {
            axios({ method: 'get', url: `${store.url}/directories/${parentId}` })
                .then(response => setData(response.data.directory))
                .catch(error => console.warn(error))
        } else {
            setData([])
        }
    }, [parentId])

    const breadcrumbItems = [
        {
            url: '/',
            label: (
                <Badge>
                    <FontAwesomeIcon icon={['fas', 'home']} />
                </Badge>
            ),
        },
        { url: '/administration/directories/0', label: 'Directory Management' },
    ]

    if (data.ancestors) {
        data.ancestors.forEach(ancestor =>
            breadcrumbItems.push({ url: `/administration/directories/${ancestor.id}`, label: ancestor.name })
        )
    }

    if (data.name) {
        breadcrumbItems.push({ url: `/administration/directories/${data.id}`, label: data.name })
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />
            <DataTable />
        </>
    )
}

export default Index
