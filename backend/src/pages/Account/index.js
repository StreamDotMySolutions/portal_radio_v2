import React, { useEffect } from 'react'
import { Container, Tab, Tabs, Card } from 'react-bootstrap' 
import axios from '../../libs/axios'
import useAccountStore from './stores/AccountStore'
import AccountTab from './components/AccountTab'
import ProfileTab from './components/ProfileTab'


const Account = () => {
    const store = useAccountStore()
    
    useEffect( () => fetchData(store), [])
    
    return (
        <>
        {
        store?.account?.email == null ? '...loading' : (
            <Container className='p-1'>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Account">
                    <Card className='mt-3'>
                        <Card.Header>Maklumat Akaun</Card.Header>
                        <Card.Body className='p-3'><AccountTab /></Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey={2} title="Profil">
                    <Card className='mt-3'>
                        <Card.Header>Maklumat Profil</Card.Header>
                        <Card.Body className='p-3'>
                            <ProfileTab />
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
            </Container>
            )
        }

        </>
    )
}

function fetchData(store){
    //console.log('fetch')
    useAccountStore.setState({account: null})
    axios({
        url: store.show_url
    })
    .then( response => {
        //console.log(response.data)
        useAccountStore.setState({account: response.data.account})
        useAccountStore.setState({refresh: false})
    })
    .catch( error => {
        console.error(error)
    })
}

export default Account;