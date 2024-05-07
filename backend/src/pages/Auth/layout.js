import React from 'react'
import './assets/style.css'
import login_logo from './assets/img/login.webp'
import rtm from './assets/img/rtm_logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {

return (
<>
<section className="vh-100">
  <div className="container-fluid h-custom">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-9 col-lg-6 col-xl-5">
        <img  src={login_logo}
              className="img-fluid" 
              alt="Content Management System" 
        />
      </div>
      <div className="col-6 offset-xs-3">
        <h2 className="text-muted mb-3">Boilerplate</h2>
        <Outlet />
      </div>
      
    </div>
  </div>
  <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">

    <div className="text-white mb-3 mb-md-0">
      Copyright  <img src={rtm} height="20" />  <FontAwesomeIcon icon="fas fa-copyright" /> 2024. All rights reserved.
    </div>


  </div>
</section>
</>
)} 

export default AuthLayout
