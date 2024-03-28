import React from 'react';
import { InputText } from '../../../../libs/FormInput';

const HtmlForm = ({isLoading}) => {
    return (
        <div>
            <InputText 
                fieldName='title' 
                placeholder='Title'  
                icon='fa-solid fa-pencil'
                isLoading={isLoading}
            />
        </div>
    );
};

export default HtmlForm;