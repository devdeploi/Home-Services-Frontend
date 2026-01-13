import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/Function';
import Header from '../HeaderandFooter/Header';

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
          setServices(data.data);
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

  return (
    <div className="d-flex flex-column" style={{ backgroundColor: '#fffcfc', minHeight: '100vh' }}>
      <Header />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center gap-2" style={{ minHeight: '80vh' }}>
          <div className="spinner-border" style={{ color: '#000080' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="fw-bold" style={{ color: '#000080' }}>Loading services...</span>
        </div>
      ) : error ? (
        <div className="container py-4 text-center text-danger">Error: {error}</div>
      ) : (
        <div className="container py-4">
          <div className="sticky-top py-3 px-3" style={{ backgroundColor: '#fffcfc' }}>
            <div className="d-flex align-items-center justify-content-center position-relative">
              <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 shadow-sm position-absolute start-0" style={{
                backgroundColor: '#000080',
                color: '#fffcfc',
                padding: '8px 16px',
                borderRadius: '12px',
                width: 'fit-content',
                zIndex: 1
              }}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '1.2rem' }} />
                <span className="fw-bold">Back</span>
              </Link>
              <h4 className="mb-0 fw-bold" style={{ color: '#000080' }}>
                All services
              </h4>
            </div>
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
                        backgroundImage: `url(${service.image_url})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                    ></div>
                    <div style={{ color: '#000080' }} className="fw-medium small">
                      {service.serv_name}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            <div style={{ height: '80px' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}