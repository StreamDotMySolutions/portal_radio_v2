import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useBannersStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateButton from '../../../../libs/CreateButton'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'
import Ordering from './Ordering'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/banners`

    const refreshKey = useBannersStore((s) => s.refreshKey)
    const paginatorUrl = useBannersStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useBannersStore((s) => s.setPaginatorUrl)

    const [items, setItems] = useState([])

    useEffect(() => {
        axios({ method: 'get', url: paginatorUrl ?? baseUrl })
            .then((response) => {
                setItems(response.data.banners)
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
                        <th className='text-center'>Ordering</th>
                        <th className='text-center' style={{ width: '100px' }}>Active?</th>
                        <th>Title</th>
                        <th className='text-center' style={{ width: '200px' }}>
                            <FontAwesomeIcon icon={['fas', 'bolt']} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item, index) => (
                        <tr key={item.id}>
                            <td className='text-center' style={{ width: '100px' }}>
                                <Ordering id={item.id} direction='up' disabled={index === 0} />
                                {' '}
                                <Ordering
                                    id={item.id}
                                    direction='down'
                                    disabled={index === items.data.length - 1}
                                />
                            </td>
                            <td className='text-center'>
                                {item.active == 1
                                    ? <FontAwesomeIcon className='text-success' icon={['fas', 'check']} />
                                    : <FontAwesomeIcon className='text-danger' icon={['fas', 'stop']} />
                                }
                            </td>
                            <td>{item.title}</td>
                            <td className='text-end'>
                                <ShowModal id={item.id} />{' '}
                                <EditModal id={item.id} />{' '}
                                <DeleteModal id={item.id} title={item.title} />
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
