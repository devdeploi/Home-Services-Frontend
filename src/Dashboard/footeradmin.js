import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footeradmin.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faList,
  faCalendarCheck,
  faUser
} from '@fortawesome/free-solid-svg-icons';

export default function Footeradmin() {
 
  
  return (
    <footer className="footer fixed-bottom text-white d-flex justify-content-around py-2 rounded-top">
      <Link to="/dashboard" className="text-center footer-item text-white text-decoration-none">
        <FontAwesomeIcon icon={faHome} />
        <div>Home</div>
      </Link>
      <Link to="/Adminservicemenu" className="text-center footer-item text-white text-decoration-none">
        <FontAwesomeIcon icon={faList} />
        <div>Services</div>
      </Link>
      <Link to="/Booking-details" className="text-center footer-item text-white text-decoration-none">
        <FontAwesomeIcon icon={faCalendarCheck} />
        <div>Booking Details</div>
      </Link>
      <Link to="/Admin-profile" className="text-center footer-item text-white text-decoration-none">
        <FontAwesomeIcon icon={faUser} />
        <div>My Profile</div>
      </Link>
    </footer>
  );
}