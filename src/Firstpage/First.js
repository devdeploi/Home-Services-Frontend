import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function First() {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <img
          src={process.env.PUBLIC_URL + "/images/Generallogo.png"}
          alt="General Services Logo"
          className="mb-4"
          style={{ maxWidth: '200px', width: '100%' }}
        />
        <h5 className="text-center">Home Service</h5>
      </div>
    </>
  )
}
