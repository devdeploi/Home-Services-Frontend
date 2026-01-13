import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { API_URL } from '../utils/Function';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        
        if (!storedData?.user_id) {
          navigate('/login');
          return;
        }

        setName(storedData.user_name || '');
        setPhone(storedData.mobile_no || '');

        const response = await fetch(
          `http://localhost/generalservices/users/getUserById.php?user_id=${storedData.user_id}&t=${Date.now()}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 200) {
            setName(data.data.user_name);
            setPhone(data.data.mobile_no);
            localStorage.setItem('userData', JSON.stringify(data.data));
          }
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };
  
    fetchUserData();
  }, [location.key, navigate]);

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z ]+$/;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!nameRegex.test(name.trim())) {
      newErrors.name = 'Name should contain only letters and spaces';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 8) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const storedData = JSON.parse(localStorage.getItem('userData'));
      
      const response = await fetch(`${API_URL}/users/updateUser.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: storedData.user_id,
          user_name: name.trim(),
          mobile_no: phone
        }),
      });
  
      const data = await response.json();
      
      if (data.status === 200) {
        const updatedUser = {
          ...storedData,
          ...data.data
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        navigate('/MyProfile', { state: { fresh: true } });
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center py-5" style={{ minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
      <div className="w-100 d-flex align-items-start">
        <Link to="/MyProfile" className="text-decoration-none p-3" style={{ color: '#000080', fontSize: '1.5rem' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      </div>

      <div className="mb-3 w-100">
        <label className="form-label fw-bold" style={{ color: '#000080' }}>
          Name
        </label>
        <input
          type="text"
          className={`form-control shadow-sm ${errors.name ? 'is-invalid' : ''}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ height: '56px' }}
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name}</div>
        )}
      </div>

      <div className="mb-4 w-100">
        <label className="form-label fw-bold" style={{ color: '#000080' }}>
          Phone number
        </label>
        <PhoneInput
  country={'in'}
  onlyCountries={['in']}
  value={phone}
  onChange={(value) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    setPhone(cleaned.startsWith('+') ? cleaned : '+' + cleaned);
  }}
  inputClass={`form-control ${errors.phone ? 'is-invalid' : ''}`}
  inputStyle={{
    width: '100%',
    height: '56px',
    borderRadius: '6px'
  }}
  disableDropdown
/>

        {errors.phone && (
          <div className="invalid-feedback d-block">{errors.phone}</div>
        )}
      </div>

      <button
        className="btn w-100 text-white my-5"
        style={{ backgroundColor: '#000080', height: '56px' }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}