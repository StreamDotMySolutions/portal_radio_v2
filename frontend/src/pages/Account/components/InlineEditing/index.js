import { useState,useEffect } from 'react'
import { Form,Button} from 'react-bootstrap'
import axios from '../../../../libs/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const InlineEditing = ({
        url,
        label,
        placeholder,
        fieldValue,
        fieldName, 
        type ='text',
        as,
        rows
      
    }) => {

    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [message, setMessage] = useState(null)
    const [value, setValue] = useState(fieldValue)

    const handleCancelClick = () => {
        setIsSuccess(false)
        setIsError(false)
        setIsEditing(false)
    }

    const handleInputClick = () => {
        setIsEditing(true)
        setIsSuccess(false)
        setIsError(false)
        console.log('edit')
    }

    const handleInputChange = (e) => {
        setIsDisabled(false)
        setValue(e.target.value)
    }

    const DisplaySuccess = () => {
        const [isVisible, setIsVisible] = useState(true);
      
        useEffect(() => {
          const timeout = setTimeout(() => {
            setIsVisible(false);
          }, 1500); // Hide the component after 2 seconds
      
          return () => {
            clearTimeout(timeout); // Clear the timeout if the component unmounts
          };
        }, []);
      
        return isVisible ? (
          <i className="ms-3 fa-solid text-success fa-check fa-beat"></i>
        ) : null;
      }

    const DisplayError = () => {

        return isError ? (
            <>
            <span className='text-danger'>{message}</span>
            </>
        ) : null;
    }
    
    const handleSaveClick = () => {
        console.log('saving')
        setIsSaving(true)
        console.log(value)

        //Send to server
        const formData = new FormData();
    
        formData.append('_method', 'put');
        formData.append(fieldName, value);
        
        axios({
          url: url,
          method: 'post',
          data: formData,
        })
          .then((response) => {      
            setIsSaving(false)
            setIsSuccess(true)
          })
          .catch((error) => {
            setMessage(error.response.data.message)
            setIsError(true)
            console.error(error)
            setIsSaving(false)
          });
        
        // Exit the editing mode
        setIsEditing(false);
    }

    return (
     
            <Form.Group className='mb-3'>
                <Form.Label>{label}</Form.Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
            
                    <Form.Control 
                        as={as}
                        rows={rows}
                        type={type}
                        className={ isError ? 'form-control is-invalid border border-danger border-1 p-2' : 'form-control-plaintext border border-1 p-2'}
                        value={value}
                        placeholder={placeholder}
                        onClick={ handleInputClick }
                        onChange={ handleInputChange }
                        style={isEditing ? { backgroundColor: 'lightyellow' } : {}}
                    />
            

                    {isEditing && (
                        <>
                        <Button 
                            disabled={isDisabled} 
                            className='ms-2 me-2 border border-1 border-success text-success' 
                            onClick={ (e) => handleSaveClick(e) } 
                            variant='light'
                        >
                            <FontAwesomeIcon icon="fa-solid fa-save" />
                        </Button> 
                    
                        <Button 
                            className='border border-1 border-danger text-danger' 
                            onClick={handleCancelClick} 
                            variant='light' 
                        >
                            <FontAwesomeIcon icon="fa-solid fa-times" />
                        </Button> 
                        </>
                    )}

                    {isSaving && (
                        <>
                            <i className="ms-3 fa-solid fa-sync fa-spin"></i>
                        </>
                    )}

                    {isSuccess && (
                        <DisplaySuccess />
                    )}

            
                </div>
                { isError && (
                    <DisplayError />
                )}

            </Form.Group>
    
    )
};

export default InlineEditing;