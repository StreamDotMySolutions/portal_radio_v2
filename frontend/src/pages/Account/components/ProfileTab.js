import useAccountStore from '../stores/AccountStore'
import InlineEditing from './InlineEditing'
import { Form,Collapse, Row, Col } from 'react-bootstrap'
import {useState} from 'react'

const ProfileTab = () => {
    const store = useAccountStore()
    const [togglePassword, setTogglePassword] = useState(false)
    
    return (
        <>
        <Row className='p-3'>
            <Col className='col-4'>

                <InlineEditing 
                    url={store.update_url}
                    label='Nama penuh'
                    placeholder='Sila letakkan nama anda'
                    fieldName='name' 
                    fieldValue={store?.account?.name}
                />

            </Col>
            <Col className='col-1'></Col>
            <Col className='col-6'>
                <InlineEditing 
                    url={store.update_url}
                    as='textarea'
                    rows='5'
                    label='Alamat '
                    placeholder='Sila letakkan alamat anda'
                    fieldName='address' 
                    fieldValue={store?.account?.profile?.address}
                />
            </Col>
        </Row>
         


          
        </>
    )
};

export default ProfileTab;