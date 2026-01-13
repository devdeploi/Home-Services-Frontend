import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { API_URL } from '../utils/Function';

export default function Bookingform() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;
  const [address, setAddress] = useState('');
  const [town, setTown] = useState('');
  const [userData, setUserData] = useState(null);

  // Track user changes and storage updates
  useEffect(() => {
    const loadUser = () => {
      const user = JSON.parse(localStorage.getItem('userData'));
      setUserData(user);
    };

    // Initial load
    loadUser();
    

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'userData') loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update form fields when user data changes
  useEffect(() => {
    if (userData) {
      // Set name from various possible fields
      setName(
        userData.user_name ||
        userData.fullname ||
        userData.name ||
        userData.username ||
        `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
      );

      // Format phone number
      const userPhone = userData.mobile_no || userData.phone || '';
      if (userPhone.startsWith('+91')) {
        setPhone(userPhone);
      } else if (userPhone) {
        setPhone('+91' + userPhone.replace(/^0+/, ''));
      }
      
      // Set address and town if available
      if (userData.address) setAddress(userData.address);
      if (userData.town) setTown(userData.town);
    } else {
      // Redirect if no user found
      navigate('/Booking', { state: { returnTo: location.pathname, service } });
    }
  }, [userData, navigate, location.pathname, service]);

  const validate = () => {
    const newErrors = {};
    const trimmedName = name.trim();
    const nameRegex = /^[A-Za-z ]+$/;

    if (!trimmedName) {
      newErrors.name = 'Name is required';
    } else if (!nameRegex.test(trimmedName)) {
      newErrors.name = 'Name should contain only letters and spaces';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!town.trim()) {
      newErrors.town = 'Town is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      fetch(`${API_URL}/booking/createBooking.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: name.trim(),
          mobile_no: phone.trim(),
          address: address.trim(),
          town: town.trim(),
          serv_name: service?.serv_name
        }),
      })
      .then(async (response) => {
        const text = await response.text();
        try {
          const jsonStart = text.indexOf('{');
          const jsonText = jsonStart !== -1 ? text.substring(jsonStart) : text;
          const data = JSON.parse(jsonText);
          
          if (!response.ok) throw data;
          setShowModal(true);
        } catch (e) {
          throw new Error('Invalid server response');
        }
      })
      .catch(error => {
        setErrors({ submit: error.message });
      });
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center bg-white px-4">
      <div className="position-relative w-100 mt-3 mb-4">
        <div className="position-absolute top-0 start-0 ms-3">
          <Link to="/services" className="text-decoration-none" style={{ color: '#000080' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '1.5rem' }} />
          </Link>
        </div>
        <div className="text-center">
          <img 
            src="/images/Generallogo.png" 
            alt="General Logo" 
            style={{ height: '242px', width: '279px' }}
          />
        </div>
        <div className="d-flex justify-content-center px-3">
          {service ? (
            <div className="text-center w-100" style={{ maxWidth: '360px' }}>
              <div 
                className="mx-auto shadow-sm border mb-2 d-flex align-items-center justify-content-center"
                style={{
                  height: '64px',
                  width: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#f8f9fa',
                  padding: '6px'
                }}
              >
                <img 
                  src={service.image_url} 
                  alt={service.serv_name}
                  style={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%', 
                    objectFit: 'contain',
                    borderRadius: '10px'
                  }}
                />
              </div>
              <p
                className="fw-medium text-center mx-auto"
                style={{ 
                  color: '#000080', 
                  fontSize: '14px',
                  wordBreak: 'break-word',
                  marginBottom: 0
                }}
              >
                Your selected <span className="fw-bold">{service.serv_name}</span> — confirm your details to book service.
              </p>
            </div>
          ) : (
            <div className="d-flex justify-content-center w-100">
              <img 
                src="/images/Generallogo.png" 
                alt="General Logo" 
                className="img-fluid"
                style={{ height: '242px', width: '279px', borderRadius: '16px' }}
              />
            </div>
          )}
        </div>
      </div>

      <form className="w-100" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-semibold" style={{ color: '#000080', fontSize: '14px' }}>Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            value={name}
            disabled
            onChange={(e) => setName(e.target.value)}
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              height:'56px',
              backgroundColor: '#f8f9fa'
            }}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="form-label fw-semibold" style={{ color: '#000080', fontSize: '14px' }}>Phone number</label>
          <PhoneInput
            country={'in'}
            value={phone}
            disabled
            onChange={(value) => {
              const cleaned = value.replace(/[^\d+]/g, '');
              setPhone(cleaned.startsWith('+') ? cleaned : '+' + cleaned);
            }}
            inputClass={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            inputStyle={{
              width: '100%',
              height: '56px',
              borderRadius: '12px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              backgroundColor: '#f8f9fa'
            }}
            onlyCountries={['in']}
            
          />
          {errors.phone && (
            <div className="invalid-feedback d-block">{errors.phone}</div>
          )}
        </div>

        {errors.submit && (
          <div className="alert alert-danger mt-2">
            {errors.submit}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="address" className="form-label fw-semibold" style={{ color: '#000080', fontSize: '14px' }}>Address</label>
          <input
            type="text"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              height:'56px'
            }}
          />
          {errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="town" className="form-label fw-semibold" style={{ color: '#000080', fontSize: '14px' }}>Town</label>
          <input
            type="text"
            className={`form-control ${errors.town ? 'is-invalid' : ''}`}
            id="town"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              height:'56px'
            }}
          />
          {errors.town && (
            <div className="invalid-feedback">{errors.town}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn w-100 fw-bold"
          style={{
            backgroundColor: '#000080',
            borderRadius: '12px',
            color: '#fff',
            padding: '10px 0'
          }}
        >
          Book Service
        </button>
      </form>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body className="text-center p-4">
          <div className="mb-3">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
              <img src="/images/tick.png" alt="" />
            </div>
          </div>
          <h5 className="fw-bold mb-2" style={{ color: '#000080' }}>Service Booked Successfully</h5>
          <p className="text-muted">We will get back to you soon</p>
          <Link to="/Booked-history" className="btn mt-3 w-100 fw-bold" style={{ backgroundColor: '#000080', borderRadius: '12px', borderColor: '#000080', color: 'white', textAlign: 'center' }}>
            Home
          </Link>
        </Modal.Body>
      </Modal>
      <div style={{height:'100px'}}></div>
    </div>
  );
}