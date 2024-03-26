import React from 'react';
import { Col } from 'react-bootstrap';

function ContentHolder() {
  return (

    <Col className="d-flex justify-content-center border border-3 border-dotted bg-light hover-effect" style={{ height: '100px' }}>
        <p className="text-left m-auto ">
            Add Content
        </p>
    </Col>
  );
}

export default ContentHolder;
