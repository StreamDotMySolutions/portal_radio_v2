import React from "react";

const Error404 = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="display-1 fw-bold text-danger">RALAT 404</div>
          <p className="fs-4 mb-4">Halaman yang dicari tidak ditemui!</p>
          <a href="https://www.rtm.gov.my/" className="btn btn-primary">
            Halaman Utama
          </a>
        </div>
      </div>
    </>
  );
};

export default Error404;
