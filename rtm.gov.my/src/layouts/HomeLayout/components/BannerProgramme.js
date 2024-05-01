import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BannerProgramme = () => {

  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [items, setItems] = useState([]);
  const url = process.env.REACT_APP_API_URL;
  const serverUrl = process.env.REACT_APP_SERVER_URL;


  useEffect(() => {
      axios(`${url}/home-programmes`)
          .then((response) => {
              //console.log(response)
              setItems(response.data.items);
          });
  }, []);

  const programmeItems = () => {
      return items.map((item, index) => (
      
          <li className="nav-item" key={index}>
            <Link className="nav-link" to="https://rtmklik.rtm.gov.my/">
              <img 
                style={{ borderRadius: '15px' }} 
                className="img-fluid" 
                src={`${serverUrl}/storage/programmes/${item.filename}`} 
                alt={item.title} />
            </Link>
          </li>
        
      ));
  };

  return (
    <nav className="navbar navbar-expand-sm shadow-sm" style={{ backgroundColor: '#2a197f', padding: '30px' }}>
      <ul className="navbar-nav mx-auto">
        {programmeItems()}
      </ul>
    </nav>
  );
}

export default BannerProgramme;
