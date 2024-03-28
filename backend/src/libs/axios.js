import Axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const axios = Axios.create({
    baseURL:  (process.env.REACT_APP_BACKEND_URL),
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    //withCredentials: true,
    
})

// intercept every request
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // get the token set by signin

        // custom headers
        config.headers['Authorization'] =  `Bearer ${token}` // Authorization
        config.headers['Accept'] = 'application/json' // return reesponse in JSON

        return config; // return back config()
    },
    (error) => {
      return Promise.reject(error);
    }
);

// detect 401 or 403
axios.interceptors.response.use(
  (response) => response, // Return the response if it's not a 401 error
  (error) => {
    if (error.response.status === 401 || error.response.status === 403 || error.response.status === 419 ) {
      // Redirect to your login page or another route
      //console.log('401 ,419 or 403')
      window.location.href = '/unauthorized';
    }

    return Promise.reject(error);
  }
);

export default axios
