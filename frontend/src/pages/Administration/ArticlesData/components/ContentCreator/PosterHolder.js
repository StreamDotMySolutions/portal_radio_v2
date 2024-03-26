import React from 'react';
import { Badge } from 'react-bootstrap';

function PosterHolder() {
  return (

    <div className="d-flex justify-content-center border border-3 border-dotted bg-light hover-effect" style={{height: '250px' }}>
        <p className="text-center m-auto "><Badge>Poster</Badge></p>
    </div>
  );
}

export default PosterHolder;
