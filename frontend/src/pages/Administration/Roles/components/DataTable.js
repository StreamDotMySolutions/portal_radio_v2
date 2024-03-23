import { Table } from "react-bootstrap"
import axios from "../../../../libs/axios"
import useStore from "../../../store"
import { useEffect, useState } from "react"


const DataTable = () => {

    const fetchUrl =  process.env.REACT_APP_BACKEND_URL + '/roles'

    const store = useStore()

    useEffect( () => {

        axios({
            url: fetchUrl,
            method: 'get',
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
          
            if( error.response?.status == 422 ){
                store.setValue('errors', error.response.data.errors)
            }
        })
    },[])

   

    return (
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>ID</td>
                    <td>Name</td>
                </tr>
            </tbody>
        </Table>
    )
}
export default DataTable