import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="navbar-brand d-flex align-items-center" >
        <img
          src='/images/Generallogo.png'
          alt="Logo"
          height="150px"
          width='126px'
          className="d-inline-block align-top me-2"
        />
        
      </div>

      
    </nav>
  );
}
