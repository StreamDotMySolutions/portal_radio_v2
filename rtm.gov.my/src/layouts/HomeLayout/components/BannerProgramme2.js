import React from 'react';

const BannerProgramme2 = () => {
  return (
 <>
    <div className="row shadow-sm" style={{ backgroundColor: '#2a197f', padding: '30px' }}>    

      <div className='col'>
        <a className="nav-link" href="https://rtmklik.rtm.gov.my/">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/rtmkliklogopetak.jpg" alt="RTM Klik Baharu" />
        </a>
      
        <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/tv1">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/tv1.jpg" alt="TV1" />
        </a>
      
        <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/tv2">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/tv2.jpg" alt="TV2" />
        </a>
      </div>    
      
      <div className='col'>
        <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/okey">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/okey.jpg" alt="Okey" />
        </a>
      
        <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/beritartm">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/berita-rtm.png" alt="Berita RTM" />
        </a>
      
      
        <a className="nav-link" href="https://berita.rtm.gov.my/">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/portal-berita.jpg" alt="Portal Berita" />
        </a>
      </div>    

      <div className='col'>
        <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/sukanrtm">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/sukanrtmbaharu.jpg" alt="Sukan RTM Baharu" />
        </a>
      
      
        <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/tv6">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/tv6.jpg" alt="TV6" />
        </a>
      
      
        <a className="nav-link" href="https://rtmklik.rtm.gov.my/live/dewanrakyat">
          <img style={{ borderRadius: '15px' }} className="img-fluid" src="/asset/IconTv/dewanrakyatbaharu.jpg" alt="Dewan Rakyat Baharu" />
        </a>
      </div>    
    </div>
    </>
  );
}

export default BannerProgramme2;
