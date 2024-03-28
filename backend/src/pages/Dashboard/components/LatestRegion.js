import { React, useState , useEffect} from 'react'
import axios from '../../../libs/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * @return JSX
 */
const LatestRegion = () => {

    const [latestRegions,setLatestRegions] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    

    // useEffect(() => {
    //     getLatestRegions(setLatestRegions)
    //   }, [])

    useEffect(() => {

        // run for 1st time
        getLatestRegions(setLatestRegions,setIsLoading)     
       
        const intervalId = setInterval(() => {
            getLatestRegions(setLatestRegions,setIsLoading)
        }, 1000 * 5) // in milliseconds

        return () => clearInterval(intervalId)
        
    }, [])

      const listRegions = latestRegions.map((item) =>
        <tr key={item.id}>
            <td>
                <small>
                {item.region_code} {item.region_name}, {item.state_name}
                 <br />   
                 <span className='text-muted'><FontAwesomeIcon icon="fas fa-clock" /><i>&nbsp;{item.when}</i></span>
                </small>
            </td>
        </tr>
    );

    return (
    <>
        { latestRegions.length > 0 ? 
            <table className='w-100 table table-striped'>
                <thead>
                    <tr>
                        <th>
                        <FontAwesomeIcon icon="fas fa-flag" /> KAWASAN
                        &nbsp; { isLoading ? <FontAwesomeIcon icon="fa-solid fa-spinner" /> : null }
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listRegions}
                </tbody>
            </table>
            : <p className='text-muted'>Tiada data</p>
         }
    </>
    )
}


/**
 * Get latest data PrnNomination via AXIOS
 * @param useState setLatestRegions
 * @return useState setLatestRegions
 */
function getLatestRegions(setLatestRegions,setIsLoading){
    setIsLoading(true)
    axios({
        url:  `${process.env.REACT_APP_BACKEND_URL}/prn-nominations/latest/regions`,   
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then( function(json){
        //console.log(json.data.data)
        setLatestRegions(json.data.data)
        setIsLoading(false)
    })
    .catch ( function(error){
        //console.log(error.response.data)
        setIsLoading(false)
    })
}

export default LatestRegion