import React from 'react';
import { Badge, Col } from 'react-bootstrap';

function ArticleSetting() {
  return (
    <Col className="d-flex border border-3 border-dotted bg-light hover-effect" style={{ height: '50px' }}>
        <p className="text-center m-auto">
            <Badge>Settings</Badge>
        </p>
    </Col>
  );
}

export default ArticleSetting;
