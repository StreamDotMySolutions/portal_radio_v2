import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge,Button,Row,Col,Form, InputGroup } from 'react-bootstrap'
import { React, useState, useEffect} from 'react'
import useStore from '../pages/store'

export function appendFormData(formData, data) {
    if (data instanceof Array) {
        data.forEach(item => {
            const { key, value } = item;
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
    } else if (typeof data === 'object') {
        for (const key in data) {
            const value = data[key];
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        }
    }
}

export function InputText({fieldName, placeholder, icon, isLoading, type='text'}){
    const store = useStore()
    const errors = store.getValue('errors')

    return(<>
                <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={icon}></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
                        placeholder={placeholder}
                        type={type}
                        value={store.getValue(fieldName) ||  ''}
                        name={fieldName}
                        size='md' 
                        readOnly={isLoading}
                        required 
                        isInvalid={errors?.hasOwnProperty(fieldName)}
                        onChange={ (e) => { 
                          store.setValue(fieldName, e.target.value)                         
                        } }
                    />
                    {
                        errors?.hasOwnProperty(fieldName) &&
                            (
                                <Form.Control.Feedback type="invalid">   
                                { errors[fieldName] ? errors[fieldName] : null }
                                </Form.Control.Feedback>
                            )
                    }  
                </InputGroup>
            </>)
}

export function InputTextarea({fieldName, placeholder, icon, rows, isLoading}){
    const store = useStore()
    const errors = store.getValue('errors')

    return(<>
                <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={icon}></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
                        as="textarea" 
                        rows={rows}
                        placeholder={placeholder}
                        value={store.getValue(fieldName) ||  ''}
                        name={fieldName}
                        size='md' 
                        readOnly={isLoading}
                        required 
                        isInvalid={errors?.hasOwnProperty(fieldName)}
                        onChange={ (e) => { 
                          store.setValue(fieldName, e.target.value)                         
                        } }
                    />
                    {
                        errors?.hasOwnProperty(fieldName) &&
                            (
                                <Form.Control.Feedback type="invalid">   
                                { errors[fieldName] ? errors[fieldName] : null }
                                </Form.Control.Feedback>
                            )
                    }  
                </InputGroup>
            </>)
}

export function InputSelect({fieldName, placeholder, icon, isLoading, options}){
    const store = useStore()
    const errors = store.getValue('errors')

    return(<>
                <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={icon}></FontAwesomeIcon></InputGroup.Text>
                    <Form.Select
                        name={fieldName}
                        size='md' 
                        readOnly={isLoading}
                        required 
                        isInvalid={errors?.hasOwnProperty(fieldName)}
                        onChange={ (e) => { 
                          store.setValue(fieldName, e.target.value)                         
                        } }
                    >
                        <option>{placeholder}</option>
                        {options?.map((option,index) => (
                            <option 
                                value={option.id}
                                key={index}
                                selected={option.id === store.getValue(fieldName)}  
                            >{option.name}</option>
                        ))}
             
                    </Form.Select>
                    {
                        errors?.hasOwnProperty(fieldName) &&
                            (
                                <Form.Control.Feedback type="invalid">   
                                { errors[fieldName] ? errors[fieldName] : null }
                                </Form.Control.Feedback>
                            )
                    }  
                </InputGroup>
            </>)
}

export function InputFile({fieldName, placeholder, icon,accept='image/*', isLoading}){
    const store = useStore()
    const errors = store.getValue('errors')

    return(<>
                <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={icon}></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
                        placeholder={placeholder}
                        type={'file'}
                        //value={store.getValue(fieldName) ||  ''}
                        name={fieldName}
                        size='md' 
                        readOnly={isLoading}
                        accept={accept}
                        isInvalid={errors?.hasOwnProperty(fieldName)}
                        onChange={ (e) => { 
                          store.setValue(fieldName, e.target.files[0])                         
                        } }
                    />
                    {
                        errors?.hasOwnProperty(fieldName) &&
                            (
                                <Form.Control.Feedback type="invalid">   
                                { errors[fieldName] ? errors[fieldName] : null }
                                </Form.Control.Feedback>
                            )
                    }  
                </InputGroup>
            </>)
}

export function InputRadio({fieldName,label="Active", yesLabel="Yes", noLabel="No"}){
    const store = useStore()
    const errors = store.getValue('errors')

    return(
        <>
    
              <Form.Label><h6>{label}</h6></Form.Label>
              <Row>
                <Col>
                  <Form.Check
                    type="radio"
                    label={yesLabel}
                    name={fieldName}
                    value="1"
                    isInvalid={errors?.hasOwnProperty(fieldName)}
                    checked={store.getValue(fieldName) === 1}
                    onChange={ (e) => { 
                                store.setValue(fieldName, e.target.checked ? e.target.value : null);                    
                            }}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="radio"
                    label={noLabel}
                    name={fieldName}
                    isInvalid={errors?.hasOwnProperty(fieldName)}
                    checked={store.getValue(fieldName) === 0}
                    onChange={ (e) => { 
                        store.setValue(fieldName, e.target.checked ? e.target.value : null);                    
                    }}
                  />
                </Col>
            </Row>
            {
            errors?.hasOwnProperty(fieldName) &&
                (
                    <Form.Control.Feedback type="invalid">   
                    { errors[fieldName] ? errors[fieldName] : null }
                    </Form.Control.Feedback>
                )
            }  
     
        
        </>
    )
}

export function InputDate({fieldName, icon}){
    const store = useStore()
    const errors = store.getValue('errors')
    
    return(<>
    
    <InputGroup>
        <InputGroup.Text><FontAwesomeIcon icon={icon}></FontAwesomeIcon></InputGroup.Text>
        <Form.Control 
            name={fieldName}
            type="date" 
            value={store.getValue(fieldName) ||  ''}
            isInvalid={errors?.hasOwnProperty(fieldName)}
        />

        {
            errors?.hasOwnProperty(fieldName) &&
                (
                    <Form.Control.Feedback type="invalid">   
                    { errors[fieldName] ? errors[fieldName] : null }
                    </Form.Control.Feedback>
                )
         }  
    </InputGroup>
    </>)
}