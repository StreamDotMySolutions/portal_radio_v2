import React from 'react';
import { Badge, Col } from 'react-bootstrap';

function DescriptionHolder() {
  return (

    <div className="d-flex justify-content-center border border-3 border-dotted bg-ligh hover-effect" style={{ height: '250px' }}>
        <p className="text-center m-auto "><Badge>Description</Badge></p>
    </div>
  );
}

export default DescriptionHolder;
