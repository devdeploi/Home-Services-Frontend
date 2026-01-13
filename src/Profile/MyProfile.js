import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/Function';

export default function MyProfile() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }


    const fetchUserData = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData) {
          setUserData(storedData);
        }

        if (!storedData?.user_id) {
          navigate('/login');
          return;
        }

        const response = await fetch(
          `${API_URL}/users/getUserById.php?user_id=${storedData.user_id}&t=${Date.now()}`
        );

        if (response.status === 401) { // Handle unauthorized
          localStorage.clear();
          navigate('/login');
          return;
        }

        const data = await response.json();
        if (data.status === 200) {
          const mergedData = { ...storedData, ...data.data };
          setUserData(mergedData);
          localStorage.setItem('userData', JSON.stringify(mergedData));
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.key, location.state?.fresh, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');

  };

  if (loading) {
    return (
      <div className="container text-center mt-4" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <img
            src="/images/11677497.gif"  // Replace with your actual loading image path
            alt="Loading"
            style={{ width: '80px', height: '80px', marginBottom: '20px' }}
          />
          <p style={{ color: '#000080', fontSize: '18px' }}>Loading Profile...</p>
        </div>
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
              color: '#000080',
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
                  backgroundColor: '#000080',
                  color: '#fffcfc',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: '500',
                  order: 1 // Ensures Logout comes first

                }}
              >
                Logout
              </button>
            </div>
            <div className='my-2'>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  border: '2px solid #000080',
                  backgroundColor: '#000080',
                  color: '#fffcfc',
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
      <h5 className="fw-bold text-strat" style={{ color: '#000080' }}>My Profile</h5>
      <img
        src={userData?.profile_image || "/images/Ellipse.png"}
        alt="Profile"
        className="rounded-circle mt-3"
        style={{ width: '100px', height: '100px' }}
      />
      <h6 className="mt-2">{userData?.user_name || 'User'}</h6>
      <div className="list-group mt-4">
        {/* Edit Profile */}
        <Link to="/Edit-profile" className="text-decoration-none mb-3 shadow rounded px-3 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center" style={{ color: '#000080' }}>
            <img src="/images/Edit.png" alt="" className="me-2" /> Edit Profile
          </div>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '35px', width: '35px', backgroundColor: '#000080', borderRadius: '6px' }}>
            <i className="bi bi-chevron-right" style={{ color: '#fffcfc' }}></i>
          </div>
        </Link>

        {/* Booked History */}
        <Link to="/Booked-history" className="text-decoration-none mb-3 shadow rounded px-3 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center" style={{ color: '#000080' }}>
            <img src="/images/Help.png" alt="" className="me-2" /> Booked History
          </div>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '35px', width: '35px', backgroundColor: '#000080', borderRadius: '6px' }}>
            <i className="bi bi-chevron-right" style={{ color: '#fffcfc' }}></i>
          </div>
        </Link>

        {/* Help & Support */}
        <Link to="/Help-support" className="text-decoration-none mb-3 shadow rounded px-3 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center" style={{ color: '#000080' }}>
            <img src="/images/Help.png" alt="" className="me-2" /> Help & Support
          </div>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '35px', width: '35px', backgroundColor: '#000080', borderRadius: '6px' }}>
            <i className="bi bi-chevron-right" style={{ color: '#fffcfc' }}></i>
          </div>
        </Link>

        {/* Logout */}
        <div
          onClick={() => setShowLogoutModal(true)}
          className="text-decoration-none mt-3 shadow rounded px-3 py-2 d-flex align-items-center"
          style={{ color: '#000080', cursor: 'pointer' }}
        >
          <img src="/images/Logout.png" alt="" className="me-2" /> Logout
        </div>
      </div>
      <div style={{ height: '100px' }}></div>
    </div>
  );
}
