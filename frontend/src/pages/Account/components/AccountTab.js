import useAccountStore from '../stores/AccountStore'
import InlineEditing from './InlineEditing'
import { Form,Collapse } from 'react-bootstrap'
import {useState} from 'react'
import { Row } from 'react-bootstrap'

const AccountTab = () => {
    const store = useAccountStore()
    const [togglePassword, setTogglePassword] = useState(false)
    
    return (
        <>

        <Row className='col-6 p-3'>
            <InlineEditing 
                type='text'
                url={store.update_url}
                label='Alamat Email'
                placeholder='Sila letakkan alamat email'
                fieldName='email' 
                fieldValue={store?.account?.email}
            />

            <Form.Check // prettier-ignore
                className='mt-4 mb-3'
                type="switch"
                id="custom-switch"
                label="Tetapkan Password"
                onChange={() => setTogglePassword(!togglePassword)}
            />

            <Collapse in={togglePassword}>
                <div>
                <InlineEditing 
                    
                    url={store.update_url}
                    label='Password'
                    placeholder='Sila tetapkan password baharu'
                    fieldName='password' 
    
                />
                </div>
            </Collapse>

        </Row>
        </>
    )
};

export default AccountTab;