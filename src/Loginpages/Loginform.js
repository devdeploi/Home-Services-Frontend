import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash, faCheck } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { API_URL } from '../utils/Function';
import Header from '../HeaderandFooter/Header';

export default function Loginform() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Phone validation
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Invalid phone number';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const formattedPhone = phone.startsWith('+') ? phone : '+' + phone;

      const response = await fetch(`${API_URL}/users/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_no: formattedPhone,
          user_password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('userData', JSON.stringify(data.data));
      localStorage.setItem('token', data.data.auth_token);
      localStorage.setItem('userRole', data.data.role);

      setShowSuccessModal(true);

    } catch (error) {
      setErrors({ apiError: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="d-flex flex-column bg-white" style={{ minHeight: '100vh' }}>
      <Header />
      <div className="container">
        {/* Back Arrow */}
        <div className='pt-3 ps-3'>
          <Link to="/" className="text-decoration-none d-flex align-items-center justify-content-center shadow-sm" style={{
            backgroundColor: '#020403',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            color: '#fac371'
          }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '1.2rem' }} />
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Phone Input */}
          <div className="form-group mb-4">
            <label style={{
              fontWeight: '500',
              fontSize: '18px',
              color: '#000000'
            }}>
              Phone Number
            </label>
            <PhoneInput
              country={'in'}
              onlyCountries={['in']}
              value={phone}
              onChange={(value) => {
                // Ensure value starts with 91 if it's missing but let the component handle the prefix
                setPhone(value);
              }}
              inputClass={`form-control shadow ${errors.phone ? 'is-invalid' : ''}`}
              inputStyle={{ width: '100%', height: '56px', borderColor: '#fac371' }}
              disableDropdown
              countryCodeEditable={false}
            />
            {errors.phone && (
              <div className="alert alert-danger mt-2">{errors.phone}</div>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group mb-4">
            <label style={{ fontWeight: '500', fontSize: '18px', color: '#000000' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control shadow ${errors.password ? 'is-invalid' : ''}`}
                style={{
                  borderColor: '#fac371',
                  height: '56px',
                  paddingRight: '40px'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#fac371',
                  fontSize: '1.2rem'
                }}
              />
            </div>
            {errors.password && (
              <div className="alert alert-danger mt-2">{errors.password}</div>
            )}
          </div>

          {/* API Error Message */}
          {errors.apiError && (
            <div className="alert alert-danger mt-3">{errors.apiError}</div>
          )}

          <div className="text-center mt-4">
            <span>Don't have an account? </span>
            <NavLink
              to="/register"
              className="text-decoration-none fw-bold"
              style={{ color: '#000000' }}
            >
              Register Now
            </NavLink>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-100 rounded mt-3"
            style={{ backgroundColor: '#020403', color: '#fac371' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Updated Success Modal */}
        {showSuccessModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 py-3">
                <div className="modal-body text-center p-4">
                  {/* Checkmark Circle Icon */}
                  <div
                    className="mb-4 mx-auto d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#4169e1',
                      color: 'white'
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} style={{ fontSize: '40px' }} />
                  </div>

                  {/* Success Message (this is blurred in the image) */}
                  <div className="text-muted mb-4">
                    <p>Login Successful!</p>
                  </div>

                  {/* Home Button */}
                  <button
                    className="btn w-100 text-white rounded-pill py-3"
                    onClick={handleModalClose}
                    style={{
                      backgroundColor: '#fac371',
                      fontSize: '18px',
                      fontWeight: '500'
                    }}
                  >
                    Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
}