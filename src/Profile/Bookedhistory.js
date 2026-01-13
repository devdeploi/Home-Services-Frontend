import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import BookingDetailCard from './BookingDetailsCard';
import axios from 'axios';
import { API_URL } from '../utils/Function';
import Header from '../HeaderandFooter/Header';

export default function BookedHistory() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchBookings = async () => {

      try {
        const response = await axios.get(
          `${API_URL}/booking/getBookingById.php?user_id=${userData?.user_id}`
        );
        const data = response.data;

        if (data.status === 200) {
          setBookings(data.data);
          setError('');
        } else if (data.status === 404) {
          setBookings([]);
          setError('');
        } else {
          setError(data.message || 'Failed to load bookings');
        }
      } catch (error) {
        if (error.response) {
          // Handle 404 from HTTP status code
          if (error.response.status === 404) {
            setBookings([]);
            setError('');
          } else {
            setError(error.response.data?.message || error.message);
          }
        } else if (error.request) {
          setError('No response from server - check your network');
        } else {
          setError('Request setup error: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userData?.user_id]);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  if (selectedBooking) {
    return <BookingDetailCard booking={selectedBooking} />;
  }

  return (
    <div className="d-flex flex-column bg-white" style={{ minHeight: '100vh' }}>
      <Header />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="w-100 d-flex align-items-center gap-3">
            <Link to="/MyProfile" className="text-decoration-none d-flex align-items-center gap-2 shadow-sm" style={{
              backgroundColor: '#020403',
              color: '#fac371',
              padding: '8px 16px',
              borderRadius: '12px',
              width: 'fit-content'
            }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '1.2rem' }} />
              <span className="fw-bold">Back</span>
            </Link>
            <h4 className="my-3" style={{ color: '#fac371' }}>Booked History</h4>
          </div>
          <div className="d-flex align-items-center">
            <h6 className="mt-2">{userData?.user_name || 'User'}</h6>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#020403' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5">
            <img
              src="/images/11677497.gif"
              alt="No bookings"
              style={{ width: '150px', height: '150px', opacity: 0.7 }}
              className="mb-3"
            />
            <h5 style={{ color: '#fac371' }}>No Bookings Found</h5>
            <p className="text-muted">You haven't made any bookings yet</p>
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div key={index} className="card shadow mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between text-muted mb-2">
                  <small>Booked</small>
                  <small>{new Date(booking.created_at).toLocaleDateString()}</small>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: "100px" }}>
                  <p className="mb-1" style={{ color: '#fac371' }}>
                    <strong>Service:</strong> <strong className="text-dark">{booking.serv_name}</strong>
                  </p>
                  <p className="mb-2" style={{ color: '#fac371' }}>
                    <strong>Date:</strong> <strong className="text-dark">
                      {new Date(booking.booked_date).toLocaleDateString('en-GB')}
                    </strong>
                  </p>
                </div>
                <button
                  className="btn w-100 mb-3"
                  style={{
                    backgroundColor: '#020403',
                    color: '#fac371',
                    borderColor: '#fac371',
                    borderRadius: '15px'
                  }}
                  onClick={() => handleBookingClick({ ...booking, user_name: userData?.user_name })}
                >
                  {booking.status === '1' && 'Pending'}
                  {booking.status === '2' && 'On Process'}
                  {booking.status === '3' && 'Completed'}
                  {booking.status === '4' && 'cencelled'}
                </button>
              </div>
            </div>
          ))
        )}
        <div style={{ height: '80px' }}></div>
      </div>
    </div>
  );
}