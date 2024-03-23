import React from 'react';

const CreateButton = ({ children }) => {
  return (
    <div className="d-flex bd-highlight mb-3">
      <div className="ms-auto p-2 bd-highlight">
        {children}
      </div>
    </div>
  );
};

export default CreateButton;
