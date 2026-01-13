import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/Function';

export default function AdminEditprofile() {
  const [userData, setUserData] = useState({
    user_name: '',
    mobile_no: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = localStorage.getItem('userData');
        const { user_id } = JSON.parse(storedData);
        
        const response = await fetch(`${API_URL}/users/getUserById.php?user_id=${user_id}`);
        const data = await response.json();
        
        if (data.status === 200) {
          setUserData({
            user_name: data.data.user_name,
            mobile_no: data.data.mobile_no,
          });
        }
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedData = localStorage.getItem('userData');
      const { user_id } = JSON.parse(storedData);
      
      // In handleSubmit function, modify the fetch body to include user_id
const response = await fetch(`${API_URL}/users/updateUser.php?user_id=${user_id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...userData,
    user_id: user_id // Add user_id to the request body
  }),
});

      const result = await response.json();
      
      if (result.status === 200) {
        // Update local storage
        const updatedData = { ...JSON.parse(storedData), ...userData };
        localStorage.setItem('userData', JSON.stringify(updatedData));
        navigate('/Admin-profile');
      } else {
        setError(result.message || 'Update failed');
      }
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="container text-center mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h5 className="fw-bold text-start" style={{ color: '#000080' }}>Edit Profile</h5>
      
      <form onSubmit={handleSubmit} className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="user_name" className="form-label">User Name</label>
          <input
            type="text"
            className="form-control"
            id="user_name"
            name="user_name"
            value={userData.user_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobile_no" className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="mobile_no"
            name="mobile_no"
            value={userData.mobile_no}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex gap-3 justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/Admin-profile')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: '#000080', color: 'white' }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}