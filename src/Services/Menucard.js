import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react'; // Import hooks
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/Function';


export default function Menucard() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/service/getAllService.php`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        if (data.status === 200) {
          setServices(data.data); // Use API data
        } else {
          setError(data.message || 'No services found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className="container py-4 text-center">Loading services...</div>;
  }

  if (error) {
    return <div className="container py-4 text-center text-danger">Error: {error}</div>;
  }

  return (
    <div className="container py-4">
      <div className="sticky-top bg-white py-3">
        <h5 className="mb-0 text-primary fw-bold">
          <Link to="/" className="text-decoration-none" style={{ color: '#000080' }}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Popular services
          </Link>
        </h5>
      </div>
      <div className="row g-3">
        {services.map((service) => (
          <div className="col-6" key={service.serv_id}>
            <Link 
              to="#"
              className="text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                const isLoggedIn = localStorage.getItem('token') !== null;
                navigate(
                  isLoggedIn ? '/Booking' : '/Register',
                  { state: { service } }
                );
              }}
            >
              <div className="border rounded-3 p-3 text-center shadow-sm bg-white h-100">
                <div
                  className="mb-2"
                  style={{
                    height: '60px',
                    backgroundImage: `url(${service.image_url})`, // Use image_url from API
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div style={{ color: '#000080' }} className="fw-medium small">
                  {service.serv_name} {/* Use serv_name from API */}
                </div>
              </div>
            </Link>
          </div>
        ))}
        <div style={{ height: '80px' }}></div>
      </div>
    </div>
  );
}