import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="footer fixed-bottom d-flex justify-content-around py-2 rounded-top">
      <Link to="/" className="text-center footer-item text-decoration-none">
        <FontAwesomeIcon icon={faHome} />
        <div>Home</div>
      </Link>
      <Link to="/services" className="text-center footer-item text-decoration-none">
        <FontAwesomeIcon icon={faList} />
        <div>Services</div>
      </Link>
      <Link to="/MyProfile" className="text-center my-2 text-decoration-none">
        <FontAwesomeIcon icon={faUser} />
        <div>My Profile</div>
      </Link>
    </footer>
  );
}
