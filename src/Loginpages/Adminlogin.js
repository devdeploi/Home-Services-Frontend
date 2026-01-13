import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { API_URL } from '../utils/Function';

export default function Adminlogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Invalid phone number';
    }

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
    try {
      const formattedPhone = phone.startsWith('+') ? phone : '+' + phone;
      const response = await fetch(`${API_URL}/users/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile_no: formattedPhone,
          user_password: password
        })
      });

      const data = await response.json();

      // ... inside handleSubmit function
      if (data.result === "true" && data.data.role === "2") {
        // Correctly store user data under 'userData'
        localStorage.setItem('userData', JSON.stringify(data.data));
        localStorage.setItem('userRole', data.data.role);
        navigate('/dashboard'); // Navigate directly to profile
      } else {
        setErrors({ apiError: data.message || 'Invalid admin credentials' });
      }
      // ...
    } catch (error) {
      setErrors({ apiError: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Back Arrow */}
      <div className='pt-3 ps-3'>
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 shadow-sm" style={{
          backgroundColor: '#000080',
          color: '#fffcfc',
          padding: '8px 16px',
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '1.2rem' }} />
          <span className="fw-bold">Back</span>
        </Link>
      </div>

      {/* Logo Section */}
      <div className="d-flex justify-content-center mt-4">
        <img
          src="/images/Generallogo.png"
          alt="Admin Logo"
          style={{ height: '242px', width: '279px' }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Phone Input */}
        <div className="form-group mb-4">
          <label style={{ fontWeight: '500', fontSize: '18px', color: '#000080' }}>
            Admin Phone Number
          </label>
          <PhoneInput
            country={'in'}
            onlyCountries={['in']}
            value={phone}
            onChange={(value) => {
              setPhone(value);
            }}
            inputClass={`form-control shadow ${errors.phone ? 'is-invalid' : ''}`}
            inputStyle={{ width: '100%', height: '56px', borderColor: '#000080' }}
            disableDropdown
            countryCodeEditable={false}
          />
          {errors.phone && (
            <div className="alert alert-danger mt-2">{errors.phone}</div>
          )}
        </div>

        {/* Password Input */}
        <div className="form-group mb-4">
          <label style={{
            fontWeight: '500',
            fontSize: '18px',
            color: '#000080'
          }}>
            Password
          </label>
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

        {/* Login Button */}
        <button
          type="submit"
          className="btn w-100 rounded mt-3"
          style={{ backgroundColor: '#000080', color: '#fffcfc', fontWeight: 'bold' }}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Admin Login'}
        </button>
      </form>
      <div style={{ height: '100px' }}></div>
    </div>
  );
}