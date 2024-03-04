import { React, useState , useEffect} from 'react'
import axios from '../../../libs/axios'
import { Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * @return JSX
 */
const Party = () => {

    const [data,setData] = useState([])
    const [isLoading,setIsLoading] = useState(false)

    useEffect(() => {
       
        // loading for 1st time
        getPartyData(setData,setIsLoading)
        
        const intervalId = setInterval(() => {
            getPartyData(setData,setIsLoading)
        }, 1000 * 10) // in milliseconds

        return () => clearInterval(intervalId)
        
    }, [])
    

    const listParties = data.parties?.map((item) =>
        <tr key={item.title}>
            <td>
            <FontAwesomeIcon icon="fa fa-sign-in" /> Parti <strong>{item.title}</strong> bertanding di <strong>{item.prn_nominations_count}</strong> kawasan
            </td>
        </tr>
    );

    return (
    <>
        { data.parties?.length > 0 ? 
            <>
 
            <div className="card-group">
                <div className="row row-cols-8">
                  
                    <div className="col mb-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">{data.total_regions}</h5>
                                <p className="card-text">Jumlah kawasan</p>
                            </div>
                        </div>
                    </div>

                    <div className="col mb-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">{data.prn_regions_nominated}/{data.total_regions}</h5>
                                <p className="card-text">Kawasan bercalon</p>
                            </div>
                        </div>
                    </div>

                    <div className="col mb-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">{data.total_nominations}</h5>
                                <p className="card-text">pencalonan</p>
                            </div>
                        </div>
                    </div>
                            
                        
                </div>
            </div>

            <hr />
            <table className='w-100 table table-striped'>
                <thead>
                    <tr>
                        <th>
                        <FontAwesomeIcon icon="fas fa-flag" /> PARTI BERTANDING 
                        &nbsp; { isLoading ? <FontAwesomeIcon icon="fa-solid fa-spinner" /> : null }
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {listParties}
                </tbody>
            </table>    
            </>
            : <p className='text-muted'>Tiada data</p>
         }
    </>
    )
}


/**
 * Get latest data PrnNomination via AXIOS
 * @param useState setLatestCandidates
 * @return useState setLatestCandidates
 */
function getPartyData(setData,setIsLoading){

    setIsLoading(true)
    axios({
        url:  `${process.env.REACT_APP_BACKEND_URL}/dashboard/prn15/parties`,   
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then( function(json){
        //console.log(json.data.data)
        setData(json.data.data)
        setIsLoading(false)
    })
    .catch ( function(error){
        //console.log(error.response.data)
        setIsLoading(false)
    })
}

export default Party