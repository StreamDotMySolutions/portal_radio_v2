import  { useEffect, useState } from 'react'
import { Image, Col } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom';

const HomeProgramme = () => {

    const url = process.env.REACT_APP_API_URL
    const serverUrl = process.env.REACT_APP_SERVER_URL
    const [items,setItems] = useState([])

    useEffect( () => {
    
        axios(`${url}/home-programmes`)
        .then( response => {
          //console.log(response)
          setItems(response.data.items)
        })
    
      },[])

    const programmeItems = () => {

        return items.map( (item, index) => (
            <li key={index} style={{ display: 'inline-block', marginRight: '10px' }}>

                <Link to={item.redirect_url}>
                    <Image
                        className="d-block rounded"
                        src={`${serverUrl}/storage/programmes/${item.filename}`}
                        alt={item.description}
                    />
                </Link>

            </li>

        ))
    }


    return (
        <Col>
            <ul className='text-center' style={{ listStyleType: 'none', padding: 0 }}>
                {programmeItems()}
            </ul>
        </Col>
    );
};

export default HomeProgramme;