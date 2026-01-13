import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Header from '../HeaderandFooter/Header';


export default function Helpandsupport() {
  // Function to handle email contact
  const handleEmailContact = () => {
    // Format with display name: "info@safprotech.com" <info@safprotech.com>
    window.location.href = "mailto:\"info@safprotech.com\" <info@safprotech.com>";
  };

  return (
    <div className="d-flex flex-column bg-white" style={{ minHeight: '100vh' }}>
      <Header />
      <div className="container py-4 d-flex flex-column align-items-center">
        <div className="w-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex justify-content-between align-items-center w-100 mb-3">
              <Link to="/MyProfile" className="text-decoration-none d-flex align-items-center gap-2 shadow-sm" style={{
                backgroundColor: '#020403',
                color: '#fac371',
                padding: '8px 16px',
                borderRadius: '12px',
                width: 'fit-content'
              }}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '1.2rem' }} />
                <span className="fw-bold">Back</span>
              </Link>
            </div>
          </div>

          <div className="text-center mb-4">
            <img src='/images/Helpandsup.png' alt="Support Icon" className="img-fluid" style={{ height: '174px', width: '183px' }} />
            <h5 className="mt-3" style={{ color: '#fac371' }}>Need help? Contact us directly</h5>
          </div>

          <div className="mb-4">
            <p className="text-center" style={{ color: '#000000' }}>If you have any problem, contact us at:</p>
            <button
              onClick={handleEmailContact}
              className="btn w-100 d-flex align-items-center justify-content-center"
              style={{ border: '2px solid #fac371', backgroundColor: '#020403', height: '56px' }}
            >
              <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: '#fac371' }} />
              <span style={{ color: '#fac371' }}>info@safprotech.com</span>
            </button>
          </div>
        </div>
        <div style={{ height: '80px' }}></div>
      </div>
    </div>
  );
}