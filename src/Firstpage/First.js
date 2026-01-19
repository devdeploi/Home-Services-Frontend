import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function First() {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 position-relative">
        <img
          src={process.env.PUBLIC_URL + "/images/Generallogo.png"}
          alt="General Services Logo"
          className="mb-4"
          style={{ maxWidth: '200px', width: '100%' }}
        />
        <h5 className="text-center">Home Service</h5>
        <div className="position-absolute bottom-0 w-100 text-center pb-3">
          <small className="fw-bold text-dark">
            Powered by <a href="https://safprotech.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold" style={{ color: '#000080' }}>SAFPRO Technology Solutions</a>
          </small>
        </div>
      </div>
    </>
  )
}
