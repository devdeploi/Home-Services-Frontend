import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Header from '../HeaderandFooter/Header';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/Function';


export default function Homepages() {
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if the event was already fired before this component mounted
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
      if (!sessionStorage.getItem('installPromptDismissed')) {
        setShowModal(true);
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update global variable too just in case
      window.deferredPrompt = e;
      // Check if user has already dismissed it in this session
      if (!sessionStorage.getItem('installPromptDismissed')) {
        setShowModal(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    }
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  useEffect(() => {
    // Fetch services
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

    // Screen size handler
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);

    fetchServices();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100 gap-2">
      <div className="spinner-border" style={{ color: '#000080' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="fw-bold" style={{ color: '#000080' }}>Loading services...</span>
    </div>;
  }

  if (error) {
    return <div className="container py-4 text-center text-danger">Error: {error}</div>;
  }

  return (
    <>
      <Header />
      <div className="container pb-5 pb-md-6 pb-lg-7 mt-4">
        {/* Header Image */}
        <div className="mb-3">
          <img
            src={process.env.PUBLIC_URL + "/images/Plane.jpg"}
            className="img-fluid w-100"
            style={{
              height: isLargeScreen ? '500px' : 'auto',
              objectFit: 'cover',
            }}
            alt="Header"
          />
        </div>

        {/* Popular Services */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 style={{ color: '#000080' }}>Popular Services</h5>
          <Link to="/services" className="text-decoration-none" style={{ color: '#000080' }}>View all</Link>
        </div>

        <div className="row text-center mb-4">
          {services.slice(0, 6).map((service) => (
            <div className="col-4 mb-3" key={service.serv_id}>
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
                <div className="shadow rounded p-2">
                  {/* Add back the image and service name elements */}
                  <div className="img-container" style={{ height: '100px' }}>
                    <img
                      src={service.image_url?.startsWith('/') ? process.env.PUBLIC_URL + service.image_url : service.image_url}
                      alt={service.serv_name}
                      className="img-fluid h-100"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ color: '#000080' }} className="mt-2">
                    {service.serv_name}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>


        {/* Spacer for fixed footer */}
        <div style={{ height: '80px' }}></div>

        <Modal
          show={showModal}
          onHide={handleClose}
          centered
          contentClassName="border-0 shadow-lg rounded-4"
        >
          <div className="p-4 text-center">
            <div className="mb-3">
              <img
                src={process.env.PUBLIC_URL + '/images/Home_Service.png'}
                alt="App Logo"
                width="80"
                height="80"
                className="img-fluid"
              />
            </div>

            <h4 className="fw-bold mb-2" style={{ color: '#000080' }}>Install Application</h4>
            <p className="text-secondary mb-4">
              Install the Home Service app for a faster, better experience.
            </p>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleInstall}
                style={{ backgroundColor: '#000080', borderColor: '#000080' }}
                className="rounded-3 fw-medium"
              >
                Install Now
              </Button>
              <Button
                variant="link"
                onClick={handleClose}
                className="text-decoration-none text-secondary"
                size="sm"
              >
                Maybe later
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}