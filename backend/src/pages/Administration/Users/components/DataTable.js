import React, { useState, useEffect } from 'react'
import { Table, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useUsersStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateButton from '../../../../libs/CreateButton'
import CreateModal from '../modals/Create'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/users`

    const refreshKey = useUsersStore((s) => s.refreshKey)
    const paginatorUrl = useUsersStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useUsersStore((s) => s.setPaginatorUrl)

    const [items, setItems] = useState([])

    const adminCount = items?.data?.filter(
        (user) => user.roles?.some((role) => role.name === 'admin')
    ).length ?? 0

    useEffect(() => {
        axios({ method: 'get', url: paginatorUrl ?? baseUrl })
            .then((response) => {
                setItems(response.data.users)
            })
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl])

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
                        <th><FontAwesomeIcon icon={['fas', 'briefcase']} />{' '}Role</th>
                        <th><FontAwesomeIcon icon={['fas', 'person']} />{' '}Name</th>
                        <th><FontAwesomeIcon icon={['fas', 'envelope']} />{' '}Email</th>
                        <th><FontAwesomeIcon icon={['fas', 'clock']} />{' '}Created At</th>
                        <th className='text-center'><FontAwesomeIcon icon={['fas', 'bolt']} /></th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item) => {
                        const isLastAdmin =
                            adminCount === 1 &&
                            item.roles?.some((role) => role.name === 'admin')
                        return (
                            <tr key={item.id}>
                                <td style={{ width: '80px' }}>
                                    {item.roles?.map((role) => (
                                        <Badge key={role.id} bg='secondary' className='me-1'>
                                            {role.name}
                                        </Badge>
                                    ))}
                                </td>
                                <td>{item.name}</td>
                                <td style={{ width: '150px' }}>{item.email}</td>
                                <td style={{ width: '180px' }}>{item.created_at}</td>
                                <td className='text-center' style={{ width: '200px' }}>
                                    <EditModal id={item.id} disabled={isLastAdmin} />{' '}
                                    <DeleteModal
                                        id={item.id}
                                        name={item.name}
                                        email={item.email}
                                        disabled={isLastAdmin}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <PaginatorLink store={paginatorAdapter} items={items} />
        </div>
    )
}

export default DataTable
