import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BannerProgramme2 = () => {
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
    // Group items into sets of three
    const groupedItems = [];
    for (let i = 0; i < items.length; i += 3) {
      groupedItems.push(items.slice(i, i + 3));
    }
    
    return groupedItems.map((group, groupIndex) => (
      <div className="row" key={groupIndex}>
        {group.map((item, index) => (
          <div className='col' key={index}>
             <Link className="nav-link" to={item.redirect_url}>
              <img 
                style={{ borderRadius: '15px' }} 
                className="img-fluid" 
                src={`${serverUrl}/storage/programmes/${item.filename}`} 
                alt={item.title} />
            </Link>
          </div>
        ))}
      </div>
    ));
  };

return (
 <>
    <div className="row shadow-sm" style={{ backgroundColor: '#2a197f', padding: '30px' }}>    
      {programmeItems()}    
    </div>
  </>
  );
}

export default BannerProgramme2;
