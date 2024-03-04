import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import './DisplayMessage.css'; // Import the CSS file

function DisplayMessage({ message, variant }) {
  const [isVisible, setIsVisible] = useState(true);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 1000); // Hide the component after 2 seconds

    return () => {
      clearTimeout(timeout); // Clear the timeout if the component unmounts
    };
  }, []);

 

  const icon = variant === 'success' ? <i className="fa-solid fa-check fa-beat"></i> : <i className="fa-solid fa-bell fa-beat"></i>;

  return isVisible ?
    <div className="full-page-overlay">
      <div className="centered-container">
        <Alert className='p-5 col-3 text-center' variant={variant}>
        <div className="fa-5x">
          {icon}
        </div>
          {message}
        </Alert>
      </div>
    </div>
  : null;
}

export default DisplayMessage;
