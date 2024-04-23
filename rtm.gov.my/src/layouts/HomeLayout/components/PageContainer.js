import React from 'react';

const PageContainer = () => {
    return (
        <div className="container-fluid"  style={{ marginBottom: "4rem" }}>
            <div className="row">
                <div className="col-md-1"></div>

                <div className="col-md-10">
                    <ul className="breadcrumb" style={{ marginTop: "40px" }}>
                        <li><a href="index.html">Utama</a></li>
                        <li><a href="direktoriangkasapuri.html">Direktori</a></li>
                        <li><a href="direktoriangkasapuri.html">Direktori Angkasapuri</a></li>
                        <li>Pejabat Ketua Pengarah</li>
                    </ul>

                    <h1 style={{ marginTop: "1rem" }}>Pejabat Ketua Pengarah</h1>
                    test123

                </div>

                <div className="col-md-1"></div>
            </div>
        </div>
    );
};

export default PageContainer;
