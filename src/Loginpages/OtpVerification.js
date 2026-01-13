import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../utils/Function';

const OtpVerification = ({ show, onClose, mobileNumber, onSuccess, initialOtp = '' }) => {
  // If initialOtp is provided, split it into array of digits
  const initialOtpArray = initialOtp ? 
    initialOtp.toString().padStart(4, '0').split('').slice(0, 4) : 
    ['', '', '', ''];
  
  const [otp, setOtp] = useState(initialOtpArray);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Start timer when component mounts
  useEffect(() => {
    let interval = null;
    if (show && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [show, timer]);

  // Focus first input when modal opens
  useEffect(() => {
    if (show && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [show]);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Navigate between inputs with arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current.focus();
    } else if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input when backspace is pressed on empty input
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 4).split('');
    
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      if (index < 4) newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    
    // Focus the last populated input or the next empty one
    const lastIndex = Math.min(pastedOtp.length - 1, 3);
    if (lastIndex >= 0) {
      inputRefs[lastIndex].current.focus();
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Call your resend OTP API here
      const response = await axios.post(
        `${API_URL}/users/resendOtp.php`,
        {
          mobile_no: mobileNumber
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      setLoading(false);
      
      if (response.data.status === 200) {
        setTimer(60); // Reset the timer
        // You might want to display a success message here
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setLoading(false);
      console.error('Resend OTP error:', error);
      setError(error.response?.data?.message || 'An error occurred while resending OTP');
    }
  };

  const verifyOtp = async () => {
    // Check if OTP is complete
    if (otp.some(digit => digit === '')) {
      setError('Please enter the complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/users/verifyOtp.php`, // Correct API endpoint
        {
          mobile_no: mobileNumber,
          otp_code: otp.join('')
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setLoading(false);
      console.log("Verification response:", response.data);

      // Check response and handle accordingly
      if (response.data.status === 200) {
        // OTP verification successful
        onSuccess();
      } else {
        // OTP verification failed
        setError(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 'An error occurred during verification');
    }
  };

  if (!show) return null;

  return (
    <div className="otp-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '2rem',
        width: '90%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#000080'
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h3 style={{ color: '#000080', textAlign: 'center', marginBottom: '1.5rem' }}>OTP Verification</h3>
        
        <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Enter the 4-digit code sent to{' '}
          <span style={{ fontWeight: 'bold' }}>{mobileNumber}</span>
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              style={{
                width: '60px',
                height: '60px',
                fontSize: '24px',
                textAlign: 'center',
                borderRadius: '10px',
                border: '1px solid #000080',
                outline: 'none'
              }}
              className="shadow"
            />
          ))}
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button
          onClick={verifyOtp}
          disabled={loading || otp.includes('')}
          className="btn w-100 mb-3 text-white"
          style={{ backgroundColor: '#000080', height: '50px' }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div style={{ textAlign: 'center' }}>
          {timer > 0 ? (
            <p>Resend OTP in {timer} seconds</p>
          ) : (
            <p>
              Didn't receive code?{' '}
              <button
                onClick={resendOtp}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#000080',
                  fontWeight: 'bold',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                Resend OTP
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;