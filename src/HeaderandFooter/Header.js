import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center">
          <img
            src='/images/Generallogo.png'
            alt="Logo"
            height="70px"
            width='70px'
            className="d-inline-block align-top me-3 rounded-circle"
            style={{ marginLeft: '10px' }}
          />
          <div className="d-flex flex-column">
            <span style={{ color: '#fac371', fontWeight: 'bold', fontSize: '1.25rem', lineHeight: '1' }}>Home Service</span>
            <small className="text-muted" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Excellence in Service</small>
          </div>
        </div>
      </div>
    </nav>
  );
}
