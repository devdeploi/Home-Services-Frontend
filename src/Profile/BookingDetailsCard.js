import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {  faImage } from '@fortawesome/free-solid-svg-icons';
const BookingDetailCard = ({ booking }) => {
  const navigate = useNavigate();
  


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3">
        <span
          onClick={() => navigate(-0)}
          style={{ cursor: 'pointer', color: '#000080' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-3" style={{ fontSize: '1.2rem' }} />
        </span>
        <div>
          <h5 className="mb-0">{booking?.user_name || 'User'}</h5>
        </div>
      </div>

      <div className="card shadow-sm border-1 rounded mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between text-muted small mb-4">
            <span>Booked</span>
            <span>{formatDate(booking?.booked_date)}</span>
          </div>

           <div className="text-center mb-4">
      {booking?.image_url ? (
        <img 
          src={booking.image_url} 
          alt="Service" 
          className="img-fluid rounded"
          style={{ maxHeight: '100px', objectFit: 'cover' }}
        />
      ) : (
        <div className="text-muted">
          <FontAwesomeIcon icon={faImage} size="3x" />
          <div>No image available</div>
        </div>
      )}
    </div>

          <div className="text-center mb-4">
            <p className="mb-2">
              <span style={{ color: '#000080', fontWeight: 'bold' }}>Service:</span> 
              <span style={{ fontWeight: 'bold' }}> {booking?.serv_name || 'N/A'}</span>
            </p>
            <p className="mb-2">
              <span style={{ color: '#000080', fontWeight: 'bold' }}>Date:</span> 
              <span style={{ fontWeight: 'bold' }}> {formatDate(booking?.booked_date)}</span>
            </p>
            
          </div>

          <button
            className="btn w-100"
            style={{ 
              backgroundColor: '#000080', 
              color: 'white', 
              borderRadius: '15px',
              padding: '8px 0'
            }}
            
          >
                 {booking.status === '1' && 'Pending'}
                {booking.status === '2' && 'On Process'}
                {booking.status === '3' && 'Completed'}
                {booking.status === '4' && 'cencelled'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailCard;