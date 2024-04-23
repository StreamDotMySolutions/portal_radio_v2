import React from 'react';

const BannerProgramme = () => {
  return (
    <nav className="navbar navbar-expand-sm shadow-sm" style={{ backgroundColor: '#2a197f', padding: '30px' }}>
      <ul className="navbar-nav mx-auto">
        <li className="nav-item">
          <a className="nav-link" href="https://rtmklik.rtm.gov.my/">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/rtmkliklogopetak.jpg" alt="RTM Klik Baharu" />
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/tv1">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/tv1.jpg" alt="TV1" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/tv2">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/tv2.jpg" alt="TV2" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/okey">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/okey.jpg" alt="Okey" />
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/beritartm">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/berita-rtm.png" alt="Berita RTM" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://berita.rtm.gov.my/">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/portal-berita.jpg" alt="Portal Berita" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/sukanrtm">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/sukanrtmbaharu.jpg" alt="Sukan RTM Baharu" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/tv6">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/tv6.jpg" alt="TV6" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/dewanrakyat">
            <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/dewanrakyatbaharu.jpg" alt="Dewan Rakyat Baharu" />
          </a>
        </li>

      </ul>
    </nav>
  );
}

export default BannerProgramme;
