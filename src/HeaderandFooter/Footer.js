import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'; // You'll create this CSS file next
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer fixed-bottom text-white d-flex justify-content-around py-2 rounded-top">
      <Link to="/" className="text-center footer-item text-white text-decoration-none">
        <img src="/images/Home.png" alt="Home" />
        <div>Home</div>
      </Link>
      <Link to="/services" className="text-center footer-item text-white text-decoration-none">
        <img src="/images/Services.png" alt="Services" />
        <div>Services</div>
      </Link>
      <Link to="/MyProfile" className="text-center my-2 text-white text-decoration-none">
        <img src="/images/profile.png" alt="Profile" />
        <div>My Profile</div>
      </Link>
    </footer>
  );
}
