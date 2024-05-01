import React from 'react';

const Menu2 = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ backgroundColor: "white" , color: "black"}} id="navbardibawah">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarbawah" aria-controls="navbarbawah" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarbawah">
                <ul className="navbar-nav mx-auto">

                    <li className="nav-item">
                        <a className="nav-link" href="#">UTAMA</a>
                    </li>

                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownTV" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            TV
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownTV" style={{ marginTop: "-10px" }}>
                            <a style={{ color: 'black' }} className="dropdown-item" href="#">TV1</a>
                            <a style={{ color: 'black' }} className="dropdown-item" href="#">TV2</a>
                            <a style={{ color: 'black' }} className="dropdown-item" href="#">TV OKEY</a>
                            
                        </div>
                    </li>


                    <li className="nav-item">
                        <a className="nav-link" href="#">RADIO</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link" href="#">PENCAPAIAN</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link" href="#">AKTIVITI</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link" href="#">RATE CARD RTM</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link" href="#">GALERI</a>
                    </li>

                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownDir" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            DIREKTORI
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownDir" style={{ marginTop: "-10px" }}>
                            <a style={{ color: 'black' }} className="dropdown-item" href="#">DIREKTORI ANGKASAPURI</a>
                            <a style={{ color: 'black' }} className="dropdown-item" href="#">DIREKTORI NEGERI</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Menu2;
