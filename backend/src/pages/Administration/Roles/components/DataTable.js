import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useRolesStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateButton from '../../../../libs/CreateButton'
import CreateModal from '../modals/Create'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/roles`

    const refreshKey = useRolesStore((s) => s.refreshKey)
    const paginatorUrl = useRolesStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useRolesStore((s) => s.setPaginatorUrl)

    const [items, setItems] = useState([])

    useEffect(() => {
        axios({ method: 'get', url: paginatorUrl ?? baseUrl })
            .then((response) => {
                setItems(response.data.roles)
            })
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl])

    // Adapt PaginatorLink's store.setValue('url', ...) interface to the roles store
    const paginatorAdapter = {
        setValue: (key, value) => {
            if (key === 'url') setPaginatorUrl(value)
        },
    }

    return (
        <div>
            <CreateButton>
                <CreateModal />
            </CreateButton>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th className='text-center'>
                            <FontAwesomeIcon icon={['fas', 'bolt']} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td className='text-center' style={{ width: '150px' }}>
                                <EditModal id={item.id} />{' '}
                                <DeleteModal id={item.id} name={item.name} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <PaginatorLink store={paginatorAdapter} items={items} />
        </div>
    )
}

export default DataTable
