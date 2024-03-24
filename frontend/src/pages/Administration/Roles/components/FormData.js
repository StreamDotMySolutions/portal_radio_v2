import React from 'react';
import { InputText } from '../../../../libs/FormInput';

const FormData = ({isLoading}) => {
    return (
        <div>
            <InputText 
                fieldName='name' 
                placeholder='Role name'  
                icon='fa-solid fa-pencil'
                isLoading={isLoading}
            />
        </div>
    );
};

export default FormData;