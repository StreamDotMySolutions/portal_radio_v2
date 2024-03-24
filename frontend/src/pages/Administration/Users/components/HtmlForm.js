import React, { useEffect } from 'react'
import { InputText, InputSelect } from '../../../../libs/FormInput'
import useStore from '../../../store'

const HtmlForm = ({isLoading}) => {
    const store = useStore()

    return (
        <div>
            <InputText 
                fieldName='name' 
                placeholder='User name'  
                icon='fa-solid fa-user'
                isLoading={isLoading}
            />
            <br />

            <InputSelect 
                  fieldName='type' 
                  options = {store.getValue('roles')}
                  placeholder='Choose a role'  
                  icon='fa-solid fa-person'
                  isLoading={isLoading}
                />
            <br />
            <InputText 
                fieldName='email' 
                placeholder='E-mail'  
                icon='fa-solid fa-envelope'
                isLoading={isLoading}
                type='email'
            />
            <br />
            <InputText 
                fieldName='password' 
                placeholder='Password'  
                icon='fa-solid fa-lock'
                isLoading={isLoading}
                type='password'
            />
                        <br />
            <InputText 
                fieldName='confirm_password' 
                placeholder='Confirm Password'  
                icon='fa-solid fa-lock'
                isLoading={isLoading}
                type='confirm_password'
            />
        </div>
    );
};

export default HtmlForm;