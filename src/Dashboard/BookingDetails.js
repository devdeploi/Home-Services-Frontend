import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { API_URL } from '../utils/Function';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/booking/getBooking.php`);
        const data = await response.json();
        
        if (data.status === 200) {
          // Sort bookings by date (latest first)
          const sortedBookings = [...data.data].sort((a, b) => {
            return new Date(b.booked_date) - new Date(a.booked_date);
          });
          setBookings(sortedBookings);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Get status text and corresponding styling
  const getStatusInfo = (status) => {
  if (status === undefined || status === null) {
    return { text: 'Unknown', color: '#000080' };
  }
  const statusMap = {
    '1': { text: 'Pending', color: '#000080' },
    '2': { text: 'On Progress', color: '#000080' },
    '3': { text: 'Completed', color: '#000080' },
    '4': { text: 'Cancelled', color: '#000080' }
  };
  return statusMap[status.toString()] || { text: 'Unknown', color: '#000080' };
};

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    const userName = (booking.user_name || '').toLowerCase();
    const servName = (booking.serv_name || '').toLowerCase();
    const statusText = getStatusInfo(booking.status).text.toLowerCase();
    const mobileNo = (booking.mobile_no || '').toLowerCase();
    return (
      userName.includes(searchLower) ||
      servName.includes(searchLower) ||
      statusText.includes(searchLower) ||
      mobileNo.includes(searchLower)
    );
  });

  // Handle delete
  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(
          `${API_URL}/booking/deleteBooking.php?booking_id=${bookingId}`,
          { method: 'DELETE' }
        );
        const data = await response.json();
        if (data.status === 200) {
          setBookings(bookings.filter(booking => booking.booking_id !== bookingId));
          alert('Booking deleted successfully');
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert('Failed to delete booking');
      }
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/booking/updateBooking.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: selectedBooking.booking_id,
          ...formData
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        const updatedBookings = bookings.map(booking => 
          booking.booking_id === selectedBooking.booking_id ? 
          { ...booking, ...formData } : booking
        );
        // Re-sort after update to maintain order
        const sortedBookings = [...updatedBookings].sort((a, b) => {
          return new Date(b.booked_date) - new Date(a.booked_date);
        });
        setBookings(sortedBookings);
        setShowEditModal(false);
        alert('Booking updated successfully');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  // Open edit modal
  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      serv_id: booking.serv_id,
      user_id: booking.user_id,
      status: booking.status
    });
    setShowEditModal(true);
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="m-3">{error}</Alert>;
  }

  return (
    <div className="container-fulied" >
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white' }}>
  {/* Header */}
  <div className="header" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eaeaea' }}>
    <Link to="/dashboard" style={{ color: '#000080', marginRight: '16px', textDecoration: 'none' }}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </Link>
    <h4 style={{ margin: 0, color: '#000080', fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Booked History</h4>
  </div>

  {/* Search Bar */}
  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eaeaea' }}>
    <input
      type="text"
      placeholder="Search bookings..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ width: '100%', padding: '8px 12px', borderRadius: '20px', border: '1px solid black' }}
    />
  </div>
</div>


      {/* Booking List */}
     <div
  className="booking-list"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    padding: '0 16px',
    marginTop: '10px'
  }}
>

        {filteredBookings.map(booking => (
          <div key={booking.booking_id} className="booking-card" style={{ backgroundColor: 'white', borderRadius: '4px', marginBottom: '12px', padding: '16px', boxShadow: '0 3px 5px rgba(0,0,0,0.1)' }}>
            {/* Booking Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div className="booked-label" style={{ color: '#666' }}>Booked</div>
              <div className="booking-date" style={{ color: '#666' }}>{booking.booked_date}</div>
            </div>
            
            {/* Service Info */}
            <div style={{ marginBottom: '12px' }}>
               <div style={{ display: 'flex' }}>
                <div style={{ fontWeight: 'bold', color: '#000080', marginRight: '8px' }}>Name:</div>
                <div>{booking.user_name}</div>
              </div>
              <div style={{ display: 'flex', marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#000080', marginRight: '8px' }}>Service:</div>
                <div>{booking.serv_name}</div>
              </div>
              <div style={{ display: 'flex', marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#000080', marginRight: '8px' }}>Mobile No:</div>
                <div>{booking.mobile_no}</div>
              </div>
             
            </div>
            
            {/* Status Button */}
            <div style={{ marginBottom: '12px' }}>
              <button 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  backgroundColor: getStatusInfo(booking.status).color, 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => openEditModal(booking)}
              >
                {getStatusInfo(booking.status).text}
              </button>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => openEditModal(booking)} 
                style={{ 
                  backgroundColor: 'transparent', 
                  border: '1px solid #000080', 
                  color: '#000080', 
                  borderRadius: '4px',
                  padding: '6px 12px',
                  marginRight: '5px',
                  cursor: 'pointer'
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
                onClick={() => handleDelete(booking.booking_id)} 
                style={{ 
                  backgroundColor: 'transparent', 
                  border: '1px solid #dc3545', 
                  color: '#dc3545', 
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedBooking?.user_name || ''}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service</Form.Label>
              <Form.Control
                type="text"
                value={selectedBooking?.serv_name || ''}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status || ''}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="1">Pending</option>
                <option value="2">On Progress</option>
                <option value="3">Completed</option>
                <option value="4">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit" style={{ backgroundColor: '#000080', borderColor: '#000080' }}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <div style={{height:'100px'}}></div>
    </div>
  );
}