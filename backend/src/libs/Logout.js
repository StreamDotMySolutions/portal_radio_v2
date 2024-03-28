import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from "../stores/AuthStore"


const HandleLogout = () =>  {

    // const isLoggedIn = useAuthStore( (state) => state.isLoggedIn ) // get state
    // const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn) // set state
    // set store isLoggedIn to false
    // setIsLoggedIn(false)

    // tell the server to destroy the token
    // const url = 'http://localhost:8000/api/logout'
    const url =   process.env.REACT_APP_BACKEND_URL + '/logout'
    const options = {
        method: 'get',
    }

    fetch(url,options)
    .then(response => {
        // response.ok status 200-299
        console.log('sddd')
        if(response.ok) {
            // set false
           

            // delete token from localstorage
            localStorage.removeItem('token');
            return response.json()
        } 
        return Promise.reject(response); // reject the promise
    })
    .then(json => {

    })
    .catch( error =>{
        console.log(error)
    })

   

 
  }
  export default HandleLogout
