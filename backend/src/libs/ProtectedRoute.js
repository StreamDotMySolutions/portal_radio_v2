import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
//import { useAuthStore } from "../stores/AuthStore"
import useAuthStore from '../pages/Auth/stores/AuthStore'

const ProtectedRoute = () => {

    //const isLoggedIn = useAuthStore(state => state.isLoggedIn) // using zustand
    const store = useAuthStore()


    //if(!isLoggedIn){
    if(!store.isAuthenticated){
        return <Navigate to='/sign-in' replace />
    }

    return <Outlet />
}
export default ProtectedRoute