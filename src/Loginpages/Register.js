import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import OtpVerification from './OtpVerification';
import { API_URL } from '../utils/Function';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate(); 

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().split(' ').length < 2) {
      newErrors.name = 'Please enter first and last name';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formattedPhone = phone.trim().replace(/[^\d+]/g, '');
      const phoneWithPlus = formattedPhone.startsWith('+') ? formattedPhone : '+' + formattedPhone;
      
      const response = await axios.post(
        `${API_URL}/users/createUser.php`,
        {
          user_name: name.trim(),
          mobile_no: phoneWithPlus,
          user_password: password.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Registration response:", response.data);

      if (response.data.status === 201) {
        // Store the OTP code from the response (for development/testing)
        const otpFromResponse = response.data.otp_code ? response.data.otp_code.toString() : '';
        setReceivedOtp(otpFromResponse);
        
        // Show OTP verification modal
        setShowOtpModal(true);
        setApiError('');
      } else {
        setApiError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  // Handle successful OTP verification
 // Handle successful OTP verification
const handleOtpSuccess = async () => {
  setShowOtpModal(false);
  
  const loginPhone = phone;
  const loginPassword = password;

  setName('');
  setPhone('');
  setPassword('');
  setReceivedOtp('');

  try {
    
    const response = await axios.post(
      `${API_URL}/users/login.php`,
      {
        mobile_no: loginPhone,
        user_password: loginPassword
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.status === 200) {
      // Store user data and token
      localStorage.setItem('userData', JSON.stringify(response.data.data));
      localStorage.setItem('token', response.data.data.auth_token);

      setShowSuccessModal(true);

      setTimeout(() => {
        if (response.data.data.role === 2) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 2000);
    } else {
      setApiError('Auto-login failed. Please login manually.');
      setShowSuccessModal(true);
    }
  } catch (error) {
    console.error('Login error:', error);
    setApiError(error.response?.data?.message || 'Auto-login failed');
    setShowSuccessModal(true);
  }
};

  return (
    <div className="container">
      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '10px',
            textAlign: 'center', width: '80%', maxWidth: '400px'
          }}>
            <img src="/images/tick.png" alt="" className='my-3' />
            <h3 style={{ color: '#000080' }} className='my-3'>Account created</h3>
            <h3 style={{ color: '#000080', marginBottom: '1rem' }}>Successfully</h3>
            <Link to="/" className="btn" style={{
              backgroundColor: '#000080', color: 'white',
              padding: '0.5rem 2rem', borderRadius: '5px'
            }} onClick={() => setShowSuccessModal(false)}>
              Back
            </Link>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      <OtpVerification 
        show={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        mobileNumber={phone}
        onSuccess={handleOtpSuccess}
        initialOtp={receivedOtp}  
      />

      <div className='pt-3 ps-3' style={{ position: 'absolute' }}>
        <Link to="/" className="text-decoration-none" style={{ color: '#000080' }}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" style={{ fontSize: '1.5rem' }} />
        </Link>
      </div>

      <div className="d-flex justify-content-center">
        <img src="/images/Generallogo.png" alt="" style={{ height: '242px', width: '279px' }} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label style={{ fontWeight: '500', fontSize: '18px', color: '#000080' }}>Enter your Full Name</label>
          <input
            type="text"
            className={`form-control shadow ${errors.name ? 'is-invalid' : ''}`}
            style={{ borderColor: '#000080', height: '56px' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <div className="alert alert-danger mt-2">{errors.name}</div>
          )}
        </div>

        <div className="form-group mb-4">
          <label style={{ fontWeight: '500', fontSize: '18px', color: '#000080' }}>Enter your Phone number</label>
           <PhoneInput
  country={'in'}
  onlyCountries={['in']}
  value={phone}
  onChange={(value) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    setPhone(cleaned.startsWith('+') ? cleaned : '+' + cleaned);
  }}
 inputClass={`form-control shadow ${errors.phone ? 'is-invalid' : ''}`}
  inputStyle={{ width: '100%', height: '56px', borderColor: '#000080' }}
  disableDropdown
/>
          {errors.phone && (
            <div className="alert alert-danger mt-2">{errors.phone}</div>
          )}
        </div>

       <div className="form-group mb-3">
  <label style={{ fontWeight: '500', fontSize: '18px', color: '#000080' }}>Enter your Password</label>
  <div style={{ position: 'relative' }}>
    <input
      type={showPassword ? "text" : "password"}
      className={`form-control shadow ${errors.password ? 'is-invalid' : ''}`}
      style={{ 
        borderColor: '#000080', 
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
        color: '#000080',
        fontSize: '1.2rem'
      }}
    />
  </div>
  {errors.password && (
    <div className="alert alert-danger mt-2">{errors.password}</div>
  )}
</div>

        <div className="text-center">
          <span>Already have an account? </span>
          <NavLink to="/login" className="nav-link d-inline p-0" style={{ color: '#000080' }}>
            Login
          </NavLink>
        </div>

        {apiError && (
          <div className="alert alert-danger mt-3">{apiError}</div>
        )}

        <button type="submit" className="btn w-100 mt-3 mb-3 text-white rounded" style={{ backgroundColor: '#000080' }}>
          Register
        </button>
      </form>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}