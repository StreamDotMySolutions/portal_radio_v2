import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge,Button,Row,Col,Form, InputGroup } from 'react-bootstrap'
import { React, useState, useEffect} from 'react'
import useStore from '../pages/store'

export function InputText({fieldName, placeholder, icon, isLoading}){
    const store = useStore()
    const errors = store.getValue('errors')

    return(<>
                <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={icon}></FontAwesomeIcon></InputGroup.Text>
                    <Form.Control 
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
