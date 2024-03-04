import React from 'react';
import { Form, FormControl } from 'react-bootstrap';

function Text() {
  return (

      <Form.Group className="mb-3" controlId="validationCustom03">
        <Form.Label>City</Form.Label>
        <FormControl 
            type="text" 
            placeholder="Enter email"
            //onChange={(e) => setValue(e.target.value)}
            required />
        <Form.Control.Feedback type="invalid">
          Please provide a valid city.
        </Form.Control.Feedback>
      </Form.Group>
  
  );
}

export default Text;
