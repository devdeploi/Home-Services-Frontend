import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/Function';

export default function Adminprofile() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {


        // Try to get stored data
        const storedData = localStorage.getItem('userData');
        const parsedData = storedData ? JSON.parse(storedData) : null;

        if (parsedData?.user_id) {
          const response = await fetch(`${API_URL}/users/getUserById.php?user_id=${parsedData.user_id}`);
          const data = await response.json();
          if (data.status === 200) {
            setUserData(data.data);
            localStorage.setItem('userData', JSON.stringify({ ...parsedData, ...data.data }));
          } else {
            setUserData(parsedData); // fallback
          }

        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        // Don't set error, just continue with default data
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [location.key, location.state?.fresh]);

  const handleLogout = () => {
    // Clear all user data including role
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event('storage'));

    // Redirect to login
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="container text-center mt-4" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <img
            src="/images/11677497.gif"
            alt="Loading"
            style={{ width: '80px', height: '80px', marginBottom: '20px' }}
          />
          <p style={{ color: '#020403', fontSize: '18px' }}>Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
        <button
          className="btn mt-3"
          style={{ backgroundColor: '#020403', color: '#fac371' }}
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container text-center mt-4">
      {showLogoutModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            width: '320px'
          }}>
            <img src="/images/Logoout.png" alt="Logoout" style={{ height: '87px', width: '79px' }} className='m-auto' />
            <h5 style={{
              color: '#fac371',
              marginBottom: '15px',
              fontSize: '20px',
              fontWeight: '600',
            }}>
              Logout
            </h5>
            <p style={{ marginBottom: '30px', color: '#666' }}>Are you sure to logout?</p>
            <div className="d-flex justify-content-between gap-3">
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#020403',
                  color: '#fac371',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: '500',
                  order: 1
                }}
              >
                Logout
              </button>
            </div>
            <div className='my-2'>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  border: '2px solid #fac371',
                  backgroundColor: 'transparent',
                  color: '#fac371',
                  cursor: 'pointer',
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  width: '270px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h5 className="fw-bold text-strat" style={{ color: '#fac371' }}>Admin Profile</h5>
      <img
        src={userData?.profile_image || "/images/Ellipse.png"}
        alt="Profile"
        className="rounded-circle mt-3"
        style={{ width: '100px', height: '100px' }}
      />
      <h6 className="mt-2">{userData?.user_name || 'Admin'}</h6>
      <div className="list-group mt-4">
        {/* Edit Profile */}
        <Link to="/Admin-Edit-profile" className="text-decoration-none mb-3 shadow rounded px-3 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center" style={{ color: '#fac371' }}>
            <img src="/images/Edit.png" alt="" className="me-2" /> Edit Profile
          </div>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '35px', width: '35px', backgroundColor: '#020403', borderRadius: '6px' }}>
            <i className="bi bi-chevron-right" style={{ color: '#fac371' }}></i>
          </div>
        </Link>

        {/* Logout */}
        <div
          onClick={() => setShowLogoutModal(true)}
          className="text-decoration-none mt-3 shadow rounded px-3 py-2 d-flex align-items-center"
          style={{ color: '#fac371', cursor: 'pointer' }}
        >
          <img src="/images/Logout.png" alt="" className="me-2" /> Logout
        </div>
      </div>
      <div style={{ height: '100px' }}></div>
    </div>
  );
}